/**
 * bind
 * @param {*} BindType 绑定类型
 */

export default (BindType) => {
    switch (BindType) {
        case 1:
            return '可交易';
        case 2:
            return '装备前可交易';
        case 3 :
            return '不可交易';
        default:
            return '未知'
    }
}

