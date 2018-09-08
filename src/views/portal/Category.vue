<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="栏目管理" name="first">
        <el-row>
          <el-col>
            <el-button size="small" type="success" @click="showAddDialog">新增栏目</el-button>
          </el-col>
        </el-row>
        <el-table :data="categories" border stripe size="medium" style="margin:10px auto;">
          <el-table-column
            label="ID"
            prop="id"
            width="60"
          >
          </el-table-column>
          <el-table-column
            label="栏目名称"
            prop="name"
          >
          </el-table-column>
          <el-table-column
            label="栏目摘要"
            prop="excerpt">
          </el-table-column>
          <el-table-column
            label="缩略图">
            <template slot-scope="scope">
              <img :src="scope.row.thumbnail" alt="scope.row.name" v-if="scope.row.thumbnail">
            </template>
          </el-table-column>
          <el-table-column
            label="模版">
            <template slot-scope="scope">
              <span v-if="scope.row.template">{{scope.row.template.name}}</span>
            </template>
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
          :data="categoryTree"
          node-key="id"
          class="categoryTree"
          default-expand-all>
          <span class="treeNode" slot-scope="{ node, data }">
        <span>{{data.name }}</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            @click.native.prevent="showUpdateDialog(data)">
            编辑栏目
          </el-button>
          <el-button
            type="warning"
            size="mini" @click.capture="showPostDialog(data)">
            栏目下文章
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click.native.prevent="deleteData(data)">
            删除
          </el-button>
        </span>
      </span>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="添加栏目" fullscreen :visible.sync="addDialog" >
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="栏目名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="栏目摘要" prop="uris">
          <el-input v-model="form.excerpt" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级栏目" prop="parent_id">
        <el-input v-model="form.parent_name" readonly @focus="showTreeDialog"></el-input>
      </el-form-item>
        <el-form-item label="栏目权重">
          <el-input v-model="form.list_order">

          </el-input>
        </el-form-item>
        <el-form-item label="栏目模版" >
          <el-select v-model="form.template_id" placeholder="请选择模版" style="width: 100%;">
            <el-option
              v-for="item in templates"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目内容">
          <br>
          <vue-neditor id="addEditor" height="500px" :content="form.content" ref="addEditor"></vue-neditor>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑栏目" fullscreen :visible.sync="updateDialog">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="栏目名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="栏目摘要" prop="uris">
          <el-input v-model="form.excerpt" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级栏目" prop="parent_id">
          <el-input v-model="form.parent_name" readonly @focus="showTreeDialog"></el-input>
        </el-form-item>
        <el-form-item label="栏目权重">
          <el-input v-model="form.list_order">

          </el-input>
        </el-form-item>
        <el-form-item label="栏目模版" >
          <el-select v-model="form.template_id" placeholder="请选择模版" style="width: 100%;">
            <el-option
              v-for="item in templates"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目内容">
          <br>
          <vue-neditor id="updateEditor" height="500px" :content="form.content" ref="updateEditor"></vue-neditor>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="updateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateData">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="选择父栏目" :visible.sync="treeDialog">
      <el-tree ref="tree" node-key="id" :data="categoryTree" :props="{label:'name'}" class="categoryTree">
         <span :class="{treeNode:true,treeNodeSelect:data.id==form.parent_id}" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="selectCategory(data)">
            选择
          </el-button>
        </span>
      </span>
      </el-tree>
      <span slot="footer">
        <el-button type="warning" @click="selectCategory({id:0,name:'一级栏目'})">设为一级栏目</el-button>
    <el-button type="primary" @click="treeDialog=false">关闭</el-button>
  </span>
    </el-dialog>
    <el-dialog title="栏目下内容" width="65%" :visible.sync="postDialog">
      <el-table :data="categoryPost" border size="medium" style="margin:10px auto;">
        <el-table-column
          label="标题"
          prop="title"></el-table-column>
        <el-table-column
          label="作者"
          prop="author"
          width="100"></el-table-column>
        <el-table-column
          label="摘要"
          prop="excerpt"
          width="200"></el-table-column>
        <el-table-column
          label="日期" width="100">
          <template slot-scope="scope">
            {{convertTime(scope.row.published_time)}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态信息" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.post_status==1" class="close"><i class="el-icon-third-attentionfavor"></i></div>
            <div v-if="scope.row.post_status==0" class="open"><i class="el-icon-third-attentionfavor"></i></div>
            <div v-if="scope.row.comment_status==1" class="close"><i class="el-icon-third-round_comment_light"></i><br></div>
            <div v-if="scope.row.comment_status==0" class="open"><i class="el-icon-third-round_comment_light"></i><br></div>
            <div v-if="scope.row.is_top==1" class="open"><i class="el-icon-third-crown"></i><br></div>
            <div v-if="scope.row.is_top==0" class="close"><i class="el-icon-third-crown"></i><br></div>
            <div v-if="scope.row.is_recommend==1" class="open"><i class="el-icon-third-newshot"></i><br></div>
            <div v-if="scope.row.is_recommend==0" class="close"><i class="el-icon-third-newshot"></i><br></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="warning" @click="showPostContentDialog(scope.row)" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="post.title" :visible.sync="postContentDialog">
      <div class="postContent">
        <div v-html="post.content"></div>
      </div>
      <span slot="footer">
        <el-button @click="postContentDialog=false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import apis from '../../api/apis'
  import utils from '../../utils/utils'
  export default {
    name: "category",
    data(){
      return{
        activeName:'first',
        currentPage:1,
        pageSize:10,
        total:0,
        addDialog:false,
        updateDialog:false,
        treeDialog:false,
        postDialog:false,
        postContentDialog:false,
        categories:[],
        categoryTree:[],
        categoryPost:[],
        templates:[],
        form:{
          name:'',
          excerpt:'',
          content:'',
          parent_id:0,
          parent_name:'一级栏目',
          template_id:'',
          template_name:'',
          list_order:0,
          more:{}
        },
        dataRules:{
          name:[
            {required: true, message: '请输入栏目名称', trigger: 'blur'}
          ],
          parent_id:[
            {required: true, message: '请选择父级权限', trigger: 'blur'}
          ]
        },
        post:{
          title:'',
          content:''
        }
      }
    },
    mounted(){
      this.getData();
      this.getTree();
      this.getTemplate();
    },
    methods:{
      showAddDialog(){
        this.getTemplate();
        this.form={
          name:'',
          excerpt:'',
          content:'',
          parent_id:0,
          parent_name:'一级栏目',
          template_id:'',
          template_name:'',
          more:{}
        };
        this.addDialog=true;
      },
      showUpdateDialog(row){
        apis.getCategory(row.id).then(res=>{
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
      showPostDialog(data){
        let id=data.id;
        apis.getPostOfCategory({id:id}).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.categoryPost=data.data;
            this.postDialog=true;
          }
        });
      },
      showPostContentDialog(row){
        let id=row.id;
        apis.getPost(id).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.post=data.data;
            this.postContentDialog=true;
          }
        });
      },
      selectCategory(data){
        this.form.parent_id=data.id;
        this.form.parent_name=data.name;
        this.treeDialog=false;
      },
      pageChange(page){
        this.currentPage=page;
        this.getData();
      },
      addData(){
        this.form.content=this.$refs.addEditor.getContent();
        this.form.more=JSON.stringify(this.form.more);
        apis.addCategory(this.form).then(res=>{
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
            apis.deleteCategory({id:row.id}).then(res=>{
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
        this.form.content=this.$refs.updateEditor.getContent();
        this.form.more=JSON.stringify(this.form.more);
        apis.updateCategory(this.form).then(res=>{
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
        apis.getCategories({ page:this.currentPage, pageSize:this.pageSize})
          .then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.categories=data.data.pageData;
              this.total=data.data.total;
            }
          });
      },
      getTree(){
        apis.getCategoryTree().then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.categoryTree=data.data;
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        });
      },
      getTemplate(){
        apis.getCategoryTemplate().then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.templates=data.data;
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

<style>
  .categoryTree .el-tree-node{
    margin-top: 10px!important;
  }
  .categoryTree .el-tree-node__content{
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
  .categoryContentEditor .ql-container{
    min-height: 300px;
  }
  .categoryContentEditor .ql-editor{
    min-height: 300px;
  }
  .open{
    display: inline-block;
    color: #FF5722;
  }
  .close{
    display: inline-block;
    color: #009688;
  }
  .postContent{
    padding: 10px;
  }
  .postContent img{
    width: 100%;
    object-fit: cover;
    object-position: center center;
  }
</style>
