<template>
    <div class="c-resource">
        <!-- 上传触发按钮 -->
        <el-button class="u-switch" type="primary" @click="openDialog" :disabled="!enable"> <img class="u-icon" svg-inline src="./assets/img/jx3.svg" />剑三资源 </el-button>

        <!-- 弹出界面 -->
        <el-dialog class="c-large-dialog" title="剑三数据库" v-model="dialogVisible" draggable>
            <div class="c-resource-content" v-loading="loading">
                <div class="m-database-search">
                    <el-radio-group class="u-client" v-model="client" @change="search" size="large">
                        <el-radio-button value="std">重制</el-radio-button>
                        <el-radio-button value="origin">缘起</el-radio-button>
                    </el-radio-group>
                    <el-input size="large" class="u-input" placeholder="请输入 ID 或 名称" v-model="query" @change="search" @keyup.enter="search">
                        <template #prepend>ID ／名称</template>
                        <template #append v-if="isPC">
                            <el-switch v-model="strict" active-text="精确匹配" @change="search" title="仅对Buff/Skill有效"></el-switch>
                        </template>
                    </el-input>
                </div>

                <el-tabs class="m-database-tabs" v-model="type" type="card" @tab-click="changeType">
                    <el-tab-pane label="Buff" name="buff">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="./assets/img/buff.svg" />
                                <b>Buff</b>
                                <em class="u-count">{{ stat.buff }}</em>
                            </span>
                        </template>
                        <div v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon>
                            共找到 <b>{{ total }}</b> 条记录
                            <div class="u-mode">
                                插入模式：
                                <el-radio-group v-model="buff_mode" size="small" @change="changeMode">
                                    <el-radio-button value="simple">简版</el-radio-button>
                                    <el-radio-button value="full">完整版</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                        <ul class="m-resource-list">
                            <li
                                v-for="(o, i) in buff"
                                :key="o.BuffID || i"
                                class="u-item"
                                :class="{ on: !!o.isSelected }"
                                @click="selectBuff(o, i)"
                                :ref="(el) => setResultItemRef('buff', i, el)"
                            >
                                <span class="u-id">
                                    ID:{{ o.BuffID }}
                                    <span class="u-detach">{{ showDetachType(o.DetachType) }}</span>
                                </span>
                                <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                                <span class="u-primary">
                                    <span class="u-name">
                                        {{ o.Name }}
                                        <em v-if="o.BuffName">({{ o.BuffName }})</em>
                                    </span>
                                    <span class="u-content">{{ o.Desc }}</span>
                                </span>
                            </li>
                        </ul>
                        <el-alert v-if="!buff.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>
                    </el-tab-pane>
                    <el-tab-pane label="技能" name="skill">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="./assets/img/skill.svg" />
                                <b>技能</b>
                                <em class="u-count">{{ stat.skill }}</em>
                            </span>
                        </template>
                        <div v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon>
                            共找到 <b>{{ total }}</b> 条记录
                            <div class="u-mode">
                                插入模式：
                                <el-radio-group v-model="skill_mode" size="small" @change="changeMode">
                                    <el-radio-button value="simple">简版</el-radio-button>
                                    <el-radio-button value="full">完整版</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                        <ul class="m-resource-list">
                            <li
                                v-for="(o, i) in skill"
                                :key="o.SkillID || i"
                                class="u-item"
                                :class="{ on: !!o.isSelected }"
                                @click="selectSkill(o, i)"
                                :ref="(el) => setResultItemRef('skill', i, el)"
                            >
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
                    </el-tab-pane>
                    <el-tab-pane label="物品" name="item">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="./assets/img/item.svg" />
                                <b>物品</b>
                                <em class="u-count">{{ stat.item }}</em>
                            </span>
                        </template>
                        <p v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon>
                            共找到 <b>{{ total }}</b> 条记录
                        </p>
                        <ul class="m-resource-list" v-if="item.length">
                            <el-popover popper-class="m-item-pop" :visible-arrow="false" trigger="hover" placement="left" v-for="(o, i) in item" :key="o.id">
                                <template #reference>
                                    <li class="u-item" :class="{ on: o.isSelected }" @click="selectItem(o, i)" :ref="(el) => setResultItemRef('item', i, el)">
                                        <span class="u-id">ID:{{ o.id }}</span>
                                        <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                                        <span class="u-name">{{ o.Name }}</span>
                                        <span class="u-content">
                                            <game-text :text="o.Desc"></game-text>
                                        </span>
                                        <span class="u-remark">
                                            {{ o.Requirement }}
                                        </span>
                                    </li>
                                </template>

                                <jx3-item :item_id="o.id" :client="client"></jx3-item>
                            </el-popover>
                        </ul>
                        <el-alert v-if="!item.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>
                    </el-tab-pane>
                    <el-tab-pane label="Npc" name="npc">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="./assets/img/npc/skull.svg" />
                                <b>Npc</b>
                                <em class="u-count">{{ stat.npc }}</em>
                            </span>
                        </template>
                        <p v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon>
                            共找到 <b>{{ total }}</b> 条记录
                        </p>
                        <ul class="m-resource-list" v-if="npc.length">
                            <li
                                v-for="(o, i) in npc"
                                :key="o.ID || i"
                                class="u-item"
                                :class="{ on: o.isSelected }"
                                @click="selectNpc(o, i)"
                                :ref="(el) => setResultItemRef('npc', i, el)"
                            >
                                <span class="u-id">ID:{{ o.ID }}</span>
                                <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                                <span class="u-name">
                                    {{ o.Name }}
                                    <em v-if="o.Level">(等级：{{ o.Level }})</em>
                                </span>
                                <span class="u-content">
                                    <span class="u-map">地图：{{ o.MapName }}</span>
                                    <span class="u-life">血量：{{ o.MaxLife }}</span>
                                    <span class="u-mana">内力：{{ o.MaxMana }}</span>
                                </span>
                                <span class="u-remark">
                                    {{ o.Requirement }}
                                </span>
                            </li>
                        </ul>
                        <el-alert v-if="!npc.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>
                    </el-tab-pane>
                    <el-tab-pane label="图标" name="icon">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="./assets/img/icons.svg" />
                                <b>图标</b>
                                <em class="u-count">{{ stat.icon }}</em>
                            </span>
                        </template>
                        <p v-if="icon.length && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon>
                            共找到 <b>{{ icon.length }}</b> 条记录
                        </p>
                        <ul class="m-resource-iconlist">
                            <li
                                v-for="(o, i) in icon"
                                :key="o.iconID || i"
                                class="u-item"
                                :class="{ on: !!o.isSelected }"
                                @click="selectIcon(o)"
                                :ref="(el) => setResultItemRef('icon', i, el)"
                            >
                                <!-- <el-tooltip
                                    effect="dark"
                                    :content="o.Name || query"
                                    placement="top"
                                >-->
                                <img class="e-jx3-icon" :src="iconURL(o.iconID)" :alt="query" />
                                <!-- </el-tooltip> -->
                            </li>
                        </ul>
                        <el-alert v-if="!icon.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>
                    </el-tab-pane>
                </el-tabs>

                <template v-if="multipage">
                    <!-- 下一页 -->
                    <el-button class="m-archive-more" :class="{ show: hasNextPage }" type="primary" icon="ArrowDown" @click="appendPage" size="large">加载更多</el-button>
                    <!-- 分页 -->
                    <el-pagination
                        class="m-archive-pages"
                        background
                        layout="total, prev, pager, next,jumper"
                        :hide-on-single-page="true"
                        :page-size="per"
                        :total="total"
                        v-model:current-page="page"
                        @current-change="changePage"
                    ></el-pagination>
                </template>

                <div class="m-database-tip" v-show="isBlank">❤ 请输入搜索条件查询</div>
            </div>

            <!-- 插入按钮 -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="large">取 消</el-button>
                    <el-button type="primary" @click="insert" size="large">
                        {{ buttonTXT }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ArrowDown, Histogram } from "@element-plus/icons-vue";
import { loadResource, loadStat, getIcons } from "./service/database";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import detach_types from "./assets/data/detach_type.json";
import { iconLink, getLink as resolveLink } from "@jx3box/jx3box-common/js/utils";
import GameText from "./GameText.vue";
import Item from "./Item.vue";

const { __iconPath, __Root, __OriginRoot } = JX3BOX;
const RESULT_REF_TYPES = ["buff", "skill", "item", "icon", "npc"];

const createResultItemRefs = () =>
    RESULT_REF_TYPES.reduce((refs, type) => {
        refs[type] = [];
        return refs;
    }, {});

export default {
    name: "Resource",
    components: {
        ArrowDown,
        Histogram,
        GameText,
        Jx3Item: Item,
    },
    props: {
        enable: {
            type: Boolean,
            default: true,
        },
    },
    emits: ["insert", "update"],
    data() {
        return {
            dialogVisible: false,
            actived: false,

            type: "buff",
            query: "",
            strict: false,
            client: window.location.hostname.includes("origin") ? "origin" : "std",

            skill: [],
            buff: [],
            item: [],
            icon: [],
            npc: [],

            stat: {
                skill: 0,
                buff: 0,
                item: 0,
                npc: 0,
                icon: 0,
            },

            done: false,
            loading: false,

            html: "",
            isPC: window.innerWidth > 720,

            per: 10,
            page: 1,
            total: 0,
            pages: 1,

            buff_mode: "simple",
            skill_mode: "simple",

            resultItemRefs: createResultItemRefs(),
        };
    },
    computed: {
        buttonTXT() {
            return this.selectedCount ? "插 入" : "确 定";
        },
        currentList() {
            return Array.isArray(this[this.type]) ? this[this.type] : [];
        },
        isBlank() {
            return !this.query && !this.currentList.length;
        },
        selectedCount() {
            return Boolean(this.html);
        },
        hasNextPage() {
            return this.total > 1 && this.page < this.pages;
        },
        multipage() {
            return this.type !== "icon" && this.done && this.pages > 1;
        },
        iconDir() {
            return this.client === "origin" ? "origin_icon" : "icon";
        },
    },
    watch: {
        html(newValue) {
            this.$emit("update", newValue);
        },
        client() {
            void this.fetchStat();
        },
    },
    created() {
        this.checkUA();
    },
    mounted() {
        window.addEventListener("resize", this.checkUA, { passive: true });
    },
    beforeUpdate() {
        RESULT_REF_TYPES.forEach((type) => {
            this.resultItemRefs[type] = [];
        });
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.checkUA);
    },
    methods: {
        async fetchStat() {
            const data = await loadStat({ client: this.client });
            if (!data) return;

            this.stat = data;
            this.actived = true;
        },
        resetResultState(type = this.type) {
            if (Array.isArray(this[type])) {
                this[type] = [];
            }
            this.total = 0;
            this.pages = 1;
            this.loading = false;
            this.done = false;
        },
        setResultItemRef(type, index, el) {
            if (!RESULT_REF_TYPES.includes(type) || !el) return;
            this.resultItemRefs[type][index] = el;
        },
        getResultItemHtml(type, index) {
            return this.resultItemRefs[type]?.[index]?.innerHTML ?? "";
        },
        nl2br(str = "") {
            // 替换\n \\\n 为 <br>
            return String(str).replace(/\\n/g, "<br>").replace(/\n/g, "<br>");
        },
        async getData(page = 1, append = false) {
            const query = this.query.trim();
            if (!query) {
                this.resetResultState();
                return;
            }

            this.loading = true;
            this.per = 10;
            this.done = false;
            let params = {
                strict: ~~this.strict,
                per: this.per,
                page,
                client: this.client,
            };

            try {
                if (this.type === "icon") {
                    if (isNaN(query)) {
                        const data = await getIcons(query, params);
                        this.icon = Array.isArray(data) ? data : [];
                    } else {
                        this.icon = [
                            {
                                iconID: Number.parseInt(query, 10),
                                isSelected: false,
                            },
                        ];
                    }
                    this.total = this.icon.length;
                    this.pages = 1;
                } else {
                    const data = await loadResource(this.type, query, params);
                    if (!append) this[this.type] = [];

                    if (!data) {
                        this.total = 0;
                        this.pages = 1;
                        return;
                    }

                    let list = [];
                    if (this.type === "item") {
                        list = this.transformData(data.data || []);
                        this.total = data.total || 0;
                        this.pages = data.per_page ? Math.ceil(data.total / data.per_page) : 1;
                    } else {
                        list = this.transformData(data.list || []);
                        this.pages = data.pages || 1;
                        this.total = data.total || 0;
                    }
                    this[this.type] = this[this.type].concat(list);
                }
            } finally {
                this.done = true;
                this.loading = false;
            }
        },
        search() {
            this.page = 1;
            void this.getData();
        },
        appendPage() {
            if (!this.hasNextPage) return;
            this.page += 1;
            void this.getData(this.page, true);
        },
        changePage(page) {
            this.page = page;
            void this.getData(page);
        },
        changeType(tab) {
            const nextType = tab?.paneName || tab?.props?.name || tab?.name || this.type;
            this.type = nextType;
            this.page = 1;
            this.resetItems();
            this.resetResultState(this.type);
            if (!this.query.trim()) return;
            void this.getData();
        },
        insert() {
            this.$emit("insert", this.html);
            this.dialogVisible = false;
        },
        transformData(data = []) {
            return data.map((item) => ({
                ...item,
                isSelected: false,
            }));
        },
        changeMode() {
            this.resetItems();
        },
        selectBuff(o, i) {
            this.resetItems();
            o.isSelected = true;
            if (this.buff_mode === "simple") {
                this.html = `<a data-type="buff" class="e-jx3-buff w-jx3-element ${o.CanCancel === 1 ? "isBuff" : "isDebuff"}" href="${this.getDbLink(
                    "buff",
                    this.client,
                    o.BuffID,
                    o.Level
                )}" data-client="${this.client}" data-id="${o.BuffID}" data-level="${o.Level}">[${o.Name}]</a>`;
            } else {
                this.html = `<pre data-type="buff" data-id="${o.BuffID}" class="e-jx3-resource">${this.nl2br(this.getResultItemHtml("buff", i))}</pre>`;
            }
        },
        selectSkill(o, i) {
            this.resetItems();
            o.isSelected = true;
            if (this.skill_mode === "simple") {
                this.html = `<a data-type="skill" class="e-jx3-skill w-jx3-element" href="${this.getDbLink("skill", this.client, o.SkillID, o.Level)}" data-client="${this.client}" data-id="${
                    o.SkillID
                }" data-level="${o.Level}">[${o.Name}]</a>`;
            } else {
                this.html = `<pre data-type="skill" data-id="${o.SkillID}" class="e-jx3-resource">${this.nl2br(this.getResultItemHtml("skill", i))}</pre>`;
            }
        },
        selectItem(o) {
            this.resetItems();
            o.isSelected = true;
            this.html = `<a data-type="item" class="e-jx3-item e-jx3-item-q${o.Quality} w-jx3-element" data-mode="" data-id="${o.id}" data-quality="${o.Quality}" data-client="${this.client}" target="_blank" href="${this.getLink("item", o.id)}">[${o.Name}]</a>`;
        },
        selectIcon(o) {
            this.resetItems();
            o.isSelected = true;
            this.html = `<img class="e-jx3-icon" src="${__iconPath}${this.iconDir}/${o.iconID}.png" alt="${o.iconID}"/>`;
        },
        selectNpc(o) {
            this.resetItems();
            o.isSelected = true;
            this.html = `<a data-type="npc" class="e-jx3-npc w-jx3-element" data-mode="" data-id="${o.ID}" data-client="${this.client}" target="_blank" href="${this.getDbLink("npc", this.client, o.ID)}">[${o.Name}]</a>`;
        },
        resetItems() {
            this.currentList.forEach((item) => {
                item.isSelected = false;
            });
            this.html = "";
        },
        checkUA() {
            this.isPC = window.innerWidth > 720;
        },
        iconURL(id) {
            return iconLink(id, this.client);
        },
        getDbLink(type, client, id, level = "") {
            const domain = client === "origin" ? __OriginRoot : __Root;
            return `${domain}app/database/?type=${type}&query=${id}&level=${level}`;
        },
        getLink(type, id) {
            const domain = this.client === "origin" ? __OriginRoot : __Root;
            return domain + resolveLink(type, id).slice(1);
        },
        filterRaw(str) {
            return str?.replace(/\\n/g, "\n") ?? "";
        },
        showDetachType(val) {
            return val && detach_types[val] ? detach_types[val] : "";
        },

        // 杂项
        // ==============================
        async openDialog() {
            this.dialogVisible = true;
            if (!this.actived) {
                await this.fetchStat();
            }
        },
    },
};
</script>

<style lang="less">
@import "./assets/css/resource.less";

.m-item-pop {
    padding: 0 !important;
    background: none !important;
    border: none;
}
</style>
