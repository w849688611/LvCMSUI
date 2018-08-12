<template>
  <div>
    <el-row>
      <el-col>
        <el-button size="small" type="success" @click="showAddDialog" icon="el-icon-plus"></el-button>
        <el-button size="small" type="danger" @click="deleteDataBySelection" icon="el-icon-delete"></el-button>
        <el-button size="small" icon="el-icon-refresh" @click="getData"></el-button>
      </el-col>
    </el-row>
    <el-table :data="users" border size="medium" style="margin:10px auto;" @selection-change="selectChange">
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        label="ID"
        prop="id"
        width="60"
      >
      </el-table-column>
      <el-table-column
        label="帐号"
        prop="account"
      >
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status==1" type="warning">锁死</el-tag>
          <el-tag v-if="scope.row.status==2" type="danger">拉黑</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="用户组"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.user_group">{{scope.row.user_group.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
            <el-button type="warning" size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
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

    <el-dialog title="添加用户" :visible.sync="addDialog" >
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="帐号" prop="account">
          <el-input v-model="form.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="正常" value=0></el-option>
            <el-option label="锁死" value=1></el-option>
            <el-option label="拉黑" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户组">
          <el-input readonly v-model="form.user_group_name" @focus="showUserGroupDialog"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="updateDialog">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="帐号" prop="account">
          <el-input v-model="form.account" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="正常" value=0></el-option>
            <el-option label="锁死" value=1></el-option>
            <el-option label="拉黑" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户组">
          <el-input readonly v-model="form.user_group_name" @focus="showUserGroupDialog"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="updateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateData">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="选择用户组" :visible.sync="userGroupSelectDialog">
      <el-table :data="userGroups">
        <el-table-column border size="small" style="margin:10px auto;" label="用户组" prop="name">
        </el-table-column>
        <el-table-column border size="small" style="margin:10px auto;" label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="selectUserGroup(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="currentUserGroupPage"
        :page-size="userGroupPageSize"
        :total="userGroupTotal"
        @current-change="userGroupPageChange"
      >
      </el-pagination>
      <span slot="footer">
    <el-button type="primary" @click="userGroupSelectDialog=false">关闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import utils from '../../utils/utils'
  export default {
    name: "user",
    data(){
      return{
        currentPage:1,
        pageSize:10,
        total:0,
        currentUserGroupPage:1,
        userGroupPageSize:10,
        userGroupTotal:0,
        selection:[],
        addDialog:false,
        updateDialog:false,
        userGroupSelectDialog:false,
        users:[],
        userGroups:[],
        form:{
          account:'',
          password:'',
          status:'0',
          user_group_id:'',
          user_group_name:''
        },
        dataRules:{
          account:[
            {required: true, message: '请填写用户帐号', trigger: 'blur'}
          ],
          password:[
            {required: true, message: '请填写用户密码', trigger: 'blur'}
          ],
          status:[
            {required: true, message: '请选择用户状态', trigger: 'blur'}
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
          user_group_id:'',
          user_group_name:''
        };
        this.addDialog=true;
      },
      showUpdateDialog(row){
        this.$axios.post('/api/user/get',{
          id:row.id
        },{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.form=data.data;
            this.form.user_group_name=this.form.user_group?this.form.user_group.name:'暂未分组';
            this.updateDialog=true;
          }else{
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        })
      },
      showUserGroupDialog(){
        this.getUserGroup();
        this.userGroupSelectDialog = true;
      },
      selectUserGroup(data){
        this.form.user_group_id=data.id;
        this.form.user_group_name=data.name;
        this.userGroupSelectDialog=false;
      },
      pageChange(page){
        this.currentPage=page;
        this.getData();
      },
      userGroupPageChange(page){
        this.currentUserGroupPage=page;
        this.getUserGroup();
      },
      selectChange(selection){
        this.selection=selection;
      },
      addData(){
        this.$axios.post('/api/user/add',this.form,{
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
            this.$axios.post('/api/user/delete',{
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
        delete this.form.password;
        this.$axios.post('/api/user/update',this.form,{
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
        this.$axios.post('/api/user/getByPage',{
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
              this.users=data.data.pageData;
              this.total=data.data.total;
            }
          })
          .catch(err=>{
            utils.handleErr.call(this,err);
          })
      },
      deleteDataBySelection(){
        let ids=this.selection.map(item=>item.id);
        this.$confirm('确认删除所选项？')
          .then(()=> {
            this.$axios.post('/api/user/delete',{
              ids:ids
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
      getUserGroup(){
        this.$axios.get('/api/userGroup/getByPage',{
          headers:{
            token:utils.getToken()
          },
          params:{
            page:this.currentUserGroupPage,
            pageSize:this.userGroupPageSize
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.userGroupTotal=data.data.total;
            this.userGroups=data.data.pageData;
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        })
      },
      resetPassword(row){
        let id=row.id;
        this.$confirm('确认重置密码？').then(()=>{
          this.$axios.post('/api/user/update',{
            id:id,
            password:'000000'
          },{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.updateDialog=false;
              this.$message.success('重置密码成功');
              this.getData();
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          });
        });
      }
    }
  }
</script>

<style>

</style>
