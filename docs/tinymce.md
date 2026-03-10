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
    v-model="content"
    :height="800"

    :tinymceUploadFn="tinymceUploadFn"
    :tinymceAssetsDomain="domain"

    :attachmentEnable="true"
    :attachmentUploadFn="uploadToOss"
    :attachmentCdnDomain="domain"
/>
```

## Props

| 字段 | 含义 | 类型 | 默认值 | 必填 | 备注 |
|---|---|---|---|---|---|
| `v-model` | 内容 | `String` | `""` | 否 | - |
| `height` | 默认高度 | `Number` | `800` | 否 | 指px |
| `tinymceUploadFn` | Tinymce 右键粘贴上传函数 | `Function` | `() => {}` | 否 | 默认空函数，避免未传时报错 |
| `tinymceCdnDomain` | Tinymce资源CDN拼接域名 | `String` | "" | 是 | 加载tinymce js&css |
| `showTips` | 是否显示编辑器使用提示 | `Boolean` | `true` | 否 |  |
| `attachmentEnable` | 是否启用附件上传 | `Boolean` | `true` | 否 |  |
| `uploadFn` | 附件上传函数 | `Function` | `() => {}` | 否 | 附件开启时才有用 |
| `uploadDomain` | 附件CDN拼接域名 | `String` | `""` | 否 | 附件开启时才有用 |


## tinymce自带上传函数实现规范
+ 右键粘贴
+ 图像上传
