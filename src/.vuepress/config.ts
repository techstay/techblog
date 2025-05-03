import { viteBundler } from '@vuepress/bundler-vite';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics';
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Techstay's Tech Blog",
      description: "My tech blog, focused on technology",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "易艾福G的技术博客",
      description: "我的技术博客，专注于技术",
    },
  },

  theme,
  plugins: [
    googleAnalyticsPlugin({
      id: "G-0QD3HGMX72"
    }),
  ],

  bundler: viteBundler({
    viteOptions: {
    },
    vuePluginOptions: {},
  }),
});


