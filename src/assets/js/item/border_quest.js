/**
 * border_quest
 * @param {*} item 物品对象
 */
const {__imgPath} = require("@jx3box/jx3box-common/data/jx3box.json");

export default (item) => {
    if (item.IsQuest > 0) return `url(${__imgPath}image/item/renwu.png)`;
    return '';
}

