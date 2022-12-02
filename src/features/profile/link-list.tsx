import React from 'react';
import Loader from '../../components/loader';
import LinkButton from './link-button';

interface LinkListProps {
  links: any[] | undefined;
  isEditing?: boolean;
  btnCallback?: (index: number) => void;
  rmvCallback?: (index: number) => void;
  addBtnCallback?: () => void;
}

const LinkList: React.FC<LinkListProps> = ({ links, isEditing, btnCallback, rmvCallback, addBtnCallback }) => {
  return (
    <Loader is_load={links === undefined}>
      <>
        <h2 className="font-interMedium text-white text-[16px] mb-4">Links</h2>
        {links !== undefined &&
          links.map(({ title, meta, url }: any, index: number) => (
            <LinkButton
              key={index}
              index={index}
              title={title}
              url={url}
              meta={meta}
              isEditing={isEditing}
              btnCallback={btnCallback}
              rmvCallback={rmvCallback}
            />
          ))}
        {isEditing && (
          <button
            onClick={addBtnCallback}
            type="button"
            className="w-full text-center my-4 px-6 py-[16px] bg-transparent border-[1px] border-[#57BFFF] text-[#FFFFFF] text-[16px] font-inter hover:text-white font-medium text-xs leading-tight uppercase rounded-full hover:bg-[#019FFF] focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
          >
            Add link
          </button>
        )}
      </>
    </Loader>
  );
};

export default LinkList;
