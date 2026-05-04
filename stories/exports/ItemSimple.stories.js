import ItemSimple from "../../src/ItemSimple.vue";
import { componentStory } from "../../src/storybook/storybook.helpers";

const demoItem = {
    id: "10001",
    Name: "示例道具",
    Quality: 4,
    IconID: 1024,
};

export default {
    title: "Exports/ItemSimple",
    component: ItemSimple,
    tags: ["autodocs"],
    args: {
        item: demoItem,
        onlyIcon: false,
        iconSize: "48px",
        withName: true,
        jx3ClientType: 1,
    },
    argTypes: {
        item: { description: "道具对象，至少建议包含 `id`、`Name`、`Quality`、`IconID`。", control: "object", table: { type: { summary: "Object" } } },
        onlyIcon: { description: "是否仅显示图标。", control: "boolean", table: { type: { summary: "Boolean" } } },
        iconSize: { description: "图标尺寸。", control: "text", table: { type: { summary: "String | Number" } } },
        withName: { description: "是否显示名称。", control: "boolean", table: { type: { summary: "Boolean" } } },
        jx3ClientType: { description: "客户端数字类型。", control: "number", table: { type: { summary: "Number" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "简化版道具展示组件。适合在列表和内联文本中快速展示道具图标与名称。",
            },
        },
    },
};

export const Default = componentStory(ItemSimple, {
    style: "padding: 24px; min-width: 240px; background: #0f172a; border-radius: 12px;",
});

export const IconOnly = componentStory(ItemSimple, {
    style: "padding: 24px; min-width: 120px; background: #0f172a; border-radius: 12px;",
});
IconOnly.args = {
    onlyIcon: true,
    withName: false,
    iconSize: "56px",
};
