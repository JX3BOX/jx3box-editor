import $ from "jquery";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";

const viewerMap = new WeakMap();

export default function renderImgPreview(rootEl, selector = "img") {
    if (!rootEl) return;

    const $root = $(rootEl);
    const imgs = $root
        .find(selector)
        .filter(function () {
            const src = $(this).attr("src");
            if (!src) return false;
            // 保留本项目的业务规则：表情图片不启用预览
            if (this.classList && this.classList.contains("e-jx3-emotion-img"))
                return false;
            return true;
        });

    imgs.each((_, ele) => {
        if (viewerMap.has(ele)) return;
        const viewer = new Viewer(ele, {
            toolbar: false,
            navbar: false,
        });
        viewerMap.set(ele, viewer);
    });
}
