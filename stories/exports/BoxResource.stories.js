import BoxResource from "../../src/BoxResource.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/BoxResource",
    component: BoxResource,
    tags: ["autodocs"],
    args: {
        enable: true,
        subtype: "通用",
    },
    argTypes: {
        enable: { description: "是否允许打开资源面板。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "true" } } },
        subtype: { description: "心法分类，会影响连招等子资源。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'通用'" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "JX3BOX 资源插入组件。挂载后会组合作者、情绪、信纸、连招等多类资源数据。",
            },
        },
    },
};

export const Overview = previewStory(BoxResource, {
    title: "魔盒资源入口预览",
    description: "这个预览直接展示魔盒资源按钮。点击后会进入作者、连招、趣图、信纸等资源的真实弹窗流程。",
    code: `<BoxResource :enable="true" subtype="通用" @insert="handleInsert" />`,
    style: "min-width: 360px; display: flex; justify-content: flex-start; align-items: center;",
});
