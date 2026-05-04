import Npc from "../../src/Npc.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/Npc",
    component: Npc,
    tags: ["autodocs"],
    args: {
        client: "std",
        id: "",
    },
    argTypes: {
        client: { description: "客户端类型。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'std'" } } },
        id: { description: "NPC ID。", control: "text", table: { type: { summary: "String | Number" }, defaultValue: { summary: "''" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "NPC 信息展示组件。根据 `client` 与 `id` 查询 NPC 数据。",
            },
        },
    },
};

export const Overview = previewStory(Npc, {
    title: "NPC 信息预览",
    description: "这里使用项目 demo 中出现的 NPC 参数：`id=69700`。接口可用时可以直接看到实际 NPC 信息卡片。",
    code: `<Npc client="std" :id="69700" />`,
    style: "min-width: 420px; display: flex; justify-content: flex-start;",
});
Overview.args = {
    client: "std",
    id: 69700,
};
