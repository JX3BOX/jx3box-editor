// 第三方UI组件
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);
import "@jx3box/jx3box-common/css/element.css";

import A from './A.vue'

Vue.config.productionTip = false

new Vue({
    render: h => h(A),
}).$mount('#app')
