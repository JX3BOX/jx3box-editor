<template>
    <div class="w-buff" v-if="data">
        <div class="w-buff-wrapper">
            <img
                class="w-buff-icon"
                :src="iconLink(data.IconID)"
                :alt="data.Name" />
            <div class="w-buff-content">
                <span class="w-buff-name">{{ data.Name }}</span>
                <span class="w-buff-desc">{{ data.Desc }}</span>
                <span class="w-buff-type" v-if="data.DetachType"
                    >※ {{ data.DetachType | showDetachType }}</span
                >
                <span class="w-buff-meta">ID : {{ data.BuffID }}</span>
                <span class="w-buff-meta">Level : {{ data.Level }}</span>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { getBuff } from "./service/database.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import detach_types from "./assets/data/detach_type.json";
export default {
    name: "Buff",
    props: {
        client: {
            type: String,
            default: "std",
        },
        id: {
            type: [String, Number],
            default: "",
        },
        level: {
            type: [String, Number],
            default: "",
        },
    },
    data: () => ({
        data: null,
    }),
    computed: {
        params: function () {
            return [this.client, this.id, this.level];
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
                        `buff-${client}-${id}-${level}`
                    );
                    if (cache) {
                        try {
                            this.data = JSON.parse(cache);
                        } catch (e) {}
                    } else {
                        id &&
                            getBuff(...this.params).then(res => {
                                let data = res.data?.list?.[0];
                                if (!data) data = null;
                                this.data = data;

                                // 将数据放入 sessionStorage
                                sessionStorage.setItem(
                                    `buff-${client}-${id}-${level}`,
                                    JSON.stringify(data)
                                );
                            });
                    }
                }
            },
        },
    },
    methods: {
        iconLink: function (id) {
            return iconLink(id, this.client);
        },
    },
    filters: {
        showDetachType: function (val) {
            if (val && detach_types[val]) {
                return detach_types[val];
            } else {
                return "";
            }
        },
    },
};
</script>

<style lang="less">
@import "./assets/css/module/buff.less";
</style>
