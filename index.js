// TODO:上传等组件
import Article from './src/Article.vue'

const components = {
    Article,
}

const install = function (Vue, Option) {
     Object.keys(components).forEach((key) => {
        Vue.component(components[key].name, components[key])
    })
}

export default {
    install
}