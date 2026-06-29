import Markdown from "../../src/Markdown.vue";
import { previewStory, useDemoText } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/Markdown",
    component: Markdown,
    tags: ["autodocs"],
    args: {
        modelValue: "",
        content: "",
        editable: true,
        attachmentEnable: true,
        resourceEnable: true,
        placeholder: "支持 Markdown，支持 Ctrl+V 粘贴图片上传",
        height: 720,
    },
    argTypes: {
        modelValue: { description: "Vue 3 `v-model` 绑定值。", control: "text", table: { type: { summary: "String" } } },
        content: { description: "兼容旧用法的初始内容。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "''" } } },
        editable: { description: "是否可编辑。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
        attachmentEnable: { description: "是否启用附件上传。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
        resourceEnable: { description: "是否启用资源插入。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
        placeholder: { description: "编辑器占位文本。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'支持 Markdown，支持 Ctrl+V 粘贴图片上传'" } } },
        height: { description: "编辑器高度。", control: "text", table: { type: { summary: "String | Number" }, defaultValue: { summary: "720" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "Markdown 编辑器组件。依赖 Vditor、上传接口和浏览器编辑环境，当前 Storybook 主要用于 props 文档。",
            },
        },
    },
};

export const Overview = previewStory(Markdown, {
    title: "Markdown 编辑器预览",
    description: "使用项目调试页同一份 Markdown 示例内容，直接展示编辑器加载后的样子。",
    code: `<Markdown v-model="content" :editable="true" :height="720" />`,
    style: "min-width: 1080px;",
    setup() {
        const { content } = useDemoText("/demo/article_markdown.html", "# 加载中");
        return { content };
    },
    template: `<StoryComponent v-bind="args" v-model="content" />`,
});
