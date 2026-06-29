import UploadAlbum from "../../src/UploadAlbum.vue";
import { componentStory } from "../../src/storybook/storybook.helpers";

export default {
    title: "Exports/UploadAlbum",
    component: UploadAlbum,
    tags: ["autodocs"],
    args: {
        modelValue: undefined,
        data: [
            { id: "demo-1", name: "封面图", url: "https://picsum.photos/seed/jx3box-story-1/240/160" },
            { id: "demo-2", name: "细节图", url: "https://picsum.photos/seed/jx3box-story-2/240/160" },
        ],
    },
    argTypes: {
        modelValue: { description: "受控图片列表，适合配合 `v-model` 使用。", control: "object", table: { type: { summary: "Array" }, defaultValue: { summary: "undefined" } } },
        data: { description: "非受控模式下的初始图片列表。", control: "object", table: { type: { summary: "Array" }, defaultValue: { summary: "[]" } } },
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "相册上传组件。支持批量上传、拖拽排序和图片预览。传入已有图片列表时可直接展示。",
            },
        },
    },
};

export const Default = componentStory(UploadAlbum, {
    style: "min-width: 720px; background: #fff; padding: 24px; border-radius: 12px;",
});
