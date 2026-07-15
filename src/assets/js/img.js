import { load } from "cheerio";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";

function joinDomain(domain, path) {
    const d = String(domain || "").replace(/\/+$/, "");
    const p = String(path || "").replace(/^\/+/, "/");
    return d ? d + p : path;
}

function isAbsoluteLike(src) {
    // 不需要拼 domain 的情况
    return (
        /^(https?:)?\/\//i.test(src) ||
        /^(data:|blob:|mailto:|tel:|javascript:)/i.test(src)
    );
}

function normalizeImgSrc(src, domain) {
    const s = String(src || "").trim();
    if (!s) return s;

    // 历史 OSS 图片域名先统一转换为当前 CDN，随后再处理可选的相对路径拼接。
    const resolved = resolveImagePath(s);
    if (resolved && resolved !== s) return resolved;

    if (!domain) return s;
    if (isAbsoluteLike(s)) return s;

    // 最常见：/uploads/xxx
    if (s.startsWith("/")) return joinDomain(domain, s);

    // 其它相对路径：uploads/a.png、./a.png
    // 用 URL 做更准确的拼接（domain 需要是带协议的，如 https://cdn.xxx.com）
    try {
        if (/^https?:\/\//i.test(domain)) {
            const base = domain.endsWith("/") ? domain : domain + "/";
            return new URL(s, base).toString();
        }
    } catch {
        console.warn("URL 拼接图片路径失败：", domain, s);
    }

    // 兜底：简单拼到根路径
    return joinDomain(domain, "/" + s.replace(/^\.\/+/, ""));
}

/**
 * @param {string} html 富文本HTML
 * @param {string} domain 可选：CDN/站点域名（如 https://cdn.xxx.com）
 */
export default function lazyLoad(html, domain = "") {
    if (!html) return html;

    const $ = load(`<root>${html}</root>`, { decodeEntities: false });

    $("img").each((_, el) => {
        const img = $(el);

        // 固定懒加载：无论如何都加/覆盖
        img.attr("loading", "lazy");

        // 无论是否传入 domain，都先统一历史 OSS/CDN 地址；相对路径仅在有 domain 时拼接。
        const src = img.attr("src");
        if (src) img.attr("src", normalizeImgSrc(src, domain));

        const dataSrc = img.attr("data-src");
        if (dataSrc) img.attr("data-src", normalizeImgSrc(dataSrc, domain));
    });

    return $("root").html() || "";
}
