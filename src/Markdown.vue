<template>
    <div class="c-editor-markdown">

        <slot name="prepend"></slot>

        <div class="c-editor-header">
            <Upload v-if="attachmentEnable" @insert="insertAttachments" :enable="true" />
            <Resource style="margin-right: 5px;" v-if="resourceEnable" @insert="insertResource" :enable="true" />
            <BoxResource v-if="resourceEnable" @insert="insertResource" :enable="true" />
        </div>

        <slot></slot>

        <markdown-editor class="c-markdown c-article" ref="md" v-model="data" @change="updateData" :subfield="false" :xssOptions="xssOptions">
            <template slot="left-toolbar-after">
                <markdown-katex @insert="insertKatex" />
                <span class="c-markdown-toolbar-image c-markdown-toolbar-item" title="上传图片" @click="selectImages"><i class="el-icon-picture-outline-round"></i></span>
                <span class="c-markdown-toolbar-file c-markdown-toolbar-item" title="上传附件" @click="selectFiles"><i class="el-icon-paperclip"></i></span>
                <markdown-video @insert="insertVideo" />
                <markdown-macro @insert="insertMacro" />
                <markdown-pz @insert="insertPz" />
                <markdown-talent @insert="insertTalent" />
                <markdown-talent2 @insert="insertTalent2" />
            </template>
        </markdown-editor>
        <input class="c-markdown-store-item" id="c-markdown-store-images" type="file" @change="uploadImages" ref="markdownImages" multiple :accept="allow_image_types" />
        <input class="c-markdown-store-item" id="c-markdown-store-files" type="file" @change="uploadFiles" ref="markdownFiles" multiple />

        <slot name="append"></slot>
    </div>
</template>

<script>
import markdownEditor from '@jx3box/markdown/src/editor.vue'

import {xssOptions} from './assets/data/markdown_whitelist.json'
import { uploadFile } from "./service/cms";

import Upload from "./Upload";
import Resource from "./Resource";
import BoxResource from "./BoxResource";

// jx3
import markdownMacro from './components/markdown/macro.vue'
import markdownPz from './components/markdown/pz.vue'
import markdownKatex from './components/markdown/katex.vue'
import markdownTalent from './components/markdown/talent.vue'
import markdownTalent2 from './components/markdown/talent2.vue'
import markdownVideo from './components/markdown/video.vue'

export default {
    name: "Markdown",
    props: {
        content: {
            type: String,
        },
        editable: {
            type: Boolean,
            default: true,
        },
        attachmentEnable: {
            type: Boolean,
            default: true,
        },
        resourceEnable: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        markdownEditor,
        Upload,
        Resource,
        BoxResource,

        markdownMacro,
        markdownPz,
        markdownKatex,
        markdownTalent,
        markdownTalent2,
        markdownVideo,
    },
    data: function() {
        return {
            data: this.content,
            allow_image_types: ["image/png", "image/jpeg", "image/gif", "image/bmp", "image/webp"],
            allow_file_types: [],
            image_ext: ["png", "jpg", "gif", "bmp", "webp"],
            files: [],
            resolved_files: [],

            xssOptions
        };
    },
    model: {
        prop: "content",
        event: "update",
    },
    watch: {
        data: function(newval) {
            this.$emit("update", newval);
        },
        content: function(newval) {
            this.data = newval;
        },
        // 监听过滤后的文件列表
        files_list: function(list) {
            this.bulkUpload(list);
        },
    },
    computed: {
        files_list: function() {
            let files = Array.from(this.files);
            return files;
        },
        $md: function() {
            return this.$refs.md;
        },
    },
    methods: {
        // 点击上传按钮
        selectImages: function() {
            document.getElementById("c-markdown-store-images").dispatchEvent(new MouseEvent("click"));
        },
        selectFiles: function() {
            document.getElementById("c-markdown-store-files").dispatchEvent(new MouseEvent("click"));
        },
        // 监听选择结果变化
        uploadImages: function(e) {
            this.files = this.$refs.markdownImages.files;
        },
        uploadFiles: function(e) {
            this.files = this.$refs.markdownFiles.files;
        },
        // 批量上传
        bulkUpload: function(list) {
            // 存在有效数据队列时
            if (!list || !list.length) return;

            // 上传队列
            let queue = [];
            for (let item of list) {
                let formdata = new FormData();
                formdata.append("file", item);
                queue.push(uploadFile(formdata));
            }

            // 回调处理
            Promise.allSettled(queue)
                .then((results) => {
                    results.forEach((result, i) => {
                        if (result.status == "fulfilled") {
                            let url = result.value.data?.data?.[0];
                            this.resolved_files.push({
                                url: url,
                                filename: list[i]["name"],
                                type: list[i]["type"],
                                ext: list[i]["name"].split(".").pop(),
                            });
                        }
                    });
                    this.insertFiles();
                })
                .finally(() => {
                    // 上传完成后清空input
                    this.images = [];
                    this.files = [];
                    this.resolved_files = [];
                });
        },
        // 插入正文
        insertFiles: function() {
            for (let item of this.resolved_files) {
                // 插入图片
                if (this.image_ext.includes(item.ext)) {
                    this.$md.insertText(this.$md.getTextareaDom(), {
                        prefix: `![${item.filename}](${item.url})`,
                        subfix: "",
                        str: "",
                    });
                    // 插入文字链接
                } else {
                    this.$md.insertText(this.$md.getTextareaDom(), {
                        prefix: `[${item.filename}](${item.url})`,
                        subfix: "",
                        str: "",
                    });
                }
            }
        },
        // 更新触发
        updateData: function(data, render) {
            this.$emit("updateData", {
                data,
                render,
            });
            this.data = data
        },
        // 插入附件
        insertAttachments: function(data) {
            let list = data?.list || []
            for(let item of list){
                // 插入图片
                if (item.is_img) {
                    this.$md.insertText(this.$md.getTextareaDom(), {
                        prefix: `![${item.name}](${item.url})`,
                        subfix: "",
                        str: "",
                    });
                // 插入文字链接
                } else {
                    this.$md.insertText(this.$md.getTextareaDom(), {
                        prefix: `[${item.name}](${item.url})`,
                        subfix: "",
                        str: "",
                    });
                }
            }
        },
        insertResource: function(data) {
            this.$md.insertText(this.$md.getTextareaDom(), {
                prefix: data,
                subfix: "",
                str: "",
            });
        },
        insertMacro(data) {
            this.$md.insertText(this.$md.getTextareaDom(), {
                prefix: data,
                subfix: "",
                str: "",
            });
        },
        insertPz(data) {
            this.$md.insertText(this.$md.getTextareaDom(), {
                prefix: data,
                subfix: "",
                str: "",
            });
        },
        insertKatex(data) {
            this.$md.insertText(this.$md.getTextareaDom(), {
                prefix: data,
                subfix: "",
                str: "",
            });
        },
        insertTalent(data) {
            this.$md.insertText(this.$md.getTextareaDom(), {
                prefix: data,
                subfix: "",
                str: "",
            });
        },
        insertTalent2(data) {
            this.$md.insertText(this.$md.getTextareaDom(), {
                prefix: data,
                subfix: "",
                str: "",
            });
        },
        insertVideo(data) {
            this.$md.insertText(this.$md.getTextareaDom(), {
                prefix: data,
                subfix: "",
                str: "",
            });
        }
    },
    filters: {},
    created: function() {},
    mounted: function() {},
};
</script>

<style lang="less">
@import "./assets/css/resource.less/markdown.less";
</style>
