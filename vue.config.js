const path = require('path');
const { spawn } = require("child_process");
const JX3BOX = require("@jx3box/jx3box-common/data/jx3box.json");
const CMS_PROXY_TARGET = (process.env.VUE_APP_CMS || JX3BOX.__cms || "https://cms.jx3box.com").replace(/\/$/, "");

const pages = {
    index: {
        title: "导航",
        entry: "src/pages/index.js",
        template: "public/index.html",
        filename: "index.html",
    },
    article: {
        title: "Article渲染",
        entry: "src/pages/article.js",
        template: "public/index.html",
        filename: "article/index.html",
    },
    tinymce: {
        title: "Tinymce编辑器",
        entry: "src/pages/tinymce.js",
        template: "public/tinymce.html",
        filename: "tinymce/index.html",
    },
    markdown: {
        title: 'Markdown',
        entry: "src/pages/markdown.js",
        template: 'public/index.html',
        filename: 'markdown/index.html',
    },
    upload: {
        title: '文件上传',
        entry: "src/pages/upload.js",
        template: 'public/index.html',
        filename: 'upload/index.html',
    }
}

let chokidar = null;
try {
    chokidar = require("chokidar");
} catch (e) {
    chokidar = null;
}

// const pkg = require("./package.json");
// const { JX3BOX } = require("@jx3box/jx3box-common");
// const webpack = require('webpack')

class RunBuildOnCssChangePlugin {
    constructor(options = {}) {
        this.paths = options.paths || [];
        this.debounceMs = Number.isFinite(options.debounceMs) ? options.debounceMs : 400;
        this.command = options.command || ["npm", ["run", "build"]];
        this.enabled = options.enabled !== false;
    }

    apply() {
        if (!this.enabled) return;
        // Only run in `vue-cli-service serve`
        if (!process.env.WEBPACK_SERVE) return;
        if (!chokidar) return;

        const watchTargets = (this.paths || []).filter(Boolean);
        if (!watchTargets.length) return;

        let timer = null;
        let running = false;
        let queued = false;

        const run = () => {
            if (running) {
                queued = true;
                return;
            }

            running = true;
            queued = false;

            const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
            const [cmd, args] = this.command;
            const realCmd = cmd === "npm" ? npmBin : cmd;

            const child = spawn(realCmd, args, {
                stdio: "inherit",
                env: process.env,
            });

            child.on("exit", () => {
                running = false;
                // build 完成后，触发 dev 页面强制 reload
                if (typeof global.__JX3BOX_DEV_TRIGGER_RELOAD__ === "function") {
                    global.__JX3BOX_DEV_TRIGGER_RELOAD__("css-build");
                }
                if (queued) run();
            });
        };

        const schedule = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(run, this.debounceMs);
        };

        const watcher = chokidar.watch(watchTargets, {
            ignoreInitial: true,
        });

        watcher.on("add", schedule);
        watcher.on("change", schedule);
        watcher.on("unlink", schedule);
    }
}

module.exports = {
    // 项目不需要 eslint，关闭 lintOnSave 以避免启动/编译时报错
    lintOnSave: false,

    configureWebpack: {
        plugins: [
            new RunBuildOnCssChangePlugin({
                paths: [
                    path.resolve(__dirname, "src/assets/css"),
                ],
                command: ["npm", ["run", "build"]],
                debounceMs: 500,
            }),
        ],
    },

    //❤️ Multiple pages ~
    pages: pages,


    //❤️ Porxy ~
    devServer: {
        proxy: {
            "^/api/cms": {
                target: CMS_PROXY_TARGET,
                changeOrigin: true,
                secure: true,
            },
        },
        setupMiddlewares(middlewares, devServer) {
            // 暴露一个全局方法，给上面的 watcher/build 插件用来强制刷新当前打开的 dev 页面
            global.__JX3BOX_DEV_TRIGGER_RELOAD__ = (file = "manual") => {
                try {
                    if (devServer && devServer.webSocketServer && devServer.webSocketServer.clients) {
                        devServer.sendMessage(devServer.webSocketServer.clients, "static-changed", file);
                    }
                } catch (e) {
                    // ignore
                }
            };
            return middlewares;
        },
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
