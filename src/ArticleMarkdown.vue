<template>
    <div class="c-article-markdown">
        <markdown-render id="c-article" class="c-markdown c-article" ref="article" v-model="origin" @change="updateOrigin" :preRender="doReg" :xssOptions="xssOptions"></markdown-render>
        <div class="w-jx3-element-pop" :style="jx3_element.style">
            <jx3-item :item_id="item.id" :jx3ClientType="item.client" v-show="jx3_element.type == 'item'" />
            <jx3-buff :client="buff.client" :id="buff.id" :level="buff.level" v-show="jx3_element.type == 'buff'" />
            <jx3-skill :client="skill.client" :id="skill.id" :level="skill.level" v-show="jx3_element.type == 'skill'" />
            <jx3-npc :client="npc.client" :id="npc.id" v-show="jx3_element.type === 'npc'"></jx3-npc>
        </div>
    </div>
</template>

<script>
import markdownRender from '@jx3box/markdown/src/render.vue'

import Vue from "vue";
import hevueImgPreview from "hevue-img-preview";
Vue.use(hevueImgPreview);

// 基本文本
import execLazyload from "../assets/js/img";
import execFilterIframe from "../assets/js/iframe";
import execFilterLink from "../assets/js/a";
import execFilterXSS from "../assets/js/script";

// 扩展文本
import renderDirectory from "../assets/js/directory";
import renderMacro from "../assets/js/macro";
import renderTalent from "../assets/js/qixue";
import renderTalent2 from "../assets/js/talent2";
import {renderKatexAll} from "../assets/js/katex";
import renderCode from "../assets/js/code";

// 剑三
import Item from "./Item";
import Buff from "./Buff";
import Skill from "./Skill";
import Npc from "./Npc";
import renderJx3Element from "../assets/js/jx3_element";
import renderImgPreview from "../assets/js/renderImgPreview";
import renderAudio from "../assets/js/audio";

import {xssOptions} from '../assets/data/markdown_whitelist.json'

export default {
    name: "ArticleMarkdown",
    props: {
        content: String,
        directorybox: String,
    },
    data: function() {
        return {
            // 原始md
            origin : '',
            // 原始渲染md后的html(传入文本回调处理函数)
            html: "",

            // 物品
            item: {
                id: "",
                client: 1,
            },
            // BUFF
            buff: {
                client: "std",
                id: "",
                level: "",
            },
            // SKILL
            skill: {
                client: "std",
                id: "",
                level: "",
            },
            // NPC
            npc: {
                client: 'std',
                id: ""
            },
            jx3_element: {
                style: {
                    top: 0,
                    left: 0,
                    display: "none",
                },
                type: "",
            },
            images: [],

            xssOptions
        };
    },
    computed: {
    },
    methods: {
        doReg: function(data) {
            if (data) {
                // 过滤内容
                data = execLazyload(data);
                data = execFilterIframe(data);
                data = execFilterXSS(data);
                data = execFilterLink(data);
                return data;
            } else {
                return "";
            }
        },
        doDOM: function() {
            // 宏
            renderMacro();
            // 奇穴
            renderTalent();
            renderTalent2();
            // Tatex
            renderKatexAll();
            // 画廊
            renderImgPreview(this);
            // 语法高亮
            renderCode(`code[class=^'lang-']`)
            // 音频
            renderAudio();
            // 物品
            renderJx3Element(this);
        },
        doDir: function() {
            let target = "#c-article";
            let dir = renderDirectory(target, this.directorybox);
            this.$emit("directoryRendered",dir);
        },
        updateOrigin : function (md,html){
            this.html = html
            this.render()
        },
        render: function() {
            // 等待html加载完毕后
            this.$nextTick(() => {
                this.$emit("contentLoaded");

                // 统一DOM处理
                this.doDOM();
                this.$emit("contentRendered");

                // 目录处理
                this.doDir();
            });
        },
    },
    watch: {
        content : {
            immediate : true,
            handler : function (val){
                this.origin = val
            }
        }
    },
    mounted: function() {
    },
    components: {
        "jx3-item": Item,
        "jx3-buff": Buff,
        "jx3-skill": Skill,
        "jx3-npc": Npc,
        markdownRender,
    },
};
</script>

<style lang="less">
@import "../assets/css/article_markdown.less";

.v-note-img-wrapper {
    display: none;
}
</style>
