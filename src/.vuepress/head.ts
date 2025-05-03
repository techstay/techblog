import type { HeadConfig } from 'vuepress/client';

const head: HeadConfig[] = [
    ["script", { src: "https://events.vercount.one/js", defer: true }],
]

export default head;