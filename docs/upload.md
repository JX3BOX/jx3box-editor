# Upload / UploadAlbum

## 版本说明

- `Upload.vue`、`UploadAlbum.vue` 已升级为 Vue3 写法（选项式 API）。
- 相册拖拽依赖已切换为 `vuedraggable@^4`（Vue3 版本）。
- 图标统一使用 `@element-plus/icons-vue`。

## Upload 用法

```vue
<script>
import Upload from "@jx3box/jx3box-editor/src/Upload.vue";

export default {
  components: { Upload },
  methods: {
    handleInsert(payload) {
      // payload: { list, html }
      console.log(payload.html);
    },
  },
};
</script>

<template>
  <Upload
    text="上传附件"
    :enable="true"
    :only-image="false"
    @insert="handleInsert"
    @update="(list) => console.log(list)"
  />
</template>
```

## Upload Props

| 字段 | 含义 | 类型 | 默认值 |
|---|---|---|---|
| `text` | 按钮文案 | `String` | `"上传附件"` |
| `enable` | 是否可用 | `Boolean` | `true` |
| `onlyImage` | 是否仅允许图片 | `Boolean` | `false` |
| `desc` | 顶部提示文案 | `String` | `"一次最多同时上传..."` |
| `accept` | 允许类型 | `String` | common conf 的 `accept` |
| `max` | 单次数量上限 | `Number` | `10` |
| `sizeLimit` | 单文件体积限制（MB） | `Number` | `30` |

## Upload Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `insert` | `{ list, html }` | 点击“插入”时触发 |
| `update` | `fileList` | 文件列表变化 |
| `htmlUpdate` | `html` | 插入 HTML 变化 |

## UploadAlbum 用法（推荐 v-model）

```vue
<script>
import UploadAlbum from "@jx3box/jx3box-editor/src/UploadAlbum.vue";

export default {
  components: { UploadAlbum },
  data() {
    return {
      album: [],
    };
  },
};
</script>

<template>
  <UploadAlbum v-model="album" />
</template>
```

## UploadAlbum Props / Events

| 字段 | 含义 | 类型 | 默认值 | 备注 |
|---|---|---|---|---|
| `v-model` (`modelValue`) | 图片列表 | `Array` | - | 推荐方式 |
| `data` | 图片列表 | `Array` | `[]` | 兼容旧用法 |

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `imgList` | Vue3 双向绑定输出 |
| `update` | `imgList` | 兼容旧事件输出 |
