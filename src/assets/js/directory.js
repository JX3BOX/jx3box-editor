import $ from "jquery";
const count = {
    H1: 0,
    H2: 0,
    H3: 0,
    H4: 0,
    H5: 0,
    H6: 0,
};
const MAX_DEPTH = 3;
const PREFIX_CLS = "lv"; //class前缀

const ICON_READING_SVG = `
    <svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-58697b5c=""><path fill="currentColor" d="m512 863.36 384-54.848v-638.72L525.568 222.72a96 96 0 0 1-27.136 0L128 169.792v638.72zM137.024 106.432l370.432 52.928a32 32 0 0 0 9.088 0l370.432-52.928A64 64 0 0 1 960 169.792v638.72a64 64 0 0 1-54.976 63.36l-388.48 55.488a32 32 0 0 1-9.088 0l-388.48-55.488A64 64 0 0 1 64 808.512v-638.72a64 64 0 0 1 73.024-63.36"></path><path fill="currentColor" d="M480 192h64v704h-64z"></path></svg>
`;

const ICON_CARET_SVG = `
    <svg width="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-58697b5c=""><path fill="currentColor" d="m512 128 288 320H224zM224 576h576L512 896z"></path></svg>
`;


function getHeaderHeight() {
    // 页面上可能没有这些元素，取存在的第一个：.c-header 优先，其次 .c-breadcrumb
    const el = document.querySelector(".c-header") || document.querySelector(".c-breadcrumb");
    if (!el) return 0;
    const rect = el.getBoundingClientRect && el.getBoundingClientRect();
    const h = (rect && rect.height) || el.offsetHeight || 0;
    return Math.max(0, Math.round(h));
}

function scrollToTopWithOffset(top) {
    const headerHeight = getHeaderHeight();
    const targetTop = Math.max(0, (top || 0) - headerHeight);
    window.scrollTo(0, targetTop);
}

function directory(from, to = '#directory') {
    // 装载容器设置
    const $box = $(to);
    if (!$box.length) return false;

    // 遍历节点
    let directories = $(from).find("h1,h2,h3,h4,h5,h6");

    // 存在目录
    if (directories.length > 1) {
        let __markTags = analystics(from);
        // <span class="c-article-directory-title-skip" class="c-go-top">↑ 顶部</span>
        $box.html(
            `<div class="c-article-directory" id="c-article-directory">
                <div class="c-article-directory-title" id="c-article-directory-title">
                    <span class="c-article-directory-title-label" class="c-go-top"><i class="u-icon el-icon-reading"></i> 导读</span>
                    <span class="c-article-directory-title-folder" class="c-go-top"><i class="el-icon-d-caret"></i> 折叠</span>
                </div>
                <div class="c-article-directory-content" id="c-article-directory-content"></div>
            </div>`
        );

        const $directory = $("#c-article-directory-content");
        // const $skip = $(".c-article-directory-title-skip");
        const $folder = $(".c-article-directory-title-folder");

        $folder.off("click.jx3boxDirectory").on("click.jx3boxDirectory", function() {
            $("#c-article-directory-content").slideToggle();
        });
        // 顶部按钮
        // $skip.on("click", function() {
        //     $(document).scrollTop(0);
        // });

        // 遍历捕获的目录项
        directories.each(function(i, item) {
            // 进行克隆
            let _item = $(item).clone();
            // 解决懒加载跳转位置问题（防止重复执行时重复插入）
            if (!$(item).children("a.w-directory-anchor").length) {
                $(item).prepend(`<a id="directory-${i}" class="w-directory-anchor"></a>`);
            }

            // 过滤行内样式
            _item.removeAttr("style");
            _item.removeAttr("align");
            _item.removeAttr("color");
            _item.html($(item).text());

            // 设置原始元素所在的位置
            // _item.attr("data-skip", ~~$(this).offset().top - 112);
            _item.data("raw", $(item));

            // 样式设置
            let _tag = $(item)[0].tagName
            if(__markTags.includes(_tag)){
                let lv = __markTags.indexOf(_tag) + 1
                _item.addClass(PREFIX_CLS + lv)
            }else{
                _item.addClass(PREFIX_CLS + 0)
            }

            //追加到目录盒中
            $directory.append(_item);
        });

        // 进行事件委托
        $directory
            .off("click.jx3boxDirectory", "h1,h2,h3,h4,h5,h6")
            .on("click.jx3boxDirectory", "h1,h2,h3,h4,h5,h6", function(e) {
                e.preventDefault();

                const $raw = $(this).data("raw");
                if (!$raw || !$raw.length) return;

                const anchorId = $raw.find('a[id^="directory-"]').first().attr("id");
                if (anchorId) window.location.hash = anchorId;

                const top = $raw.offset().top;
                // 等待 hash 更新和布局稳定后再滚动，避免异步渲染/图片加载影响
                requestAnimationFrame(() => scrollToTopWithOffset(top));

                $raw.addClass("isScrollFocus");
                setTimeout(() => {
                    $raw.removeClass("isScrollFocus");
                }, 3500);
            });

        return true;
    }

    // 不存在目录
    return false;
}

function analystics(from) {
    // 统计各个级别
    for (let key in count) {
        count[key] = $(from).find(key).length;
    }
    // 取前3个级别
    let __c = 0;
    let __markTags = [];
    for (let key in count) {
        if (count[key]) {
            if (__c < MAX_DEPTH) {
                __c += 1;
                __markTags.push(key);
            }
        }
    }
    return __markTags;
}

export default directory;
