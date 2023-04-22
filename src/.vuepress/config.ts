import { defineUserConfig } from "vuepress";
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

  // Enable it with pwa
  // shouldPrefetch: false,
});
