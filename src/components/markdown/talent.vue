<template>
    <div class="c-editor-markdown-dialog">
        <span class="c-markdown-toolbar-file c-markdown-toolbar-item" @click="handleClick" title="插入奇穴方案">
            奇
        </span>

        <el-dialog :visible.sync="visible" title="插入奇穴方案" :modal-append-to-body="false">
            <p>💙 请填入<a target="_blank" href="/macro/talent">奇穴模拟器</a>生成的编码</p>

            <el-input class="u-input u-input-macro" type="textarea" :rows="5" v-model="talent"></el-input>

            <div slot="footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="insert">插入</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "markdown_talent",
    data() {
        return {
            visible: false,
            talent: "",
        };
    },
    methods: {
        handleClick() {
            this.visible = true;
        },
        cancel() {
            this.visible = false;
            this.talent = "";
        },
        insert() {
            const content = `<pre class="e-jx3qixue-area">${this.talent}</pre>`;

            this.$emit("insert", content);

            this.talent = "";

            this.visible = false;
        },
    },
};
</script>

