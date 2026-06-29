const { createProxyMiddleware } = require("http-proxy-middleware");
const JX3BOX = require("@jx3box/jx3box-common/data/jx3box.json");

const CMS_PROXY_TARGET = (process.env.VUE_APP_CMS || JX3BOX.__cms || "https://cms.jx3box.com").replace(/\/$/, "");
const { __cms, __node, __team, __next } = JX3BOX;

module.exports = function storybookMiddleware(router) {
    router.use(
        "/api/cms",
        createProxyMiddleware({
            target: CMS_PROXY_TARGET,
            changeOrigin: true,
            secure: true,
        })
    );

    router.use(
        "/api/node",
        createProxyMiddleware({
            target: __node,
            changeOrigin: true,
            secure: true,
        })
    );

    router.use(
        "/__proxy/cms",
        createProxyMiddleware({
            target: __cms,
            changeOrigin: true,
            secure: true,
            pathRewrite: {
                "^/__proxy/cms": "",
            },
        })
    );

    router.use(
        "/__proxy/node",
        createProxyMiddleware({
            target: __node,
            changeOrigin: true,
            secure: true,
            pathRewrite: {
                "^/__proxy/node": "",
            },
        })
    );

    router.use(
        "/__proxy/team",
        createProxyMiddleware({
            target: __team,
            changeOrigin: true,
            secure: true,
            pathRewrite: {
                "^/__proxy/team": "",
            },
        })
    );

    router.use(
        "/__proxy/next",
        createProxyMiddleware({
            target: __next,
            changeOrigin: true,
            secure: true,
            pathRewrite: {
                "^/__proxy/next": "",
            },
        })
    );
};
