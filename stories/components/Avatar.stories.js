import Avatar from "../../src/components/Avatar.vue";
import { componentStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Components/Avatar",
    component: Avatar,
    tags: ["autodocs"],
    args: {
        uid: 10086,
        url: "https://cdn.jx3box.com/image/avatar/1024.jpg",
        frame: "",
        size: "s",
    },
    argTypes: {
        uid: {
            description: "用户 UID。",
            control: "text",
            table: { type: { summary: "String | Number" }, category: "required" },
        },
        url: {
            description: "头像地址，为空时走默认头像逻辑。",
            control: "text",
            table: { type: { summary: "String" }, defaultValue: { summary: "''" } },
        },
        frame: {
            description: "头像框标识。",
            control: "text",
            table: { type: { summary: "String" }, defaultValue: { summary: "''" } },
        },
        size: {
            description: "头像尺寸，可传内置尺寸名或数值。",
            control: "text",
            table: { type: { summary: "String | Number" }, defaultValue: { summary: "'s'" } },
        },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "展示用户头像与可选头像框。适合直接查看 `uid`、`url`、`frame`、`size` 的传值方式。",
            },
        },
    },
};

export const Default = componentStory(Avatar, {
    style: "padding: 24px; background: #f8fafc; display: inline-flex; border-radius: 12px;",
});

export const Large = componentStory(Avatar, {
    style: "padding: 24px; background: #f8fafc; display: inline-flex; border-radius: 12px;",
});
Large.args = {
    size: 136,
};
