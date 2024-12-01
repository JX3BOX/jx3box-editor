# Article & Editor

# Dev
```
$ npm install 
$ npm run serve
$ open http://localhost:8080  //文章渲染
$ open http://localhost:8080/tinymce  //tinymce编辑器
$ open http://localhost:8080/markdown  //markdown编辑器
$ tinymce http://localhost:5000
```

## Step.1 Install

```
npm install @jx3box/jx3box-editor
```

## Step.2 Import

-   指定模块

```javascript
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce.vue";
//import Markdown from "@jx3box/jx3box-article/src/Markdown.vue"
```

## Step.3 Usage

文章

```html
<article :content="content" directorybox="#directory" />
```

编辑器

```html
<script src="https://cdn.jx3box.com/static/tinymce/tinymce.min.js?v=$version"></script>
<Tinymce
    v-model="content"
    :attachmentEnable="true"
    :resourceEnable="true"
    :height="300"
/>
```

批量附件上传插入/资源快捷查询插入

```html
<Upload @insert="insertWhere" @update="getList" @htmlUpdate="getHTML" />
<Resource @insert="insertWhere" @update="getHTML" />
```

---

# 页面远程引入文章渲染模块

1. head标签：头部引入文件
   注意应带上查询参数以防本地缓存，版本号请读取https://github.jx3box.com/jx3box-editor/package.json中的version  
   app 启动的时候读一次存到本地就可以，之后本地页面可以直接使用对应版本号。  
   后续 11 月会新增一个文本物品浮层功能（关联物品百科）。

```html
<script src="https://cdn.jx3box.com/static/jx3box-lib/vue.js?v="></script>
<script src="https://cdn.jx3box.com/static/jx3box-editor/jx3box_article.umd.min.js?v="></script>
```

2. body标签：需要插入的位置

```html
<div id="app">
    <jx3box_article id="article" content="loading.."></jx3box_article>
</div>
```

3. body末尾：初始化脚本

```html
<script>
    
    var username = "$token"; //使用正确的token
    var password = "android"; //安卓端使用
    var headers = new Headers();
    headers.set("Authorization", "Basic " + btoa(username + ":" + password));

    // 1.异步加载设置数据，将420改成正确的文章ID
    fetch("https://cms.jx3box.com/api/cms/post/420", {
        method: "GET",
        headers: headers,
        credentials: "include",
        mode: "cors",
    }).then((res) => {
        res.json().then((data) => {
            let content = data && data.data && data.data.post.post_content;
            document.getElementById("article").setAttribute("content", content);
            // 2.实例化
            new Vue({
                components: {
                    jx3box_article,
                },
            }).$mount("#app");
        });
    });
</script>
```
