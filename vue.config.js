const path = require('path');

const pkg = require("./package.json");
const { JX3BOX } = require("@jx3box/jx3box-common");
const webpack = require('webpack')

module.exports = {

    //❤️ Multiple pages ~
    pages: {
        index: {
            title: "导航",
            entry: "src/pages/index.js",
            template: "public/index.html",
            filename: "index.html",
        },
        article: {
            title: "Article渲染",
            entry: "src/pages/article.js",
            template: "public/article.html",
            filename: "article/index.html",
        },
        tinymce: {
            title: "Tinymce编辑器",
            entry: "src/pages/tinymce.js",
            template: "public/tinymce.html",
            filename: "tinymce/index.html",
        },
        markdown: {
            title: 'Markdown编辑器',
            entry: "src/pages/markdown.js",
            template: 'public/article.html',
            filename: 'markdown/index.html',
        },
    },


    //❤️ Porxy ~
    devServer: {
        proxy: {
            "/api/cms": {
                "target": process.env["DEV_SERVER"] == "true" ? "http://localhost:7100" : "https://cms.jx3box.com",
                "onProxyReq": function (request) {
                    request.setHeader("origin", "");
                }
            },
            "/api/team": {
                target: "https://team.api.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api": {
                target: "https://next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
        }
    },

    //❤️ 配置需要被 Babel 转译的 node_modules 依赖 ~
    // transpileDependencies: [
    //     'htmlparser2',
    //     'cheerio',
    //     'dom-serializer',
    //     'domelementtype',
    //     'domhandler',
    //     'domutils',
    //     'entities',
    //     'parse5',
    //     'parse5-htmlparser2-tree-adapter'
    // ],

    chainWebpack: config => {

        //💝 in-line small imgs ~
        config.module.rule("images").set("parser", {
            dataUrlCondition: {
                maxSize: 4 * 1024, // 4KiB
            },
        });

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));

    },
};

function addStyleResource(rule) {
    var preload_styles = [];
    preload_styles.push(
        path.resolve(__dirname, "./node_modules/csslab/base.less"),
        path.resolve(__dirname, "./assets/css/var.less")
    );
    rule.use("style-resource").loader("style-resources-loader").options({
        patterns: preload_styles,
    });
}
