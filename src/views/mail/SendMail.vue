<template>
<div>
  <el-form>
    <el-form-item label="收件人">
      <el-input v-model="to"></el-input>
    </el-form-item>
    <el-form-item label="主题">
      <el-input v-model="subject"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <vue-neditor height="500px" ref="mailEditor"></vue-neditor>
    </el-form-item>
    <el-form-item label="选择系统邮箱">
      <el-input v-model="from.address" @focus="showSelectMailDialog" readonly></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="sendMail">发送</el-button>
    </el-form-item>
  </el-form>
  <el-dialog title="选择系统邮箱" :visible.sync="selectMailDialog">
    <el-table :data="mails" v-loading="loading" border stripe size="medium" style="margin:10px auto;">
      <el-table-column
        label="E-mail"
        prop="address">
      </el-table-column>
      <el-table-column
        label="发件人名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="selectMail(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="pageChange"
    >
    </el-pagination>
    <span slot="footer">
    <el-button @click="selectMailDialog=false">关闭</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
  import apis from '../../api/apis'
    export default {
        name: "send-mail",
      data(){
          return{
            to:'',
            from:'',
            subject:'',
            mails:'',
            currentPage:1,
            pageSize:10,
            total:0,
            selectMailDialog:false,
            loading:false
          }
      },
      methods:{
          selectMail(row){
            this.from=row;
            this.selectMailDialog=false;
          },
        showSelectMailDialog(){
            this.loading=true;
            this.selectMailDialog=true;
            this.currentPage=1;
            this.getMailData();
        },
        getMailData(){
          let params={
            page:this.currentPage,
            pageSize:this.pageSize,
            clientType:0,
          };
          apis.getMails(params).then(res=>{
            this.loading=false;
            let data=res.data;
            if(data.status=='200'){
              this.mails=data.data.pageData;
              this.total=data.data.total;
            }
          });
        },
        pageChange(page){
            this.currentPage=page;
            this.getMailData();
        },
        sendMail(){
            let params={
              id:this.from.id,
              to:[this.to],
              subject:this.subject,
              content:this.$refs.mailEditor.getContent(),
            };
            apis.sendMail(params).then(res=>{
              console.log(res);
              this.$message.success('发送完成');
            });
        }
      }
    }
</script>

<style scoped>
.el-dialog__wrapper{
  z-index: 10000!important;
}
</style>
