import { sidebar } from "vuepress-theme-hope";

export default sidebar({
    "/": [
        "",
        // "portfolio",
        {
            text: "E-utilities 英文文档",
            icon: "earth-americas",
            prefix: "E-utilities_EN/",
            link: "E-utilities_EN/",
            children: "structure",
        },
        {
            text: "E-utilities 汉化文档",
            icon: "language",
            prefix: "E-utilities_zh-CN/",
            link: "E-utilities_zh-CN/",
            children: "structure",
        },
    ],
});
