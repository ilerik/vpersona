// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config, { isServer }) {
    //config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    if (isServer) {
      config.output.webassemblyModuleFilename =
        "./../static/wasm/[modulehash].wasm";
    } else {
      config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    }
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };
    config.optimization.moduleIds = "named";
    return config;
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  env: {
    FIREBASE_API_KEY: String(process.env.FIREBASE_API_KEY),
    FIREBASE_AUTH_DOMAIN: String(process.env.FIREBASE_AUTH_DOMAIN),
    FIREBASE_DATABASE_URL: String(process.env.FIREBASE_DATABASE_URL),
    FIREBASE_PROJECT_ID: String(process.env.FIREBASE_PROJECT_ID),
    FIREBASE_STORAGE_BUCKET: String(process.env.FIREBASE_STORAGE_BUCKET),
    FIREBASE_MESSAGING_SENDER_ID: String(
      process.env.FIREBASE_MESSAGING_SENDER_ID
    ),
    FIREBASE_APP_ID: String(process.env.FIREBASE_APP_ID),
    FIREBASE_MEASUREMENT_ID: String(process.env.FIREBASE_MEASUREMENT_ID),
  },
};
export default config;
