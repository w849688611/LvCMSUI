<template>
  <div>
    <el-row>
      <el-col>
        <el-button size="small" type="success" @click="showAddDialog">新增导航组</el-button>
      </el-col>
    </el-row>
    <el-table :data="navs" border size="medium" style="margin:10px auto;">
      <el-table-column
        label="ID"
        prop="id"
        width="60"
      >
      </el-table-column>
      <el-table-column
        label="导航组名"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="描述"
        prop="excerpt"
      >
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="showItemDialog(scope.row)">导航项列表</el-button>
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

    <el-dialog title="添加导航组" :visible.sync="addDialog" >
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="导航组名" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.excerpt" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑导航组" :visible.sync="updateDialog">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="导航组名" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.excerpt" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="updateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateData">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="导航项列表" :visible.sync="itemDialog">
      <el-row>
        <el-col>
          <el-button size="small" type="success" @click="showAddItemDialog">新增导航项</el-button>
        </el-col>
      </el-row>
      <el-tree
        :data="navItems"
      default-expand-all
        :props="{label:'name'}"
        class="navItemTree">
        <span slot-scope="{ node, data }" class="treeNode">
        <span>{{`${data.name}(权重：${data.list_order})`}}</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            @click.prevent="showUpdateItemDialog(data)">
            编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="deleteItemData(data)">
            删除
          </el-button>
        </span>
      </span>
      </el-tree>
    </el-dialog>
    <el-dialog title="添加导航项" :visible.sync="itemAddDialog">
      <el-form :model="itemForm" :rules="itemDataRules">
        <el-form-item label="导航项名称" prop="name">
          <el-input v-model="itemForm.name">

          </el-input>
        </el-form-item>
        <el-form-item label="导航项权重">
          <el-input v-model="itemForm.list_order">

          </el-input>
        </el-form-item>
        <el-form-item label="父级导航项">
          <el-input v-model="itemForm.parent_name" readonly @focus="showTreeDialog">

          </el-input>
        </el-form-item>
        <el-form-item label="导航项内容">
          <el-input v-model="itemForm.item_text" readonly @focus="showTabDialog">

          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="itemAddDialog=false">取消</el-button>
    <el-button type="primary" @click="addItemData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="更新导航项" :visible.sync="itemUpdateDialog">
      <el-form :model="itemForm">
        <el-form-item label="导航项名称" prop="name">
          <el-input v-model="itemForm.name">

          </el-input>
        </el-form-item>
        <el-form-item label="导航项权重">
          <el-input v-model="itemForm.list_order">

          </el-input>
        </el-form-item>
        <el-form-item label="父级导航项">
          <el-input v-model="itemForm.parent_name" readonly @focus="showTreeDialog">

          </el-input>
        </el-form-item>
        <el-form-item label="导航项内容">
          <el-input v-model="itemForm.item_text" readonly @focus="showTabDialog">

          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="itemUpdateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateItemData">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择父级导航项" :visible.sync="treeDialog">
      <el-tree :data="navItems"
               default-expand-all
               :props="{label:'name'}"
               class="navItemTree">
         <span slot-scope="{ node, data }" class="treeNode">
        <span>{{`${data.name}(权重：${data.list_order})`}}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="selectParentNavItem(data)">
            选择
          </el-button>
        </span>
      </span>
      </el-tree>
      <span slot="footer">
        <el-button @click="treeDialog=false">关闭</el-button>
        <el-button type="warning" @click="selectParentNavItem({id:0,name:'一级导航项'})">设为一级导航项</el-button>
  </span>
    </el-dialog>
    <el-dialog title="选择导航项内容" :visible.sync="tabDialog">
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="栏目" name="first">
          <el-tree ref="tree" node-key="id" :data="categories" :props="{label:'name'}" class="navItemTree" default-expand-all	>
         <span slot-scope="{ node, data }" class="treeNode">
        <span>{{ data.name }}</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            @click="selectItemContent({type:1,id:data.id,text:data.name})">
            选择
          </el-button>
        </span>
      </span>
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="内容" name="second">
          <el-table :data="posts" border size="medium" style="margin:10px auto;">
            <el-table-column
              label="标题"
              prop="title"></el-table-column>
            <el-table-column
              label="作者"
              prop="author"
              width="100"></el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"  @click="selectItemContent({type:3,id:scope.row.id,text:scope.row.title})">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page.sync="currentPostPage"
            :page-size="postPageSize"
            :total="postTotal"
            @current-change="postPageChange"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="单页" name="third">
          <el-table :data="singles" border size="medium" style="margin:10px auto;">
            <el-table-column
              label="标题"
              prop="title"></el-table-column>
            <el-table-column
              label="摘要"
              prop="excerpt"
            >
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"  @click="selectItemContent({type:2,id:scope.row.id,text:scope.row.title})">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page.sync="currentSinglePage"
            :page-size="singlePageSize"
            :total="singleTotal"
            @current-change="singlePageChange"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="链接" name="fourth">
          <el-input v-model="itemForm.link">
          </el-input>
          <div style="margin: 10px auto;"></div>
          <el-button type="primary" @click="selectItemContent({type:4,id:0,text:itemForm.link})">确定</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import utils from '../../utils/utils'
  export default {
    name: "nav",
    data(){
      return{
        currentPage:1,
        pageSize:10,
        total:0,
        addDialog:false,
        updateDialog:false,
        itemDialog:false,
        itemAddDialog:false,
        itemUpdateDialog:false,
        treeDialog:false,
        tabDialog:false,
        tabActiveName:'first',
        navs:[],
        nowNavId:0,//正在显示列表的导航组id
        navItems:[],
        categories:[],
        posts:[],
        singles:[],
        form:{
          name:'',
          excerpt:'',
          more:{}
        },
        dataRules:{
          name:[
            {required: true, message: '请填写导航组名称', trigger: 'blur'}
          ]
        },
        itemForm:{
          nav_id:'',
          parent_id:0,
          parent_name:'一级导航项',
          name:'',
          type:'',
          item_id:'',
          item_text:'',
          more:{},
          list_order:0,
          link:''
        },
        itemDataRules:{
          name:[
            {required: true, message: '请填写导航项名称', trigger: 'blur'}
          ]
        },
        /**
         * tab页内的分页信息
         * */
        currentPostPage:1,
        postPageSize:5,
        postTotal:0,
        currentSinglePage:1,
        singlePageSize:5,
        singleTotal:0,
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
      showAddDialog(){
        this.form={
          name:'',
          excerpt:'',
          more:{}
        };
        this.addDialog=true;
      },
      showUpdateDialog(row){
        this.$axios.post('/api/nav/get',{
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
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        })
      },
      showItemDialog(row){
        let id=row.id;
        this.nowNavId=id;
        this.itemForm.nav_id=id;
        this.navItems=[];
        this.getItemData();
        this.itemDialog=true;
      },
      showAddItemDialog(){
        this.itemForm={
          nav_id:this.nowNavId,
          parent_id:0,
          parent_name:'',
          name:'',
          type:'',
          item_id:'',
          item_text:'',
          more:{},
          list_order:0
        };
        this.itemAddDialog=true;
      },
      showUpdateItemDialog(row){
        this.$axios.post('/api/nav/item/get',{
          id:row.id
        },{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            let itemForm=data.data;
            /**
             * 非链接导航
             */
            if(itemForm.item&&itemForm.item!=null){
              if(itemForm.type=='1'){
                itemForm.item_text=itemForm.item.name;
              }
              else if(itemForm.type=='2'||itemForm.type=='3'){
                itemForm.item_text=itemForm.item.title;
              }
            }
            /**
             * 链接类导航
             */
            if(itemForm.type=='4'){
              itemForm.item_text=itemForm.link;
            }
            if(itemForm.parent&&itemForm.parent!=null){
              itemForm.parent_id=itemForm.parent.id;
              itemForm.parent_name=itemForm.parent.name;
            }
            else{
              itemForm.parent_id=0;
              itemForm.parent_name='一级导航项';
            }
            this.itemForm=itemForm;
            this.itemUpdateDialog=true;
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
      },
      /**
       * 展示树型结构，选取父级导航项
       */
      showTreeDialog(){
        this.treeDialog=true;
      },
      showTabDialog(){
        this.tabDialog=true;
        this.getCategoryData();
        this.getPostData();
        this.getSingleData();
      },
      pageChange(page){
        this.currentPage=page;
        this.getData();
      },
      postPageChange(page){
        this.currentPostPage=page;
        this.getPostData();
      },
      singlePageChange(page){
        this.currentSinglePage=page;
        this.getSingleData();
      },
      addData(){
        this.form.more=JSON.stringify(this.form.more);
        this.$axios.post('/api/nav/add',this.form,{
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
            this.$axios.post('/api/nav/delete',{
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
        this.form.more=JSON.stringify(this.form.more);
        this.$axios.post('/api/nav/update',this.form,{
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
        this.$axios.post('/api/nav/getByPage',{
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
              this.navs=data.data.pageData;
              this.total=data.data.total;
            }
          })
          .catch(err=>{
            utils.handleErr.call(this,err);
          })
      },
      addItemData(){
        let itemForm=this.itemForm;
        itemForm.more=JSON.stringify(itemForm.more);
        this.$axios.post('/api/nav/item/add',itemForm,{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.$message.success('添加导航项成功');
            this.itemAddDialog=false;
            this.getItemData();
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
      },
      updateItemData(){
        let itemForm=this.itemForm;
        itemForm.more=JSON.stringify(itemForm.more);
        this.$axios.post('/api/nav/item/update',itemForm,{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.$message.success('更新导航项成功');
            this.itemUpdateDialog=false;
            this.getItemData();
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
      },
      deleteItemData(row){
        this.$confirm('确认删除该项？')
          .then(()=> {
            this.$axios.post('/api/nav/item/delete',{
              id:row.id
            },{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              if(res.data.status=='200'){
                this.$message.success(res.data.msg);
                this.getItemData();
              }
              else{
                this.$message.error(utils.responseToString(res.data.msg));
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            })
          });
      },
      getItemData(){
        let id=this.nowNavId;
        this.$axios.get('/api/nav/getItemOfNav',{
          params:{
            id:id
          },
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.navItems=data.data;
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
      },
      getCategoryData(){
        this.$axios.get('/api/category/getTree',{headers:{
            token:utils.getToken()
          }}).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.categories=data.data;
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        })
      },
      getPostData(){
        this.$axios.post('/api/post/getByPage',{
          page:this.currentPostPage,
          pageSize:this.postPageSize
        },{
          headers:{
            token:utils.getToken()
          }
        })
          .then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.posts=data.data.pageData;
              this.postTotal=data.data.total;
            }
          })
          .catch(err=>{
            utils.handleErr.call(this,err);
          });
      },
      getSingleData(){
        this.$axios.post('/api/single/getByPage',{
          page:this.currentSinglePage,
          pageSize:this.singlePageSize
        },{
          headers:{
            token:utils.getToken()
          }
        })
          .then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.singles=data.data.pageData;
              this.singleTotal=data.data.total;
            }
          })
          .catch(err=>{
            utils.handleErr.call(this,err);
          });
      },
      selectParentNavItem(data){
        this.itemForm.parent_id=data.id;
        this.itemForm.parent_name=data.name;
        this.treeDialog=false;
      },
      selectItemContent(item){
        this.itemForm.item_id=item.id;
        this.itemForm.item_text=item.text;
        this.itemForm.type=item.type;
        this.tabDialog=false;
      }
    }
  }
</script>

<style>
  .navItemTree{
    margin-bottom: 10px;
  }
  .navItemTree .el-tree-node{
    margin-top: 10px!important;
  }
  .navItemTree .el-tree-node__content{
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
</style>
