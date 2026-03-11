<template>
    <div class="c-editor-tinymce">
        <slot name="prepend"></slot>

        <div class="c-editor-header">
            <Upload v-if="attachmentEnable" @insert="insertAttachments" />
            <!-- <Resource v-if="resourceEnable" @insert="insertResource" /> -->
            <!-- <BoxResource v-if="resourceEnable" @insert="insertResource" :subtype="subtype" /> -->
        </div>

        <Emotion v-if="emotionEnable" class="c-editor-emotion" @selected="emotionSelected"></Emotion>

        <slot></slot>

        <editor
            id="tinymce"
            v-model="data"
            :init="init"
            class="c-tinymce"
            placeholder="✔ 图片可右键粘贴或拖拽至编辑器内自动上传 ✔ 支持word/excel内容一键粘贴"
        />
        <el-alert class="u-tutorial" type="warning" show-icon
            >进入特殊区域（代码块，折叠块等等）脱离或使用工具栏触发后，请使用键盘方向 → ↓
            键进行脱离，回车只是正常在区块内换行。去掉样式点击第二行第一个&lt;清除格式&gt;即可复位。<a
                href="/collection/31"
                target="_blank"
                >[编辑器使用指南]</a
            >
        </el-alert>

        <slot name="append"></slot>
    </div>
</template>

<script>
import GlobalConf from "../config/global.js";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const { __cdn, __imgPath, __cms } = JX3BOX;
// 开发环境走 devServer proxy，避免跨域导致粘贴图片上传“看起来没反应”
const apiUrl = process.env.NODE_ENV === "development" ? "/api/cms/upload/tinymce" : __cms + "api/cms/upload/tinymce";

import Upload from "./Upload";
// import Resource from "./Resource";
// import BoxResource from "./BoxResource";
import Emotion from "@jx3box/jx3box-emotion/src/Emotion.vue";

import axios from "axios";
import Editor from "@tinymce/tinymce-vue";
import hljs_languages from "./assets/js/item/hljs_languages.js";
import { draggable } from "./assets/js/drag";

// TODO:请求代理问题

export default {
    name: "Tinymce",
    components: {
        Editor,
        Upload,
        // Resource,
        // BoxResource,
        Emotion,
    },
    directives: {
        draggable: {
            mounted: draggable,
            updated: draggable,
        },
    },
    props: {
        // Vue3 默认 v-model
        modelValue: {
            type: String,
        },

        // 默认高度
        height: {
            type: Number,
            default: 800,
        },

        // 是否启用附件上传
        attachmentEnable: {
            type: Boolean,
            default: true,
        },
        // 是否启用资源插入
        resourceEnable: {
            type: Boolean,
            default: true,
        },
        // 是否启用表情插入
        emotionEnable: {
            type: Boolean,
            default: true,
        },

        // 心法（技能连招使用）
        subtype: {
            type: String,
            default: "",
        },
    },
    emits: ["update:modelValue", "update"],
    data: function () {
        return {
            data: this.modelValue ?? "",
            init: {
                // 选择器
                selector: "#tinymce",

                // 语言
                language: "zh_CN",

                // 设置
                convert_urls: false,

                // 样式
                content_css:
                    process.env.VUE_APP_TINYMCE_DEV === "true"
                        ? `http://localhost:5120/skins/content/default/content.min.css`
                        : `${__cdn}/static/tinymce/skins/content/default/content.min.css`,
                body_class: "c-article c-article-editor c-article-tinymce",
                height: this.height || 800,
                autosave_ask_before_unload: false,
                content_style: "",

                // UI
                icons: "custom",
                menubar: false,
                branding: false,
                contextmenu: "",
                plugins: GlobalConf.plugins,
                toolbar: GlobalConf.toolbar,
                mobile: GlobalConf.mobile,
                block_formats: "段落=p;一级标题=h1;二级标题=h2;三级标题=h3;四级标题=h4;五级标题=h5;六级标题=h6;",
                fontsize_formats: "12px 14px 16px 18px 22px 24px 26px 28px 32px 48px 72px",
                color_map: GlobalConf.color_map,

                codesample_languages: hljs_languages,

                // Image
                image_advtab: true,
                file_picker_types: "file image",
                // images_upload_url: this.uploadUrl,
                automatic_uploads: true,
                // 允许直接粘贴图片（会以 blob 形式触发 images_upload_handler）
                paste_data_images: true,
                // images_upload_credentials: true,
                images_upload_handler: this.imagesUploadHandler,
                valid_children: "+body[style]",
            },
            mode: "tinymce",
        };
    },
    watch: {
        data: function (val) {
            this.$emit("update:modelValue", val);
            this.$emit("update", val);
        },
        modelValue: {
            immediate: true,
            handler: function (val) {
                if (val !== undefined && val !== this.data) this.data = val ?? "";
            },
        },
    },
    methods: {
        setup: function (editor) {
            console.log("ID为: " + editor.id + " 的编辑器即将初始化.");
        },
        ready: function (editor) {
            console.log("ID为: " + editor.id + " 的编辑器已初始化完成.");
        },
        insertAttachments: function (data) {
            // eslint-disable-next-line no-undef
            tinyMCE.editors["tinymce"].insertContent(data.html);
        },
        insertResource: function (data) {
            // eslint-disable-next-line no-undef
            tinyMCE.editors["tinymce"].insertContent(data);
        },
        imagesUploadHandler: function (blobInfo, success, failure, progress) {
            let fdata = new FormData();
            fdata.append("file", blobInfo.blob(), blobInfo.filename());

            axios
                .post(apiUrl, fdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                    auth: {
                        username: (localStorage && localStorage.getItem("token")) || "",
                        password: "cms common request",
                    },
                    onUploadProgress: function (e) {
                        if (progress && e.total > 0) {
                            progress((e.loaded / e.total) * 100);
                        }
                    },
                })
                .then((res) => {
                    const payload = res.data || {};
                    if (payload.code) {
                        failure(payload.msg || payload.message || "上传失败");
                        return;
                    }

                    const url =
                        payload.location ||
                        payload.url ||
                        (payload.data &&
                            (Array.isArray(payload.data)
                                ? payload.data[0]
                                : payload.data.url || payload.data.location || payload.data));

                    if (!url) {
                        failure("上传成功但未返回图片地址");
                        return;
                    }

                    success(url);
                })
                .catch((err) => {
                    const message =
                        (err.response && err.response.data && (err.response.data.msg || err.response.data.message)) ||
                        "图片上传请求异常";
                    failure(message);
                });
        },
        emotionSelected: function (emotion) {
            let src = emotion.filename;
            if (!emotion.filename.startsWith("http")) {
                src = `${__imgPath}emotion/output/${emotion.filename}`;
            }
            const IMAGE = `<img class="t-emotion" src="${src}" alt="${src}" style="max-width:60px;max-height:60px" />`;
            tinyMCE.editors["tinymce"].insertContent(IMAGE);
        },
    },
    mounted: function () {
        // console.log(process.env.VUE_APP_TINYMCE_DEV)
    },
};
</script>

<style lang="less">
@import "./assets/css/tinymce.less";
</style>
