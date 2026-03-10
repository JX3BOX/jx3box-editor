<template>
	<div class="c-letter-paper">
		<div
			:class="`c-letter-title c-letter-title__${data.slug}`"
			:style="{
				backgroundImage: `url(${data.img_title || ''})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
			}"
		>
			我是抬头
		</div>
		<div
			:class="`c-letter-content c-letter-content__${data.slug}`"
			:style="{
				backgroundImage: `url(${data.img_body || ''})`,
			}"
		>
			<div
				class="u-header"
				:style="{
					backgroundImage: `url(${data.img_header || ''})`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'top center',
				}"
			>
				<div
					class="u-footer"
					:style="{
						backgroundImage: `url(${data.img_footer || ''})`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'bottom center',
					}"
				>
					<p v-for="o in 4" :key="o">明月几时有，把酒问青天。</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "letter-demo",
	props: {
		data: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			styleTag: null,
		};
	},
	watch: {
		"data.style": {
			immediate: true,
			handler(val) {
				this.insertStyle(val);
			},
		},
	},
	methods: {
		insertStyle(style) {
			if (this.styleTag) {
				document.body.removeChild(this.styleTag);
			}
			this.styleTag = document.createElement("style");
			this.styleTag.textContent = style;
			document.body.appendChild(this.styleTag);
		},
	},
};
</script>
<style lang="less">
.c-letter-title {
	background-size: cover;
}
.c-letter-content {
	margin-top: 20px;
	background-repeat: repeat-y;
	background-size: contain;
}
.c-letter-content .u-header,
.c-letter-content .u-footer {
	background-size: contain;
	background-repeat: no-repeat;
}
.c-letter-content .u-footer {
	background-position: bottom;
}
</style>
