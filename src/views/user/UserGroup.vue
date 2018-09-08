<template>
  <div>
    <el-row>
      <el-col>
        <el-button size="small" type="success" @click="showAddDialog">新增用户组</el-button>
      </el-col>
    </el-row>
    <el-table :data="userGroups" border stripe size="medium" style="margin:10px auto;">
      <el-table-column
        label="用户组名称"
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
          <el-button-group>
            <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
            <el-button type="warning" size="mini" @click="showUserDialog(scope.row)">组下用户</el-button>
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
    <el-dialog title="添加用户组" :visible.sync="addDialog" >
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="用户组名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑用户组" :visible.sync="updateDialog">
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
    <el-dialog title="用户组下用户" :visible.sync="userDialog">
      <el-table :data="users" border size="medium" style="margin:10px auto;">
        <el-table-column
          label="用户组名称"
          prop="account"
        >
        </el-table-column>
        <el-table-column
        label="用户状态"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==0" type="success">正常</el-tag>
            <el-tag v-if="scope.row.status==1" type="warning">锁死</el-tag>
            <el-tag v-if="scope.row.status==2" type="danger">拉黑</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="userDialog=false">取消</el-button>
      <el-button type="primary" >确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import utils from '../../utils/utils'
  export default {
    name: "userGroup",
    data(){
      return{
        tempId:'',//当前操作行的角色的id
        currentPage:1,
        pageSize:10,
        total:0,
        currentUserPage:1,
        userPageSize:10,
        userTotal:0,
        addDialog:false,
        updateDialog:false,
        userDialog:false,
        users:[],
        userGroups:[],
        form:{
          name:'',
        },
        dataRules:{
          name:[
            {required: true, message: '请输入用户组名称', trigger: 'blur'}
          ]
        }
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
      showAddDialog(){
        this.addDialog=true;
      },
      showUpdateDialog(row){
        this.$axios.post('/api/userGroup/get',{
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
      showUserDialog(row){
        this.tempId=row.id;
        this.userDialog=true;
        this.$axios.get('/api/userGroup/getUserOfGroup',{
          params:{
            id:row.id
          },
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.users=data.data.pageData;
            this.userTotal=data.data.total;
            this.currentUserPage=data.data.page;
            this.userPageSize=data.data.pageSize;
            this.userDialog=true;
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
      },
      addData(){
        this.$axios.post('/api/userGroup/add',this.form,{
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
            this.$axios.post('/api/userGroup/delete',{
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
        this.$axios.post('/api/userGroup/update',this.form,{
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
        this.$axios.post('/api/userGroup/getByPage',{
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
              this.userGroups=data.data.pageData;
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
      }
    }
  }
</script>

<style>

</style>
