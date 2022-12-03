# **vRanda**

### Task #6 Web3 social networks, integration with DAO

vRanda is a user-friendly Web3 profile for decentralized social networks.

All the user personal data stores in Social DB. [[https://github.com/NearSocial/social-db/](https://github.com/NearSocial/social-db/)]

vRanda has Web2.5 -oriented design to facilitate mass adoption.

We use The Graph Protocol NEAR & Social DB subgraphs for indexing and search. [[https://thegraph.com/en/](https://thegraph.com/en/)]

The user can add:

- Name & bio
- Avatar picture
- Portfolio links
- NEAR NFTs
- Subscriptions (NEAR IDs)

Structure:

- Front
- The Graph Protocol NEAR subgraph for NFTs indexing by user NEAR id
- The Graph Protocol Social DB subgraph for users indexing by user NEAR id

In the vRanda profiles, users can create a Web3 profile, manage their personal data and choose which information they want to disclose. vRanda stores the user's personal data on-chain in Social DB. All the listed information is saved according to the authorized user's NEAR ID.

Any user’s profile is available to everyone on her public page. The address of this public page contains the user's NEAR ID. Therefore, the data from Social DB is retrieved to the dynamic page according to the current NEAR ID.

Using NEAR Explorer to import profile data might be confusing, especially if we address Web2 users. For this reason, we provide a simple process of NFT import. There is no need to provide a NEAR contact address or NFT ID. All the NFTs will be loaded automatically according to the user's NEAR ID. We use The Graph Protocol to set up a NEAR subgraph to accomplish this goal. It is used to index all NFTs owned by a given user.

Also, we use The Graph Protocol to index Social DB by user NEAR ID. It is used to provide the information about given user to her public page.

# MVP Deployment

1. Web application on Vercel https://vpersona.vercel.app
1. Subgraph for Near.Social https://thegraph.com/hosted-service/subgraph/ilerik/near-social

# Create T3 App

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with the most basic configuration and then move on to more advanced configuration.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

We also [roll our own docs](https://create.t3.gg) with some summary information and links to the respective documentation.

Also checkout these awesome tutorials on `create-t3-app`.

- [Build a Blog With the T3 Stack - tRPC, TypeScript, Next.js, Prisma & Zod](https://www.youtube.com/watch?v=syEWlxVFUrY)
- [Build a Live Chat Application with the T3 Stack - TypeScript, Tailwind, tRPC](https://www.youtube.com/watch?v=dXRRY37MPuk)
- [Build a full stack app with create-t3-app](https://www.nexxel.dev/blog/ct3a-guestbook)
- [A first look at create-t3-app](https://dev.to/ajcwebdev/a-first-look-at-create-t3-app-1i8f)

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
