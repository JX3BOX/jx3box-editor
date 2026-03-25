import { createApp } from "vue";

import ArticlePage from "../views/article.vue";
const app = createApp(ArticlePage);

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";
import "@jx3box/jx3box-common/css/element-fonticon.css";
app.use(ElementPlus);

import '@jx3box/jx3box-common/css/font.css';
import '@jx3box/jx3box-common/css/normalize.css';
import "../assets/css/tailwind.css";

app.mount("#app");
