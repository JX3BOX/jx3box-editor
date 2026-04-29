<template>
    <div class="c-editor-markdown" :class="{ 'c-editor-markdown--preview': previewVisible }">
        <slot name="prepend"></slot>

        <slot></slot>

        <div ref="editorHost" class="c-editor-markdown__host"></div>

        <slot name="append"></slot>
    </div>
</template>

<script>
import axios from "axios";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import {
    Bold,
    Code2,
    Expand,
    Eye,
    EyeOff,
    Heading,
    Italic,
    Link2,
    List,
    ListChecks,
    ListOrdered,
    Quote,
    Redo2,
    SquareCode,
    Strikethrough,
    TableProperties,
    Undo2,
} from "lucide";
import Vditor from "vditor";
import "vditor/dist/index.css";
import "github-markdown-css/github-markdown-light.css";
import normalizeMarkdownForVditor from "./assets/js/normalizeMarkdownForVditor.js";

const { __cms } = JX3BOX;
const UPLOAD_API = `${__cms}api/cms/upload`;
const TOOLBAR_ICON_SIZE = 16;
const STATIC_TOOLBAR_ICONS = {
    headings: Heading,
    bold: Bold,
    italic: Italic,
    strike: Strikethrough,
    link: Link2,
    list: List,
    "ordered-list": ListOrdered,
    check: ListChecks,
    quote: Quote,
    code: Code2,
    "inline-code": SquareCode,
    table: TableProperties,
    undo: Undo2,
    redo: Redo2,
    fullscreen: Expand,
};

function renderLucideIcon(iconNode) {
    if (!iconNode) return "";

    const attrs = {
        xmlns: "http://www.w3.org/2000/svg",
        width: TOOLBAR_ICON_SIZE,
        height: TOOLBAR_ICON_SIZE,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        class: "c-editor-markdown__icon",
        "aria-hidden": "true",
    };
    const svgAttrs = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
    const content = iconNode
        .map(([tag, tagAttrs]) => {
            const elementAttrs = Object.entries(tagAttrs)
                .map(([key, value]) => `${key}="${value}"`)
                .join(" ");

            return `<${tag} ${elementAttrs}></${tag}>`;
        })
        .join("");

    return `<svg ${svgAttrs}>${content}</svg>`;
}

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
            editorMode: "sv",
            previewVisible: false,
            isRebuildingEditor: false,
            isUploadingImage: false,
            previewRenderVersion: 0,
            counterElement: null,
            counterClickListener: null,
            counterClickTimestamps: [],
            pendingTip: "",
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
    },
    mounted() {
        this.initEditor();
    },
    beforeUnmount() {
        this.destroyEditor();
    },
    methods: {
        getPreviewMode() {
            return this.previewVisible ? "both" : "editor";
        },
        getPreviewTip() {
            return this.previewVisible ? "返回编辑" : "查看预览";
        },
        getToolbarIconMap() {
            return {
                ...STATIC_TOOLBAR_ICONS,
                "toggle-preview": this.previewVisible ? EyeOff : Eye,
            };
        },
        getToolbar() {
            return [
                {
                    name: "toggle-preview",
                    icon: renderLucideIcon(Eye),
                    tip: this.getPreviewTip(),
                    tipPosition: "ne",
                    click: () => this.togglePreview(),
                },
                "|",
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
                        mark: true,
                        sanitize: true,
                        toc: true,
                    },
                    mode: this.getPreviewMode(),
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
                    this.applyPreviewState();
                    this.syncToolbarState();
                    this.bindCounterShortcut();
                    this.showPendingTip();
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
            this.unbindCounterShortcut();
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
            if (this.previewVisible) {
                this.renderPreviewContent();
            }
        },
        getToolbarButton(name) {
            return this.$refs.editorHost?.querySelector?.(`.vditor-toolbar button[data-type="${name}"]`) || null;
        },
        syncToolbarState() {
            const iconMap = this.getToolbarIconMap();

            Object.entries(iconMap).forEach(([name, iconNode]) => {
                const button = this.getToolbarButton(name);
                if (!button) return;

                button.innerHTML = renderLucideIcon(iconNode);
            });

            const previewButton = this.getToolbarButton("toggle-preview");
            if (previewButton) {
                previewButton.setAttribute("aria-label", this.getPreviewTip());
                previewButton.classList.toggle("vditor-menu--current", this.previewVisible);
            }

            this.$refs.editorHost?.querySelectorAll?.(".vditor-toolbar button[data-type]").forEach((button) => {
                const isVisibleInPreview = ["toggle-preview", "fullscreen"].includes(button.dataset.type || "");

                button.parentElement.style.display = this.previewVisible && !isVisibleInPreview ? "none" : "";
            });
            this.$refs.editorHost?.querySelectorAll?.(".vditor-toolbar .vditor-toolbar__divider").forEach((divider) => {
                divider.style.display = this.previewVisible ? "none" : "";
            });
        },
        syncEditorPanels() {
            const host = this.$refs.editorHost;
            const preview = host?.querySelector?.(".vditor-preview");
            const sv = host?.querySelector?.(".vditor-sv");
            const irWrapper = host?.querySelector?.(".vditor-ir");
            const wysiwygWrapper = host?.querySelector?.(".vditor-wysiwyg");

            if (preview) {
                preview.style.display = this.previewVisible ? "block" : "none";
            }
            if (sv) {
                sv.style.display = this.editorMode === "sv" && !this.previewVisible ? "block" : "none";
            }
            if (irWrapper) {
                irWrapper.style.display = "none";
            }
            if (wysiwygWrapper) {
                wysiwygWrapper.style.display = this.editorMode === "wysiwyg" && !this.previewVisible ? "block" : "none";
            }
        },
        applyPreviewState() {
            if (!this.editorReady || !this.editor) return;

            this.syncEditorPanels();
            if (this.previewVisible) {
                this.renderPreviewContent();
            }
        },
        renderPreviewContent: async function () {
            if (!this.editorReady || !this.editor) return;

            const previewRoot = this.$refs.editorHost?.querySelector?.(".vditor-preview");
            const previewBody = previewRoot?.querySelector?.(".vditor-reset") || previewRoot;
            if (!previewBody) return;

            const version = ++this.previewRenderVersion;
            const normalizedMarkdown = normalizeMarkdownForVditor(this.editor.getValue());

            await Vditor.preview(previewBody, normalizedMarkdown, {
                mode: "light",
                lang: "zh_CN",
                hljs: {
                    enable: true,
                    lineNumber: false,
                    style: "github",
                },
                markdown: {
                    mark: true,
                    sanitize: true,
                    toc: true,
                },
                icon: "ant",
            });

            if (version !== this.previewRenderVersion) return;
            previewBody.classList.add("markdown-body");
        },
        togglePreview() {
            this.previewVisible = !this.previewVisible;

            if (!this.editorReady || !this.editor) return;

            this.applyPreviewState();
            this.syncToolbarState();
        },
        toggleSecretEditorMode() {
            if (this.isRebuildingEditor) return;

            this.editorMode = this.editorMode === "wysiwyg" ? "sv" : "wysiwyg";
            this.pendingTip = this.editorMode === "wysiwyg" ? "已切换到所见即所得模式" : "已切换到 Markdown 源码模式";
            this.rebuildEditor();
        },
        bindCounterShortcut() {
            const counter = this.$refs.editorHost?.querySelector?.(".vditor-counter");
            if (!counter || counter === this.counterElement) return;

            this.unbindCounterShortcut();
            this.counterClickListener = this.counterClickListener || (() => this.handleCounterClick());
            this.counterElement = counter;
            this.counterElement.addEventListener("click", this.counterClickListener);
        },
        unbindCounterShortcut() {
            if (!this.counterElement) return;

            this.counterElement.removeEventListener("click", this.counterClickListener);
            this.counterElement = null;
        },
        handleCounterClick() {
            const now = Date.now();

            this.counterClickTimestamps = this.counterClickTimestamps.filter((time) => now - time <= 2000);
            this.counterClickTimestamps.push(now);

            if (this.counterClickTimestamps.length < 6) return;

            this.counterClickTimestamps = [];
            this.toggleSecretEditorMode();
        },
        showPendingTip() {
            if (!this.pendingTip || !this.editor?.tip) return;

            this.editor.tip(this.pendingTip, 1500);
            this.pendingTip = "";
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

    .vditor-sv{
        font-family: var(--apple-font-family);
    }

    &__host {
        overflow: visible;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        background-color: #ffffff;
    }

    &__icon {
        display: block;
        width: 16px;
        height: 16px;
    }

    .vditor {
        border: 0;
        background: #ffffff;
        overflow: visible;
    }

    .vditor-toolbar {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        background: #f6f8fa;
        border-bottom: 1px solid #d8dee4;
        overflow: visible;

        .vditor-toolbar__item {
            margin-right: 2px;
        }

        .vditor-toolbar__divider {
            margin: 0 4px;
        }

        .vditor-toolbar__item > .vditor-tooltipped {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            padding: 0;
            color: #4b5563;
        }

        .vditor-toolbar__item > .vditor-tooltipped svg {
            fill: none !important;
            stroke: currentColor !important;
            stroke-width: 2 !important;
            stroke-linecap: round;
            stroke-linejoin: round;
            width: 16px;
            height: 16px;
            overflow: visible;
        }

        .vditor-toolbar__item > .vditor-tooltipped svg * {
            fill: none !important;
            stroke: currentColor !important;
            stroke-width: 2 !important;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .vditor-panel button {
            width: auto;
            height: auto;
            padding: 4px 8px;
            color: inherit;
            display: block;
            line-height: 1.5;
            text-align: left;
            white-space: nowrap;
        }
    }

    &--preview {
        .vditor-sv,
        .vditor-ir,
        .vditor-wysiwyg,
        .vditor-counter {
            display: none !important;
        }

        .vditor-preview {
            display: block !important;
            width: 100%;
        }
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
        padding: 3px 8px;
        border-top: 0;
        background: rgba(27, 31, 35, 0.05);
        border-radius: 3px;
        line-height: 1.4;
        margin: 0;
        position: absolute;
        right: 12px;

        &::before,
        &::after {
            display: none !important;
            content: none !important;
        }
    }

    .vditor-preview__action {
        display: none;
    }

    .vditor-tooltipped::before,
    .vditor-tooltipped::after {
        z-index: 30;
    }

    .vditor-menu--current {
        color: #0969da;
        background: #eaf2ff;
    }

    @media (max-width: 768px) {
        .vditor-reset.markdown-body,
        .vditor-sv__editor,
        .vditor-ir__marker,
        .vditor-wysiwyg {
            padding: 16px;
        }
    }
}
</style>
