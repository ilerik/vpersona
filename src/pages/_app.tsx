import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import "@near-wallet-selector/modal-ui/styles.css";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";
import Header from "../components/header";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <WalletSelectorContextProvider>
      <SessionProvider session={session}>
        <div className="font-druk bg-[url(/mission_bg.png)] bg-cover bg-fixed bg-no-repeat text-gray-900 dark:text-white">
          <Header />
          <Component {...pageProps} />
          {/* <Footer /> */}
        </div>
      </SessionProvider>
    </WalletSelectorContextProvider>
  );
};

export default trpc.withTRPC(MyApp);
