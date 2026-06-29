import Article from "../../src/Article.vue";
import { previewStory, useDemoText } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/Article",
    component: Article,
    tags: ["autodocs"],
    args: {
        post_mode: "tinymce",
        content: "<p>示例内容</p>",
        cdnDomain: "https://cdn.jx3box.com",
        linkWhitelist: [],
        linkStrict: false,
        iframeWhitelist: [],
        directorybox: "",
        pageable: true,
    },
    argTypes: {
        post_mode: { description: "文章来源模式。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'tinymce'" } } },
        content: { description: "待渲染的 HTML 内容。", control: "text", table: { type: { summary: "String" } } },
        cdnDomain: { description: "相对资源地址拼接使用的 CDN 域名。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'https://cdn.jx3box.com'" } } },
        linkWhitelist: { description: "链接白名单。", control: "object", table: { type: { summary: "Array" }, defaultValue: { summary: "[]" } } },
        linkStrict: { description: "开启后不在白名单的链接将被禁用。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "false" } } },
        iframeWhitelist: { description: "iframe 白名单。", control: "object", table: { type: { summary: "Array" }, defaultValue: { summary: "[]" } } },
        directorybox: { description: "目录容器选择器。", control: "text", table: { type: { summary: "String" } } },
        pageable: { description: "是否分页展示长文。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "富文本文章渲染组件。依赖较多运行时行为、目录处理和内嵌弹层组件，Storybook 主要用于查看 props。",
            },
        },
    },
};

export const Overview = previewStory(Article, {
    title: "富文本文章预览",
    description: "这里直接加载项目现有的 `public/demo/article_basic.html` 作为示例内容。这样能看到分页后的文章排版、图片、表格和基础富文本效果。",
    code: `<Article :content="html" post_mode="tinymce" :pageable="true" />`,
    style: "min-width: 960px;",
    setup() {
        const { content } = useDemoText("/demo/article_basic.html", "<p>加载中...</p>");
        return { html: content };
    },
    template: `<StoryComponent v-bind="args" :content="html" />`,
});
