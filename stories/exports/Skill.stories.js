import Skill from "../../src/Skill.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/Skill",
    component: Skill,
    tags: ["autodocs"],
    args: {
        client: "std",
        id: "",
        level: "",
    },
    argTypes: {
        client: { description: "客户端类型。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'std'" } } },
        id: { description: "技能 ID。", control: "text", table: { type: { summary: "String | Number" }, defaultValue: { summary: "''" } } },
        level: { description: "技能等级。", control: "text", table: { type: { summary: "String | Number" }, defaultValue: { summary: "''" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "技能展示组件。根据 `client`、`id`、`level` 查询技能详情。",
            },
        },
    },
};

export const Overview = previewStory(Skill, {
    title: "技能信息预览",
    description: "这里使用项目 demo 中的技能参数：`id=2716`、`level=0`，直接展示技能详情卡片的实际样子。",
    code: `<Skill client="std" :id="2716" :level="0" />`,
    style: "min-width: 420px; display: flex; justify-content: flex-start;",
});
Overview.args = {
    client: "std",
    id: 2716,
    level: 0,
};
