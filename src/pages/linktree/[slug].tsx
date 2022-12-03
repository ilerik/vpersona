/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import type { NextPage } from 'next';
import ProfileComponent from '../../features/profile';
import LinkList from '../../features/profile/link-list';
import NftList from '../../features/profile/nft-list';
import Loader from '../../components/loader';

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
    <div className="flex min-h-screen justify-center items-center">
      <Loader is_load={profile === undefined}>
        <div className="flex flex-col items-baseline md:flex-row w-full max-w-[1240px] my-[20px] px-[20px] mt-[120px]">
          <div className="flex flex-col w-full md:max-w-[33%] bg-[#019FFF] rounded-[20px] ">
            <div className="flex w-full flex-col mb-[20px] p-[20px]">
              <ProfileComponent profile={profile} accountId={String(nearid)} />
            </div>
            <div className="flex w-full flex-col bg-[#293FC2] rounded-[20px] p-[20px]  relative">
              <LinkList links={links} />
            </div>
          </div>
          <div className="flex flex-col w-full md:max-w-[66%] rounded-xl p-[20px]">
            <div className="flex flex-col bg-white w-full rounded-xl p-[20px] md:ml-[20px]">
              <NftList nfts={nfts} nearid={String(nearid)} />
            </div>
            <button
              onClick={()=>setIsSubscribed(!isSubscribed)}
              type="button"
              className="flex self-center text-[16px] font-inter mt-[20px] px-6 py-2.5 bg-white border-[1px] border-[#019FFF] text-[#019FFF] hover:text-white font-medium text-xs leading-tight uppercase rounded-full hover:bg-[#019FFF] focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              {isSubscribed?'Unsubscribe':'Subscribe'}
            </button>
          </div>
        </div>
      </Loader>
    </div>
  );
};

LinktreePage.getInitialProps = async ({ query }) => {
  const nearid = query.slug;
  //const profile = await getDocFromFirebase('users', String(nearid));
  // TODO fetch profile here
  const profile = { name: "mocked user"};
  return {
    profile,
    nearid: String(nearid),
  };
};

export default LinktreePage;
