import $ from "jquery";
function buildIframe(str) {
    let _str = new URLSearchParams(str);
    let mode = _str.get("mode");

    if (mode == "vertical") {
        return `<div class="w-pz-iframe-wrap" style="width:100%;overflow:auto;"><iframe class="w-pz-iframe" src="${str}" scrolling="no" width="750" height="3468" style="border:none;background:none;max-width:none;"></iframe></div>`;
    } else {
        return `<div class="w-pz-iframe-wrap" style="width:100%;overflow:auto;"><iframe class="w-pz-iframe" src="${str}" scrolling="no" width="1280" height="720" style="border:none;background:none;max-width:none;"></iframe></div>`;
    }
}

function renderPzIframe(selector = ".e-pz-iframe") {
    try {
        $(selector).each(function (i, ele) {
            // 获取嵌入源地址
            let url = $(this).text();

            // 构建嵌入源码
            let code = buildIframe(url);

            // 挂载点
            $(this).after(code);
        });
    } catch (e) {
        console.error(e);
    }
}

export default renderPzIframe;
