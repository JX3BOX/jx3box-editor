import { createApp } from "vue";

import MarkdownPage from "../views/markdown.vue";
const app = createApp(MarkdownPage);

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";
app.use(ElementPlus);

import '@jx3box/jx3box-common/css/font.css';
import '@jx3box/jx3box-common/css/normalize.css';

app.mount("#app");
