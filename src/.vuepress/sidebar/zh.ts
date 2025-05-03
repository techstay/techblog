import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [
    "",
    {
      text: "教程",
      icon: "speed",
      prefix: "tutorials/",
      children: "structure"
    },
    {
      text: "文章",
      icon: "blog",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
  ],
});
