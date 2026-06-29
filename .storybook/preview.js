import { setup } from "@storybook/vue3";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import "../src/assets/css/var.less";
import "../src/assets/css/article.less";
import "../src/assets/css/markdown.less";
import "../src/assets/css/resource.less";
import "../src/assets/css/upload.less";
import "../src/assets/css/upload_album.less";
import "../src/assets/css/tinymce.less";

setup((app) => {
    app.use(ElementPlus);
});

const ensureStorage = (key) => {
    if (typeof window === "undefined" || window[key]) return;
    const store = {};
    window[key] = {
        getItem(name) {
            return Object.prototype.hasOwnProperty.call(store, name) ? store[name] : null;
        },
        setItem(name, value) {
            store[name] = String(value);
        },
        removeItem(name) {
            delete store[name];
        },
        clear() {
            Object.keys(store).forEach((name) => delete store[name]);
        },
    };
};

ensureStorage("localStorage");
ensureStorage("sessionStorage");

if (typeof window !== "undefined") {
    window.__JX3BOX_STORYBOOK__ = true;

    const originFetch = window.fetch?.bind(window);
    if (originFetch) {
        window.fetch = (input, init) => {
            const nextInput = rewriteProxyRequest(input);
            return originFetch(nextInput, init);
        };
    }
}

export const parameters = {
    controls: {
        expanded: true,
        sort: "requiredFirst",
    },
    actions: {
        argTypesRegex: "^on[A-Z].*",
    },
    docs: {
        toc: true,
    },
    layout: "centered",
};

function rewriteProxyRequest(input) {
    if (typeof input === "string") {
        return rewriteUrlString(input);
    }

    if (input instanceof Request) {
        return new Request(rewriteUrlString(input.url), input);
    }

    return input;
}

function rewriteUrlString(url) {
    if (!url) return url;

    if (url.startsWith("/__proxy/") || url.startsWith("/api/")) {
        return url;
    }

    if (url.startsWith("http://localhost:6006/__proxy/") || url.startsWith("http://127.0.0.1:6006/__proxy/")) {
        const parsed = new URL(url);
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }

    return url;
}
