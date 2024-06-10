<template>
    <div class="c-combo m-resource-combo">
        <el-tabs v-model="activeName" type="card" class="m-skill-tabs">
            <el-tab-pane label="门派武学" name="special">
                <template #label>
                    <div class="u-tab-label">
                        <i class="el-icon-s-order"></i>
                        <b>门派武学</b>
                    </div>
                </template>
            </el-tab-pane>
            <el-tab-pane label="全部技能" name="all">
                <template #label>
                    <div class="u-tab-label">
                        <i class="el-icon-menu"></i>
                        <b>全部技能</b>
                    </div>
                </template>
            </el-tab-pane>
        </el-tabs>
        <div class="c-combo-content">
            <div class="m-select-content">
                <div v-show="activeName === 'all'">
                    <div v-if="total && done" class="m-resource-count">
                        <i class="el-icon-s-data"></i> 共找到 <b>{{ total }}</b> 条记录
                    </div>
                    <ul class="m-resource-list">
                        <li v-for="(o, i) in skill" class="u-item" :key="i" @click="selectSkill(o, i)" ref="skill">
                            <span class="u-id">ID:{{ o.SkillID }}</span>
                            <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                            <span class="u-primary">
                                <span class="u-name">
                                    {{ o.Name }}
                                    <em v-if="o.SkillName">({{ o.SkillName }})</em>
                                </span>
                                <span class="u-content">
                                    {{ filterRaw(o.Desc) }}
                                </span>
                            </span>
                        </li>
                    </ul>
                    <el-alert v-if="!skill.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>

                    <template v-if="multipage">
                        <!-- 下一页 -->
                        <el-button class="m-archive-more" :class="{ show: hasNextPage }" type="primary" icon="el-icon-arrow-down" @click="appendPage">加载更多</el-button>
                        <!-- 分页 -->
                        <el-pagination
                            class="m-archive-pages"
                            background
                            layout="total, prev, pager, next,jumper"
                            :hide-on-single-page="true"
                            :page-size="per"
                            :total="total"
                            :current-page.sync="page"
                            @current-change="changePage"
                        ></el-pagination>
                    </template>

                    <div class="m-database-tip" v-show="isBlank">❤ 请输入搜索条件查询</div>
                </div>
                <skill-martial v-show="activeName === 'special'" :client="client" :subtype="subtype" @selectSkill="selectSkill"></skill-martial>
            </div>

            <div class="c-combo-content__right">
                <!-- 已选技能 -->
                <el-divider>已选技能
                    <!-- <el-checkbox v-model="sort" border size="small">开启排序</el-checkbox> -->
                </el-divider>
                <div class="m-selected-skills">
                    <ul class="m-skills-list">
                        <li v-for="(skill, index) in selected" :key="skill.SkillID + '' + index" class="m-skill" @contextmenu.prevent="(event) => onContextmenu(event, skill)">
                            <div class="u-skill" v-if="skill && skill.IconID">
                                <img class="u-skill-icon" :src="iconURL(skill.IconID)" :alt="skill.IconID" />
                                <i class="u-gcd-icon" v-show="skill.WithoutGcd">
                                    <i class="el-icon-time"></i>
                                </i>
                                <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                                <span class="u-note" :title="skill.n" :style="itemStyle(skill)">{{ skill.n }}</span>
                            </div>
                            <i class="u-remove-icon" title="移除" @click="removeSelected(index)"><i class="el-icon-close"></i></i>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="showRemark" width="600px" append-to-body v-draggable class="c-large-dialog" title="设置备注">
            <el-form label-position="left" label-width="80px">
                <el-form-item label="备注">
                    <el-input placeholder="输入备注" v-model="form.n"></el-input>
                </el-form-item>
                <el-form-item label="文字颜色">
                    <el-color-picker v-model="form.c" :predefine="predefineColors" show-alpha></el-color-picker>
                </el-form-item>
                <el-form-item label="文字大小">
                    <el-input v-model="form.fz"></el-input>
                </el-form-item>
                <el-form-item label="文字粗细">
                    <el-select v-model="form.fw">
                        <el-option v-for="i in 9" :key="i" :value="i * 100" :label="i * 100"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预览">
                    <span :style="nStyle">{{ form.n || '示例文字' }}</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="showRemark = false">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定
				</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
import Vue from "vue";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { getSkill } from "../../service/resource";
import SkillMartial from "./SkillMartial.vue";

import Sortable from "sortablejs";
import { cloneDeep, pick } from "lodash";

import LoadScript from "vue-plugin-load-script";
Vue.use(LoadScript);

import contextmenu from "vue-contextmenujs";
Vue.use(contextmenu);
export default {
    name: "ComboSkill",
    components: {
        SkillMartial,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        subtype: {
            type: String,
            default: "通用",
        },
        query: {
            type: String,
            default: "",
        },
        client: {
            type: String,
            default: "std",
        },
        strict: {
            type: Boolean,
            default: false,
        },
    },
    model: {
        prop: "modelValue",
        event: "update:modelValue",
    },
    data() {
        return {
            skill: [],
            done: false,
            per: 10,
            page: 1,
            total: 1,
            pages: 1,

            activeName: "special",
            selected: [],

            sort: false,

            form: {
                n: "",
                c: "",
                fz: "14",
                fw: "500"
            },
            showRemark: false,
            currentSkill: {},

            predefineColors: [
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577',
            ]
        };
    },
    computed: {
        hasNextPage: function () {
            return this.total > 1 && this.page < this.pages;
        },
        multipage: function () {
            return this.done && this.pages > 1;
        },
        isBlank: function () {
            return !this.query && !this.skill["length"];
        },
        nStyle() {
            return pick({
                color: this.form.c,
                fontSize: (this.form.fz || 12) + 'px',
                fontWeight: this.form.fw
            }, ['color','fontSize','fontWeight'])
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initSkillSort();
        });
    },
    methods: {
        getData(page = 1, append = false) {
            if (!this.query) return;

            this.loading = true;
            this.per = 10;
            this.done = false;
            let query = this.query;
            let params = {
                strict: ~~this.strict,
                per: this.per,
                page: page,
                client: this.client,
            };

            getSkill(query, params)
                .then((data) => {
                    if (!append) this.skill = [];
                    const list = this.transformData(data.list || []);
                    this.pages = data.pages;
                    this.total = data.total;
                    this.skill = this.skill.concat(list);
                })
                .finally(() => {
                    this.done = true;
                    this.loading = false;
                });
        },
        selectSkill: function (o) {
            this.selected.push(o);
        },
        removeSelected: function (index) {
            this.selected.splice(index, 1);
        },
        submit() {
            this.$emit("submit", this.selected);
            this.close();
            this.selected = [];
        },
        close() {
            this.$emit("update:modelValue", false);
        },
        iconURL: function (id) {
            return iconLink(id, this.client);
        },
        filterRaw: function (str) {
            return str && str.replace(/\\n/g, "\n");
        },
        search: function () {
            this.page = 1;
            this.getData();
        },
        appendPage: function () {
            this.getData(++this.page, true);
        },
        changePage: function (i) {
            this.getData(i);
        },
        transformData: function (data) {
            data.forEach((item) => {
                item.isSelected = false;
            });
            return data;
        },
        initSkillSort() {
            const el = document.querySelector(`.m-selected-skills .m-skills-list`);
            if (!el) return;
            const _this = this;
            const sortSkills = Sortable.create(el, {
                animation: 200,
                forceFallback: true,
                onEnd({ newIndex, oldIndex }) {
                    const newSkills = cloneDeep(_this.selected);
                    const [removed] = newSkills.splice(oldIndex, 1);
                    newSkills.splice(newIndex, 0, removed);
                    _this.selected = newSkills;
                },
            });
        },
        onContextmenu(event, skill) {
            this.$contextmenu({
                items: [
                    {
                        label: !skill?.WithoutGcd ? "设置为无GCD技能" : "设置为有GCD技能",
                        onClick: () => {
                            this.$set(skill, "WithoutGcd", !skill.WithoutGcd);
                        },
                        icon: !skill?.WithoutGcd ? "el-icon-check" : "el-icon-close",
                    },
                    {
                        label: "备注",
                        onClick: () => {
                            this.showRemark = true;
                            this.currentSkill = skill
                            // this.$prompt("请输入备注", "备注", {
                            //     confirmButtonText: "确定",
                            //     cancelButtonText: "取消",
                            //     inputValue: skill?.n || "",
                            //     // 最长4个字
                            //     inputValidator: (value) => {
                            //         return value.length <= 4;
                            //     },
                            // })
                            //     .then(({ value }) => {
                            //         this.$set(skill, "n", value);
                            //     })
                            //     .catch(() => {});
                        },
                    }
                ],
                event,
                customClass: "custom-class",
                zIndex: 99999,
                minWidth: 200,
            });
            return false;
        },
        renderVal() {
            const { selected } = this;
            let skills_html = "";
            selected.forEach((item) => {
                const obj = {
                    gcd: item.WithoutGcd ? 0 : 1,
                };
                item.n && (obj.n = item.n);
                item.c && (obj.c = item.c);
                item.fz && (obj.fz = item.fz);
                item.fw && (obj.fw = item.fw);

                item.client = this.client;
                skills_html += `<li class="w-skill-combo-item">${item.SkillID},${item.Name},${item.IconID},${JSON.stringify(obj)}</li>`;
            });
            const html = `<ul class="e-skill-combo w-skill-combo">${skills_html}</ul>`;
            return html;
        },
        confirm() {
            if (this.form.n) {
                this.$set(this.currentSkill, 'n', this.form.n);
                this.$set(this.currentSkill, 'c', this.form.c);
                this.$set(this.currentSkill, 'fz', this.form.fz);
                this.$set(this.currentSkill, 'fw', this.form.fw);
            }

            this.showRemark = false
        },
        itemStyle(item) {
            return pick({
                color: item.c,
                fontSize: (item.fz || 12) + 'px',
                fontWeight: item.fw
            }, ['color','fontSize','fontWeight'])
        }
    },
};
</script>

<style lang="less">
@import "../../assets/css/combo.less";
</style>
