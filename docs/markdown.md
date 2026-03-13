# Markdown

-   基于 `Vditor` 封装的 Markdown 编辑器。
-   默认提供源码编辑与整页预览，预览样式使用 GitHub Markdown Light。
-   支持 `Ctrl+V` 粘贴图片并走 CMS 上传。

## 注意事项

-   组件内部使用 `v-model` / `modelValue` 作为主双向绑定方式。
-   预览模式为整块容器切换，不是左右分屏。
-   所见即所得模式默认不暴露在 UI 上，仅保留隐藏入口用于内部调试。

## 使用指南

1. 在业务组件中引入并通过 `v-model` 使用编辑器。

```vue
<script>
import Markdown from "@jx3box/jx3box-editor/src/Markdown.vue";

export default {
    components: { Markdown },
    data() {
        return {
            content: "",
        };
    },
};
</script>

<template>
    <Markdown v-model="content" :height="720" :editable="true" :attachmentEnable="true" :resourceEnable="true" />
</template>
```

2. 如需兼容旧用法，也可以继续传 `:content` 并监听更新事件。

```vue
<Markdown :content="content" @update:content="content = $event" />
```

## 交互说明

-   左上角工具栏提供基础 Markdown 编辑能力。
-   `查看预览` 会将整个编辑容器切换为预览态，再次点击返回编辑。
-   右上角字数区域在 2 秒内连续点击 6 次，可在源码模式与所见即所得模式之间切换。

## Props

| 字段                     | 含义             | 类型               | 默认值                                      | 备注                             |
| ------------------------ | ---------------- | ------------------ | ------------------------------------------- | -------------------------------- |
| `modelValue` (`v-model`) | 编辑器内容       | `String`           | `undefined`                                 | 推荐双向绑定方式                 |
| `content`                | 兼容旧内容传入   | `String`           | `""`                                        | 当未传 `modelValue` 时生效       |
| `editable`               | 是否允许编辑     | `Boolean`          | `true`                                      | `false` 时进入只读               |
| `attachmentEnable`       | 是否启用附件能力 | `Boolean`          | `true`                                      | 当前保留字段，上传以粘贴图片为主 |
| `resourceEnable`         | 是否启用资源能力 | `Boolean`          | `true`                                      | 当前保留字段                     |
| `placeholder`            | 编辑器占位文案   | `String`           | `"支持 Markdown，支持 Ctrl+V 粘贴图片上传"` |                                  |
| `height`                 | 编辑器高度       | `String \| Number` | `720`                                       | 数字按 px 处理                   |

## Emits

| 事件                | 参数                               | 说明                          |
| ------------------- | ---------------------------------- | ----------------------------- |
| `update:modelValue` | `string`                           | `v-model` 回传                |
| `update:content`    | `string`                           | 兼容旧用法                    |
| `update`            | `string`                           | 兼容事件                      |
| `updateData`        | `{ data: string, render: string }` | 返回 Markdown 原文与当前 HTML |

## 上传处理

-   支持直接 `Ctrl+V` 粘贴图片上传。
-   上传接口使用 CMS：`${__cms}api/cms/upload`。
-   上传成功后会在光标位置插入 Markdown 图片语法。

## 渲染说明

-   编辑器预览与文章 Markdown 渲染统一基于 `Vditor`。
-   预览区域挂载 `markdown-body` 类名，并使用 `github-markdown-css/github-markdown-light.css`。
-   代码高亮使用 `highlight.js` 的 `github` 风格。
