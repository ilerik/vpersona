/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import type { NextPage } from "next";
import ProfileComponent from "../../features/profile";
import LinkList from "../../features/profile/link-list";
import NftList from "../../features/profile/nft-list";
import Loader from "../../components/loader";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL = "https://api.thegraph.com/subgraphs/name/ilerik/near-social";

interface LinktreePageProps {
  profile: any;
  nearid: string;
}

const LinktreePage: NextPage<LinktreePageProps> = ({ profile, nearid }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { links, nfts } = profile || {
    links: [],
    nfts: [],
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader is_load={profile === undefined}>
        <div className="my-[20px] mt-[120px] flex w-full max-w-[1240px] flex-col items-baseline px-[20px] md:flex-row">
          <div className="flex w-full flex-col rounded-[20px] bg-[#019FFF] md:max-w-[33%] ">
            <div className="mb-[20px] flex w-full flex-col p-[20px]">
              <ProfileComponent profile={profile} accountId={String(nearid)} />
            </div>
            <div className="relative flex w-full flex-col rounded-[20px] bg-[#293FC2]  p-[20px]">
              <LinkList links={links} />
            </div>
          </div>
          <div className="flex w-full flex-col rounded-xl p-[20px] md:max-w-[66%]">
            <div className="flex w-full flex-col rounded-xl bg-white p-[20px] md:ml-[20px]">
              <NftList nfts={nfts} nearid={String(nearid)} />
            </div>
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              type="button"
              className="mt-[20px] flex self-center rounded-full border-[1px] border-[#019FFF] bg-white px-6 py-2.5 font-inter text-[16px] text-xs font-medium uppercase leading-tight text-[#019FFF] transition duration-150 ease-in-out hover:bg-[#019FFF] hover:text-white focus:outline-none focus:ring-0"
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
        </div>
      </Loader>
    </div>
  );
};

LinktreePage.getInitialProps = async ({ query }) => {
  const nearid = query.slug as string;
  const queryProfile = `
  query GetAccount($id: ID!) {
    accounts(id: $id) {
      id
      data
    }
  }
  `;

  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });
  const variables = { id: nearid };

  const profile = await client
    .query({
      query: gql(queryProfile),
      variables,
    })
    .then((data) => {
      console.log("Subgraph data: ", data);
      const vself = JSON.parse(
        data.data.accounts.filter((acc: any) => acc.id == nearid)[0].data
      ).data[nearid!].vself;

      vself.links = Object.values(vself.links);
      if (nearid !== "sergantche.testnet") {
        vself.avatar = vself.avatar_url;
      }
      console.log(vself);
      return vself;
    })
    .catch((err) => {
      console.log("Error fetching data: ", err);
    });

  return {
    profile,
    nearid: String(nearid),
  };
};

export default LinktreePage;
