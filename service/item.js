import { $node, $cms } from "@jx3box/jx3box-common/js/https";

// 获取物品
function get_item(item_id, client = 'std') {
    if (!item_id) return;

    return $node().get(`/resource/${client}/item_merged.${item_id}`);
}

// 获取清单
function get_plan(plan_id) {
    return $cms().get(`/api/cms/app/item-plan/${plan_id}`);
}

export { get_item, get_plan };
