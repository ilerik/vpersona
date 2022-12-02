import React from 'react';
import NftLink from './nft-link';

interface NftListProps {
  nfts: any[] | undefined;
  btnCallback?: (index: number) => void;
  addBtnCallback?: () => void;
  rmvCallback?: (index: number) => void;
  isEditing?: boolean;
  nearid?: string;
}

const NftList: React.FC<NftListProps> = ({ nfts, btnCallback, rmvCallback, addBtnCallback, isEditing, nearid }) => {
  return (
    <div className="w-full xl:min-w-[600px] max-w-[1080px] flex-col flex sm:mx-2 relative">
      <div className="flex flex-row justify-between">
        <h2 className="font-grotesk text-[#3D3D3D] text-[32px] uppercase">Nfts</h2>
        {isEditing && (
          <div className="flex flex-row">
            <button
              onClick={addBtnCallback}
              type="button"
              className="flex self-center text-[16px] font-inter mr-[10px] px-6 py-2.5 bg-transparent border-[1px] border-[#019FFF] text-[#019FFF] hover:text-white font-medium text-xs leading-tight uppercase rounded-full hover:bg-[#019FFF] focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              Add nft
            </button>
            <button
              type="submit"
              className="flex self-center text-[16px] font-inter px-6 py-2.5 bg-transparent border-[1px] border-[#019FFF] text-[#019FFF] hover:text-white font-medium text-xs leading-tight uppercase rounded-full hover:bg-[#019FFF] focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
      {nfts !== undefined &&
        nfts.map(({ title, meta, url }: any, index: number) => (
          <NftLink
            key={index}
            title={title}
            meta={meta}
            url={url}
            index={index}
            btnCallback={btnCallback}
            rmvCallback={rmvCallback}
            isEditing={isEditing}
            nearid={nearid}
          />
        ))}
    </div>
  );
};

export default NftList;
