import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [
    "",
    {
      text: "教程",
      icon: "material-symbols:school",
      prefix: "tutorials/",
      children: "structure"
    },
    {
      text: "文章",
      icon: "mdi:blog-outline",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
  ],
});
