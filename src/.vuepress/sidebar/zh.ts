import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    {
      text: "技能",
      icon: "speed",
      prefix: "skill/",
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
