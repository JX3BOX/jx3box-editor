import $ from "jquery";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

function renderCombo(selector = ".e-skill-combo") {
    try {
        $(selector).each(function (i, ele) {
            // 获取嵌入源地址
            let html = ''

            let children = $(this).children();

            children.each(function (i, ele) {
                let url = $(this).text();

                // extend = {gcd: 0, note: "炖鸡"}
                const [id, name, icon, extend] = url.split(/,(?![^{]*\})/);
                
                // 去除左右花括号

                const _extend = extend ? JSON.parse(extend) : null;

                // 渲染
                let code = `
                <span class="w-skill-combo-item">
                    <img class="u-skill-icon" src="${iconLink(icon)}" alt="${icon}" title="${name}" />
                    <span class="u-skill-name" title="${name}">${name}</span>
                    <span class="u-skill-note" title="${_extend && _extend.n}" style="color:${_extend&&_extend.c}">${_extend && _extend.n || ''}</span>
                    <i class="u-gcd-icon ${_extend && _extend.gcd == 0 ? 'is-show' : ''}" title="无GCD技能">
                        <i class="el-icon-time"></i>
                    </i>
                </span>
            `;
                html += code;
            });
            // 挂载点
            $(this).html(html);
        });
    } catch (e) {
        console.log(e)
    }
}

export default renderCombo;
