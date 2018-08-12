<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-card shadow="never" v-if="dashboard.admin">
            <h3 style="color: #409EFF;text-align: center;padding: 0;margin: 0px;">{{dashboard.admin.account}}</h3>
            <h5 style="color:#909399;text-align: center;padding: 0;margin: 5px;">{{dashboard.admin.role.name}}</h5>
            <div style="text-align: center;">
              <el-tag v-if="dashboard.admin.status==0" type="success" size="small">正常</el-tag>
              <el-tag v-if="dashboard.admin.status==1" type="danger" size="small">锁死</el-tag>
              <el-tag v-if="dashboard.admin.status==2" type="info" size="small">拉黑</el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="never" style="background-color: #009688">
            <h1 style="color: white;text-align: center;padding: 0;margin: 0;font-size: 48px;">{{dashboard.adminCount}}</h1>
            <h5 style="color:white;text-align: center;padding: 0;margin: 0;">管理员</h5>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="never" style="background-color: #1E9FFF">
            <h1 style="color: white;text-align: center;padding: 0;margin: 0;font-size: 48px;">{{dashboard.userCount}}</h1>
            <h5 style="color:white;text-align: center;padding: 0;margin: 0;">用户</h5>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="never" style="background-color: #2F4056">
            <h1 style="color: white;text-align: center;padding: 0;margin: 0;font-size: 48px;">{{dashboard.postCount}}</h1>
            <h5 style="color:white;text-align: center;padding: 0;margin: 0;">文章</h5>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="never" style="background-color: #FFB800">
            <h1 style="color: white;text-align: center;padding: 0;margin: 0;font-size: 48px;">{{dashboard.pluginCount}}</h1>
            <h5 style="color:white;text-align: center;padding: 0;margin: 0;">插件</h5>
          </el-card>
        </el-col>
        <el-col :span="24">
          <div style="height: 30px;"></div>
        </el-col>
        <el-col :span="14">
          <el-card shadow="never"></el-card>
        </el-col>
        <el-col :span="10">
          <el-card shadow="never">
            <span slot="header">最新文章</span>
            <el-table
              :data="dashboard.newPost"
              size="mini"
              style="width: 100%;">
              <el-table-column
                prop="title"
                label="标题"
                width="180">
              </el-table-column>
              <el-table-column
                prop="author"
                label="作者">
              </el-table-column>
              <el-table-column
                label="发布时间">
                <template slot-scope="scope">
                  {{convertTime(scope.row.published_time)}}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import utils from '../../utils/utils'
    export default {
        name: "dash-board",
      data(){
          return {
            dashboard:{},
          };
      },
      mounted(){
          this.getData();
      },
      methods:{
          getData(){
            this.$axios.get('/api/dashboard/getBackDashBoard',{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              if(res.data.status=='200'){
                this.dashboard=res.data.data;
              }
              else{
                this.$message.error(utils.responseToString(res.data.msg));
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            });
          },
        convertTime(timestamp){
          if(timestamp&&timestamp.toString().length>=10){
            let date=utils.convertTime(timestamp);
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
          }
          return;
        }
      }
    }
</script>

<style scoped>

</style>
