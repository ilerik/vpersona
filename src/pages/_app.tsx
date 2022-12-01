import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import "@near-wallet-selector/modal-ui/styles.css";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";

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
