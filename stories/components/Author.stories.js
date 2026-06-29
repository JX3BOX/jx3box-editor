import Author from "../../src/components/Author.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Components/Author",
    component: Author,
    tags: ["autodocs"],
    args: {
        uid: 10086,
    },
    argTypes: {
        uid: {
            description: "作者 UID。",
            control: "text",
            table: { type: { summary: "String | Number" }, category: "required" },
        },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "作者信息卡片。组件会在侦听 `uid` 后请求远程作者数据，因此在 Storybook 中主要用于查看 props 文档。",
            },
        },
    },
};

export const Overview = previewStory(Author, {
    title: "作者卡片预览",
    description: "这里直接使用项目 demo 中出现过的作者 UID：`8`。如果接口可用，就能看到完整作者卡片，而不是只有 props 表。",
    code: `<Author :uid="8" />`,
    style: "min-width: 420px; display: flex; justify-content: flex-start;",
});
Overview.args = {
    uid: 8,
};
