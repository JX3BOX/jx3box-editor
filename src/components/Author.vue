<template>
    <!-- @圈人pop：作者卡片 -->
    <div class="w-author" v-loading="loading">
        <div class="w-author-wrapper el-popover" :class="{ 'is-no-atcard': !bg }" v-if="data" :style="authorCardStyle">
            <div class="u-author">
                <Avatar
                    class="u-avatar"
                    :uid="uid"
                    :url="data.user_avatar"
                    :size="60"
                    :frame="data.user_avatar_frame"
                />
                <div class="u-info">
                    <a class="u-name" :href="authorLink(uid)" target="_blank">
                        <el-tooltip class="item" effect="dark" content="签约作者" placement="top" v-if="isSuperAuthor">
                            <a class="u-superauthor" href="/dashboard/cooperation" target="_blank">
                                <img :src="super_author_icon" alt="superauthor" />
                            </a>
                        </el-tooltip>
                        <span class="u-displayname" :title="data.display_name">{{ data.display_name || "未知" }}</span>
                    </a>
                    <div class="u-extend">
                        <el-tooltip class="item" effect="dark" placement="top">
                            <template #content>
                                <span class="u-tips">经验值：{{ data.experience }}</span>
                            </template>
                            <span
                                class="u-level"
                                :class="'lv-' + level"
                                :style="{
                                    backgroundColor: showLevelColor(level),
                                }"
                                >Lv.{{ level }}</span
                            >
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="vipTypeTitle" placement="top" v-if="isVip">
                            <a class="u-vip" href="/vip/premium?from=sidebar_author" target="_blank">
                                <i class="i-icon-vip on">{{ vipType }}</i>
                            </a>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <!-- <div class="u-honor" :style="honorStyle" v-if="honor">{{ honor }}</div> -->
            <div class="u-trophy" v-if="hasTrophy">
                <div class="m-medals" v-if="medals && medals.length">
                    <div class="m-medal">
                        <a
                            v-for="item in medals"
                            :key="item.id"
                            :href="medalLink(item)"
                            target="_blank"
                            class="u-medal"
                            :title="item.medal_desc"
                        >
                            <img class="u-medal-img" :src="showMedalIcon(item.medal)" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="u-author-role" v-if="authorRoles.length">
                <div class="u-author-role-label"></div>
                <div class="u-author-roles">
                    <component
                        :is="item.url ? 'a' : 'span'"
                        class="u-author-role-item"
                        :href="item.url"
                        :target="item.url ? '_blank' : null"
                        :style="roleStyle(item)"
                        v-for="item in authorRoles"
                        :key="item.key"
                    >
                        <img class="u-author-role-icon" v-if="item.icon" :src="item.icon" />
                        <span class="u-author-role-content">
                            <span class="u-author-role-name">{{ item.name }}</span>
                            <span class="u-author-role-server" v-if="item.server">@{{ item.server }}</span>
                        </span>
                    </component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { authorLink, getMedalLink, showSchoolIcon } from "@jx3box/jx3box-common/js/utils";
import { getUserInfo, getUserMedals } from "../service/author.js";
import { getDecoration, getDecorationJson, getUserSkin } from "../service/cms.js";
import User from "@jx3box/jx3box-common/js/user";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import Avatar from "./Avatar.vue";
const ATCARD_CACHE_KEY = "skin_atcard_pc_authorcard_v2_";
const ATCARD_SUBTYPE = "pc_authorcard";
const DECORATION_JSON = "decoration_json";
const DECORATION_KEY = "decoration_me";
const HONOR_KEY = "honor_me";
const POSITION_MAP = {
    lt: "left top",
    mt: "center top",
    ct: "center top",
    rt: "right top",
    lm: "left center",
    ml: "left center",
    mm: "center center",
    cm: "center center",
    o: "center center",
    rm: "right center",
    mr: "right center",
    lb: "left bottom",
    mb: "center bottom",
    cb: "center bottom",
    rb: "right bottom",
};

const { __server, __imgPath, __userLevelColor, __cdn, __Root, __userLevel } = JX3BOX;
export default {
    name: "Author",
    components: {
        Avatar,
    },
    props: {
        uid: {
            type: [String, Number],
            required: true,
        },
        visible: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        data: null,
        medals: [],
        loading: false,
        bg: "",
        bgPosition: "right top",
        honor: "",
        honorStyle: {},
    }),
    computed: {
        super_author_icon: function () {
            return __imgPath + "image/user/" + "superauthor.svg";
        },
        isVip: function () {
            return this.data?.is_pro || this.data?.is_pre;
        },
        vipTypeTitle: function () {
            return this.data?.is_pro ? "专业版会员" : "高级版会员";
        },
        vipType: function () {
            return this.data?.is_pro ? "PRO" : "PRE";
        },
        level: function () {
            return User.getLevel(this.data && this.data.experience);
        },
        hasTrophy: function () {
            return this.medals.length;
        },
        isSuperAuthor: function () {
            return !!this.data?.sign;
        },
        authorRoles: function () {
            const roles = this.normalizeRoles(this.data?.public_roles);
            return roles.map(this.normalizeRole).filter((item) => item.name);
        },
        authorCardStyle: function () {
            return this.bg
                ? {
                      backgroundImage: `url(${this.bg})`,
                      backgroundPosition: this.bgPosition,
                  }
                : {};
        },
    },
    watch: {
        uid: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.loadData();
                    if (this.visible) {
                        this.getAtcard();
                    }
                    // this.getHonor();
                }
            },
        },
        visible: {
            handler(val) {
                if (val && this.uid) {
                    this.getAtcard();
                }
            },
        },
    },
    methods: {
        loadData: function () {
            const promises = [getUserInfo(this.uid), getUserMedals(this.uid)];
            this.loading = true;
            Promise.all(promises).then((res) => {
                this.data = res[0];
                this.medals = res[1];
                this.loading = false;
            });
        },
        loadUserInfo: function () {
            return getUserInfo(this.uid).then((data) => {
                this.data = data;
            });
        },
        loadMedals: function () {
            return getUserMedals(this.uid).then((data) => {
                this.medals = data;
            });
        },
        getAtcard() {
            const uid = this.uid;
            this.bg = "";
            this.bgPosition = "right top";

            const cached = this.getAtcardCache(uid);
            if (cached) {
                this.setAtcardBackground(cached === "no" ? null : cached);
                return;
            }

            getUserSkin({
                user_id: uid,
                type: "atcard",
            })
                .then((data) => {
                    if (this.uid !== uid) return;

                    let rows = data?.data?.data || [];
                    let skin = this.selectAtcardSkin(this.flattenUserSkins(rows));
                    let image = this.showDecorationImage(skin?.image);
                    if (!image) {
                        this.setAtcardCache(uid, "no");
                        this.bg = "";
                        return;
                    }
                    let payload = {
                        image,
                        position: this.resolveAtcardPosition(skin?.position),
                    };
                    this.setAtcardCache(uid, payload);
                    this.setAtcardBackground(payload);
                })
                .catch(() => {
                    if (this.uid === uid) {
                        this.bg = "";
                    }
                });
        },
        setAtcardBackground(val) {
            if (typeof val === "string") {
                this.bg = val || "";
                this.bgPosition = "right top";
                return;
            }
            this.bg = val?.image || "";
            this.bgPosition = val?.position || "right top";
        },
        getAtcardCache(uid) {
            let cached = sessionStorage.getItem(ATCARD_CACHE_KEY + uid);
            if (!cached) return null;
            if (cached === "no") return cached;
            try {
                return JSON.parse(cached);
            } catch (e) {
                sessionStorage.removeItem(ATCARD_CACHE_KEY + uid);
                return null;
            }
        },
        setAtcardCache(uid, val) {
            if (!uid) return;
            sessionStorage.setItem(ATCARD_CACHE_KEY + uid, val === "no" ? "no" : JSON.stringify(val));
        },
        flattenUserSkins(rows = []) {
            return rows.reduce((list, row) => {
                let skins = Array.isArray(row?.skins) ? row.skins : [];
                return list.concat(skins);
            }, []);
        },
        selectAtcardSkin(list = []) {
            let skins = list.filter((item) => item?.subtype === ATCARD_SUBTYPE && item?.image);
            let theme = this.getCurrentTheme();
            return (
                skins.find((item) => item?.theme === "all") ||
                skins.find((item) => item?.theme === theme) ||
                skins.find((item) => !item?.theme) ||
                null
            );
        },
        getCurrentTheme() {
            let theme =
                document.documentElement.getAttribute("data-theme") ||
                document.body?.getAttribute("data-theme") ||
                localStorage.getItem("__theme") ||
                "light";
            return String(theme || "light").toLowerCase() === "dark" ? "dark" : "light";
        },
        resolveAtcardPosition(position) {
            let key = String(position || "rt")
                .trim()
                .toLowerCase();
            return POSITION_MAP[key] || POSITION_MAP.rt;
        },
        getHonor() {
            this.honor = "";
            let user_id = this.uid;
            if (!user_id) {
                return;
            }
            let honor_local = sessionStorage.getItem(HONOR_KEY + user_id);
            if (honor_local == "no") return;
            //已有缓存，读取解析
            if (honor_local) {
                this.honor = honor_local;
                this.getHonorStyle();
                return;
            }
            getDecoration({ using: 1, user_id: user_id, type: "honor" }).then((data) => {
                let res = data.data.data;
                if (res.length == 0) {
                    //空 则为无主题，不再加载接口，界面设No
                    sessionStorage.setItem(HONOR_KEY + user_id, "no");
                    return;
                }
                let honor = res[0];
                sessionStorage.setItem(HONOR_KEY + user_id, honor.val);
                this.honor = honor.val;
                this.getHonorStyle();
            });
        },
        //有称号后，获取样式配置
        getHonorStyle() {
            let user_id = this.uid;
            let decoration_local = sessionStorage.getItem(DECORATION_KEY + user_id);
            if (decoration_local) {
                //解析本地缓存
                let decoration_parse = JSON.parse(decoration_local);
                if (!decoration_parse.status) return;

                if (decoration_parse) {
                    this.setHonorStyle(decoration_parse);
                    return;
                }
            }
            getDecoration({ using: 1, user_id: user_id, type: "homebg" }).then((data) => {
                let res = data.data.data;
                if (res.length == 0) {
                    //空 则为无主题，不再加载接口，界面设No
                    sessionStorage.setItem(DECORATION_KEY + user_id, JSON.stringify({ status: false }));
                    return;
                }
                let decoration = res[0];
                let decorationJson = sessionStorage.getItem(DECORATION_JSON);
                if (!decorationJson) {
                    //加载远程json，用于Honor颜色配置
                    getDecorationJson().then((json) => {
                        let decoration_json = json.data;
                        let theme = JSON.parse(JSON.stringify(decoration_json[decoration.val]));
                        theme.status = true;
                        sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify(theme));
                        //缓存远程JSON文件
                        sessionStorage.setItem(DECORATION_JSON, JSON.stringify(decoration_json));
                        this.setHonorStyle(theme);
                    });
                } else {
                    let theme = JSON.parse(decorationJson)[decoration.val];
                    theme.status = true;
                    sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify(theme));
                    this.setHonorStyle(theme);
                }
            });
        },
        setHonorStyle(style) {
            this.honorStyle = {
                "background-color": style.buttoncolor,
                color: style.buttontextcolor,
            };
        },

        showMedalIcon: function (val) {
            return __cdn + "/design/medals/user/" + val + ".webp";
        },
        medalLink: function ({ rank_id, medal_type = "rank" }) {
            return getMedalLink(rank_id, medal_type);
        },
        showMedalDesc: function (item) {
            return item.medal_desc || medal_map[item.medal];
        },
        showLevelColor: function (level) {
            return __userLevelColor[level];
        },
        showDecorationImage: function (val) {
            if (!val) return "";
            if (/^(https?:)?\/\//.test(val) || /^(data|blob):/.test(val)) return val;
            return __cdn.replace(/\/$/, "") + "/" + val.replace(/^\//, "");
        },
        normalizeRoles: function (roles) {
            if (!roles) return [];
            if (Array.isArray(roles)) return roles;
            if (typeof roles === "string") {
                try {
                    const parsed = JSON.parse(roles);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                    return roles
                        .split(/[,，]/)
                        .map((item) => item.trim())
                        .filter(Boolean);
                }
            }
            return [roles];
        },
        normalizeRole: function (role, index) {
            if (typeof role === "string") {
                return {
                    key: role + index,
                    name: role,
                };
            }

            const info = role?.role_info || role?.info || {};
            const name =
                role?.name ||
                role?.title ||
                role?.label ||
                role?.role_name ||
                role?.display_name ||
                role?.remark ||
                info?.name ||
                info?.title ||
                info?.label ||
                info?.role_name ||
                "";

            return {
                key: role?.id || role?.key || role?.val || name + index,
                name,
                server: role?.server || role?.role_server || role?.jx3_server || info?.server || info?.role_server || "",
                url: this.normalizeLink(role?.url || role?.link || role?.href || info?.url || info?.link || ""),
                icon: this.normalizeRoleIcon(role, info),
                color: role?.color || info?.color || "",
                backgroundColor: role?.background_color || role?.bg_color || info?.background_color || info?.bg_color || "",
                borderColor: role?.border_color || info?.border_color || "",
            };
        },
        normalizeRoleAsset: function (url) {
            if (!url) return "";
            url = String(url).trim();
            if (/^(https?:)?\/\//.test(url)) return url;
            return __cdn + url.replace(/^\/+/, "");
        },
        normalizeRoleIcon: function (role, info) {
            const mount = role?.mount || role?.school || role?.school_id || info?.mount || info?.school || info?.school_id || "";
            if (mount) return showSchoolIcon(mount);

            return this.normalizeRoleAsset(role?.icon || role?.logo || role?.image || info?.icon || info?.logo || "");
        },
        normalizeLink: function (url) {
            if (!url) return "";
            url = String(url).trim();
            if (/^(https?:)?\/\//.test(url)) return url;
            return __Root + url.replace(/^\/+/, "");
        },
        roleStyle: function (role) {
            return {
                color: role.color || null,
                backgroundColor: role.backgroundColor || null,
                borderColor: role.borderColor || null,
            };
        },
        authorLink,
    },
};
</script>

<style lang="less">
@import "../assets/css/module/author.less";
.w-author {
    .w-author-wrapper {
        width: 300px;
        min-width: 300px;
        max-width: 300px;
        padding: 12px;
        border: 1px solid rgba(132, 146, 166, 0.28);
        border-radius: 8px;
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: top right;
        background-size: 100% auto;
        box-shadow: 0 14px 34px rgba(31, 41, 55, 0.16), 0 2px 8px rgba(31, 41, 55, 0.08);
        &.is-no-atcard {
            border-color: rgba(124, 134, 156, 0.34);
            background: linear-gradient(180deg, #ffffff 0%, #f3f6fb 100%);
        }
        .u-author {
            padding: 4px 10px 12px 5px;
        }
        .u-avatar {
            .fl;
            .mr(12px);
            .size(60px);
        }
        .u-info {
            height: 60px;
        }
        img {
            border: none;
            margin: 0;
            padding: 0;
        }
        a {
            .lh(28px);
            text-decoration: none;
            &:hover {
                text-decoration: none;
                box-shadow: none;
            }
        }
        .u-displayname {
            .fz(15px);
            .nobreak;
            max-width: 190px;
            color: @color;
            .bold;
        }
    }
    .u-honor {
        .mt(2px);
        .dbi;
        .h(18px);
        background-color: #494038;
        color: #ffffff;
        .fz(12px,14px);
        padding: 2px 50px 2px 10px;
        .mb(15px);
        .r(2px);
    }
    .u-author-role {
        .mt(8px);
    }
    .u-author-role-label {
        margin: 0 0 8px 0;
        height: 1px;
        background-color: rgba(154, 167, 181, 0.28);
    }
    .u-author-roles {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .u-author-role-item {
        .flex(y);
        gap: 7px;
        max-width: 100%;
        min-height: 21px;
        color: #56677a;
        font-size: 12px;
        line-height: 21px;
        box-sizing: border-box;
        text-decoration: none;

        &:hover {
            .u-author-role-server {
                color: #fba524;
            }
        }
    }
    .u-author-role-icon {
        .size(20px);
        flex-shrink: 0;
        object-fit: contain;
    }
    .u-author-role-content {
        min-width: 0;
        display: flex;
        align-items: baseline;
    }
    .u-author-role-name {
        min-width: 0;
        margin-right: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #42566d;
        font-size: 12px;
        font-weight: 400;
    }
    .u-author-role-server {
        flex-shrink: 0;
        color: #fba524;
        font-size: 12px;
        font-weight: 400;
    }
}
</style>
