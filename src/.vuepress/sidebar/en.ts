import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
    {
      text: "Tutorials",
      icon: "material-symbols:school",
      prefix: "tutorials/",
      children: "structure"
    },
    {
      text: "Posts",
      icon: "mdi:blog-outline",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
  ]
});
