<template>
	<div class="e-letter" v-html="html"></div>
</template>

<script>
export default {
	name: "Letter",
	props: {
		data: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			html: "",
			styleTag: null,
		};
	},
	watch: {
		data: {
			immediate: true,
			deep: true,
			handler(obj) {
				const _style = this.initStyle(obj);
				this.insertStyle(_style);
				this.html = this.htmlDemo(obj);
				this.$emit("update", { html: this.html, id: obj.id });
			},
		},
	},
	methods: {
		// 初始化style
		initStyle({ style, slug }) {
			if (!slug) return;
			if (!style) {
				return `.img_title_${slug}{}\n\n.img_body_${slug}{}\n\n.img_header_${slug}{}\n\n.img_footer_${slug}{}`;
			}
			const ruleRegex = /\.([^{]+)\s*{([^}]*)}/g;
			let match;
			let _style = "";
			while ((match = ruleRegex.exec(style)) !== null) {
				const className = match[1].trim().replace(/_(.+?)_([^_]+)$/, `_$1_${slug}`);
				const styleRules = match[2].trim();
				_style += `.${className}{${styleRules}}\n\n`;
			}
			return _style;
		},
		// 默认html
		htmlDemo({ slug }) {
			const titleHtml = `<div class="e-letter-title img_title_${slug}">我是抬头</div>`;
			const contentHtml = `<div class="e-letter-content img_body_${slug}"><div class="u-letter-content__header img_header_${slug}"><div class="u-letter-content__footer img_footer_${slug}"><p>明月几时有，把酒问青天。</p></div></div></div>`;
			return `<div class="e-letter">${titleHtml}${contentHtml}</div>`;
		},
		// 插入style标签
		insertStyle(style = "") {
			if (this.styleTag) {
				document.body.removeChild(this.styleTag);
			}
			this.styleTag = document.createElement("style");
			const common = `.e-letter-title {background-size: cover;min-height: 42px;}.e-letter-title + .e-letter-content {margin-top: 20px;}.e-letter-content {background-repeat: repeat-y;background-size: contain;}.u-letter-content__header,.u-letter-content__footer {background-size: 100% auto;background-repeat: no-repeat;}.u-letter-content__footer {padding: 20px;min-height: 200px;background-position: bottom center;}`;
			const { img_title, img_body, img_header, img_footer, slug } = this.data;
			const title = img_title ? `.img_title_${slug}{background-image:url(${img_title});}` : "";
			const body = img_body ? `.img_body_${slug}{background-image:url(${img_body});}` : "";
			const header = img_header ? `.img_header_${slug}{background-image:url(${img_header});}` : "";
			const footer = img_footer ? `.img_footer_${slug}{background-image:url(${img_footer});}` : "";
			const img = title + body + header + footer;
			this.styleTag.textContent = style + common + img;
			document.body.appendChild(this.styleTag);
		},
	},
};
</script>
