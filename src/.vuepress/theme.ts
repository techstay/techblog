import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://techstay.tech",

  author: {
    name: "techstay",
    url: "https://github.com/techstay",
  },
  hotReload: true,
  logo: "https://m.gettywallpapers.com/wp-content/uploads/2023/05/Cute-Anime-Avatar.jpg",

  repo: "techstay/techblog",
  copyright: 'Licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh">CC BY-NC-ND 4.0</a>',
  docsDir: "src",

  blog: {
    medias: {
      Email: "mailto:lovery521@gmail.com",
      GitHub: "https://github.com/techstay",
    },
  },

  markdown: {
    figure: true,
    imgLazyload: true,
    imgMark: true,
    imgSize: true,
    math: {
      type: "katex",
    },
    include: true,
    revealjs: true,
    footnote: true,
    tabs: true,
    alert: true,
    sub: true,
    sup: true,
    spoiler: true,
    attrs: true,
    mark: true,
    align: true,
    echarts: true,
    mermaid: true,
    plantuml: true,
    markmap: true,
    flowchart: true,
    codeTabs: true
  },

  locales: {
    "/": {
      navbar: enNavbar,
      sidebar: enSidebar,
      footer: "Techstay's tech blog. Current Page Views: <span id='vercount_value_page_pv'>Loading</span>. Total Visits: <span id='vercount_value_site_pv'>Loading</span>. Total Visitors: <span id='vercount_value_site_uv'>Loading</span>.",
      displayFooter: true,
      blog: {
        description: "Techstay's tech blog.",
        intro: "/intro.html",
      },

    },

    "/zh/": {
      navbar: zhNavbar,
      sidebar: zhSidebar,
      footer: "易艾福G的技术博客 本页访问: <span id='vercount_value_page_pv'>Loading</span>. 总站访问: <span id='vercount_value_site_pv'>Loading</span>. 总站访客: <span id='vercount_value_site_uv'>Loading</span>.",
      displayFooter: true,
      blog: {
        description: "懒人一个",
        intro: "/intro.html",
      },

    },
  },

  plugins: {
    blog: true,

    icon: {
      assets: "iconify",
    },

    comment: {
      provider: "Giscus",
      repo: "techstay/techblog",
      repoId: "R_kgDOJZ7KHA",
      category: "Announcements",
      categoryId: "DIC_kwDOJZ7KHM4CV9lO",
      mapping: "pathname",
    },

    feed: {
      rss: true,
    }
  },
});
