import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
    {
      text: "Tutorials",
      icon: "speed",
      prefix: "tutorials/",
      children: "structure"
    },
    {
      text: "Posts",
      icon: "blog",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
  ]
});
