import $ from "jquery";

/**
 * 渲染音频组件
 * 将 e-audio 转换为实际的音频播放器
 * @param {string} selector - 选择器，默认为 ".w-audio"
 */
function renderVoice(selector = ".w-audio") {
    try {
        $(selector).each(function (i, ele) {
            const $audio = $(this);
            const content = $audio.text().trim();
            
            // 解析内容：name:xxx;author:xxx;user_id:xxx;src:xxx
            const params = {};
            content.split(';').forEach(item => {
                const [key, value] = item.split(':');
                if (key && value !== undefined) {
                    params[key.trim()] = value.trim();
                }
            });

            // 提取参数
            const { name = '未命名音频', author = '', user_id = '', src = '' } = params;

            if (!src) {
                console.warn('音频源地址为空', content);
                return;
            }

            // 渲染音频播放器
            const html = `
                <div class="w-audio-player">
                    <div class="w-audio-info">
                        <div class="w-audio-name">${name}</div>
                        ${author ? `<div class="w-audio-author">作者: ${author}</div>` : ''}
                    </div>
                    <audio controls preload="metadata" style="width: 100%; margin-top: 10px;">
                        <source src="${src}" type="audio/mpeg">
                        <source src="${src}" type="audio/ogg">
                        <source src="${src}" type="audio/wav">
                        您的浏览器不支持音频播放。
                    </audio>
                </div>
            `;

            $audio.html(html);
        });
    } catch (e) {
        console.error('音频渲染错误:', e);
    }
}

export default renderVoice;
