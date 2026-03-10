/**
 * 拖拽移动
 * @param  {elementObjct} bar 鼠标点击控制拖拽的元素
 * @param {elementObjct}  target 移动的元素
 * @param {function}  callback 移动后的回调
 */
const startDrag = (bar, target, callback) => {
    var params = {
        top: 0,
        left: 0,
        currentX: 0,
        currentY: 0,
        flag: false,
        cWidth: 0,
        cHeight: 0,
        tWidth: 0,
        tHeight: 0
    };

    // 给拖动块添加样式
    bar.style.cursor = 'move';

    // 获取相关CSS属性
    // o是移动对象
    // var getCss = function (o, key) {
    //   return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
    // };

    bar.onmousedown = function (event) {
        // 按下时初始化params
        var e = event ? event : window.event;
        params = {
            top: target.offsetTop,
            left: target.offsetLeft,
            currentX: e.clientX,
            currentY: e.clientY,
            flag: true,
            cWidth: document.body.clientWidth,
            cHeight: document.body.clientHeight,
            tWidth: target.offsetWidth,
            tHeight: target.offsetHeight
        };

        // 给被拖动块初始化样式
        target.style.margin = 0;
        target.style.top = params.top + 'px';
        target.style.left = params.left + 'px';

        if (!event) {
            // 防止IE文字选中
            bar.onselectstart = function () {
                return false;
            }
        }

        document.onmousemove = function (event) {
            // 防止文字选中
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

            var e = event ? event : window.event;
            if (params.flag) {
                var nowX = e.clientX;
                var nowY = e.clientY;
                // 差异距离
                var disX = nowX - params.currentX;
                var disY = nowY - params.currentY;
                // 最终移动位置
                var zLeft = 0;
                var zTop = 0;

                zLeft = parseInt(params.left) + disX;
                // 限制X轴范围
                if (zLeft <= -parseInt(params.tWidth / 2)) {
                    zLeft = -parseInt(params.tWidth / 2);
                }
                if (zLeft >= params.cWidth - parseInt(params.tWidth * 0.5)) {
                    zLeft = params.cWidth - parseInt(params.tWidth * 0.5);
                }

                zTop = parseInt(params.top) + disY;
                // 限制Y轴范围
                if (zTop <= 0) {
                    zTop = 0;
                }
                if (zTop >= params.cHeight - parseInt(params.tHeight * 0.5)) {
                    zTop = params.cHeight - parseInt(params.tHeight * 0.5);
                }

                // 执行移动
                target.style.left = zLeft + 'px';
                target.style.top = zTop + 'px';
            }

            if (typeof callback == "function") {
                callback(zLeft, zTop);
            }
        }

        document.onmouseup = function () {
            params.flag = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

/**
 * 为el-dialog弹框增加拖拽功能
 * @param {*} el 指定dom
 * @param {*} binding 绑定对象
 * desc   只要用到了el-dialog的组件，都可以通过增加v-draggable属性变为可拖拽的弹框
 */
export const draggable = (el, binding) => {
    // 绑定拖拽事件 [绑定拖拽触发元素为弹框头部、拖拽移动元素为整个弹框]
    startDrag(el.querySelector('.el-dialog__header'), el.querySelector('.el-dialog'), binding.value);
};