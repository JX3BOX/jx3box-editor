<template>
    <h1 class="title">文章渲染</h1>
    <div class="tab">
        <el-segmented v-model="group" :options="groupOptions" />
    </div>
    <div class="container">
        <Article class="article" :content="content" :post_mode="postMode"></Article>
        <div id="directory"></div>
    </div>
</template>

<script>
import Article from "../Article.vue";
export default {
    name: "ArticleDemo",
    props: [],
    components: {
        Article,
    },
    data: function () {
        return {
            content: "",
            group: "basic",
            groupOptions: [
                { label: "基础内容", value: "basic" },
                { label: "剑三内容", value: "jx3" },
                { label: "魔盒内容", value: "jx3box" },
                { label: "Markdown", value: "markdown" },
            ],
        };
    },
    computed: {
        postMode() {
            return this.group === "markdown" ? "markdown" : "tinymce";
        },
    },
    watch: {
        group: {
            immediate: true,
            handler(val) {
                const url = `/demo/article_${val}.html`;
                fetch(url)
                    .then((res) => res.text())
                    .then((data) => {
                        this.content = data;
                    });
            },
        },
    },
};
</script>

<style lang="less">
.title {
    .x;
}
.tab {
    .flex(x);
    margin-bottom: 1rem;
}
.container {
    #directory {
        .w(200px);
        position: fixed;
        right: 20px;
        top: 20px;
    }
    .article {
        margin-right: 320px;
    }
}
body {
    min-height: 2000px;
    padding: 0 20px;
}
</style>
