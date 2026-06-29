import QRcode from "../../src/components/QRcode.vue";
import { componentStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Components/QRcode",
    component: QRcode,
    tags: ["autodocs"],
    args: {
        href: "https://editor.jx3box.com",
        s: 120,
        v: "static",
    },
    argTypes: {
        href: { description: "二维码目标地址；为空时使用当前页面地址。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "''" } } },
        s: { description: "二维码尺寸。", control: "text", table: { type: { summary: "String | Number" }, defaultValue: { summary: "100" } } },
        v: { description: "展示模式，可选 `cms` 或 `static`。", control: "text", table: { type: { summary: "String" }, defaultValue: { summary: "'cms'" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "二维码组件，可用于 CMS 悬浮入口或静态展示模式。",
            },
        },
    },
};

export const Static = componentStory(QRcode, {
    style: "padding: 24px; background: #f8fafc; border-radius: 12px;",
});

export const CmsTrigger = componentStory(QRcode, {
    style: "padding: 24px; background: #f8fafc; border-radius: 12px;",
});
CmsTrigger.args = {
    v: "cms",
};
