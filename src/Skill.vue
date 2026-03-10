<template>
    <div class="w-skill" v-if="data">
        <div class="w-skill-wrapper">
            <img
                class="w-skill-icon"
                :src="iconLink(data.IconID || 13)"
                :alt="data.Name"
            />
            <div class="w-skill-content">
                <el-button
                    type="text"
                    class="w-skill-switch-parse"
                    @click="show_parse = !show_parse"
                >
                    <i class="el-icon-refresh"></i>
                </el-button>
                <span class="w-skill-name">{{ data.Name }}</span>
                <span class="w-skill-desc">{{ desc }}</span>
                <div class="w-skill-talent">{{ talent_desc }}</div>
                <span class="w-skill-meta">ID : {{ data.SkillID }}</span>
                <span class="w-skill-meta">Level : {{ data.Level }}</span>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { getSkill } from "./service/database.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Skill",
    props: ["client", "id", "level"],
    data: () => ({
        data: null,
        show_parse: true,
    }),
    computed: {
        params: function () {
            return [this.client, this.id, this.level];
        },
        desc: function () {
            if (this.data.parse && this.show_parse) {
                const result = this.data.parse.desc;
                return result.replace(/\\n/g, "\n");
            }
            return this.data?.Desc;
        },
        talent_desc: function () {
            if (this.data.parse && this.show_parse) {
                return this.data.parse.talent_desc;
            }
            return "";
        },
    },
    watch: {
        params: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val) {
                    let [client, id, level] = val;
                    // 读取本地数据
                    const cache = sessionStorage.getItem(
                        `skill-${client}-${id}-${level}`
                    );
                    if (cache) {
                        try {
                            this.data = JSON.parse(cache);
                            return;
                        } catch {}
                        // 没有缓存则发起请求获取数据
                    }
                    if (!id) return;
                    getSkill(...this.params).then(res => {
                        let data = res.data?.list?.[0];
                        if (!data) data = null;
                        this.data = data;

                        // 将数据放入 sessionStorage
                        sessionStorage.setItem(
                            `skill-${client}-${id}-${level}`,
                            JSON.stringify(data)
                        );
                    });
                }
            },
        },
    },
    methods: {
        iconLink: function (id) {
            return iconLink(id, this.client);
        },
    },
};
</script>

<style lang="less">
@import "./assets/css/resource.less/module/skill.less";
</style>
