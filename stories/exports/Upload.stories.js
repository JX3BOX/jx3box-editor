import Upload from "../../src/Upload.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/Upload",
    component: Upload,
    tags: ["autodocs"],
    args: {
        text: "上传附件",
        onlyImage: false,
        desc: "",
        accept: "",
        enable: true,
        max: 10,
        sizeLimit: 30,
    },
    argTypes: {
        text: { description: "上传按钮文案。", control: "text", table: { type: { summary: "String" } } },
        onlyImage: { description: "是否只允许图片。", control: "boolean", table: { type: { summary: "Boolean" } } },
        desc: { description: "上传说明文本。", control: "text", table: { type: { summary: "String" } } },
        accept: { description: "原生文件选择 accept 配置。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "DEFAULT_ACCEPT" } } },
        enable: { description: "是否允许上传。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
        max: { description: "一次最多允许上传的文件数。", control: "number", table: { type: { summary: "Number" }, defaultValue: { summary: "10" } } },
        sizeLimit: { description: "单个文件大小限制，单位 MB。", control: "number", table: { type: { summary: "Number" }, defaultValue: { summary: "30" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "附件上传组件。支持限制上传格式、数量和单文件大小。",
            },
        },
    },
};

export const Overview = previewStory(Upload, {
    title: "Upload 交互外观预览",
    description: "这里展示上传组件默认外观。实际上传仍依赖 CMS 接口，但在 Storybook 中已经可以清楚看到按钮、说明和调用入口。",
    code: `<Upload text="上传附件" :max="10" :sizeLimit="30" />`,
    style: "min-width: 720px;",
});
