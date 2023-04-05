const env = process.env.NODE_ENV;
const isDev = env === "development";

console.log("isDev", isDev);
const DEV_CONFIG = {};

const PRD_CONFIG = {};
const nextConfig = {
  ...(isDev ? DEV_CONFIG : PRD_CONFIG),
};

module.exports = nextConfig;
