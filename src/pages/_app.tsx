import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { atom } from "jotai";

import { setupWalletSelector } from "@near-wallet-selector/core";
import type { WalletSelector, AccountState } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import "@near-wallet-selector/modal-ui/styles.css";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";

// const selectorAtom = atom(
//   await setupWalletSelector({
//     network: "testnet",
//     debug: true,
//     modules: [...(await setupDefaultWallets())],
//   })
// );

// const modalAtom = atom((get) => {
//   const selector = get(selectorAtom);
//   return setupModal(selector, {
//     contractId: "v1.social08.testnet",
//   });
// });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <WalletSelectorContextProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </WalletSelectorContextProvider>
  );
};

export default trpc.withTRPC(MyApp);
