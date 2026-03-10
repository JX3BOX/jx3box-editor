<template>
    <div>
        <ArticleMarkdown :content="content"/>
    </div>
</template>

<script>
import content from './content_4'
import ArticleMarkdown from '../src/ArticleMarkdown.vue'
export default {
   name : '',
   props:[],
   components : {
       ArticleMarkdown
   },
   data : function(){
       return {
           content,
       }
   },
   computed:{},
   watch:{},
   methods:{},
   filters:{},
   created:function(){},
   mounted:function(){},
}
</script>