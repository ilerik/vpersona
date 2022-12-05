/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import ProfileComponent from "../../features/profile";
import LinkList from "../../features/profile/link-list";
import NftList from "../../features/profile/nft-list";
import Loader from "../../components/loader";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { SOCIAL_CONTRACT_ID } from "../../constants";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL = "https://api.thegraph.com/subgraphs/name/ilerik/near-social";
const queryProfile = `
  query GetAccount($id: ID!) {
    accounts(id: $id) {
      id
      data
    }
  }
`;

interface LinktreePageProps {
  profile: any;
  nearid: string;
}

interface FormState {
  subscriptions: any[]
}

const LinktreePage: NextPage<LinktreePageProps> = ({ profile, nearid }) => {
  const [signedInProfile, setSignedInProfile] = useState<FormState>({subscriptions: []});
  const [showSubscribeButton, setShowSubscribeButton] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { accountId, selector } = useWalletSelector();
  const { links, nfts } = profile || {
    links: [],
    nfts: [],
  };

  // Fetch subscriptions of authorized user
  useEffect(() => {
    const initProfile = async () => {
      try {
        // First check that user is authorized in NEAR
        if (accountId === null) {
          setShowSubscribeButton(false);
          return;
        }

        // Fetch subscriptions and update state
        const client = new ApolloClient({
          uri: APIURL,
          cache: new InMemoryCache(),
        });
        const variables = { id: accountId };
        try {
          const { data } = await client.query({ query: gql(queryProfile), variables });
          const vself = JSON.parse(
            data.accounts.filter((acc: any) => acc.id == accountId)[0]
              .data
          ).data[accountId!].vself;
          console.log(vself);
          const subs: string[] = vself.subscriptions === undefined ? [] : Object.values(vself.subscriptions);

          // Check that `account_id` has already subscribed on the `near_id`
          const ind = subs.findIndex((v: unknown) => v === nearid);
          setSignedInProfile(vself);
          setIsSubscribed(ind !== -1);
          setShowSubscribeButton(true);
        } catch (err) {
          console.log("Error fetching subscriptions: ", err);
        }
      } catch (err) {
        console.log(err);
      }
    };
    initProfile();
  }, [accountId]);

  const handleSubscribe = async () => {
    try {
      // Form data to save in the contract
      let newSubs: any = [];
      if (Object.keys(signedInProfile?.subscriptions).length > 0) {
        newSubs = Object.values(signedInProfile.subscriptions);
      } 
      newSubs.push(nearid);
      const data = {
        [accountId!]: {
          vself: {
            ...signedInProfile,
            subscriptions: Object.assign({}, newSubs)
          },
        },
      };

      const wallet = await selector.wallet();
      await wallet.signAndSendTransaction({
        signerId: accountId!,
        receiverId: SOCIAL_CONTRACT_ID,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "set",
              args: { data },
              gas: "30000000000000",
              deposit: "100000000000000000000000",
            },
          },
        ],
      });
      setIsSubscribed(true);
    } catch (err) {
      console.log("Can't fetch data", err);
    }
  }

  const handleUnSubscribe = async () => {
    try {
      // Form data to save in the contract
      const index = Object.values(signedInProfile.subscriptions).indexOf(nearid);
      if (index === -1) {
        console.log(`${accountId} is not subscribe on ${nearid}`);
        return;
      }
      let newSubs = Object.values(signedInProfile.subscriptions);
      newSubs.splice(index, 1); // remove subscription on `nearid`

      // Form data
      const data = {
        [accountId!]: {
          vself: {
            ...signedInProfile,
            subscriptions: Object.assign({}, newSubs)
          },
        },
      };
      const wallet = await selector.wallet();
      await wallet.signAndSendTransaction({
        signerId: accountId!,
        receiverId: SOCIAL_CONTRACT_ID,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "set",
              args: { data },
              gas: "30000000000000",
              deposit: "100000000000000000000000",
            },
          },
        ],
      });
      setIsSubscribed(false);
    } catch (err) {
      console.log("Can't fetch data", err);
    }
  }

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
            {
              showSubscribeButton && (
                <button
                  onClick={isSubscribed ? () => handleUnSubscribe() : () => handleSubscribe()}
                  type="button"
                  className="mt-[20px] flex self-center rounded-full border-[1px] border-[#019FFF] bg-white px-6 py-2.5 font-inter text-[16px] text-xs font-medium uppercase leading-tight text-[#019FFF] transition duration-150 ease-in-out hover:bg-[#019FFF] hover:text-white focus:outline-none focus:ring-0"
                >
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </button>
              )
            }
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
      const vself = JSON.parse(
        data.data.accounts.filter((acc: any) => acc.id == nearid)[0].data
      ).data[nearid!].vself;

      vself.links = Object.values(vself.links);
      return vself;
    })
    .catch((err) => {
      console.log("Error fetching data: ", err);
      return {};
    });

  return {
    profile,
    nearid: String(nearid),
  };
};

export default LinktreePage;
