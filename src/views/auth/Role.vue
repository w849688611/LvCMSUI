<template>
<div>
  <el-row>
    <el-col>
      <el-button size="small" type="success" @click="showAddDialog">新增角色</el-button>
    </el-col>
  </el-row>
  <el-table :data="roles" border size="medium" style="margin:10px auto;">
    <el-table-column
    label="角色名称"
    prop="name"
    >
    </el-table-column>
    <el-table-column
      label="创建时间"
      prop="create_time">
    </el-table-column>
    <el-table-column
      label="更新时间"
      prop="update_time">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
        <el-button type="warning" size="mini" @click="showTreeDialog(scope.row)">配置权限</el-button>
        <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
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
  <el-dialog title="添加角色" :visible.sync="addDialog" >
    <el-form :model="form" :rules="dataRules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
  </el-dialog>
  <el-dialog title="编辑角色" :visible.sync="updateDialog">
    <el-form :model="form" :rules="dataRules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
    <el-button @click="updateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateData">确定</el-button>
    </span>
  </el-dialog>
  <el-dialog title="配置权限" :visible.sync="treeDialog">
    <el-tree :data="authTree" ref="tree" node-key="id" :props="{label:'name'}" show-checkbox class="authTree">
    </el-tree>
    <el-button @click="treeDialog=false">取消</el-button>
    <el-button type="primary" @click="setAuth">确定</el-button>
  </el-dialog>
</div>
</template>

<script>
  import utils from '../../utils/utils'
    export default {
        name: "role",
      data(){
          return{
            tempId:'',//当前操作行的角色的id
            currentPage:1,
            pageSize:10,
            total:0,
            addDialog:false,
            updateDialog:false,
            treeDialog:false,
            authTree:[],
            roles:[],
            form:{
              name:'',
            },
            dataRules:{
              name:[
                {required: true, message: '请输入角色名称', trigger: 'blur'}
              ]
            }
          }
      },
      mounted(){
          this.getData();
        this.getTree();
      },
      methods:{
          showAddDialog(){
            this.addDialog=true;
          },
        showUpdateDialog(row){
            this.$axios.post('/api/role/get',{
              id:row.id
            },{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.form=data.data;
                this.updateDialog=true;
              }else{
                this.$message.error(data.msg);
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            })
        },
        showTreeDialog(row){
          this.tempId=row.id;
          this.treeDialog=true;
            this.$axios.get('/api/role/get',{
              params:{
                id:row.id
              },
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              let data=res.data;
                if(data.status=='200'){
                  this.treeDialog=true;
                  console.log(this.$refs.tree);
                  this.$refs.tree.setCheckedNodes(data.data.auth);
                }
                else{
                  this.$message.error(utils.responseToString(data.msg));
                }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            });
        },
        addData(){
            this.$axios.post('/api/role/add',this.form,{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              if(res.data.status=='200'){
                this.$message.success(res.data.msg);
                this.addDialog=false;
                utils.clearObj(this.form);
                this.getData();
              }
              else{
                this.$message.error(utils.responseToString(res.data.msg));
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            });
        },
        deleteData(row){
          this.$confirm('确认删除该项？')
            .then(()=> {
              this.$axios.post('/api/role/delete',{
                id:row.id
              },{
                headers:{
                  token:utils.getToken()
                }
              }).then(res=>{
                if(res.data.status=='200'){
                  this.$message.success(res.data.msg);
                  this.getData();
                }
                else{
                  this.$message.error(utils.responseToString(res.data.msg));
                }
              }).catch(err=>{
                utils.handleErr.call(this,err);
              })
            });
        },
        updateData(){
            this.$axios.post('/api/role/update',this.form,{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.updateDialog=false;
                this.$message.success(data.msg);
                this.getData();
              }
              else{
                this.$message.error(utils.responseToString(data.msg));
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            });
        },
        getData(){
            this.$axios.post('/api/role/getByPage',{
              page:this.currentPage,
              pageSize:this.pageSize
            },{
              headers:{
                token:utils.getToken()
              }
            })
              .then(res=>{
                let data=res.data;
                if(data.status=='200'){
                  this.roles=data.data.pageData;
                  this.total=data.data.total;
                }
              })
              .catch(err=>{
                utils.handleErr.call(this,err);
            })
          },
        pageChange(page){
            this.currentPage=page;
            this.getData();
        },
        getTree(){
          this.$axios.get('/api/auth/getTree',{headers:{
              token:utils.getToken()
            }}).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.authTree=data.data;
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          })
        },
        setAuth(){
            let auths=this.$refs.tree.getCheckedNodes();
            this.$axios.post('/api/role/bindAuth',{
              id:this.tempId,
              auths:JSON.stringify(auths)
            },{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.$message.success('配置权限成功');
                this.treeDialog=false;
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

<style>
  .authTree{
    margin-bottom: 10px;
  }
  .authTree .el-tree-node{
    margin-top: 10px!important;
  }
  .authTree .el-tree-node__content{
    height: 36px!important;
  }
</style>
