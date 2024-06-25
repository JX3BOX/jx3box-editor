<template>
    <div class="m-pvp-martial">
        <div class="u-platform-select" v-if="client == 'std'">
            <div
                class="u-platform-option"
                :class="{ 'is-select': platform == 1 }"
                @click="platform = 1"
                >旗舰端</div
            >
            <div
                class="u-platform-option"
                :class="{ 'is-select': platform == 2 }"
                @click="platform = 2"
                >无界端</div
            >
        </div>
        <div class="u-skill-list">
            <!-- 旗舰端技能列表 -->
            <template v-if="platform == 1">
                <div
                    v-for="kungfu in kungfus"
                    :key="kungfu"
                    class="m-martial-skill">
                    <div class="u-title">
                        <span class="u-title-name">{{
                            showKungfuName(kungfu)
                        }}</span>
                        <img
                            src="../../assets/img/skillset.png"
                            class="u-title-img"
                            alt="" />
                    </div>
                    <div class="m-skills" v-if="kungfusSkills[kungfu]">
                        <div
                            class="m-skill"
                            v-for="(skill, index) in formatSkill(
                                kungfusSkills[kungfu]
                            )"
                            :key="index"
                            @click="selectSkill(skill)">
                            <div class="u-skill" v-if="skill && skill.IconID">
                                <img
                                    class="u-skill-icon"
                                    :src="iconLink(skill.IconID)"
                                    :alt="skill.IconID" />
                                <span class="u-name" :title="skill.Name">{{
                                    skill.Name
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 奇穴技能 -->
                <div
                    class="m-martial-skill"
                    v-if="talentSkills && talentSkills.length">
                    <div class="u-title">
                        <span class="u-title-name">奇穴技能</span>
                        <img
                            src="../../assets/img/skillset.png"
                            class="u-title-img"
                            alt="" />
                    </div>
                    <div class="m-skills">
                        <div
                            class="m-skill"
                            v-for="(skill, index) in talentSkills"
                            :key="index"
                            @click="selectSkill(skill)">
                            <div class="u-skill" v-if="skill && skill.IconID">
                                <img
                                    class="u-skill-icon"
                                    :src="iconLink(skill.IconID)"
                                    :alt="skill.IconID" />
                                <span class="u-name" :title="skill.Name">{{
                                    skill.Name
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 江湖轻功 -->
                <div class="m-martial-skill">
                    <div class="u-title">
                        <span class="u-title-name">江湖轻功</span>
                        <img
                            src="../../assets/img/skillset.png"
                            class="u-title-img"
                            alt="" />
                    </div>
                    <div class="m-skills">
                        <div
                            class="m-skill"
                            v-for="(skill, index) in commonSkills"
                            :key="index"
                            @click="selectSkill(skill)">
                            <div class="u-skill" v-if="skill && skill.IconID">
                                <img
                                    class="u-skill-icon"
                                    :src="iconLink(skill.IconID)"
                                    :alt="skill.IconID" />
                                <span class="u-name" :title="skill.Name">{{
                                    skill.Name
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <!-- 无界端技能列表 -->
            <template v-else-if="platform == 2">
                <!-- 门派技能 -->
                <div class="m-martial-skill" v-if="wujie_data.mount.length">
                    <div class="u-title">
                        <span class="u-title-name">门派技能</span>
                        <img
                            src="../../assets/img/skillset.png"
                            class="u-title-img"
                            alt="" />
                    </div>
                    <div class="m-skills">
                        <div
                            class="m-skill"
                            v-for="(skill, index) in formatSkill(
                                wujie_data.mount
                            )"
                            :key="index"
                            @click="selectSkill(skill)">
                            <div class="u-skill" v-if="skill && skill.IconID">
                                <img
                                    class="u-skill-icon"
                                    :src="iconLink(skill.IconID)"
                                    :alt="skill.IconID" />
                                <span class="u-name" :title="skill.Name">{{
                                    skill.Name
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 通用技能 -->
                <div class="m-martial-skill">
                    <div class="u-title">
                        <span class="u-title-name">通用技能</span>
                        <img
                            src="../../assets/img/skillset.png"
                            class="u-title-img"
                            alt="" />
                    </div>
                    <div class="m-skills">
                        <div
                            class="m-skill"
                            v-for="(skill, index) in formatSkill(
                                wujie_data.common
                            )"
                            :key="index"
                            @click="selectSkill(skill)">
                            <div class="u-skill" v-if="skill && skill.IconID">
                                <img
                                    class="u-skill-icon"
                                    :src="iconLink(skill.IconID)"
                                    :alt="skill.IconID" />
                                <span class="u-name" :title="skill.Name">{{
                                    skill.Name
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import {
    getSkills,
    getTalents,
    getMobileForceSkillList,
} from "../../service/node";
import kungfumap_std from "@jx3box/jx3box-data/data/martial/kungfu_std.json";
import kungfumap_origin from "@jx3box/jx3box-data/data/martial/kungfu_origin.json";
import { flattenDeep, uniqBy } from "lodash";
import kungfus from "@jx3box/jx3box-data/data/martial/kungfuid.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "pvp_martial",
    props: {
        subtype: {
            type: String,
            default: "通用",
        },
        client: {
            type: String,
            default: "std",
        },
    },
    emits: [],
    data() {
        return {
            platform: 1,
            talents: [],
            data: [],

            wujie_data: {
                common: [],
                mount: [],
            },
            loading: false,
        };
    },
    computed: {
        mountId() {
            return xfmap[this.subtype]?.id;
        },
        skillIds() {
            return flattenDeep(
                Object.values(this.kungfumap?.[this.mountId]?.["skills"])
            );
        },
        ids() {
            return [
                ...this.skillIds,
                ...this.talentSkillIds,
                ...this.commonIds,
            ].join(",");
        },
        kungfumap() {
            return this.client == "origin" ? kungfumap_origin : kungfumap_std;
        },
        params() {
            return {
                ids: this.ids,
                client: this.client,
            };
        },
        // 奇穴id std
        talentSkillIds() {
            return (
                flattenDeep(this.mountId && this.talents?.[this.mountId]) || []
            );
        },
        // 手动写死
        commonIds() {
            // 后撤、蹑云逐月、扶摇直上、凌霄揽胜、瑶台枕鹤、迎风回浪
            return [9007, 9003, 9002, 9005, 9006, 9004];
        },
        // 门派技能数据
        kungfusSkills: function () {
            const obj = {};
            Object.entries(this.kungfumap[this.mountId]["skills"]).forEach(
                ([key, value]) => {
                    obj[key] = value.map(SkillID => {
                        const currentSkill = this.data.find(
                            d => d.SkillID == SkillID
                        );
                        return currentSkill;
                    });
                }
            );
            return obj;
        },
        // 门派技能套路id
        kungfus: function () {
            return this.kungfumap[this.mountId]["kungfus"];
        },
        talentSkills() {
            return this.talentSkillIds
                .map(SkillID => {
                    const currentSkill = this.data.find(
                        d => d.SkillID == SkillID
                    );
                    return currentSkill;
                })
                .filter(item => item && item.IsPassiveSkill == 0);
        },
        commonSkills() {
            return this.commonIds
                .map(SkillID => {
                    const currentSkill = this.data.find(
                        d => d.SkillID == SkillID
                    );
                    return currentSkill;
                })
                .filter(Boolean);
        },
    },
    async mounted() {
        this.talents = await getTalents();
        await this.loadSkills();
        getMobileForceSkillList(0).then(res => {
            this.wujie_data.common = res.data.data
                ?.map(s => s.skill)
                .filter(Boolean);
        });
    },
    watch: {
        mountId: {
            handler() {
                this.loadSkills();
            },
        },
        subtype: {
            handler() {
                if (this.client != "std") return;
                const force_id = xfmap[this.subtype]?.force;
                if (!force_id) return;
                getMobileForceSkillList(force_id).then(res => {
                    this.wujie_data.mount = res.data.data
                        ?.map(s => s.skill)
                        .filter(Boolean);
                });
            },
            immediate: true,
        },
        client(val) {
            if (val == "origin") {
                this.platform = 1;
                return;
            }
            const force_id = xfmap[this.subtype]?.force;
            if (!force_id) return;
            getMobileForceSkillList(force_id).then(res => {
                this.wujie_data.mount = res.data.data
                    ?.map(s => s.skill)
                    .filter(Boolean);
            });
        },
    },
    methods: {
        iconLink,
        async loadSkills() {
            this.loading = true;
            return getSkills(this.params)
                .then(res => {
                    this.data = uniqBy(res.data, "Name");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 技能套路名称
        showKungfuName: function (val) {
            return kungfus[val];
        },
        selectSkill(skill) {
            this.$emit("selectSkill", skill);
        },
        formatSkill(arr) {
            return arr.filter(item => item?.SkillID);
        },
    },
};
</script>

<style lang="less"></style>
