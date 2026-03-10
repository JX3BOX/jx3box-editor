<template>
    
    <h1 class="title">Tinymce编辑器</h1>
    <div class="tab">
        <el-segmented v-model="group" :options="groupOptions"/>
    </div>
    
    <div>
        <Tinymce
            v-model="content"
            :tinymceUploadFn="uploadFn"
            :tinymceAssetsDomain="domain"
            :attachmentEnable="true"
            :attachmentUploadFn="uploadFn"
            :attachmentCdnDomain="domain"
        />
    </div>
</template>

<script>
import Tinymce from "../Tinymce.vue";
export default {
    name: "TinymceDemo",
    data: function () {
        return {
            content: "",
            group: "basic",
            groupOptions: [
                { label: "基础内容", value: "basic" },
                { label: "魔盒内容", value: "jx3box" },
            ],
        };
    },
    components: {
        Tinymce,
    },
    methods: {
        uploadFn() {
            return Promise.reject(new Error("tinymceUploadFn 未实现（仅用于 demo 页面预览）"));
        },
    },
    async mounted() {
        const res = await fetch("/demo/article_basic.html");
        this.content = await res.text();
    },
};
</script>

<style lang="less">
.title{
    .x;
}
.tab{
    .flex(x);
    margin-bottom: 1rem;
}
</style>
