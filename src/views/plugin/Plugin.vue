<template>
  <div>
    <el-row :gutter="20">
      <el-col v-for="(item,index) in plugins" :key="index" :span="8">
        <el-card >
          <div slot="header" class="pluginTitle">
            <el-row>
              <el-col :span="20">{{item.name}}</el-col>
              <el-col :span="4">
                <span v-if="item.status!=-1">
                  <el-switch
                    v-model="item.status"
                    :disable="item.status==-1?true:false"
                    :active-value=1
                    :inactive-value=0
                    @change="togglePlugin(item)"
                  >
                    </el-switch>
                </span>
              </el-col>
            </el-row>
          </div>
          <div>
            <p style="font-size: 14px;color: #999999;padding: 0;">简介：{{item.description}}</p>
            <div>
              <span v-if="item.status==-1">
                <el-button round size="mini" type="primary" @click="installPlugin(item)">安装</el-button>
              </span>
              <span v-else>
                <el-button round size="mini" type="warning" @click="updatePlugin(item)">
                  更新
                </el-button>
                <el-button round size="mini" type="danger" @click="uninstallPlugin(item)">
                  卸载
                </el-button>
              </span>
              <span>
                <el-button round size="mini" type="info" @click="helpPlugin(item)">
                  文档
                </el-button>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="helpDialog" title="插件文档">
      <div v-html="helpContent"></div>
      <span slot="footer">
        <el-button @click="helpDialog=false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import utils from '../../utils/utils'
    export default {
        name: "plugin",
      data(){
         return {
           plugins:[],
           helpDialog:false,
           helpContent:''//帮助文档的内容
         }
      },
      mounted(){
          this.getPlugins();
      },
      methods:{
          getPlugins(){
            this.$axios.get('/api/plugin/get',{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.plugins=data.data;
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            })
          },
        installPlugin(item){
            this.$axios.post('/api/plugin/install',{
              name:item.name,
              author:item.author
            },{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.$message.success('安装插件成功');
                this.getPlugins();
              }
              else{
                this.$message.error(utils.responseToString(data.msg));
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            });
        },
        updatePlugin(item){
          this.$axios.post('/api/plugin/update',{
            name:item.name,
            author:item.author
          },{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.$message.success('更新插件成功');
              this.getPlugins();
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          });
        },
        uninstallPlugin(item){
          this.$axios.post('/api/plugin/uninstall',{
            name:item.name,
            author:item.author
          },{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.$message.success('卸载插件成功');
              this.getPlugins();
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          });
        },
        helpPlugin(item){
            this.$axios.post('/api/plugin/help',{
              name:item.name,
              author:item.author
            },{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.helpContent=data.data.help||'';
                this.helpDialog=true;
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            });
        },
        togglePlugin(item){
            this.$axios.post('/api/plugin/toggle',{
              name:item.name,
              author:item.author,
              status:item.status
            },{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.$message.success('切换插件状态成功');
              }
              else{
                this.$message.error(utils.responseToString(data.msg));
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            });
        }
      }
    }
</script>

<style scoped>
.pluginTitle{
  font-size: 20px;
}
</style>
