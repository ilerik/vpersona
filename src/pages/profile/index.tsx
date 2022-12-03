/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
// import {
//   addDocToFirestoreWithName,
//   getDocFromFirebase,
//   // setAnalyticsUserProperties,
//   uploadImageToFirebase,
// } from '../../utils/firebase';
import Modal from "../../components/modal";
import LinkEditor from "../../features/profile/link-editor";
import NftList from "../../features/profile/nft-list";
import LinkList from "../../features/profile/link-list";
import ProfileComponent from "../../features/profile";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import ErrorCreateMessage from "../../features/event-form/error-create";
import Loader from "../../components/loader";
import NotAuthorizedBlock from "../../components/not-authorized";
import { KEYPOM_CONTRACT_ID, SOCIAL_CONTRACT_ID } from "../../constants";

type resultLink = {
  [key: string]: string;
};

interface formState {
  name: string;
  bio: string;
  links: any[];
  nfts: any[];
}

const initialFormState = {
  name: "",
  bio: "",
  links: [],
  nfts: [],
};

const ProfilePage: NextPage = () => {
  const [formState, setFormState] = useState<formState>(initialFormState);
  const { links, nfts, ...profile } = formState;
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLinkEditing, setIsLinkEditing] = useState<boolean>(false);
  const [isNftEdit, setIsNftEdit] = useState<boolean>(false);
  const [linkToEdit, setLinkToEdit] = useState<any>();
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [nftsData, setNftsData] = useState<object>({});

  const { accountId, selector } = useWalletSelector();

  useEffect(() => {
    const initProfile = async () => {
      try {
        // TODO fetch user data
        //const result = await getDocFromFirebase('users', String(accountId));
        const result = {};
        setFormState(
          result ? { ...initialFormState, ...result } : initialFormState
        );
      } catch (err) {
        setFormState(initialFormState);
      } finally {
        setIsLoading(false);
      }
    };
    initProfile();
  }, [accountId]);

  const submitLinkTreeForm = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    console.log("Save changes");
    event.preventDefault();
    try {
      setIsLoading(true);
      if (!accountId) {
        throw "Invalid ID";
      }
      
      // Save profile data in near social contract
      console.log(avatar);
      const avatar_url =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/800px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg";
      // TODO Upload image
      // uploadImageToFirebase(avatar).then((url) => {
      //   addDocToFirestoreWithName('users', String(accountId), { ...formState, avatar: url });
      // });
      // setAnalyticsUserProperties({ avatar: 'changed' });

      // Save in blockchain
      const wallet = await selector.wallet();
      const data = {
        [accountId!]: {
          vself: { avatar_url, name: profile.name, bio: profile.bio },
        },
      };
      console.log(data);
      wallet.signAndSendTransaction({
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
      //setIsSuccess(true);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsSuccess(false);
    setIsLinkEditing(false);
    setIsNftEdit(false);
    setLinkToEdit(null);
    setActiveIndex(-1);
    setIsError(false);
  };

  const openModal = () => {
    setIsLinkEditing(true);
  };

  const openNftModal = () => {
    setIsLinkEditing(true);
    setIsNftEdit(true);
  };

  const handleNewLink = (link: resultLink) => {
    if (isNftEdit) {
      let newNftsArray = [...nfts];
      const checkedNFTSLinksArray = newNftsArray.filter(
        (el) => el.title == link.title
      );
      if (checkedNFTSLinksArray.length && !linkToEdit) {
        throw "already exist";
      }
      newNftsArray = [...nfts, link];
      setIsLinkEditing(false);
      setIsNftEdit(false);
      setFormState({ ...formState, nfts: newNftsArray });
    } else {
      let newLinksArray = [...links];
      const checkedLinksArray = newLinksArray.filter(
        (el) => el.title == link.title
      );
      if (checkedLinksArray.length && !linkToEdit) {
        throw "already exist";
      }
      if (activeIndex > -1) {
        newLinksArray[activeIndex] = link;
      } else {
        newLinksArray = [...links, link];
      }
      setActiveIndex(-1);
      setIsLinkEditing(false);
      setFormState({ ...formState, links: newLinksArray });
    }
    setLinkToEdit(null);
  };

  const removeLink = (index: number) => {
    const newLinksArray = [...links];
    newLinksArray.splice(index, 1);
    setFormState({ ...formState, links: newLinksArray });
  };

  const removeNftsLink = (index: number) => {
    const newNftLinksArray = [...nfts];
    newNftLinksArray.splice(index, 1);
    setFormState({ ...formState, nfts: newNftLinksArray });
  };

  const selectLinkToEdit = (index: number) => {
    setIsLinkEditing(true);
    setActiveIndex(index);
    setLinkToEdit(links[index]);
  };

  const selectNftLinkToEdit = (index: number) => {
    setIsLinkEditing(true);
    setIsNftEdit(true);
    setActiveIndex(index);
    setLinkToEdit(nfts[index]);
  };

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const key = e.currentTarget.name;
    setFormState({ ...formState, [key]: value });
  };

  const handleTextareaChange = (
    event: React.FormEvent<HTMLTextAreaElement>
  ): void => {
    const value = event.currentTarget.value;
    const key = event.currentTarget.name;
    setFormState({ ...formState, [key]: value });
  };

  const handleImgChange = (file: File) => {
    setAvatar(file);
  };

  if (!accountId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-[20px]">
        <div className="w-full max-w-[1240px] rounded-xl bg-white px-[20px] py-[40px]">
          <div className="mx-auto w-full max-w-[1080px]">
            <NotAuthorizedBlock />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal isOpened={isLinkEditing} closeCallback={closeModal}>
        <LinkEditor
          submitLink={handleNewLink}
          linkToEdit={linkToEdit}
          account_id={String(accountId)}
          isNftEdit={isNftEdit}
        />
      </Modal>
      <Modal isOpened={isSuccess} closeCallback={closeModal}>
        <h2 className="mb-2 font-drukMedium text-black">
          Your changes has been applied
        </h2>
        {/* <p className="text-[#3D3D3D] mb-4">
          You can see your changes on your{' '}
          <a className="underline text-[#019FFF] hover:no-underline" href={`/linktree/${accountId}`}>
            profile page
          </a>
        </p> */}
      </Modal>
      <Modal isOpened={isError} isError={isError} closeCallback={closeModal}>
        <ErrorCreateMessage />
      </Modal>
      <div className="flex min-h-screen items-center justify-center pt-[125px]">
        <Loader is_load={isLoading}>
          <form
            onSubmit={submitLinkTreeForm}
            className="my-[20px] flex w-full max-w-[1240px] flex-col  items-baseline px-[20px] md:flex-row"
          >
            <div className="flex w-full flex-col items-center rounded-[20px] bg-[#019FFF] md:w-1/3 ">
              <div className="mb-[20px] flex w-full flex-col py-[30px] px-[40px]">
                <ProfileComponent
                  isEditing={true}
                  profile={profile}
                  handleInputChange={handleInputChange}
                  handleTextareaChange={handleTextareaChange}
                  accountId={String(accountId)}
                  handleImgChange={handleImgChange}
                />
              </div>
              <div className="relative flex w-full flex-col rounded-[20px] bg-[#293FC2] py-[30px] px-[40px]">
                <LinkList
                  addBtnCallback={openModal}
                  links={links}
                  isEditing={true}
                  btnCallback={selectLinkToEdit}
                  rmvCallback={removeLink}
                />
              </div>
            </div>

            <div className="flex w-full flex-col items-center rounded-xl bg-white py-[30px] px-[40px] md:ml-[20px] md:w-2/3">
              <NftList
                nfts={nfts}
                btnCallback={selectNftLinkToEdit}
                rmvCallback={removeNftsLink}
                isEditing={true}
                addBtnCallback={openNftModal}
                nearid={String(accountId)}
              />
            </div>
          </form>
        </Loader>
      </div>
    </>
  );
};

// ProfilePage.getInitialProps = async (...ctx) => {
//   console.log('ctx: ', ctx);
//   return {
//     test: 'test',
//   };
// };

export default ProfilePage;
