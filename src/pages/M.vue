<template>
    <div>
        <Markdown v-model="content" :editable="true" @updateData="updateData"/>
    </div>
</template>

<script>
import Markdown from "../src/Markdown.vue";
import demo from "./content_4";
export default {
    name: "MarkdownDemo",
    props: [],
    components: {
        Markdown,
    },
    data: function() {
        return {
            content: demo,
        };
    },
    computed: {},
    watch: {},
    methods: {
        updateData : function (data){
            // console.log(data)
        }
    },
    filters: {},
    created: function() {},
    mounted: function() {},
};
</script>
