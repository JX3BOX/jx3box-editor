<template>
    <div class="c-upload">
        <el-button type="primary" :disabled="!enable" @click="dialogVisible = true">
            <el-icon><UploadFilled /></el-icon>
            <span>{{ buttonText }}</span>
        </el-button>

        <el-dialog v-model="dialogVisible" class="c-large-dialog" title="上传">
            <div class="c-upload-toolbar">
                <!-- 清空按钮 -->
                <el-button class="u-upload-clear" plain size="small" @click="clear"
                    ><el-icon> <Delete /> </el-icon><span>清空</span></el-button
                >
                <!-- 限制提示 -->
                <div class="u-upload-tip" :title="tipText" type="info" show-icon :closable="false"><span>{{ tipText }}</span></div>
            </div>

            <el-upload
                list-type="picture-card"
                :auto-upload="false"
                :limit="max"
                multiple
                :file-list="fileList"
                :on-change="change"
                ref="uploadbox"
                :accept="accept"
                with-credentials
            >
                <template #default>
                    <el-icon><Plus /></el-icon>
                </template>

                <template #file="{ file }">
                    <div
                        class="u-file-wrapper"
                        @click.stop="select(file)"
                        :class="{
                            isSelected: !!file.selected,
                            disabled: file.status !== 'success',
                        }"
                        v-loading="file.status === 'uploading'"
                    >
                        <template v-if="isImageFile(file)">
                            <img
                                class="el-upload-list__item-thumbnail u-imgbox"
                                :src="file.url"
                                :data-upload-uid="file.uid"
                                alt=""
                            />
                            <i class="u-mask"></i>
                            <span class="u-op u-preview-btn" @click.stop="preview(file, $event)">
                                <el-icon><ZoomIn /></el-icon>
                            </span>
                        </template>
                        <span
                            class="u-op u-delete-btn"
                            :class="{ 'is-single': !isImageFile(file) }"
                            @click.stop="deleteFile(file)"
                        >
                            <el-icon><Delete /></el-icon>
                        </span>
                        <div v-if="!isImageFile(file)" class="u-filebox">
                            <img class="u-fileplaceholder" svg-inline src="./assets/img/file.svg" />
                            <span class="u-filename">{{ file.name }}</span>
                        </div>
                        <label v-show="file.status === 'success'" class="u-file-select-label">
                            <el-icon><Check /></el-icon>
                        </label>
                    </div>
                </template>
            </el-upload>

            <template #footer>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insert">
                    {{ buttonTXT }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import { Check, Delete, Plus, UploadFilled, ZoomIn } from "@element-plus/icons-vue";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import allow_types from "@jx3box/jx3box-common/data/conf";
import { showImgPreview } from "./assets/js/renderImgPreview";
const { __cms } = JX3BOX;
const API = __cms + "api/cms/upload";
const imgtypes = ["jpg", "png", "gif", "bmp", "webp", "jpeg", "svg"];

export default {
    name: "Upload",
    components: {
        Check,
        Delete,
        Plus,
        UploadFilled,
        ZoomIn,
    },
    props: {
        text: {
            type: String,
        },
        onlyImage: {
            type: Boolean,
        },
        desc: {
            type: String,
        },
        accept: {
            type: String,
            default: allow_types.accept,
        },
        enable: {
            type: Boolean,
            default: true,
        },
        max: {
            type: Number,
            default: 10,
        },
        // 文件大小限制
        sizeLimit: {
            type: Number,
            default: 30,
        },
    },
    emits: ["insert", "update", "htmlUpdate"],
    data() {
        return {
            dialogVisible: false,
            fileList: [],
            insertList: "",
        };
    },
    watch: {
        fileList: {
            deep: true,
            handler(newval) {
                this.$emit("update", newval);
            },
        },
        insertList(newval) {
            this.$emit("htmlUpdate", newval);
        },
    },
    computed: {
        tipText() {
            return (
                this.desc ||
                `一次最多同时上传${this.max}个文件（单个文件不超过${this.sizeLimit}M），格式限常见的图片、文档、数据表及压缩包`
            );
        },
        buttonText() {
            return this.text || "上传附件";
        },
        selectedCount() {
            return this.fileList.filter((file) => file.selected).length;
        },
        buttonTXT() {
            return this.selectedCount ? "插 入" : "确 定";
        },
    },
    methods: {
        isImageFile(file) {
            if (!file) return false;
            if (typeof file.is_img === "boolean") return file.is_img;
            if (file.raw?.type?.startsWith("image/")) return true;

            const origin = file.name || file.url || "";
            const clean = origin.split("?")[0].split("#")[0];
            const ext = (clean.split(".").pop() || "").toLowerCase();
            return imgtypes.includes(ext);
        },
        change(file) {
            if (!file || file.status === "success" || !file.raw) return;

            const ext = (file.name.split(".").pop() || "").toLowerCase();
            const is_img = imgtypes.includes(ext);

            if (this.onlyImage && !is_img) {
                this.$message.warning("当前仅允许上传图片");
                this.removeFileByUid(file.uid);
                return;
            }

            const sizeInMB = (file.size || 0) / 1024 / 1024;
            if (sizeInMB > this.sizeLimit) {
                this.$message.error(`文件超出大小限制（${this.sizeLimit}M）`);
                this.removeFileByUid(file.uid);
                return;
            }

            const fdata = new FormData();
            fdata.append("file", file.raw);

            axios
                .post(API, fdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                    auth: {
                        username: (localStorage && localStorage.getItem("token")) || "",
                        password: "cms common request",
                    },
                })
                .then((res) => {
                    const payload = res.data || {};
                    if (payload.code) {
                        this.$message.error(payload.msg || "上传失败");
                        this.removeFileByUid(file.uid);
                        return;
                    }

                    const url =
                        payload.location ||
                        payload.url ||
                        (payload.data &&
                            (Array.isArray(payload.data)
                                ? payload.data[0]
                                : payload.data.url || payload.data.location || payload.data));

                    if (!url) {
                        this.$message.error("上传成功但未返回文件地址");
                        this.removeFileByUid(file.uid);
                        return;
                    }

                    file.url = url;
                    file.is_img = is_img;
                    file.selected = true;
                    file.status = "success";

                    const targetIndex = this.fileList.findIndex((item) => item.uid === file.uid);
                    if (targetIndex > -1) {
                        this.fileList.splice(targetIndex, 1, file);
                    } else {
                        this.fileList.push(file);
                    }

                    this.$message.success("上传成功");
                })
                .catch((err) => {
                    const code = err?.response?.data?.code;
                    const message = err?.response?.data?.message || err?.response?.data?.msg;
                    if (code) {
                        this.$message.error(`[${code}] ${message || "请求异常"}`);
                    } else {
                        this.$message.error("请求异常");
                    }
                    this.removeFileByUid(file.uid);
                });
        },
        select(file) {
            if (file.status !== "success") return;
            file.selected = !file.selected;
        },
        preview(file, e) {
            if (!this.isImageFile(file) || !file.url) return;
            const wrapper = e?.currentTarget?.closest?.(".u-file-wrapper");
            const img = wrapper?.querySelector?.("img.u-imgbox");
            if (!img) return;
            showImgPreview(img);
        },
        buildHTML() {
            const list = [];
            this.fileList.forEach((file) => {
                if (file.selected) {
                    this.isImageFile(file)
                        ? list.push(`<img src="${file.url}" />`)
                        : list.push(`<a target="_blank" href="${file.url}">${file.name}</a>`);
                }
            });
            this.insertList = list.join(" \n");
            return this.insertList;
        },
        insert() {
            this.dialogVisible = false;
            if (!this.selectedCount) return;
            this.$emit("insert", {
                list: this.fileList,
                html: this.buildHTML(),
            });
            this.resetSelectStatus();
        },
        resetSelectStatus() {
            this.fileList.forEach((file) => {
                file.selected = false;
            });
        },
        clear() {
            this.$refs.uploadbox?.clearFiles?.();
            this.fileList = [];
            this.insertList = "";
        },
        removeFileByUid(uid) {
            if (!uid) return;
            this.fileList = this.fileList.filter((file) => file.uid !== uid);
        },
        deleteFile(file) {
            if (!file) return;
            this.removeFileByUid(file.uid);
        },
    },
};
</script>

<style lang="less" src="./assets/css/upload.less"></style>
