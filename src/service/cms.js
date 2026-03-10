import { $cms } from "@jx3box/jx3box-common/js/https";
import axios from "axios";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";

function uploadFile(data) {
    return $cms().post(`/api/cms/upload`, data);
}

// 获取用户列表
function loadAuthors(params) {
    return $cms().get(`/api/cms/user/list`, {
        params: params,
    });
}

// 获取表情列表
function loadEmotions(params) {
    return $cms().get(`/api/cms/post/emotions`, {
        params: params,
    });
}
//获取装扮
function getDecoration(params) {
    return $cms().get(`/api/cms/user/decoration`, {
        params,
    });
}

function getDecorationJson() {
    let url = __cdn + "design/decoration/index.json";
    return axios.get(url);
}

// 获取信纸
function getLetterPaper(params) {
    return $cms().get(`/api/cms/design/letter-paper`, {
        params,
    });
}
export { uploadFile, loadAuthors, loadEmotions, getDecoration, getDecorationJson, getLetterPaper };