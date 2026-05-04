import Buff from "../../src/Buff.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/Buff",
    component: Buff,
    tags: ["autodocs"],
    args: {
        client: "std",
        id: "",
        level: "",
    },
    argTypes: {
        client: { description: "客户端类型。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'std'" } } },
        id: { description: "Buff ID。", control: "text", table: { type: { summary: "String | Number" }, defaultValue: { summary: "''" } } },
        level: { description: "Buff 等级。", control: "text", table: { type: { summary: "String | Number" }, defaultValue: { summary: "''" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "Buff 信息展示组件。根据 `client`、`id`、`level` 拉取对应 Buff 数据。",
            },
        },
    },
};

export const Overview = previewStory(Buff, {
    title: "Buff 信息预览",
    description: "这里直接使用项目 demo 中出现过的 Buff 参数：`id=122`、`level=1`。如果接口可用，就能直接看到实际 Buff 卡片。",
    code: `<Buff client="std" :id="122" :level="1" />`,
    style: "min-width: 420px; display: flex; justify-content: flex-start;",
});
Overview.args = {
    client: "std",
    id: 122,
    level: 1,
};
