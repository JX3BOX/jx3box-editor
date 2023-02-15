// 图片地址&懒加载
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
function lazyLoad(str) {
    if (!str) return;

    const REG = /<img(.*?)src=[\'"]([^\'"]+)[\'"](.*?)>/gi;
    let item;
    while ((item = REG.exec(str))) {
        let origin = item[0];
        let prefix = item[1];
        let src = resolveImagePath(item[2]);
        if (src.includes('https://console.cnyixun.com/')) {
            src = src.replace('https://console.cnyixun.com/', __cdn)
        }
        let suffix = item[3];
        let output = `<img ${prefix} loading="lazy" src="${src}" ${suffix}>`;
        str = str.replace(origin, output);
    }
    return str;
}
export default lazyLoad;
