<template>
    <h1 class="title">文章渲染</h1>
    <div class="tab">
        <el-segmented v-model="group" :options="groupOptions" />
    </div>
    <div>
        <Article :content="content"></Article>
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
</style>
