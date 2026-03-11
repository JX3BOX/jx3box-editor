<template>
    <div class="c-upload-album">
        <Upload text="批量上传图片" :only-image="true" @insert="updateFileList" />
        <div class="c-upload-album-list">
            <draggable v-if="imgList.length" v-model="imgList" item-key="id" class="u-draggable-list">
                <template #item="{ element, index }">
                    <div class="u-album-item">
                        <img class="u-pic" :src="showThumbnail(element.url)" />
                        <i class="u-mask"></i>
                        <span class="u-op u-preview" @click.stop="previewHandle(element)">
                            <el-icon><ZoomIn /></el-icon>
                        </span>
                        <span class="u-op u-delete" @click.stop="deleteHandle(index)">
                            <el-icon><Delete /></el-icon>
                        </span>
                    </div>
                </template>
            </draggable>
            <div v-else class="u-null">
                <el-icon><Warning /></el-icon>
                当前没有任何图片
            </div>
        </div>
        <el-dialog v-model="dialogVisible" class="c-upload-album-preview">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import Upload from "./Upload.vue";
import { Delete, Warning, ZoomIn } from "@element-plus/icons-vue";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils.js";
import draggable from "vuedraggable";

const normalizeItem = (item, index = 0) => {
    if (!item || !item.url) return null;
    return {
        ...item,
        id: item.id || item.uid || `${item.url || "img"}-${item.name || "image"}-${index}`,
    };
};

const isSameList = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    return a.every((item, index) => {
        const target = b[index] || {};
        return item.id === target.id && item.url === target.url && item.name === target.name;
    });
};

export default {
    name: "UploadAlbum",
    components: {
        draggable,
        Upload,
        ZoomIn,
        Delete,
        Warning,
    },
    props: {
        modelValue: {
            type: Array,
            default: undefined,
        },
        data: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    emits: ["update:modelValue", "update"],
    data() {
        return {
            imgList: [],
            dialogImageUrl: "",
            dialogVisible: false,
        };
    },
    computed: {
        sourceList() {
            return this.modelValue !== undefined ? this.modelValue : this.data;
        },
    },
    watch: {
        sourceList: {
            immediate: true,
            deep: true,
            handler(newval) {
                const normalized = (newval || []).map((item, index) => normalizeItem(item, index)).filter(Boolean);
                if (!isSameList(normalized, this.imgList)) {
                    this.imgList = normalized;
                }
            },
        },
        imgList: {
            deep: true,
            handler(newval) {
                this.$emit("update", newval);
                this.$emit("update:modelValue", newval);
            },
        },
    },
    methods: {
        updateFileList(data) {
            const upload_list = Array.isArray(data?.list) ? data.list : [];
            const img_list = [];
            upload_list.forEach((item, index) => {
                if (item.is_img) {
                    img_list.push({
                        id: item.uid || `${item.url || "img"}-${item.name || "image"}-${index}`,
                        name: item.name,
                        url: item.url,
                    });
                }
            });
            this.imgList = img_list;
        },
        showThumbnail(val) {
            return getThumbnail(val, 146);
        },
        previewHandle(item) {
            this.dialogImageUrl = item.url;
            this.dialogVisible = true;
        },
        deleteHandle(i) {
            this.imgList.splice(i, 1);
        },
    },
};
</script>

<style lang="less" src="./assets/css/upload_album.less"></style>
