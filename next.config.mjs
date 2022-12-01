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
    config.experiments = { ...config.experiments, asyncWebAssembly: true, topLevelAwait: true };    
    config.optimization.moduleIds = "named";
    return config;
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
