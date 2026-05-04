import Letter from "../../src/components/Letter.vue";
import { componentStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Components/Letter",
    component: Letter,
    tags: ["autodocs"],
    args: {
        data: {
            slug: "demo",
            remark: "示例信纸标题",
            style: ".letter--demo{padding:24px;border:1px solid #d4b483;border-radius:12px;background:linear-gradient(180deg,#fff9ef,#fff3dc)}.letter-title--demo{font-size:20px;font-weight:700;color:#7c4a03}",
        },
    },
    argTypes: {
        data: { description: "信纸数据对象，需要至少包含 `slug`、`remark`、`style`。", control: "object", table: { type: { summary: "Object" }, defaultValue: { summary: "undefined" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "信纸渲染组件。使用时必须传入完整的 `data` 对象，否则组件会在立即执行的 watcher 中报错。",
            },
        },
    },
};

export const Default = componentStory(Letter, {
    style: "min-width: 360px; background: #faf7f2; padding: 24px; border-radius: 12px;",
});
