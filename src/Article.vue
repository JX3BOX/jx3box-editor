<template>
    <div class="c-article-tinymce c-article-box">
        <!-- <div id="c-article-origin" class="c-article-origin" ref="origin"><slot></slot></div> -->
        <div id="c-article" class="c-article" ref="article" v-if="pageable">
            <div class="c-article-chunk" v-for="(text, i) in data" :key="i" v-html="text" :class="{ on: i == page - 1 || all == true }" :id="'c-article-part' + ~~(i + 1)"></div>
        </div>
        <div id="c-article" class="c-article" ref="article" v-else-if="data && data.length" v-html="data[0]"></div>
        <el-button class="c-article-all" type="primary" v-if="!all && hasPages" @click="showAll">加载全部</el-button>
        <el-pagination
            class="c-article-pages"
            v-if="!all"
            background
            :page-size="1"
            :hide-on-single-page="true"
            @current-change="changePage"
            :current-page="page"
            layout="total, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
        <div class="w-jx3-element-pop" :style="jx3_element.style">
            <jx3-item :item_id="item.id" :jx3ClientType="item.client" v-show="jx3_element.type == 'item'" />
            <jx3-buff :client="buff.client" :id="buff.id" :level="buff.level" v-show="jx3_element.type == 'buff'" />
            <jx3-skill :client="skill.client" :id="skill.id" :level="skill.level" v-show="jx3_element.type == 'skill'" />
            <jx3-npc :client="npc.client" :id="npc.id" v-show="jx3_element.type === 'npc'" />
            <jx3-author :uid="author.id" v-show="jx3_element.type === 'author'" />
            <jx3-emotion-author :id="emotion.id" v-show="jx3_element.type === 'emotion'" />
        </div>
        <!-- <gallery :images="images" :index="gallery_index" @close="index = null"></gallery> -->
    </div>
</template>

<script>
import $ from "jquery";
const HEADER_HEIGHT = 112; //头部高度

import { Pagination, Button, Popover } from "element-ui";
import "@jx3box/jx3box-common/css/element.css";

// 相册
// import gallery from "vue-gallery-slideshow";
import Vue from "vue";
import hevueImgPreview from "hevue-img-preview";
Vue.use(hevueImgPreview);

// XSS
import execFilterXSS from "../assets/js/xss";
// const execFilterXSS = require("xss");
// const xss_options = {
//     allowCommentTag: true,
// };

// 基本文本
import execLazyload from "../assets/js/img";
import execFilterIframe from "../assets/js/iframe";
import execFilterLink from "../assets/js/a";
import execSplitPages from "../assets/js/nextpage";

// 扩展文本
import renderFoldBlock from "../assets/js/fold";
import renderDirectory from "../assets/js/directory";
import renderMacro from "../assets/js/macro";
import renderTalent from "../assets/js/qixue";
import renderTalent2 from "../assets/js/talent2";
import { renderKatexAll } from "../assets/js/katex";
import renderCode from "../assets/js/code";
import renderImgPreview from "../assets/js/renderImgPreview";
import renderPzIframe from "../assets/js/pz_iframe";
import renderCombo from "../assets/js/combo";
import renderVoice from "../assets/js/voice";

// 剑三
import Item from "./Item";
import Buff from "./Buff";
import Skill from "./Skill";
import Npc from "./Npc";
import Author from "./components/Author";
import PostAuthor from "./components/PostAuthor.vue";
import renderJx3Element from "../assets/js/jx3_element";

export default {
    name: "Article",
    props: {
        content: String,
        // 拼接相对路径地址的图片，需要自带协议
        cdnDomain: {
            type: String,
            default: "https://cdn.jx3box.com",
        },
        // 链接白名单检查，不在白名单，使用新窗跳转
        linkWhitelist: {
            type: Array,
            default: function () {
                return [];
            },
        },
        // 链接白名单强制模式，开启后不在白名单的链接一律置空，不允许跳转
        linkStrict: {
            type: Boolean,
            default: false,
        },
        // iframe白名单检查，不在白名单，移除iframe
        iframeWhitelist: {
            type: Array,
            default: function () {
                return [];
            },
        },
        directorybox: String,
        pageable: {
            type: Boolean,
            default: true,
        },
    },
    data: function () {
        return {
            // 作品
            all: false,
            page: 1,
            data: [],
            mode: "",

            // 画廊
            gallery_index: null,
            images: [],

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
                client: "std",
                id: "",
            },
            author: {
                id: "",
            },
            emotion: {
                id: "",
            },
            // COMMON
            jx3_element: {
                style: {
                    top: 0,
                    left: 0,
                    display: "block",
                },
                type: "",
            },
        };
    },
    computed: {
        total: function () {
            return this.chunks.length;
        },
        hasPages: function () {
            return this.chunks.length > 1;
        },
        origin: function () {
            return this.content;
        },
        chunks: function () {
            return this.pageable ? execSplitPages(this.origin) : [this.origin];
        },
    },
    methods: {
        doReg: function (data) {
            if (data) {
                // 1. 先执行 XSS 过滤（xss.js 已包含所有配置）
                data = execFilterXSS(data);

                // 2. 然后执行 iframe 白名单过滤
                data = execFilterIframe(data, ["player.bilibili.com", "docs.qq.com", "open.douyu.com", ...this.iframeWhitelist]);

                // 3. 处理图片懒加载
                data = execLazyload(data, this.cdnDomain);

                // 4. 最后处理链接
                data = execFilterLink(data, this.linkWhitelist, this.linkStrict);

                return data;
            } else {
                return "";
            }
        },
        doDOM: function ($root) {
            // 折叠块
            renderFoldBlock($root);
            // 代码
            renderCode(`code[class=^'language-']`);
            // Tatex
            renderKatexAll();

            // 画廊（需要在宏、奇穴、物品等之前渲染以排除下方自动生成图片）
            // renderGallery(this)
            renderImgPreview(this);
            // 宏
            renderMacro();
            // 奇穴
            renderTalent();
            renderTalent2();
            // 配装
            renderPzIframe();
            // 连招
            renderCombo();
            // 音频
            renderVoice();
            // 物品
            renderJx3Element(this);
        },
        doDir: function () {
            // 显示局部
            let target = "";
            if (this.hasPages && !this.all) {
                target = "#c-article-part" + this.page;
                // 全部
            } else {
                target = "#c-article";
            }
            let dir = renderDirectory(target, this.directorybox);
            this.$emit("directoryRendered", dir);

            if (window.location.hash?.includes("directory")) {
                let id = window.location.hash;
                let target = $(`${id}`).offset().top;
                console.log(target);
                $(document).scrollTop(target - HEADER_HEIGHT);
            }

            $(".w-directory-anchor").on("click", function () {
                e.preventDefault();
                let id = $(this).attr("id");
                let target = $(`#${id}`).offset().top;
                $(document).scrollTop(target - HEADER_HEIGHT);
                window.location.hash = `#${id}`;
            });
        },
        changePage: function (i) {
            this.page = i;
            window.scrollTo(0, 0);
            this.$nextTick(() => {
                this.doDir();
            });
        },
        showAll: function () {
            this.all = true;
            this.$nextTick(() => {
                this.doDir();
            });
        },
        render: function () {
            let result = [];
            for (let chunk of this.chunks) {
                let _chunk = this.doReg(chunk);
                result.push(_chunk);
            }
            this.data = result;
        },
        run: function () {
            this.render();

            // 等待html加载完毕后
            this.$nextTick(() => {
                this.$emit("contentLoaded");

                // 统一DOM处理
                const $root = this.$refs.article;
                this.doDOM($root);
                this.$emit("contentRendered");

                // 目录处理
                this.doDir();
            });
        },
    },
    watch: {
        content: function () {
            this.run();
        },
    },
    mounted: function () {
        const params = new URLSearchParams(location.search);
        this.mode = params.get("mode") || "";
        this.run();
    },
    components: {
        "el-pagination": Pagination,
        "el-button": Button,
        // "el-popover": Popover,
        "jx3-item": Item,
        "jx3-buff": Buff,
        "jx3-skill": Skill,
        "jx3-npc": Npc,
        "jx3-author": Author,
        "jx3-emotion-author": PostAuthor,
        // "gallery":gallery,
        // VueViewer
    },
};
</script>

<style lang="less">
@import "../assets/css/article.less";
</style>
