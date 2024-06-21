import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
    base: "/E-utilities_zh-CN/",

    lang: "zh-CN",
    title: "E-utilities 汉化文档",
    description: "E-utilities 的汉化文档",

    theme,

    // 和 PWA 一起启用
    // shouldPrefetch: false,
});
