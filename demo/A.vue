<template>
    <div>
        <!-- <ItemSimple :item="item1" />
        <ItemSimple :item="item2" :only-icon="true" iconSize="56px" />
        <ItemSimple :item="item3" :only-icon="true" iconSize="56px" />
        <ItemSimple :item="item4" :only-icon="true" iconSize="56px" />
        <ItemSimple :item="item5" jx3-client-type="1" only-icon="true" iconSize="56px" />
        <ItemSimple :item="item6" jx3-client-type="2" only-icon="true" iconSize="56px" /> -->
        <!-- <Article
            :content="content"
            directorybox="#directory"
            style="padding: 20px;"
            @contentRendered="test1"
            @directoryRendered="test2"
        ></Article>
        <Buff :id="51145" client="origin" :level="0"></Buff>
        <Skill :id="2716" client="std" :level="0"></Skill> -->
        <Item :item_id="'6_27425'"></Item>
        <Item :item_id="'7_101430'"></Item>
        <div id="directory"></div>
    </div>
</template>

<script>
import ItemSimple from "../src/ItemSimple.vue";
import Article from "../src/Article.vue";
import demohtml from "./content_1";
import { get_item } from "../service/item";
import { getBuff, getSkill } from "../service/database";
import Item from "../src/Item.vue";
import Buff from "../src/Buff.vue";
import Skill from "../src/Skill.vue";

export default {
    name: "A",
    props: [],
    components: {
        // Buff,
        // Article,
        // ItemSimple,
        Item,
        // Skill
    },
    data: function () {
        return {
            content: demohtml,
            item1: null,
            item2: null,
            item3: null,
            item4: null,
            item5: null,
            item6: null,
            buff: null,
            skill: null
        };
    },
    computed: {},
    methods: {
        test1: function () {
            console.log("文章已渲染");
        },
        test2: function () {
            console.log("目录已渲染");
        },
    },
    mounted: function () {
        // fetch("https://server.jx3box.com/post/find?id=420").then((res) => {
        //     res.json().then((data) => {
        //         this.content = data.data.post.post_content
        //     })
        // });


        get_item("10_310").then((res) => {
            let data = res.data;
            if (data.code === 200) {
                let item = data.data.item;
                this.item1 = JSON.stringify(item) !== "{}" ? item : null;
            }
        });

        get_item("6_4396").then((res) => {
            let data = res.data;
            if (data.code === 200) {
                let item = data.data.item;
                this.item2 = JSON.stringify(item) !== "{}" ? item : null;
            }
        });

        get_item("10_202").then((res) => {
            let data = res.data;
            if (data.code === 200) {
                let item = data.data.item;
                this.item3 = JSON.stringify(item) !== "{}" ? item : null;
            }
        });

        get_item("10_98").then((res) => {
            let data = res.data;
            if (data.code === 200) {
                let item = data.data.item;
                this.item4 = JSON.stringify(item) !== "{}" ? item : null;
            }
        });

        get_item("5_3028", "std").then((res) => {
            let data = res.data;
            if (data.code === 200) {
                let item = data.data.item;
                this.item5 = JSON.stringify(item) !== "{}" ? item : null;
            }
        });

        get_item("5_3028", "origin").then((res) => {
            let data = res.data;
            if (data.code === 200) {
                let item = data.data.item;
                this.item6 = JSON.stringify(item) !== "{}" ? item : null;
            }
        });
    },
};
</script>

<style lang="less">
html {
    padding: 20px;
}
</style>
