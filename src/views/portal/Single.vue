<template>
  <div>
    <el-row>
      <el-col>
        <el-button size="small" type="success" @click="showAddDialog">新增单页</el-button>
      </el-col>
    </el-row>
    <el-table :data="singles" border size="medium" style="margin:10px auto;">
      <el-table-column
        label="ID"
        prop="id"
        width="60"
      >
      </el-table-column>
      <el-table-column
        label="单页名称"
        prop="title"
      >
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">发布</el-tag>
          <el-tag v-if="scope.row.status==0" type="warning">未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="摘要"
        prop="excerpt"
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

    <el-dialog title="添加单页" :visible.sync="addDialog" >
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="标题" prop="account">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="account">
          <el-input v-model="form.keywords" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="password">
          <el-input v-model="form.excerpt"  type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="发布" :value=1></el-option>
            <el-option label="未发布" :value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <br>
         <!--<vue-neditor id="addEditor" height="500px" v-model="form.content"></vue-neditor>-->
          <vue-neditor id="addEditor" height="500px" :content="form.content" ref="addEditor"></vue-neditor>
        </el-form-item>
       <el-form-item>
         <el-form-item label="模版">
           <el-select v-model="form.template_id" placeholder="请选择模版" style="width: 100%;">
             <el-option
               v-for="item in templates"
               :key="item.id"
               :label="item.name"
               :value="item.id">
             </el-option>
           </el-select>
         </el-form-item>
       </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑单页" :visible.sync="updateDialog">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="form.keywords" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.excerpt"  type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="发布" :value=1></el-option>
            <el-option label="未发布" :value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <br>
          <vue-neditor id="updateEditor" height="500px" :content="form.content" ref="updateEditor"></vue-neditor>
        </el-form-item>
        <el-form-item>
          <el-form-item label="模版">
            <el-select v-model="form.template_id" placeholder="请选择模版" style="width: 100%;">
              <el-option
                v-for="item in templates"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
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
  import utils from '../../utils/utils'
  export default {
    name: "single",
    data(){
      return{
        currentPage:1,
        pageSize:10,
        total:0,
        addDialog:false,
        updateDialog:false,
        singles:[],
        templates:[],
        form:{
          title:'',
          keywords:'',
          excerpt:'',
          content:'',
          status:1,
          template_id:'',
          more:{}
        },
        dataRules:{
          title:[
            {required: true, message: '请填写标题', trigger: 'blur'}
          ]
        }
      }
    },
    mounted(){
      this.getData();
      this.getTemplate();
    },
    methods:{
      showAddDialog(){
        this.form={
          title:'',
          keywords:'',
          excerpt:'',
          content:'',
          status:1,
          template_id:'',
          more:{}
        };
        this.addDialog=true;
        this.getTemplate();
      },
      showUpdateDialog(row){
        this.getTemplate();
        this.$axios.post('/api/single/get',{
          id:row.id
        },{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
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
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
      },
      pageChange(page){
        this.currentPage=page;
        this.getData();
      },
      addData(){
        this.form.content=this.$refs.addEditor.getContent();
        this.form.more=JSON.stringify(this.form.more);
        this.$axios.post('/api/single/add',this.form,{
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
            this.$axios.post('/api/single/delete',{
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
        this.form.content=this.$refs.updateEditor.getContent();
        this.form.more=JSON.stringify(this.form.more);
        this.$axios.post('/api/single/update',this.form,{
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
        this.$axios.post('/api/single/getByPage',{
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
              this.singles=data.data.pageData;
              this.total=data.data.total;
            }
          })
          .catch(err=>{
            utils.handleErr.call(this,err);
          });
      },
      getTemplate(){
        this.$axios.get('api/template/getSingleTemplate',{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.templates=data.data;
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
      },
    }
  }
</script>

<style>
  .singleContentEditor .ql-container{
    min-height: 300px;
  }
  .singleContentEditor .ql-editor{
    min-height: 300px;
  }
</style>
