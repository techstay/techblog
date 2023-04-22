import { defineUserConfig } from "vuepress";
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics';
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "易艾福G的技术博客",
      description: "我的技术博客，专注于技术",
    },
    // "/zh/": {
    //   lang: "zh-CN",
    //   title: "易艾福G的技术博客",
    //   description: "我的技术博客，专注于技术",
    // },
  },

  theme,
  plugins: [
    googleAnalyticsPlugin({
      id: "G-0QD3HGMX72"
    }),
  ]
  // Enable it with pwa
  // shouldPrefetch: false,
});
