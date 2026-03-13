<template>
    <div class="c-article-tinymce c-article-box">
        <!-- <div id="c-article-origin" class="c-article-origin" ref="origin"><slot></slot></div> -->

        <div id="c-article" class="c-article" ref="article" v-if="pageable">
            <div
                class="c-article-chunk"
                v-for="(text, i) in data"
                :key="i"
                v-html="text"
                :class="{ on: i == page - 1 || all == true, 'markdown-body': isMarkdownMode }"
                :id="'c-article-part' + ~~(i + 1)"
            ></div>
        </div>

        <div
            id="c-article"
            class="c-article"
            ref="article"
            v-else-if="data && data.length"
            v-html="data[0]"
            :class="{ 'markdown-body': isMarkdownMode }"
        ></div>

        <el-button class="c-article-all" type="primary" v-if="!all && hasPages" @click="showAll">加载全部</el-button>

        <el-pagination
            class="c-article-pages"
            v-if="!all"
            background
            center
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
            <jx3-skill
                :client="skill.client"
                :id="skill.id"
                :level="skill.level"
                v-show="jx3_element.type == 'skill'"
            />
            <jx3-npc :client="npc.client" :id="npc.id" v-show="jx3_element.type === 'npc'" />
            <jx3-author :uid="author.id" v-show="jx3_element.type === 'author'" />
            <jx3-emotion-author :id="emotion.id" v-show="jx3_element.type === 'emotion'" />
        </div>
    </div>
</template>

<script>
import $ from "jquery";
import Vditor from "vditor";
import "github-markdown-css/github-markdown-light.css";

// XSS
import execFilterXSS from "./assets/js/xss";

// 基本文本
import execLazyload from "./assets/js/img";
import execFilterIframe from "./assets/js/iframe";
import execFilterLink from "./assets/js/a";
import execSplitPages from "./assets/js/nextpage";
import normalizeMarkdownForVditor from "./assets/js/normalizeMarkdownForVditor";

// 扩展文本
import renderFoldBlock from "./assets/js/fold";
import renderDirectory from "./assets/js/directory";
import renderKatex from "./assets/js/katex";
import renderCode from "./assets/js/code";
import renderImgPreview from "./assets/js/renderImgPreview";

// 魔盒
import renderMacro from "./assets/js/macro";
import renderTalent from "./assets/js/qixue";
import renderTalent2 from "./assets/js/talent2";
import renderPzIframe from "./assets/js/pz_iframe";
import renderCombo from "./assets/js/combo";
import renderAudio from "./assets/js/audio";
import Author from "./components/Author";
import PostAuthor from "./components/PostAuthor.vue";

// 剑三
import Item from "./Item";
import Buff from "./Buff";
import Skill from "./Skill";
import Npc from "./Npc";
import renderJx3Element from "./assets/js/jx3_element";

export default {
    name: "Article",
    props: {
        post_mode: {
            type: String,
            default: "tinymce",
        },

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

        // 目录容器选择器
        directorybox: String,
        // 是否开启分页
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
            renderVersion: 0,

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
            return this.data.length;
        },
        hasPages: function () {
            return this.data.length > 1;
        },
        origin: function () {
            return this.content;
        },
        isMarkdownMode: function () {
            return ["markdown", "md", "vditor"].includes(String(this.post_mode || "").toLowerCase());
        },
        chunks: function () {
            return this.pageable ? execSplitPages(this.origin) : [this.origin];
        },
    },
    methods: {
        getHeaderHeight: function () {
            // 页面上可能没有这些元素，取存在的第一个：.c-header 优先，其次 .c-breadcrumb
            const el = document.querySelector(".c-header") || document.querySelector(".c-breadcrumb");
            if (!el) return 0;
            const rect = el.getBoundingClientRect && el.getBoundingClientRect();
            const h = (rect && rect.height) || el.offsetHeight || 0;
            return Math.max(0, Math.round(h));
        },
        scrollToTopWithOffset: function (top) {
            const headerHeight = this.getHeaderHeight();
            const targetTop = Math.max(0, (top || 0) - headerHeight);
            window.scrollTo(0, targetTop);
        },
        doReg: function (data) {
            if (data) {
                // 1. 先执行 XSS 过滤（xss.js 已包含所有配置）
                data = execFilterXSS(data);

                // 2. 然后执行 iframe 白名单过滤
                data = execFilterIframe(data, [
                    "player.bilibili.com",
                    "docs.qq.com",
                    "open.douyu.com",
                    ...this.iframeWhitelist,
                ]);

                // 3. 处理图片懒加载
                data = execLazyload(data, this.cdnDomain);

                // 4. 最后处理链接
                data = execFilterLink(data, this.linkWhitelist, this.linkStrict);

                return data;
            } else {
                return "";
            }
        },
        renderMarkdownChunk: async function (chunk) {
            const temp = document.createElement("div");
            const normalizedChunk = normalizeMarkdownForVditor(chunk);

            await Vditor.preview(temp, normalizedChunk, {
                mode: "light",
                lang: "zh_CN",
                hljs: {
                    enable: true,
                    lineNumber: false,
                    style: "github",
                },
                markdown: {
                    mark: true,
                    sanitize: true,
                    toc: true,
                },
                icon: "ant",
            });

            return temp.innerHTML;
        },
        renderMarkdown: async function () {
            const html = await this.renderMarkdownChunk(this.origin);
            const chunks = this.pageable ? execSplitPages(html) : [html];

            return chunks.map((chunk) => this.doReg(chunk));
        },
        doDOM: function ($root) {
            // 折叠块
            renderFoldBlock($root);
            // 代码
            renderCode(`code[class=^'language-']`);
            // Tatex
            renderKatex();
            // 画廊
            renderImgPreview($root, "img:not(.e-jx3-emotion-img)");

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
            renderAudio();
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
                const $target = $(`${id}`);
                if ($target.length) {
                    const top = $target.offset().top;
                    // 等待目录 DOM 真正插入并布局后再滚动
                    requestAnimationFrame(() => this.scrollToTopWithOffset(top));
                }
            }

            const vm = this;
            $(".w-directory-anchor")
                .off("click.jx3boxArticleDir")
                .on("click.jx3boxArticleDir", function (e) {
                    e.preventDefault();
                    let id = $(this).attr("id");
                    const $target = $(`#${id}`);
                    if ($target.length) {
                        const top = $target.offset().top;
                        vm.scrollToTopWithOffset(top);
                    }
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
        render: async function () {
            const version = ++this.renderVersion;
            let result = [];

            if (this.isMarkdownMode) {
                result = await this.renderMarkdown();
            } else {
                for (let chunk of this.chunks) {
                    let _chunk = this.doReg(chunk);
                    result.push(_chunk);
                }
            }

            if (version !== this.renderVersion) return;
            this.data = result;
        },
        run: async function () {
            this.page = 1;
            this.all = false;
            await this.render();
            if (!this.data.length) return;

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
        post_mode: function () {
            this.run();
        },
    },
    mounted: function () {
        const params = new URLSearchParams(location.search);
        this.mode = params.get("mode") || "";
        this.run();
    },
    components: {
        "jx3-item": Item,
        "jx3-buff": Buff,
        "jx3-skill": Skill,
        "jx3-npc": Npc,
        "jx3-author": Author,
        "jx3-emotion-author": PostAuthor,
    },
};
</script>

<style lang="less">
@import "./assets/css/article.less";
</style>
