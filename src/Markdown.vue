<template>
    <div class="c-editor-markdown">
        <slot name="prepend"></slot>

        <div class="c-editor-markdown__toolbar">
            <div class="c-editor-markdown__toolbar-left">
                <span class="c-editor-markdown__toolbar-label">编辑模式</span>
                <el-radio-group v-model="editorMode" size="small">
                    <el-radio-button v-for="item in modeOptions" :key="item.value" :value="item.value">
                        {{ item.label }}
                    </el-radio-button>
                </el-radio-group>
            </div>
            <div class="c-editor-markdown__toolbar-tip">GitHub 样式预览，支持 Ctrl+V 粘贴图片上传</div>
        </div>

        <slot></slot>

        <div ref="editorHost" class="c-editor-markdown__host"></div>

        <slot name="append"></slot>
    </div>
</template>

<script>
import axios from "axios";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import Vditor from "vditor";
import "vditor/dist/index.css";
import "github-markdown-css/github-markdown.css";

const { __cms } = JX3BOX;
const UPLOAD_API = `${__cms}api/cms/upload`;
const MODE_OPTIONS = [
    { label: "所见即所得", value: "wysiwyg" },
    { label: "即时渲染", value: "ir" },
    { label: "分屏预览", value: "sv" },
];

export default {
    name: "Markdown",
    props: {
        modelValue: {
            type: String,
        },
        content: {
            type: String,
            default: "",
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
        placeholder: {
            type: String,
            default: "支持 Markdown，支持 Ctrl+V 粘贴图片上传",
        },
        height: {
            type: [String, Number],
            default: 720,
        },
    },
    emits: ["update:modelValue", "update:content", "update", "updateData"],
    data() {
        return {
            data: this.modelValue ?? this.content ?? "",
            editor: null,
            editorReady: false,
            editorMode: "ir",
            modeOptions: MODE_OPTIONS,
            isRebuildingEditor: false,
            isUploadingImage: false,
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                if (value !== undefined && value !== this.data) {
                    this.data = value ?? "";
                    this.syncEditorValue(this.data);
                }
            },
        },
        content: {
            immediate: true,
            handler(value) {
                if (this.modelValue === undefined && value !== this.data) {
                    this.data = value ?? "";
                    this.syncEditorValue(this.data);
                }
            },
        },
        editable: {
            immediate: true,
            handler() {
                this.applyEditableState();
            },
        },
        editorMode(nextMode, prevMode) {
            if (!this.editorReady || this.isRebuildingEditor || nextMode === prevMode) {
                return;
            }

            this.rebuildEditor(nextMode);
        },
    },
    mounted() {
        this.initEditor();
    },
    beforeUnmount() {
        this.destroyEditor();
    },
    methods: {
        getPreviewMode(mode) {
            return mode === "sv" ? "both" : "editor";
        },
        getToolbar() {
            return [
                "headings",
                "bold",
                "italic",
                "strike",
                "link",
                "|",
                "list",
                "ordered-list",
                "check",
                "quote",
                "code",
                "inline-code",
                "table",
                "|",
                "undo",
                "redo",
                "fullscreen",
            ];
        },
        buildEditorOptions(initialValue) {
            return {
                cache: {
                    enable: false,
                },
                classes: {
                    preview: "markdown-body",
                },
                counter: {
                    enable: true,
                    type: "markdown",
                },
                height: this.height,
                icon: "ant",
                lang: "zh_CN",
                mode: this.editorMode,
                placeholder: this.placeholder,
                preview: {
                    delay: 0,
                    hljs: {
                        enable: true,
                        lineNumber: false,
                        style: "github",
                    },
                    markdown: {
                        sanitize: true,
                    },
                    mode: this.getPreviewMode(this.editorMode),
                },
                customWysiwygToolbar() {},
                toolbar: this.getToolbar(),
                toolbarConfig: {
                    pin: true,
                },
                upload: {
                    accept: "image/*",
                    max: 30 * 1024 * 1024,
                    multiple: false,
                    withCredentials: true,
                    handler: async (files) => this.handleImageUpload(files),
                },
                value: initialValue,
                after: () => {
                    this.editorReady = true;
                    this.syncEditorValue(this.data);
                    this.applyEditableState();
                },
                input: (value) => {
                    this.handleEditorInput(value);
                },
            };
        },
        initEditor(initialValue = this.data) {
            const host = this.$refs.editorHost;
            if (!host) return;

            this.editorReady = false;
            this.editor = new Vditor(host, this.buildEditorOptions(initialValue));
        },
        destroyEditor() {
            if (!this.editor) return;

            this.editor.destroy();
            this.editor = null;
            this.editorReady = false;
        },
        rebuildEditor() {
            const currentValue = this.editor?.getValue?.() ?? this.data ?? "";
            this.data = currentValue;
            this.isRebuildingEditor = true;
            this.destroyEditor();
            this.$nextTick(() => {
                this.initEditor(currentValue);
                this.isRebuildingEditor = false;
            });
        },
        syncEditorValue(value) {
            if (!this.editorReady || !this.editor) return;

            const nextValue = value ?? "";
            if (this.editor.getValue() === nextValue) return;
            this.editor.setValue(nextValue);
        },
        applyEditableState() {
            if (!this.editorReady || !this.editor) return;

            if (this.editable) {
                this.editor.enable();
            } else {
                this.editor.disabled();
            }
        },
        handleEditorInput(value) {
            this.data = value;
            this.emitEditorPayload(value);
        },
        emitEditorPayload(value) {
            this.$emit("update:modelValue", value);
            this.$emit("update:content", value);
            this.$emit("update", value);
            this.$emit("updateData", {
                data: value,
                render: this.editor?.getHTML?.() ?? "",
            });
        },
        validateImageFile(file) {
            if (!file) return "未检测到可上传的文件";
            if (!file.type?.startsWith("image/")) return "当前仅支持粘贴图片上传";
            if (file.size > 30 * 1024 * 1024) return "图片大小不能超过 30MB";
            return "";
        },
        async uploadImage(file) {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(UPLOAD_API, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
                auth: {
                    username: (localStorage && localStorage.getItem("token")) || "",
                    password: "cms common request",
                },
            });

            const payload = response.data || {};
            if (payload.code) {
                throw new Error(payload.msg || payload.message || "上传失败");
            }

            const url =
                payload.location ||
                payload.url ||
                (payload.data &&
                    (Array.isArray(payload.data)
                        ? payload.data[0]
                        : payload.data.url || payload.data.location || payload.data));

            if (!url) {
                throw new Error("上传成功但未返回图片地址");
            }

            return url;
        },
        async handleImageUpload(files) {
            if (this.isUploadingImage) return "图片上传中，请稍候";

            const imageFiles = Array.from(files || []).filter(Boolean);
            if (!imageFiles.length) return "未检测到可上传的图片";

            for (const file of imageFiles) {
                const message = this.validateImageFile(file);
                if (message) return message;
            }

            this.isUploadingImage = true;

            try {
                const markdownList = [];
                for (const file of imageFiles) {
                    const url = await this.uploadImage(file);
                    const alt = file.name || "image";
                    markdownList.push(`![${alt}](${url})`);
                }

                if (markdownList.length) {
                    this.editor?.insertMD(markdownList.join("\n"));
                }
            } catch (error) {
                return error?.message || "图片上传失败";
            } finally {
                this.isUploadingImage = false;
            }
        },
    },
};
</script>

<style lang="less">
.c-editor-markdown {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &__toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__toolbar-left {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__toolbar-label,
    &__toolbar-tip {
        font-size: 13px;
        color: #57606a;
        line-height: 1.4;
    }

    &__host {
        overflow: visible;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        background-color: #ffffff;
    }

    .el-radio-group {
        box-shadow: none;
    }

    .vditor {
        border: 0;
        background: #ffffff;
        overflow: visible;
    }

    .vditor-toolbar {
        padding: 10px 12px;
        background: #f6f8fa;
        border-bottom: 1px solid #d8dee4;
        overflow: visible;
    }

    .vditor-reset {
        min-height: 640px;
    }

    .vditor-reset.markdown-body {
        box-sizing: border-box;
        width: 100%;
        max-width: none;
        min-height: 100%;
        padding: 24px 32px;
        background: #ffffff;
    }

    .vditor-sv__editor,
    .vditor-ir__marker,
    .vditor-wysiwyg {
        padding: 24px 32px;
    }

    .vditor-wysiwyg > .vditor-reset > :first-child,
    .vditor-ir > .vditor-reset > :first-child {
        margin-top: 0;
    }

    .vditor-counter {
        padding: 8px 12px;
        border-top: 1px solid #d8dee4;
        background: #f6f8fa;
    }

    .vditor-preview__action {
        display: none;
    }

    .vditor-tooltipped::before,
    .vditor-tooltipped::after {
        z-index: 30;
    }

    @media (max-width: 768px) {
        &__toolbar {
            align-items: flex-start;
        }

        .vditor-reset.markdown-body,
        .vditor-sv__editor,
        .vditor-ir__marker,
        .vditor-wysiwyg {
            padding: 16px;
        }
    }
}
</style>
