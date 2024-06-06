<template>
    <div class="m-pvp-martial">
        <div v-for="kungfu in kungfus" :key="kungfu" class="m-martial-skill">
            <div class="u-title">
                <span class="u-title-name">{{ showKungfuName(kungfu) }}</span>
                <img src="../../assets/img/skillset.png" class="u-title-img" alt="" />
            </div>
            <div class="m-skills" v-if="kungfusSkills[kungfu]">
                <div class="m-skill" v-for="(skill, index) in formatSkill(kungfusSkills[kungfu])" :key="index" @click="selectSkill(skill)">
                    <div class="u-skill" v-if="skill && skill.IconID">
                        <img
                            class="u-skill-icon"
                            :src="iconLink(skill.IconID)"
                            :alt="skill.IconID"
                        />
                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 奇穴技能 -->
        <div class="m-martial-skill" v-if="talentSkills && talentSkills.length">
            <div class="u-title">
                <span class="u-title-name">奇穴技能</span>
                <img src="../../assets/img/skillset.png" class="u-title-img" alt="" />
            </div>
            <div class="m-skills">
                <div class="m-skill" v-for="(skill, index) in talentSkills" :key="index" @click="selectSkill(skill)">
                    <div class="u-skill" v-if="skill && skill.IconID">
                        <img
                            class="u-skill-icon"
                            :src="iconLink(skill.IconID)"
                            :alt="skill.IconID"
                        />
                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 江湖轻功 -->
        <div class="m-martial-skill">
            <div class="u-title">
                <span class="u-title-name">江湖轻功</span>
                <img src="../../assets/img/skillset.png" class="u-title-img" alt="" />
            </div>
            <div class="m-skills">
                <div class="m-skill" v-for="(skill, index) in commonSkills" :key="index" @click="selectSkill(skill)">
                    <div class="u-skill" v-if="skill && skill.IconID">
                        <img
                            class="u-skill-icon"
                            :src="iconLink(skill.IconID)"
                            :alt="skill.IconID"
                        />
                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { getSkills, getTalents } from "../../service/node";
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
            talents: [],
            data: [],
            loading: false,
        };
    },
    computed: {
        mountId() {
            return xfmap[this.subtype]?.id;
        },
        skillIds() {
            return flattenDeep(Object.values(this.kungfumap?.[this.mountId]?.["skills"]));
        },
        ids() {
            return [...this.skillIds, ...this.talentSkillIds, ...this.commonIds].join(",");
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
            return flattenDeep(this.mountId && this.talents?.[this.mountId]) || [];
        },
        // 手动写死
        commonIds() {
            // 后撤、蹑云逐月、扶摇直上、凌霄揽胜、瑶台枕鹤、迎风回浪
            return [9007, 9003, 9002, 9005, 9006, 9004];
        },
        // 门派技能数据
        kungfusSkills: function () {
            const obj = {};
            Object.entries(this.kungfumap[this.mountId]["skills"]).forEach(([key, value]) => {
                obj[key] = value.map((SkillID) => {
                    const currentSkill = this.data.find((d) => d.SkillID == SkillID);
                    return currentSkill;
                });
            });
            return obj;
        },
        // 门派技能套路id
        kungfus: function () {
            return this.kungfumap[this.mountId]["kungfus"];
        },
        talentSkills() {
            return this.talentSkillIds.map((SkillID) => {
                const currentSkill = this.data.find((d) => d.SkillID == SkillID);
                return currentSkill;
            }).filter(item => item && item.IsPassiveSkill == 0);
        },
        commonSkills() {
            return this.commonIds.map((SkillID) => {
                const currentSkill = this.data.find((d) => d.SkillID == SkillID);
                return currentSkill;
            }).filter(Boolean);
        }
    },
    async mounted() {
        this.talents = await getTalents();
        await this.loadSkills();
    },
    watch: {
        mountId: {
            handler() {
                this.loadSkills();
            },
        },
    },
    methods: {
        iconLink,
        async loadSkills() {
            this.loading = true;
            return getSkills(this.params)
                .then((res) => {
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
            this.$emit('selectSkill', skill);
        },
        formatSkill(arr) {
            return arr.filter(item => item?.SkillID)
        }
    },
};
</script>

<style lang="less">

</style>
