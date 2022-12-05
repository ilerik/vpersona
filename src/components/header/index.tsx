/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import ActiveLink from "../active-link";
import SocialLinks from "./social-links";
import HeaderSettingsButton from "./settings-button";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import type { Account } from "near-api-js";
import { providers } from "near-api-js";
import BurgerMenuIcon from "../icons/BurgerMenuIcon";
import DropdownMenu from "./dropdown-menu";

const Header: React.FC = () => {
  // Dropdown
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<{ title: string; type: string }>(
    { title: "", type: "" }
  );
  const router = useRouter();

  const headerRef: any = useRef(null);
  // Handling Auth Flow
  const { selector, modal, accountId } = useWalletSelector();
  const [avatar, setAvatar] = useState<string | null>(null);
  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider: any = new providers.JsonRpcProvider({
      url: network.nodeUrl,
    });
    return provider
      .query({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data: any) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.options]);

  const handleSignIn = async () => {
    try {
      modal.show();
      setTimeout(() => {
        try {
          const middleBtn: any = document.querySelector(".middleButton");
          middleBtn.onclick = () => {
            modal.hide();
            router.push("/onboard");
          };
        } catch (err) {
          console.log(err);
        }
      }, 0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignOut = useCallback(async () => {
    setActiveMenu({ title: "", type: "" });
    setOpen(false);
    const wallet = await selector.wallet();

    wallet.signOut().catch((err: any) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  }, [selector]);

  useEffect(() => {
    getAccount()
      .then((nextAccount: any) => {
        // nextAccount &&
        //   getDocFromFirebase("users", String(nextAccount.account_id)).then(
        //     (doc: any) => doc && setAvatar(String(doc.avatar))
        //   );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accountId, getAccount, handleSignOut]);

  // Dropdown Menu Handling
  // Place Header Background While Scrolling
  // Detect Scroll Event and setting state
  useEffect(() => {
    const onScroll = (e: Event) => {
      if (typeof window !== undefined) {
        const win = e.currentTarget as Window;
        const currentPosition = win.scrollY;
        currentPosition > 10 ? setScrolling(true) : setScrolling(false);
      }
    };
    typeof window !== undefined && window.addEventListener("scroll", onScroll);

    return () => {
      typeof window !== undefined &&
        window.removeEventListener("scroll", onScroll);
    };
  }, [scrolling]);

  // Close Dropdown When Clicked Outside Header

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveMenu({ title: "", type: "" });
        setOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headerRef]);

  // Close Everything When Route Changes
  useEffect(() => {
    setActiveMenu({ title: "", type: "" });
    setOpen(false);
  }, [router.pathname]);

  const toggleSettingsMenu = () => {
    if (!accountId) {
      handleSignIn();
      return;
    }
    if (open && activeMenu.type !== "SettingsMenu") {
      setActiveMenu({ title: "", type: "SettingsMenu" });
      return;
    }
    setOpen(!open);
    setActiveMenu({ title: "", type: "SettingsMenu" });
  };

  // Prepareing CSS Styles
  const logoClassName = "text-[#41F092] text-[25px] font-grotesk";
  let navClassName =
    "flex flex-col fixed top-0 z-50 py-4 w-full items-center transition-colors duration-500  ";
  navClassName += "bg-[#000000f0] text-white";
  if (scrolling || open) {
    navClassName += " bg-[#000000f0]";
    if (activeMenu.title !== "") {
      navClassName += " text-[#ffffff61]";
    }
  }

  return (
    <nav className={navClassName} ref={headerRef}>
      <div className="mx-auto flex w-full max-w-[1240px] flex-row items-center justify-between px-[20px]">
        <ActiveLink href="/">
          <h2 className={logoClassName}>vSelf</h2>
        </ActiveLink>

        <div className="flex  flex-row items-center ">
          <SocialLinks />
          <HeaderSettingsButton
            avatar={avatar}
            accountId={accountId}
            toggleSettings={toggleSettingsMenu}
          />
        </div>
      </div>
      <DropdownMenu
        isOpened={open}
        accountId={accountId}
        handleSignOut={handleSignOut}
      />
    </nav>
  );
};

export default Header;
