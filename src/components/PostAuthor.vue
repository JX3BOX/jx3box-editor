<!--
 * @Author: iRuxu
 * @Date: 2022-07-17 00:13:35
 * @LastEditTime: 2022-07-17 00:40:25
 * @Description:
-->
<template>
    <div class="w-author w-author__post" v-loading="loading">
        <div class="w-author-wrapper el-popover" v-if="data">
            <div class="u-meta">
                <span class="u-meta-label">作者</span>
                <span class="u-meta-value">
                    <a class="u-user" :href="authorLink(data.user_id)" target="_blank">
                        <Avatar class="u-user-avatar" :uid="data.user_id" :url="data.user_info.user_avatar" :size="32" />
                        <span class="u-user-name">{{ data.user_info.display_name }}</span>
                    </a>
                </span>
            </div>
            <div class="u-meta">
                <div class="u-meta-label">更新</div>
                <div class="u-meta-value">
                    {{ formatTime(data.created_at) }}
                </div>
            </div>
            <div class="u-meta">
                <div class="u-meta-label">信息</div>
                <div class="u-meta-value">{{ data.desc }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { authorLink } from "@jx3box/jx3box-common/js/utils";
import { getEmotion } from "../service/author";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import dayjs from "dayjs";
import Avatar from "./common/Avatar.vue";

const { __server, __imgPath, __userLevelColor } = JX3BOX;
export default {
    name: "PostAuthor",
    components: {
        Avatar,
    },
    props: ["id"],
    data: () => ({
        data: null,
        loading: false,
    }),
    computed: {},
    watch: {
        id: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.loadData();
                }
            },
        },
    },
    methods: {
        authorLink,
        loadData() {
            this.loading = true;
            getEmotion(this.id).then((res) => {
                this.data = res.data.data;
                this.loading = false;
            });
        },
        formatTime(val) {
            return (val && dayjs(val).format("YYYY-MM-DD HH:mm:ss")) || "";
        },
    },
};
</script>

<style scoped lang="less">
@import ".././assets/css/resource.less/module/author.less";
.w-author {
    .u-meta {
        display: flex;
        align-items: center;
        .fz(12px,24px);
        .h(24px);
        .mb(5px);
    }
    .u-meta-label {
        .mr(10px);
        background-color: #f6f8fa;
        padding: 0 8px;
        .r(2px);
    }
    .u-meta-value,
    .u-user {
        display: flex;
        align-items: center;
    }
    .u-user-avatar {
        .size(24px);
        .mr(5px);
    }
}
</style>
