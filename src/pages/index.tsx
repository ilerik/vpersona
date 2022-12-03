import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";

import { providers, utils } from "near-api-js";
import type { AccountView } from "near-api-js/lib/providers/provider";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import { useCallback, useEffect, useState } from "react";

import { KEYPOM_CONTRACT_ID, SOCIAL_CONTRACT_ID } from "../constants";

type Account = AccountView & {
  account_id: string;
};

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const router = useRouter();

  // Wallet selector state management
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    return provider
      .query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.options]);

  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    setLoading(true);

    getAccount().then((nextAccount) => {
      setAccount(nextAccount);
      setLoading(false);
    });
  }, [accountId, getAccount]);

  const handleSignIn = () => {
    modal.show();
  };

  const handleAuthorize = async () => {
    const wallet = await selector.wallet();
    //
    //wallet.signIn;
    await wallet.signAndSendTransaction({
      signerId: accountId!,
      receiverId: KEYPOM_CONTRACT_ID,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "get_key_total_supply",
            args: {},
            gas: "30000000000000",
            deposit: "10000000000000000000000",
          },
        },
      ],
    });
  };

  const handleCreateSocialProfile = async () => {
    const wallet = await selector.wallet();
    const data = { [accountId!]: "vself" };
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
  };

  const goToProfilePage = () => {
    router.push("/profile");
  }

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  };

  const handleSwitchWallet = () => {
    modal.show();
  };

  const handleSwitchAccount = () => {
    const currentIndex = accounts.findIndex((x) => x.accountId === accountId);
    const nextIndex = currentIndex < accounts.length - 1 ? currentIndex + 1 : 0;

    const nextAccountId = accounts[nextIndex]!.accountId;

    selector.setActiveAccount(nextAccountId);

    alert("Switched account to " + nextAccountId);
  };

  const handleVerifyOwner = async () => {
    const wallet = await selector.wallet();
    try {
      const owner = await wallet.verifyOwner({
        message: "test message for verification",
      });

      if (owner) {
        alert(`Signature for verification: ${JSON.stringify(owner)}`);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      alert(message);
    }
  };

  return (
    <>
      <Head>
        <title>vPersona</title>
        <meta name="description" content="vPersona" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="align-center flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="align-center container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">vPersona</span>
          </h1>
          <p className="tracking-tight text-white sm:text-[1rem]">HACK IN PROGRESS</p>
          <div className="flex flex-col items-center gap-2 text-white">
            {loading ? (
              <>Loading Wallet Selector</>
            ) : (
              <>
                {!account ? (
                  <>
                    <p className="tracking-tight text-white">Please, sign in</p>
                  </>
                ) : (
                  <>
                    <button onClick={goToProfilePage}>
                      Create NEAR.Social Profile
                    </button>
                    <button onClick={handleSignOut}>Log out</button>
                    {/* <button onClick={handleAuthorize}>Authorize Keypom</button>
                    <button onClick={handleSwitchWallet}>Switch Wallet</button>
                    <button onClick={handleVerifyOwner}>Verify Owner</button>
                    {accounts.length > 1 && (
                      <button onClick={handleSwitchAccount}>
                        Switch Account
                      </button>
                    )} */}
                  </>
                )}
              </>
            )}
          </div>
          {/* <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div> */}
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
