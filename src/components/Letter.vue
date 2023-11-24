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
		};
	},
	watch: {
		data: {
			immediate: true,
			deep: true,
			handler(obj) {
				const html = this.initStyle(obj);
				this.html = this.htmlDemo(html);
				this.$emit("update", { html: this.html, id: obj.id });
			},
		},
	},
	methods: {
		initStyle(data) {
			const { style } = data;
			if (!style) {
				return {
					style: ".img_title{}\n\n.img_body{}\n\n.img_header{}\n\n.img_footer{}",
				};
			}
			const ruleRegex = /\.([^{]+)\s*{([^}]*)}/g;
			let match;
			let html = {
				style: "",
			};
			while ((match = ruleRegex.exec(style)) !== null) {
				const className = match[1].trim();
				const styleRules = match[2].trim();
				html[`${className}_style`] = styleRules;
				html[className] = data[className];
				html.style += `.${className}{${html[`${className}_style`]}}\n\n`;
			}
			return html;
		},
		htmlDemo(data) {
			let { img_title, img_body, img_header, img_footer, img_title_style, img_body_style, img_header_style, img_footer_style } = data;
			let title = img_title ? `background-image:url(${img_title});background-size:cover;` : "";
			title += img_title_style;
			let body = img_body ? `background-image:url(${img_body});background-repeat:repeat-y;background-size:contain;` : "";
			body += img_body_style;
			let header = img_header ? `background-image:url(${img_header});background-size:100% auto;background-repeat:no-repeat;` : "";
			header += img_header_style;
			let footer = img_footer ? `background-image:url(${img_footer});background-position: bottom center;background-size:100% auto;background-repeat: no-repeat;min-height:80px;padding:20px;` : "min-height:80px;padding:20px;";
			footer += img_footer_style;

			const titleHtml = `<div class="e-letter-title" style="${title}">我是抬头</div>`;
			const contentHtml = `<div class="e-letter-content" style="${body}"><div class="u-letter-content__header" style="${header}"><div class="u-letter-content__footer" style="${footer}"><p>明月几时有，把酒问青天。</p></div></div></div>`;
			return titleHtml + "<br/>" + contentHtml;
		},
	},
};
</script>
