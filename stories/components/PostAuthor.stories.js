import PostAuthor from "../../src/components/PostAuthor.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Components/PostAuthor",
    component: PostAuthor,
    tags: ["autodocs"],
    args: {
        id: 1,
    },
    argTypes: {
        id: { description: "作者或内容关联 ID。", control: "text", table: { type: { summary: "String | Number" }, defaultValue: { summary: "''" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "帖子作者信息组件。侦听 `id` 后会请求情绪或作者详情接口，当前 Storybook 主要展示 props。",
            },
        },
    },
};

export const Overview = previewStory(PostAuthor, {
    title: "帖子作者信息预览",
    description: "该组件依赖远程接口。这里给出一个最小可运行示例，便于直接观察渲染结构。",
    code: `<PostAuthor :id="3102" />`,
    style: "min-width: 420px; display: flex; justify-content: flex-start;",
});
Overview.args = {
    id: 3102,
};
