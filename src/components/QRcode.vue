<template>
    <div class="w-qrcode" @click="togglePic" :class="{ on: active }" v-if="mode == 'cms'">
        <img class="u-icon" svg-inline src=".././assets/img/other/qr-code.svg" />
        <span class="u-text">二维码</span>
        <div class="u-qrcode">
            <qrcode-vue class="u-pic" :value="value" :size="size" level="H"></qrcode-vue>
            <span>扫一扫即可访问</span>
        </div>
    </div>
    <div class="w-qrcode-static" v-else-if="mode == 'static'">
        <div class="u-qrcode">
            <qrcode-vue class="u-pic" :value="value" :size="size" level="H"></qrcode-vue>
            <span class="u-txt"
                ><img class="u-icon" svg-inline src="./assets/img/other/qr-code.svg" />扫一扫手机访问</span
            >
        </div>
    </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
export default {
    name: "QRcode",
    props: ["href", "v", "s"],
    data: function () {
        return {
            value: this.href || location.href,
            size: this.s || 100,
            active: false,
            mode: this.v || "cms",
        };
    },
    computed: {},
    methods: {
        togglePic: function (e) {
            e.stopPropagation();
            this.active = !this.active;
        },
    },
    mounted: function () {
        const vm = this;
        document.addEventListener("click", function () {
            vm.active = false;
        });
    },
    components: {
        QrcodeVue,
    },
};
</script>

<style lang="less">
.w-qrcode {
    .dbi;
    .u-icon {
        .mr(5px);
        .size(14px);
        .y(-2px);
        fill: @color;
    }
    .u-text {
        .fz(13px);
        user-select: none;
    }
    .pointer;
    transition: 0.1s ease-in-out;
    &:hover {
        color: #f39;
        .u-icon {
            fill: #f39;
        }
    }

    .u-qrcode {
        .none;
        .pa;
        .mt(5px);
        padding: 10px;
        border: 1px solid #e8e8e8;
        z-index: 1;
        background: #fff;
        border-radius: 3px;
        font-size: 12px;
        text-align: center;
        color: #888;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    }
    .u-pic {
        .size(100px);
        .mb(5px);
    }
    &.on {
        .u-qrcode {
            .db;
        }
    }
}
@media screen and (max-width: @phone) {
    .w-qrcode {
        .none;
    }
}
.w-qrcode-static {
    .u-qrcode {
        .ps;
    }
    .u-icon {
        .mr(5px);
        .size(14px);
        .y(-2px);
        fill: @color;
    }
    .u-pic {
        background-color: #fff;
        padding: 7px 7px 7px 8px;
    }
    .u-txt {
        padding: 0 5px;
        .db;
        .fz(12px,2);
    }
}
</style>
