<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="权限资源" name="first">
        <el-row>
          <el-col>
            <el-button size="small" type="success" @click="showAddDialog">新增权限</el-button>
          </el-col>
        </el-row>
        <el-table :data="roles" border size="medium" stripe style="margin:10px auto;">
          <el-table-column
            label="ID"
            prop="id"
            width="60"
          >
          </el-table-column>
          <el-table-column
            label="权限名称"
            prop="name"
          >
          </el-table-column>
          <el-table-column
            label="资源路径"
            prop="uris">
          </el-table-column>
          <el-table-column
            label="父级ID"
            prop="parent_id"
            width="90"
          >
          </el-table-column>
          <el-table-column label="权重"
          prop="list_order" width="90"
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
      </el-tab-pane>
      <el-tab-pane label="树形结构" name="second">
        <el-tree
        :data="authTree"
        node-key="id"
        class="authTree"
        default-expand-all>
          <span class="treeNode" slot-scope="{ node, data }">
        <span>{{ data.name }}({{data.uris}})</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            @click="showUpdateDialog(data)">
            编辑权限
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="deleteData(data)">
            删除权限
          </el-button>
        </span>
      </span>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="添加权限资源" :visible.sync="addDialog" >
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="权限资源名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限资源路径" prop="uris">
          <el-input v-model="form.uris" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权重(越大越靠前)">
          <el-input v-model="form.list_order" type="number"></el-input>
        </el-form-item>
        <el-form-item label="父级资源" prop="parent_id">
          <el-input v-model="form.parent_name" readonly @focus="showTreeDialog"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.more.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑权限资源" :visible.sync="updateDialog">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="权限资源名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限资源路径" prop="uris">
          <el-input v-model="form.uris" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权重(越大越靠前)">
          <el-input v-model="form.list_order" type="number"></el-input>
        </el-form-item>
        <el-form-item label="父级资源" prop="parent_id">
          <el-input v-model="form.parent_name" readonly @focus="showTreeDialog"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.more.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="updateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateData">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="选择资源" :visible.sync="treeDialog">
      <el-tree ref="tree" node-key="id" :data="authTree" :props="{label:'name'}" class="authTree">
         <span :class="{treeNode:true,treeNodeSelect:data.id==form.parent_id}" slot-scope="{ node, data }">
        <span>{{ data.name }}({{data.uris}})</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="selectAuth(data)">
            选择
          </el-button>
        </span>
      </span>
      </el-tree>
      <span slot="footer">
        <el-button type="warning" @click="selectAuth({id:0,name:'一级权限资源'})">设为一级权限资源</el-button>
    <el-button type="primary" @click="treeDialog=false">关闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import utils from '../../utils/utils'
  import apis from '../../api/apis'
  export default {
    name: "auth",
    data(){
      return{
        activeName:'first',
        currentPage:1,
        pageSize:10,
        total:0,
        addDialog:false,
        updateDialog:false,
        treeDialog:false,
        roles:[],
        authTree:[],
        form:{
          name:'',
          uris:'',
          parent_id:0,
          parent_name:'一级权限资源',
          list_order:0,
          more:{
            icon:''
          }
        },
        dataRules:{
          name:[
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          uris:[
            {required: true, message: '请填写权限路径', trigger: 'blur'}
          ],
          parent_id:[
            {required: true, message: '请选择父级权限', trigger: 'blur'}
          ],
        }
      }
    },
    mounted(){
      this.getData();
      this.getTree();
    },
    methods:{
      showAddDialog(){
        this.form={
          name:'',
          uris:'',
          parent_id:0,
          parent_name:'一级权限资源',
          more:{
            icon:''
          }
        };
        this.addDialog=true;
      },
      showUpdateDialog(row){
        apis.getAuth(row.id).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.form=data.data;
            if(!this.form.more){
              this.form.more={};
            }
            this.updateDialog=true;
          }else{
            this.$message.error(data.msg);
          }
        });
      },
      showTreeDialog(){
        this.getTree();
        this.treeDialog=true;
      },
      selectAuth(data){
        this.form.parent_id=data.id;
        this.form.parent_name=data.name;
        this.treeDialog=false;
      },
      pageChange(page){
        this.currentPage=page;
        this.getData();
      },
      addData(){
        this.form.more=JSON.stringify(this.form.more);
       apis.addAuth(this.form).then(res=>{
          if(res.data.status=='200'){
            this.$message.success(res.data.msg);
            this.addDialog=false;
            utils.clearObj(this.form);
            this.getData();
            this.getTree();
          }
          else{
            this.$message.error(utils.responseToString(res.data.msg));
          }
        });
      },
      deleteData(row){
        this.$confirm('确认删除该项？')
          .then(()=> {
            apis.deleteAuth(row.id).then(res=>{
              if(res.data.status=='200'){
                this.$message.success(res.data.msg);
                this.getData();
                this.getTree();
              }
              else{
                this.$message.error(utils.responseToString(res.data.msg));
              }
            });
          });
      },
      updateData(){
        this.form.more=JSON.stringify(this.form.more);
       apis.updateAuth(this.form).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.updateDialog=false;
            this.$message.success(data.msg);
            this.getData();
            this.getTree();
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        });
      },
      getData(){
        apis.getAuths({ page:this.currentPage, pageSize:this.pageSize})
          .then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.roles=data.data.pageData;
              this.total=data.data.total;
            }
          });
      },
      getTree(){
        apis.getAuthTree().then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.authTree=data.data;
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        });
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
