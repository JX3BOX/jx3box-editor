import Item from "../../src/Item.vue";
import { previewStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/Item",
    component: Item,
    tags: ["autodocs"],
    args: {
        item: undefined,
        item_id: "",
        client: "std",
        jx3ClientType: 1,
    },
    argTypes: {
        item: { description: "已完整准备好的物品数据对象。", control: "object", table: { type: { summary: "Object" } } },
        item_id: { description: "物品 ID；传入后会触发数据请求。", control: "text", table: { type: { summary: "String" } } },
        client: { description: "客户端类型。", control: "text", table: { type: { summary: "String" } } },
        jx3ClientType: { description: "客户端数字类型，1 为重制，2 为缘起。", control: "number", table: { type: { summary: "Number" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "物品详情组件。可以直接传完整 `item` 对象，也可以通过 `item_id` 触发远程拉取。",
            },
        },
    },
};

export const Overview = previewStory(Item, {
    title: "物品详情预览",
    description: "这里使用手工 mock 的 `item` 对象直接渲染详情组件，便于先看清布局和信息密度。实际业务里也可以改用 `item_id` 让组件自行拉取。",
    code: `<Item :item="itemData" :jx3ClientType="1" />`,
    style: "min-width: 520px; display: flex; justify-content: flex-start;",
});
Overview.args = {
    item: {
        Name: "示例道具",
        IconID: 1024,
        Quality: 4,
        MaxDurability: 100,
        Durable: 80,
        Desc: "用于 Storybook 预览的示例道具描述。",
        Level: 120,
        Genre: 1,
        DetailType: 1,
        Source: "Storybook Mock",
        GetType: "演示生成",
    },
    jx3ClientType: 1,
};
