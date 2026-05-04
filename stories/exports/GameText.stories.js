import GameText from "../../src/GameText.vue";
import { componentStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/GameText",
    component: GameText,
    tags: ["autodocs"],
    args: {
        text: "普通文本示例",
        ignoreColor: false,
        client: "std",
    },
    argTypes: {
        text: { description: "游戏内 Text 标签文本或普通文本。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "''" } } },
        ignoreColor: { description: "是否忽略游戏文本中的颜色信息。", control: "boolean", table: { type: { summary: "Boolean" }, defaultValue: { summary: "false" } } },
        client: { description: "客户端类型。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'std'" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "用于渲染游戏内 Text 标签文本。普通文本场景可直接在 Storybook 中查看效果。",
            },
        },
    },
};

export const PlainText = componentStory(GameText, {
    style: "padding: 24px; min-width: 320px; background: #fff; border-radius: 12px;",
});

export const IgnoreColor = componentStory(GameText, {
    style: "padding: 24px; min-width: 320px; background: #fff; border-radius: 12px;",
});
IgnoreColor.args = {
    text: "支持关闭颜色渲染的文本示例",
    ignoreColor: true,
};
