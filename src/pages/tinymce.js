import { createApp } from "vue";

import TinymcePage from "../views/tinymce.vue";
const app = createApp(TinymcePage);

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";

const rawLang = (localStorage.getItem("lang") || "zh-cn").toLowerCase();
const langMap = {
    "zh-cn": { element: "zh-cn", tinymce: "zh_CN" },
    "zh-hans": { element: "zh-cn", tinymce: "zh_CN" },
    "zh-tw": { element: "zh-tw", tinymce: "zh_TW" },
    "zh-hant": { element: "zh-tw", tinymce: "zh_TW" },
    en: { element: "en", tinymce: "en" },
    "en-us": { element: "en", tinymce: "en" },
    vi: { element: "vi", tinymce: "vi_VN" },
    "vi-vn": { element: "vi", tinymce: "vi_VN" },
};
const currentLang = langMap[rawLang] || langMap["zh-cn"];
window.__EDITOR_LANG__ = currentLang;

const epLocaleLoaders = {
    "zh-cn": () => import("element-plus/es/locale/lang/zh-cn"),
    "zh-tw": () => import("element-plus/es/locale/lang/zh-tw"),
    en: () => import("element-plus/es/locale/lang/en"),
    vi: () => import("element-plus/es/locale/lang/vi"),
};
const loadElementLocale = epLocaleLoaders[currentLang.element] || epLocaleLoaders["zh-cn"];

import '@jx3box/jx3box-common/css/font.css';
import '@jx3box/jx3box-common/css/normalize.css';

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

loadElementLocale()
    .then((module) => {
        app.use(ElementPlus, { locale: module.default });
    })
    .catch(() => {
        app.use(ElementPlus);
    })
    .finally(() => {
        app.mount("#app");
    });
