<template>
<div>
  <el-form :inline="true" class="searchForm">
    <el-form-item>
      <el-button size="small" type="success" @click="showAddDialog" icon="el-icon-plus"></el-button>
      <el-button size="small" type="danger" @click="deleteDataBySelection" icon="el-icon-delete"></el-button>
      <el-button size="small" icon="el-icon-refresh" @click="getData"></el-button>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="search.email" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item label="类型">
      <el-select v-model="search.clientType" placeholder="类型">
        <el-option label="全部" :value="-1"></el-option>
        <el-option label="系统邮箱" :value="0"></el-option>
        <el-option label="用户邮箱" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getData">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="mails" v-loading="loading" border stripe size="medium" style="margin:10px auto;" @selection-change="selectChange">
    <el-table-column
      type="selection"
      width="40">
    </el-table-column>
    <el-table-column
      label="E-mail"
      prop="address">
    </el-table-column>
    <el-table-column
      label="SMTP Host"
      prop="smtp_host">
    </el-table-column>
    <el-table-column
      label="SMTP Port"
      prop="smtp_port">
    </el-table-column>
    <el-table-column
      label="发件人名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="类型">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.client_type=='0'" color="#009688" size="mini"><span style="color: white;">系统邮箱</span></el-tag>
        <el-tag v-if="scope.row.client_type=='1'" color="#01AAED" size="mini"><span style="color: white;">用户邮箱</span></el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button-group>
          <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
        </el-button-group>
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
  <el-dialog title="添加" :visible.sync="addDialog" >
    <el-form :model="form" :rules="dataRules">
      <el-form-item label="邮箱地址" prop="address">
        <el-input v-model="form.address" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="SMTP Host" prop="smtp_host">
        <el-input v-model="form.smtp_host" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="SMTP 端口" prop="smtp_port">
        <el-input v-model="form.smtp_port" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="使用类型">
        <el-select v-model="form.client_type">
          <el-option label="系统邮箱" :value=0></el-option>
          <el-option label="用户邮箱" :value=1></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="连接类型">
        <el-select v-model="form.connect_type">
          <el-option label="SSL" :value=0></el-option>
          <el-option label="TLS" :value=1></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发件人名称" prop="account">
        <el-input v-model="form.name" auto-complete="off">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
  </el-dialog>
  <el-dialog title="编辑" :visible.sync="updateDialog">
    <el-form :model="form" :rules="dataRules">
      <el-form-item label="邮箱地址" prop="address">
        <el-input v-model="form.address" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="SMTP Host" prop="smtp_host">
        <el-input v-model="form.smtp_host" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="SMTP 端口" prop="smtp_port">
        <el-input v-model="form.smtp_port" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="使用类型">
        <el-select v-model="form.client_type">
          <el-option label="系统邮箱" :value=0></el-option>
          <el-option label="用户邮箱" :value=1></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="连接类型">
        <el-select v-model="form.connect_type">
          <el-option label="SSL" :value=0></el-option>
          <el-option label="TLS" :value=1></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发件人名称">
        <el-input v-model="form.name" auto-complete="off">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
    <el-button @click="updateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateData">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import apis from '../../api/apis'
  import utils from '../../utils/utils'
    export default {
        name: "mail",
      data(){
          return {
            search:{
              email:'',
              clientType:-1
            },
            currentPage:1,
            pageSize:10,
            total:0,
            selection:[],
            addDialog:false,
            updateDialog:false,
            mails:[],
            loading:false,
            form:{
              name:'',
              account:'',
              password:'',
              smtp_host:'',
              smtp_port:'',
              address:'',
              client_type:0,
              connect_type:0,
            },
            dataRules:{
              smtp_host:[
                {required: true, message: '请填写smtp域名', trigger: 'blur'}
              ],
              smtp_port:[
                {required: true, message: '请填写smtp端口', trigger: 'blur'}
              ],
              account:[
                {required: true, message: '请填写账号', trigger: 'blur'}
              ],
              password:[
                {required: true, message: '请填写密码', trigger: 'blur'}
              ],
              address:[
                {required: true, message: '请填写邮箱地址', trigger: 'blur'}
              ],
            }
          }
      },
      mounted(){
        this.getData();
      },
      methods:{
        showAddDialog(){
          this.form={
            name:'',
            account:'',
            password:'',
            smtp_host:'',
            smtp_port:'',
            address:'',
            client_type:0,
            connect_type:0,
          };
          this.addDialog=true;
        },
        showUpdateDialog(row){
          apis.getMail(row.id).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.form=data.data;
              this.updateDialog=true;
            }else{
              this.$message.error(utils.responseToString(data.msg));
            }
          });
        },
        pageChange(page){
          this.currentPage=page;
          this.getData();
        },
        selectChange(selection){
          this.selection=selection;
        },
        addData(){
          apis.addMail(this.form).then(res=>{
            if(res.data.status=='200'){
              this.$message.success(res.data.msg);
              this.addDialog=false;
              utils.clearObj(this.form);
              this.getData();
            }
            else{
              this.$message.error(utils.responseToString(res.data.msg));
            }
          });
        },
        deleteData(row){
          this.$confirm('确认删除该项？')
            .then(()=> {
              apis.deleteMail({id:row.id}).then(res=>{
                if(res.data.status=='200'){
                  this.$message.success(res.data.msg);
                  this.getData();
                }
                else{
                  this.$message.error(utils.responseToString(res.data.msg));
                }
              });
            });
        },
        updateData(){
          apis.updateMail(this.form).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.updateDialog=false;
              this.$message.success(data.msg);
              this.getData();
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          });
        },
        getData(){
          this.loading=true;
          let params={
            page:this.currentPage,
            pageSize:this.pageSize,
            address:this.search.email,
          };
          if(this.search.clientType!='-1'){
            params.clientType=this.search.clientType
          }
         apis.getMails(params).then(res=>{
              this.loading=false;
              let data=res.data;
              if(data.status=='200'){
                this.mails=data.data.pageData;
                this.total=data.data.total;
              }
            });
        },
        deleteDataBySelection(){
          let ids=this.selection.map(item=>item.id);
          this.$confirm('确认删除所选项？')
            .then(()=> {
             apis.deleteMail({ids:ids}).then(res=>{
                if(res.data.status=='200'){
                  this.$message.success(res.data.msg);
                  this.getData();
                }
                else{
                  this.$message.error(utils.responseToString(res.data.msg));
                }
              });
            });
        },
      }

    }
</script>

<style scoped>
.searchForm{
  background: #eee;
  padding-top: 25px;
  padding-left: 10px;
}
</style>
