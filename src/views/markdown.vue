<template>
    <div class="m-markdown-demo">
        <h1 class="m-markdown-demo__title">Markdown 编辑器</h1>
        <p class="m-markdown-demo__desc">基于 Vditor 的演示页，默认加载 `public/demo/article_markdown.html`。</p>

        <Markdown v-model="content" />
    </div>
</template>

<script>
import Markdown from "../Markdown.vue";

export default {
    name: "MarkdownDemo",
    components: {
        Markdown,
    },
    data() {
        return {
            content: "",
        };
    },
    created() {
        this.loadDemoContent();
    },
    methods: {
        loadDemoContent() {
            fetch("/demo/article_markdown.html")
                .then((res) => res.text())
                .then((data) => {
                    this.content = data;
                })
                .catch(() => {
                    this.content = "";
                });
        },
    },
};
</script>

<style lang="less">
.m-markdown-demo {
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px;

    &__title {
        margin: 0 0 8px;
        text-align: center;
    }

    &__desc {
        margin: 0 0 16px;
        text-align: center;
        color: #57606a;
    }
}
</style>
