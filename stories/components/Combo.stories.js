import Combo from "../../src/components/Combo.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Components/Combo",
    component: Combo,
    tags: ["autodocs"],
    args: {
        modelValue: false,
        subtype: "通用",
        query: "",
        client: "std",
        strict: false,
    },
    argTypes: {
        modelValue: { description: "控制连招面板的显隐。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "false" } } },
        subtype: { description: "心法或分类。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'通用'" } } },
        query: { description: "默认搜索关键字。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "''" } } },
        client: { description: "客户端类型。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'std'" } } },
        strict: { description: "是否开启精确搜索。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "false" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "技能连招编辑组件。依赖技能数据接口、右键菜单和拖拽交互，适合先通过 Storybook 查看 props 定义。",
            },
        },
    },
};

export const Overview = previewStory(Combo, {
    title: "连招编辑区域预览",
    description: "这里直接渲染组件主体。虽然完整交互依赖远程技能数据，但至少可以看到 tabs、已选区域和整体布局，不再只是说明文字。",
    code: `<Combo :modelValue="false" subtype="通用" client="std" />`,
    style: "min-width: 1180px;",
});
