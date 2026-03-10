import { createApp } from "vue";

import TinymcePage from "../views/tinymce.vue";
const app = createApp(TinymcePage);

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";
app.use(ElementPlus);

app.mount("#app");
