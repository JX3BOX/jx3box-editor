import { $next, $cms, $team } from "@jx3box/jx3box-common/js/https";

async function getUserMedals(uid) {
    const res = await $next({ mute: true })
        .get("/api/user/" + uid + "/medals");
    return res.data.data;
}

async function getUserInfo(uid) {
    const res = await $cms({ mute: true })
        .get(`/api/cms/user/${uid}/info`);
    return res.data.data;
}

async function getUserPublicTeams(uid) {
    const res = await $team({ mute: true }).get(`/api/team/relation/public`, {
        params: {
            uid: uid,
        },
    });
    return res.data.data;
}

// 获取指定表情
function getEmotion(id) {
    return $cms().get(`/api/cms/post/emotion/${id}`);
}

export {
    getUserMedals,
    getUserInfo,
    getUserPublicTeams,
    getEmotion
}