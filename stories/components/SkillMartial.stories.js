import SkillMartial from "../../src/components/SkillMartial.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Components/SkillMartial",
    component: SkillMartial,
    tags: ["autodocs"],
    args: {
        subtype: "通用",
        client: "std",
    },
    argTypes: {
        subtype: { description: "心法或技能分类。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'通用'" } } },
        client: { description: "客户端类型。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'std'" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "武学技能组件。挂载后会根据 `subtype` 和 `client` 拉取技能与天赋数据，适合先在 Storybook 中确认 props 调用方式。",
            },
        },
    },
};

export const Overview = previewStory(SkillMartial, {
    title: "门派武学预览",
    description: "这里直接渲染默认的 `通用 + std` 模式。接口可用时会展示技能分组列表，能更直观看到组件的实际用途。",
    code: `<SkillMartial subtype="通用" client="std" />`,
    style: "min-width: 960px;",
});
