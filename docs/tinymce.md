# Tinymce

## 注意事项
版本迭代时，注意刷新cdn（css+js）  
$path-to/static/tinymce/tinymce.min.js  
$path-to/static/tinymce/skins/content/default/content.min.css  


## 使用指南

1. 在public/index.html中引入并设置
```html
<script src="https://cdn.jx3box.com/static/tinymce/tinymce.min.js"></script>
window.RX_TINYMCE_ROOT=https://cdn.jx3box.com/static/tinymce
```

2. 在组件中使用
```js
import Tinymce from '@jx3box/jx3box-editor/src/Tinymce.vue'
<Tinymce
    :content="content"
    :height="800"
    :attachmentEnable="true"
    :resourceEnable="true"
/>
```

## Props

| 字段 | 含义 | 类型 | 默认值 | 必填 | 备注 |
|---|---|---|---|---|---|
| `v-model` | 内容 | `String` | `""` | 否 | - |
| `height` | 默认高度 | `Number` | `800` | 否 | 指px |
| `attachmentEnable` | 是否启用附件上传 | `Boolean` | `true` | 否 |  |
| `resourceEnable` | 是否启用资源插入 | `Boolean` | `true` | 否 |  |
| `subtype` | 心法 | `String` | `冰心诀` | 否 | 技能连招用 |

## tinymce自带上传函数实现规范
+ 右键粘贴
+ 图像上传
