import Tinymce from "../../src/Tinymce.vue";
import { previewStory, useDemoText } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/Tinymce",
    component: Tinymce,
    tags: ["autodocs"],
    args: {
        modelValue: "",
        content: "",
        height: 800,
        attachmentEnable: true,
        resourceEnable: true,
        emotionEnable: true,
        subtype: "通用",
    },
    argTypes: {
        modelValue: { description: "Vue 3 `v-model` 绑定值。", control: "text", table: { type: { summary: "String" } } },
        content: { description: "兼容旧用法的初始内容。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "''" } } },
        height: { description: "编辑器高度。", control: "number", table: { type: { summary: "Number" }, defaultValue: { summary: "800" } } },
        attachmentEnable: { description: "是否启用附件上传。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
        resourceEnable: { description: "是否启用资源插入。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
        emotionEnable: { description: "是否启用表情插入。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
        subtype: { description: "心法分类，影响连招等功能。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'通用'" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "TinyMCE 富文本编辑器封装。依赖 TinyMCE 运行时、上传和资源插入环境。",
            },
        },
    },
};

export const Overview = previewStory(Tinymce, {
    title: "Tinymce 编辑器预览",
    description: "这里加载 `public/demo/article_basic.html` 作为初始内容，直接展示富文本编辑器的默认工作形态。",
    code: `<Tinymce v-model="html" :height="800" :attachmentEnable="true" :resourceEnable="true" />`,
    style: "min-width: 1080px;",
    setup() {
        const { content } = useDemoText("/demo/article_basic.html", "<p>加载中...</p>");
        return { html: content };
    },
    template: `<StoryComponent v-bind="args" v-model="html" />`,
});
