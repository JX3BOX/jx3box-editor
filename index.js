// TODO:上传等组件
import Article from "./src/Article.vue";
import Buff from "./src/Buff.vue";
import GameText from "./src/GameText.vue";
import Item from "./src/Item.vue";
import ItemSimple from "./src/ItemSimple.vue";
import Npc from "./src/Npc.vue";
import Skill from "./src/Skill.vue";

const components = {
    Article,
    Buff,
    GameText,
    Item,
    ItemSimple,
    Npc,
    Skill,
};

const install = function (Vue, Option) {
    Object.keys(components).forEach((key) => {
        Vue.component(components[key].name, components[key]);
    });
};

export default {
    install,
};
