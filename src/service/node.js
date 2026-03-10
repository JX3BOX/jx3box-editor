import { $node, axios } from "@jx3box/jx3box-common/js/https";

function getSkill(query, params) {
    let condition = isNaN(query) ? "name" : "id";
    return $node()
        .get(`/skill/${condition}/${query}`, {
            params: params,
        })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log(err);
        });
}

function getSkillList(params) {
    return $node().get(`/skill`, {
        params: params,
    });
}

import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const $oss = axios.create({
    baseURL: JX3BOX.__dataPath,
});

function getSkills(params) {
    return $node().get("/skills", {
        params: params,
    });
}

async function getTalents() {
    let res = await $oss.get("talent/talents.json");
    return res.data;
}

async function getTalents2() {
    let res = await $oss.get("talent2/talent2.json");
    return res.data;
}

export function getMobileForceSkillList(force_id) {
    return $node().get("/v2/kungfu/panel", {
        params: {
            mount_id: force_id,
            client: 'wujie'
        },
    });
}

export { getSkill, getSkillList, getSkills, getTalents, getTalents2 };
