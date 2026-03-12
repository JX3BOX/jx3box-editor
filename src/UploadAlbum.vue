<template>
    <div class="c-upload-album">
        <el-button type="primary" @click="triggerFileSelect" :loading="uploading">
            <el-icon><UploadFilled /></el-icon>
            <span>批量上传图片</span>
        </el-button>
        <input ref="fileInput" class="u-hidden-input" type="file" accept="image/*" multiple @change="onFileInputChange" />

        <div
            class="c-upload-album-list"
            :class="{ 'is-dragover': isDragover, 'is-uploading': uploading, 'is-empty': !imgList.length }"
            @click="triggerFileSelect"
            @dragenter.prevent="onDragEnter"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
        >
            <draggable v-if="imgList.length" v-model="imgList" item-key="id" class="u-draggable-list">
                <template #item="{ element, index }">
                    <div class="u-album-item" @click.stop>
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
            <div v-if="imgList.length" class="u-add-card" @click.stop="triggerFileSelect">
                <el-icon><Plus /></el-icon>
            </div>
            <div v-else class="u-drop-hint is-empty">
                <el-icon class="u-drop-icon"><UploadFilled /></el-icon>
                <span>将文件拖到此处，或 <span class="u-drop-link">点击上传</span></span>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" class="c-upload-album-preview">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils.js";
import draggable from "vuedraggable";
const { __cms } = JX3BOX;
const API = __cms + "api/cms/upload";

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
        ZoomIn,
        Delete,
        Plus,
        UploadFilled,
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
            isDragover: false,
            uploading: false,
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
        triggerFileSelect() {
            this.$refs.fileInput?.click();
        },
        onFileInputChange(e) {
            const files = Array.from(e.target?.files || []);
            if (e.target) e.target.value = "";
            this.uploadFiles(files);
        },
        onDragEnter() {
            this.isDragover = true;
        },
        onDragOver() {
            this.isDragover = true;
        },
        onDragLeave(e) {
            if (!e.currentTarget.contains(e.relatedTarget)) {
                this.isDragover = false;
            }
        },
        onDrop(e) {
            this.isDragover = false;
            const files = Array.from(e.dataTransfer?.files || []);
            this.uploadFiles(files);
        },
        isImageFile(file) {
            if (!file) return false;
            if (file.type && file.type.startsWith("image/")) return true;
            const name = (file.name || "").toLowerCase();
            return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/.test(name);
        },
        async uploadFiles(files = []) {
            if (!files.length) return;

            const imageFiles = files.filter((file) => this.isImageFile(file));
            const skipped = files.length - imageFiles.length;
            if (skipped > 0) {
                this.$message.warning(`已跳过 ${skipped} 个非图片文件`);
            }
            if (!imageFiles.length) return;

            this.uploading = true;
            try {
                const uploaded = await Promise.all(imageFiles.map((file, index) => this.uploadSingle(file, index)));
                const valid = uploaded.filter(Boolean);
                if (valid.length) {
                    this.imgList = [...this.imgList, ...valid];
                    this.$message.success(`上传成功 ${valid.length} 张图片`);
                }
            } finally {
                this.uploading = false;
            }
        },
        async uploadSingle(file, index) {
            const fdata = new FormData();
            fdata.append("file", file);
            try {
                const res = await axios.post(API, fdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                    auth: {
                        username: (localStorage && localStorage.getItem("token")) || "",
                        password: "cms common request",
                    },
                });

                const payload = res.data || {};
                if (payload.code) {
                    this.$message.error(payload.msg || "上传失败");
                    return null;
                }

                const url =
                    payload.location ||
                    payload.url ||
                    (payload.data &&
                        (Array.isArray(payload.data) ? payload.data[0] : payload.data.url || payload.data.location || payload.data));

                if (!url) return null;
                return {
                    id: `${url}-${Date.now()}-${index}`,
                    name: file.name,
                    url,
                };
            } catch (err) {
                const message = err?.response?.data?.message || err?.response?.data?.msg || "请求异常";
                this.$message.error(message);
                return null;
            }
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
