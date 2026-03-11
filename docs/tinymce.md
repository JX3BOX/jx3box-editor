# Tinymce

- 基于 tinymce v5 扩展。
- 内置 powerpaste/checklist 与 JX3BOX 定制插件。

## 注意事项

版本迭代时注意刷新 CDN：

- `static/tinymce/tinymce.min.js`
- `static/tinymce/skins/content/default/content.min.css`

## 使用指南

1. 在页面入口引入 tinymce 资源并设置根路径。

```html
<script src="https://cdn.jx3box.com/static/tinymce/tinymce.min.js"></script>
<script>
  window.RX_TINYMCE_ROOT = "https://cdn.jx3box.com/static/tinymce";
</script>
```

2. 在业务组件中通过 `v-model` 使用编辑器。

```vue
<script>
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce.vue";

export default {
  components: { Tinymce },
  data() {
    return {
      content: "",
    };
  },
};
</script>

<template>
  <Tinymce
    v-model="content"
    :height="800"
    :attachmentEnable="true"
    :resourceEnable="true"
    :emotionEnable="true"
  />
</template>
```

## 迁移说明（重要）

- 旧用法 `:content="content"` 已废弃。
- 新项目（含 UC）统一使用 `v-model`：`<Tinymce v-model="content" />`。

## Props

| 字段 | 含义 | 类型 | 默认值 | 备注 |
|---|---|---|---|---|
| `modelValue` (`v-model`) | 编辑器内容 | `String` | `""` | 推荐且唯一双向绑定方式 |
| `height` | 默认高度 | `Number` | `800` | 单位 px |
| `attachmentEnable` | 是否启用附件上传 | `Boolean` | `true` | |
| `resourceEnable` | 是否启用资源插入 | `Boolean` | `true` | |
| `emotionEnable` | 是否启用表情插入 | `Boolean` | `true` | |
| `subtype` | 心法（技能连招） | `String` | `""` | |

## Emits

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string` | `v-model` 回传 |
| `update` | `string` | 兼容事件 |

## Tinymce 上传处理

- 支持右键粘贴图片。
- 支持图像上传。

## 插件添加步骤

1. 在 `tinymce/icons/custom/icons.js` 添加 svg 图标（注意 viewBox、尺寸与压缩）。
2. 在 `tinymce/plugins` 复制模板插件目录并改名。
3. 在编辑器配置中激活插件并追加工具栏项。
