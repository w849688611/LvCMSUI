<template>
<div>
  <script :id="editorId" type="text/plain" :style="{width:width,height:height}"></script>
</div>
</template>

<script>
  import './../../static/neditor/neditor.config'
  import './../../static/neditor/neditor.all.min'
import './../../static/neditor/i18n/zh-cn/zh-cn'
    export default {
        name: "vue-neditor",
      model:{
          prop:'content',
          event:'contentChange'
      },
      props:{
          id:{
            default:'editor'
          },
          width:{
            default:'100%'
          },
          height:{
            default:'300px'
          },
          zIndex:{
            default:3000
          },
          content:{
            default:''
          }
      },
      data(){
          return{
            editor:null,
            editorId:this.id+Date.now().toString()
          }
      },
      watch:{
          content:function(val,oleVal){
            this.editor.setContent(val?val:'');
            this.editor.focus(true);
          }
      },
      mounted(){
          this.editor=UE.getEditor(this.editorId,{
            zIndex:this.zIndex
          });
          this.editor.ready(()=>{
            this.editor.setContent(this.content);
          });
          this.editor.addListener('contentChange',()=>{
            this.$emit('contentChange',this.editor.getContent());
          });
      },
      beforeDestroy(){
          this.editor.reset();
      },
      methods:{
          getContent(){
            if(this.editor){
              return this.editor.getContent();
            }
          },
        setContent(content){
            if(this.editor){
              this.editor.ready(()=>{
                this.editor.setContent(content);
              });
            }
        }
      }
    }
</script>

<style scoped>

</style>
