<template>
    <div class="c-upload-demo">
        <h1 class="title">Upload 组件演示</h1>

        <el-tabs v-model="activeTab">
            <el-tab-pane label="Upload 附件上传" name="upload">
                <Upload @insert="onInsert" @update="onUploadListChange" />

                <el-alert class="u-alert" type="info" :closable="false" show-icon title="插入结果（HTML）" />
                <pre class="u-block">{{ insertedHtml || "暂无插入内容" }}</pre>

                <el-alert class="u-alert" type="info" :closable="false" show-icon title="当前文件列表" />
                <ul class="u-list" v-if="uploadFileList.length">
                    <li v-for="file in uploadFileList" :key="file.uid || file.url">
                        <span>{{ file.name }}</span>
                        <a :href="file.url" target="_blank" rel="noopener noreferrer">{{ file.url }}</a>
                    </li>
                </ul>
                <div v-else class="u-empty">暂无文件</div>
            </el-tab-pane>

            <el-tab-pane label="UploadAlbum 图片相册" name="album">
                <UploadAlbum v-model="albumList" />
                <ol class="u-list" v-if="albumList.length">
                    <li v-for="item in albumList" :key="item.id || item.url">
                        <span>{{ item.name || "未命名" }}</span>
                        <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.url }}</a>
                    </li>
                </ol>
                <div v-else class="u-empty">暂无相册图片</div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Upload from "../Upload.vue";
import UploadAlbum from "../UploadAlbum.vue";

export default {
    name: "UploadDemo",
    components: {
        Upload,
        UploadAlbum,
    },
    data() {
        return {
            activeTab: "upload",
            insertedHtml: "",
            uploadFileList: [],
            albumList: [],
        };
    },
    methods: {
        onInsert(payload) {
            this.insertedHtml = payload?.html || "";
        },
        onUploadListChange(list) {
            this.uploadFileList = Array.isArray(list) ? list : [];
        },
    },
};
</script>

<style lang="less">
.c-upload-demo {
    max-width: 960px;
    margin: 0 auto;

    .title {
        .x;
        margin-bottom: 20px;
    }

    .u-alert {
        margin: 20px 0 10px;
    }

    .u-block {
        margin: 0;
        padding: 12px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background: #fafafa;
        white-space: pre-wrap;
        word-break: break-word;
    }

    .u-list {
        margin: 0;
        padding-left: 18px;
        line-height: 1.8;

        li {
            span {
                margin-right: 8px;
                color: #303133;
            }

            a {
                color: #409eff;
                word-break: break-all;
            }
        }
    }

    .u-empty {
        color: #909399;
    }
}
</style>
