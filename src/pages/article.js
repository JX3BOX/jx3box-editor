import { createApp } from "vue";

import ArticlePage from "../views/article.vue";
const app = createApp(ArticlePage);

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";
app.use(ElementPlus);

import '@jx3box/jx3box-common/css/font.css';
import '@jx3box/jx3box-common/css/normalize.css';

app.mount("#app");
