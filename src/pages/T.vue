<template>
    <div>
        <Tinymce v-model="content" :attachmentEnable="true" :resourceEnable="true" @update="test" subtype="冰心诀"/>
    </div>
</template>

<script>
import Tinymce from "../src/Tinymce.vue";
import demohtml from "./content_1";
export default {
    name: "T",
    props: [],
    data: function () {
        return {
            content : demohtml
        };
    },
    computed: {},
    methods: {
        test : function (val){
            // console.log(val)
        }
    },
    mounted: function () {},
    components: {
        Tinymce,
    },
};
</script>

<style lang="less">
    html{
        padding:20px;
    }
</style>