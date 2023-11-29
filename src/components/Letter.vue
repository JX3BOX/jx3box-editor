<template>
	<div class="e-letter" v-html="html"></div>
</template>

<script>
export default {
	name: "Letter",
	emits: ["update"],
	props: {
		data: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			html: "",
		};
	},
	watch: {
		data: {
			immediate: true,
			deep: true,
			handler(obj) {
				this.html = this.htmlDemo(obj);
			},
		},
		html: {
			immediate: true,
			handler(val) {
				this.$emit("update", { id: this.data.id, html: val });
			},
		},
	},
	methods: {
		// 默认html
		htmlDemo({ slug, style }) {
			const titleHtml = `<div class="e-letter-title letter-title--${slug}">我是抬头</div>`;
			const contentHtml = `<div class="e-letter-content letter-header--${slug}"><div class="u-letter-content--header letter-footer--${slug}"><div class="u-letter-content--footer letter-body--${slug}"><p>明月几时有，把酒问青天。</p></div></div></div>`;
			return `<div class="e-letter letter--${slug}">${titleHtml}<br/> ${contentHtml}</div></div><style>${style}</style>`;
		},
	},
};
</script>
