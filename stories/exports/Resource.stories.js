import Resource from "../../src/Resource.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/Resource",
    component: Resource,
    tags: ["autodocs"],
    args: {
        enable: true,
    },
    argTypes: {
        enable: { description: "是否允许点击打开资源面板。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "剑三数据库资源选择组件。主要通过弹窗检索并插入 Buff、Skill、Item、NPC 等资源。",
            },
        },
    },
};

export const Overview = previewStory(Resource, {
    title: "剑三资源入口预览",
    description: "这个预览先展示触发按钮本身。点击后会进入真实的资源弹窗逻辑，适合确认组件在页面中的入口外观和基础交互。",
    code: `<Resource :enable="true" @insert="handleInsert" />`,
    style: "min-width: 360px; display: flex; justify-content: flex-start; align-items: center;",
});
