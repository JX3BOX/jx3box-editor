<template>
    <div
        v-if="source"
        class="c-item"
        :class="{
            'c-item-equipment': source.AucGenre >= 1 && source.AucGenre <= 4,
            'c-item-furniture': source.AucGenre == 21,
        }">
        <div class="c-item-wrapper">
            <!-- 精炼等级 -->
            <div v-if="source.MaxStrengthLevel" class="u-max-strength-level">
                <span
                    v-text="`精炼等级：0 / ${source.MaxStrengthLevel}`"></span>
            </div>
            <!-- 物品名称 -->
            <div
                class="u-title"
                :style="{ color: color(source.Quality) }"
                v-text="source.Name"></div>
            <!-- 装备类型 -->
            <div class="u-usage" v-if="show_equip_usage">
                <template v-if="source.EquipUsage == 1">
                    <img
                        class="u-label-icon"
                        src="../assets/img/item/pve.png"
                        alt="" />
                    <span>秘境挑战</span>
                </template>
                <template v-if="source.EquipUsage == 2">
                    <img
                        class="u-label-icon"
                        src="../assets/img/item/pvp.png"
                        alt="" />
                    <span>竞技对抗</span>
                </template>
                <template v-if="source.EquipUsage == 3">
                    <img
                        class="u-label-icon"
                        src="../assets/img/item/pvx.png"
                        alt="" />
                    <span>休闲</span>
                </template>
            </div>
            <!-- 绑定状态 -->
            <div
                v-if="source.BindType > 1"
                class="u-bind"
                v-text="bind(source.BindType)"></div>
            <!-- 唯一 -->
            <div
                v-if="parseInt(source.MaxExistAmount) === 1"
                class="unique"
                v-text="'唯一'"></div>
            <!-- 存在时间 -->
            <div
                v-if="parseInt(source.MaxExistTime) > 0"
                class="u-max-exist-time"
                v-text="'限时时间：' + showDuration(source.MaxExistTime)"></div>
            <!-- 最大拥有数 -->
            <div
                v-if="parseInt(source.MaxExistAmount) > 1"
                class="u-max-exist-amount"
                v-text="'最大拥有数：' + source.MaxExistAmount"></div>
            <!-- 武器类别 -->
            <div v-if="source.AucGenre == 1" class="u-weapon-type-label"
                >武器</div
            >
            <div v-if="source.AucGenre == 2" class="u-weapon-type-label"
                >暗器</div
            >
            <!-- 物品类型文案 -->
            <div
                v-if="source.TypeLabel"
                class="u-type-label"
                v-text="source.TypeLabel"></div>
            <!-- 装备属性 -->
            <div
                class="u-attributes"
                v-if="source.attributes && source.attributes.length">
                <div
                    v-for="attribute in common_attributes"
                    :key="attribute.type"
                    class="u-field"
                    :class="[`u-${attribute.color}`]">
                    <span
                        v-if="
                            attribute.type == 'atMeleeWeaponAttackSpeedBase' ||
                            attribute.type == 'atRangeWeaponAttackSpeedBase'
                        "
                        class="u-value u-speed"
                        v-text="attribute.label"></span>
                    <span
                        v-else-if="attribute.type == 'atHorseAttribute'"
                        class="u-value u-horse-attribute">
                        <img
                            v-if="attribute.icon_id > 0"
                            class="u-horse-icon"
                            :src="iconLink(attribute.icon_id)" />
                        <div
                            class="u-horse-desc"
                            v-html="attribute.label"></div>
                    </span>
                    <span v-else class="u-value">
                        <game-text :text="attribute.label"></game-text>
                    </span>
                </div>
                <template v-if="orange_std_attribute.length > 0">
                    <div class="u-spec-attribute-title u-yellow">
                        <img
                            class="u-label-icon"
                            src="../assets/img/item/std.png" />
                        <span>特殊属性效果</span>
                    </div>
                    <div
                        class="u-value u-spec-attribute"
                        v-for="attribute in orange_std_attribute"
                        :key="attribute.label">
                        <game-text :text="attribute.label"></game-text>
                    </div>
                </template>
                <template v-if="orange_wujie_attribute.length > 0">
                    <div class="u-spec-attribute-title u-yellow">
                        <img
                            class="u-label-icon"
                            src="../assets/img/item/wujie.png" />
                        <span>特殊属性效果</span>
                    </div>
                    <div
                        class="u-value u-spec-attribute"
                        v-for="(attribute, key) in orange_wujie_attribute"
                        :key="key">
                        <game-text :text="attribute.label"></game-text>
                    </div>
                    <div class="u-value u-spec-attribute u-orange"
                        >属性效果双端一致</div
                    >
                </template>
            </div>
            <!-- 家具属性 -->
            <div
                class="u-furniture-attributes"
                v-if="source.furniture_attributes">
                <div
                    class="u-field u-green"
                    v-if="source.furniture_attributes.record">
                    <span
                        class="u-value"
                        v-text="
                            `装修评分：${source.furniture_attributes.record}`
                        "></span>
                </div>
            </div>
            <!-- 镶嵌 -->
            <ul v-if="source.Diamonds" class="u-diamonds u-gray">
                <!-- 五行石 -->
                <li
                    class="u-diamond"
                    v-for="(label, key) in source.Diamonds"
                    :key="key">
                    <span class="u-square"></span>
                    <span class="u-text" v-text="`镶嵌孔：${label}`"></span>
                </li>
                <!-- 五彩石 -->
                <li v-if="source.AucGenre == 1" class="u-diamond">
                    <span class="u-square"></span>
                    <span class="u-text">&lt;只能镶嵌五彩石&gt;</span>
                </li>
            </ul>
            <!-- 仅性别可穿戴 -->
            <div
                v-if="source.Requires && source.Requires[7]"
                class="u-require-sex"
                v-text="source.Requires[7]"></div>
            <!-- 需要门派 -->
            <div
                v-if="source.Requires && source.Requires[6]"
                class="u-require-school"
                v-text="source.Requires[6]"></div>
            <!-- 需要等级 -->
            <div
                v-if="source.Requires && source.Requires[5]"
                class="u-require-level"
                v-text="source.Requires[5]"></div>
            <!-- 需要阵营 -->
            <div
                v-if="source.Requires && source.Requires[100]"
                class="u-require-camp"
                v-text="source.Requires[100]"></div>
            <!-- 需求宅邸等级 -->
            <div
                v-if="source.Requires && source.Requires[101]"
                class="u-require-homeland-level"
                v-text="source.Requires[101]"></div>
            <!-- 最大耐久度 -->
            <div
                v-if="
                    source.AucGenre >= 1 &&
                    source.AucGenre <= 3 &&
                    source.MaxDurability
                "
                class="u-max-durability"
                v-text="'最大耐久度' + source.MaxDurability"></div>
            <!-- 套装信息 -->
            <div v-if="source.Set" class="u-set">
                <br />
                <div
                    class="u-yellow"
                    v-text="
                        `${source.Set.name}(1/${source.Set.siblings.length})`
                    "></div>
                <ul class="u-set-siblings u-gray">
                    <li
                        v-for="(sibling, key) in source.Set.siblings"
                        :key="key"
                        :class="{
                            'u-yellow':
                                sibling &&
                                (sibling == source.Name ||
                                    sibling.includes(source.Name)),
                        }">
                        {{
                            sibling
                                .split("/")
                                .map(s => s.trim())
                                .sort((a, b) => a.localeCompare(b))
                                .join(" / ")
                        }}</li
                    >
                </ul>
                <br />
                <ul class="u-set-attributes u-gray">
                    <li
                        v-for="(attribute, key) in source.Set.attributes"
                        :key="key">
                        <span>{{ `[${key}]` }}</span>
                        <game-text
                            :client="client"
                            :text="attribute"
                            :ignore-color="true"></game-text>
                    </li>
                </ul>
                <br />
            </div>
            <!-- 图片 -->
            <div class="u-image-url" v-if="source.ImageUrl">
                <img
                    :src="source.ImageUrl"
                    @error.once="source.ImageUrl = null" />
            </div>
            <!-- 描述 -->
            <p v-if="source.Desc" class="u-desc u-yellow">
                <game-text :client="client" :text="source.Desc"></game-text>
            </p>
            <!-- 五彩石属性 -->
            <p
                v-if="source.WuCaiHtml"
                class="u-desc"
                v-html="source.WuCaiHtml"></p>
            <!-- 品质等级 -->
            <div
                v-if="source.Level"
                class="u-level u-yellow"
                v-text="'品质等级' + source.Level"></div>
            <!-- 装备分数 -->
            <div
                v-if="Number(source.EquipmentRating)"
                class="u-equipment-rating u-orange"
                v-text="'装备分数' + source.EquipmentRating"></div>
            <!-- 推荐门派心法 -->
            <div
                v-if="source.Recommend"
                class="u-equipment-recommend"
                v-text="'推荐门派：' + source.Recommend"></div>
            <!-- 冷却时间 -->
            <div
                v-if="source.CoolDown"
                class="u-equipment-recommend"
                v-text="'使用间隔' + second_format(source.CoolDown)"></div>
            <!-- 外观名称 -->
            <div
                v-if="source.Appearance"
                class="u-appearance"
                v-text="'外观名称：' + source.Appearance"></div>
            <!-- 可收集门派 -->
            <div
                v-if="source.CanExterior"
                class="u-can-exterior"
                v-text="'外观：' + source.CanExterior"></div>
            <!-- 储物箱共享 -->
            <div
                v-if="
                    source.CanShared &&
                    !(source.AucGenre >= 1 && source.AucGenre <= 4)
                "
                class="u-can-shared"
                >该物品可以放入账号储物箱共享。</div
            >
            <div
                v-if="
                    source.CanShared &&
                    source.AucGenre >= 1 &&
                    source.AucGenre <= 4
                "
                class="u-can-shared"
                >该装备未精炼、镶嵌、附魔、穿戴前可以放入账号储物箱共享。</div
            >
            <!-- 家具可交互可缩放 -->
            <div v-if="source.furniture_attributes" class="u-furniture-can">
                <span v-if="source.furniture_attributes.interact">可交互</span>
                <span
                    v-if="source.furniture_attributes.scale_range"
                    v-text="
                        `可缩放(${source.furniture_attributes.scale_range.replace(
                            ';',
                            ' - '
                        )}倍)`
                    "></span>
            </div>
            <!-- 物品来源 -->
            <div v-if="source.GetSource" class="u-get-source">
                <span class="u-get-source-header">获取途径：</span>
                <div
                    class="u-get-source-list"
                    v-for="source in source.GetSource"
                    :key="source.label">
                    <span class="u-get-source-type"> {{ source.label }} </span>
                    <template v-if="source.children">
                        <div
                            v-for="child in source.children"
                            :key="child.label || child">
                            <span
                                class="u-get-source-child"
                                v-if="typeof child === 'string'">
                                {{ child }}
                            </span>
                            <span
                                class="u-get-source-child"
                                v-else-if="child.label"
                                @click="onClickSource(child)"
                                :style="sourceStyle(child)"
                                :class="{ 'is-link': child.app && child.id }">
                                {{ sourceLabel(child) }}
                            </span>
                        </div>
                    </template>
                </div>
            </div>
            <div
                v-else-if="source.GetType"
                class="u-get-type"
                v-text="`物品来源：${source.GetType}`"></div>
            <div
                v-if="
                    source.furniture_attributes &&
                    source.furniture_attributes.limit
                "
                class="u-get-type"
                v-text="`摆放上限：${source.furniture_attributes.limit}`"></div>
        </div>
    </div>
</template>

<script>
import { get_item } from "../service/item.js";
import { getLink } from "@jx3box/jx3box-common/js/utils.js";

import GameText from "./GameText.vue";

import attribute_percent from "../assets/js/item/attribute_percent.js";
import bind from "../assets/js/item/bind.js";
import color from "../assets/js/item/color.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

import second_format from "../assets/js/item/second_format.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export default {
    name: "Item",
    props: {
        item: {
            type: Object,
        },
        item_id: {
            type: String,
        },
        client: {
            type: String,
        },
        jx3ClientType: {
            type: Number,
        },
    },
    data() {
        return {
            source: null,
        };
    },
    components: {
        GameText,
    },
    computed: {
        // 兼容旧版传值
        env_client_id: function () {
            return location.href.includes("origin") ? 2 : 1;
        },
        client_id: function () {
            return this.jx3ClientType || this.env_client_id;
        },
        client_by_id: function () {
            return this.client_id == 1 ? "std" : "origin";
        },
        // 新版传值
        final_client: function () {
            return this.client || this.client_by_id;
        },
        cache_key: function () {
            return `item-${this.final_client}-${this.item_id}`;
        },
        // 是否展示装备类型
        show_equip_usage() {
            if (Number(this.source?.AucGenre) === 1 && this.source.Quality > 4)
                return false;
            if ([1, 2, 3].includes(Number(this.source?.AucGenre))) return true;
            if (this.source?.AucGenre == 4 && this.source?.AucSubType < 4)
                return true;
            return false;
        },
        common_attributes() {
            return this.source?.attributes?.filter(
                item => item.color != "orange"
            );
        },
        orange_std_attribute() {
            return this.source?.attributes?.filter(
                item => item.color == "orange" && !item.is_mobile
            );
        },
        orange_wujie_attribute() {
            return this.source?.attributes?.filter(
                item => item.color == "orange" && item.is_mobile
            );
        },
    },
    methods: {
        sourceLabel(child) {
            if (typeof child === "string") return child;
            if (child.app == "item") return `[${child.label}]`;
            return child.label;
        },
        sourceStyle(child) {
            if (child.quality)
                return {
                    color: color(child.quality),
                };
            return null;
        },
        onClickSource(child) {
            const { app, id } = child;
            if (!app || !id) return;
            const link = getLink(app, id);
            if (link) {
                window.open(link, "_blank");
            }
        },
        iconLink: function (id) {
            return iconLink(id, this.final_client);
        },
        second_format,
        showDuration: function (val) {
            val = Number(val);
            return val && dayjs.duration(val).asDays().toFixed(0) + "天";
        },
        attribute_percent,
        bind,
        color,
        formatDescHtml: function (str) {
            return str.replace(/font=\d+\s>/g, "");
        },
    },
    watch: {
        item: {
            immediate: true,
            handler() {
                if (typeof this.item !== "undefined") this.source = this.item;
            },
        },
        item_id: {
            immediate: true,
            handler(val) {
                if (val) {
                    // 提取本地数据
                    let _cache = sessionStorage.getItem(this.cache_key);

                    // 本地读取缓存
                    if (_cache) {
                        try {
                            this.source = JSON.parse(_cache);
                        } catch (e) {
                            console.log(e, "[Item]无法解析本地缓存");
                        }

                        // 服务端拉取
                    } else {
                        get_item(this.item_id, this.final_client).then(res => {
                            let item = res.data;
                            let isValidItem = JSON.stringify(item) !== "{}";
                            if (isValidItem) {
                                this.source = item;
                                sessionStorage.setItem(
                                    this.cache_key,
                                    JSON.stringify(this.source)
                                );
                            } else {
                                this.source = null;
                            }
                        });
                    }
                }
            },
        },
    },
};
</script>

<style lang="less">
@import "../assets/css/module/item.less";
</style>
