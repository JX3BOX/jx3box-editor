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
                
                const _extend = extend ? JSON.parse(extend) : {};
                const { gcd, n = '', c, fz=12, fw='normal',client='std' } = _extend;

                // 渲染
                let code = `
                <span class="w-skill-combo-item">
                    <img class="u-skill-icon w-jx3-element" src="${iconLink(icon)}" alt="${icon}" title="${name}" data-type="skill" data-id="${id}" data-client="${client}" />
                    <span class="u-skill-name" title="${name}">${name}</span>
                    <span class="u-skill-note" title="${n}" style="color:${c};font-size:${fz}px;font-weight:${fw}">${n}</span>
                    <i class="u-gcd-icon ${gcd == 0 ? 'is-show' : ''}" title="无GCD技能">
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
