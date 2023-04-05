const env = process.env.NODE_ENV;
const isDev = env === "development";

console.log("isDev", isDev);
const DEV_CONFIG = {};

const PRD_CONFIG = {
  output: "standalone",
  compress: true,
};
const nextConfig = {
  ...(isDev ? DEV_CONFIG : PRD_CONFIG),
};

module.exports = nextConfig;
