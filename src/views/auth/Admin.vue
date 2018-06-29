<template>
  <div>
    <el-row>
      <el-col>
        <el-button size="small" type="success" @click="showAddDialog">新增管理员</el-button>
      </el-col>
    </el-row>
    <el-table :data="admins" border size="medium" style="margin:10px auto;">
      <el-table-column
        label="ID"
        prop="id"
        width="60"
      >
      </el-table-column>
      <el-table-column
        label="管理员帐号"
        prop="account"
      >
      </el-table-column>
      <el-table-column
        label="管理员状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status==1" type="warning">锁死</el-tag>
          <el-tag v-if="scope.row.status==2" type="danger">拉黑</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="管理员角色"
        prop="role.name"
      >
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
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

    <el-dialog title="添加管理员" :visible.sync="addDialog" >
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="管理员帐号" prop="account">
          <el-input v-model="form.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="form.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="管理员状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="正常" value=0></el-option>
            <el-option label="锁死" value=1></el-option>
            <el-option label="拉黑" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否超级管理员">
          <el-radio-group v-model="form.super">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色分配" prop="role_name">
          <el-input readonly v-model="form.role_name" @focus="showRoleSelectDialog"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑管理员" :visible.sync="updateDialog">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="管理员帐号" prop="account">
          <el-input v-model="form.account" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="form.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="管理员状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="正常" value=0></el-option>
            <el-option label="锁死" value=1></el-option>
            <el-option label="拉黑" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否超级管理员">
          <el-radio-group v-model="form.super">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色分配" prop="role_name">
          <el-input readonly v-model="form.role_name" @focus="showRoleSelectDialog"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="updateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateData">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="选择角色" :visible.sync="roleSelectDialog">
      <el-table :data="roles">
        <el-table-column border size="small" style="margin:10px auto;" label="ID" prop="id">
        </el-table-column>
        <el-table-column border size="small" style="margin:10px auto;" label="角色" prop="name">
        </el-table-column>
        <el-table-column border size="small" style="margin:10px auto;" label="选择角色" >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="selectRole(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
    <el-button type="primary" @click="roleSelectDialog=false">关闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import utils from '../../utils/utils'
  export default {
    name: "admin",
    data(){
      return{
        currentPage:1,
        pageSize:10,
        total:0,
        addDialog:false,
        updateDialog:false,
        roleSelectDialog:false,
        admins:[],
        roles:[],
        form:{
          account:'',
          password:'',
          status:'0',
          super:0,
          role_id:'',
          role_name:''
        },
        dataRules:{
          account:[
            {required: true, message: '请填写管理员帐号', trigger: 'blur'}
          ],
          password:[
            {required: true, message: '请填写管理员密码', trigger: 'blur'}
          ],
          status:[
            {required: true, message: '请选择管理员状态', trigger: 'blur'}
          ]
        }
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
      showAddDialog(){
        this.form={
          account:'',
          password:'',
          status:'0',
          super:0,
          role_id:'',
          role_name:''
        };
        this.addDialog=true;
      },
      showUpdateDialog(row){
        this.$axios.post('/api/admin/get',{
          id:row.id
        },{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.form=data.data;
            this.form.role_name=this.form.role.name;
            this.form.password='';
            this.updateDialog=true;
          }else{
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        })
      },
      showRoleSelectDialog(){
        this.getRole();
        this.roleSelectDialog = true;
      },
      selectRole(data){
        this.form.role_id=data.id;
        this.form.role_name=data.name;
        this.roleSelectDialog=false;
      },
      pageChange(page){
        this.currentPage=page;
        this.getData();
      },
      addData(){
        this.$axios.post('/api/admin/add',this.form,{
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
            this.$axios.post('/api/admin/delete',{
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
        this.$axios.post('/api/admin/update',this.form,{
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
        this.$axios.post('/api/admin/getByPage',{
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
              this.admins=data.data.pageData;
              this.total=data.data.total;
            }
          })
          .catch(err=>{
            utils.handleErr.call(this,err);
          })
      },
      getRole(){
        this.$axios.get('/api/role/get',{headers:{
            token:utils.getToken()
          }}).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.roles=data.data;
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        })
      }
    }
  }
</script>

<style>
  .authTree .el-tree-node{
    margin-top: 10px!important;
  }
  .authTree .el-tree-node__content{
    height: 36px!important;
  }
  .treeNode{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .treeNodeSelect{
    background: #ddd;
  }
</style>
