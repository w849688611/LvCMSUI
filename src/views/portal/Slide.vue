<template>
  <div>
    <el-row>
      <el-col>
        <el-button size="small" type="success" @click="showAddDialog" icon="el-icon-plus"></el-button>
        <el-button size="small" type="danger" @click="deleteDataBySelection" icon="el-icon-delete"></el-button>
        <el-button size="small" icon="el-icon-refresh" @click="getData"></el-button>
      </el-col>
    </el-row>
    <el-table :data="slides" border stripe size="medium" style="margin:10px auto;" @selection-change="selectChange">
      <el-table-column
        type="selection"
      >
      </el-table-column>
      <el-table-column
        label="ID"
        prop="id"
      >
      </el-table-column>
      <el-table-column
        label="组名"
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
          <el-button type="warning" size="mini" @click="showItemDialog(scope.row)">幻灯片项列表</el-button>
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

    <el-dialog title="添加幻灯片组" :visible.sync="addDialog" >
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="幻灯片组名" prop="name">
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
    <el-dialog title="编辑幻灯片组" :visible.sync="updateDialog">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="配置组名" prop="name">
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
    <el-dialog title="幻灯片项列表" :visible.sync="itemDialog">
      <el-row>
        <el-col>
          <el-button size="small" type="success" @click="showAddItemDialog" icon="el-icon-plus"></el-button>
          <el-button size="small" type="danger" @click="deleteItemDataBySelection" icon="el-icon-delete"></el-button>
          <el-button size="small" icon="el-icon-refresh" @click="getItemData"></el-button>
        </el-col>
      </el-row>
      <el-table :data="slideItems" border size="medium" style="margin:10px auto;" @selection-change="selectItemChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="图片" width="300">
          <template slot-scope="scope">
            <img :src="scope.row.img_url" :alt="scope.row.name" style="width: 100%;height: auto;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span>
              <el-button-group>
                <el-button
                  type="primary"
                  size="mini"
                  @click.prevent="showUpdateItemDialog(scope.row)">
            编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="deleteItemData(scope.row)">
            删除
          </el-button>
              </el-button-group>
        </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="添加幻灯片项" :visible.sync="itemAddDialog">
      <el-form :model="itemForm" :rules="itemDataRules">
        <el-form-item label="幻灯片项名称" prop="name">
          <el-input v-model="itemForm.name">

          </el-input>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="itemForm.list_order">

          </el-input>
        </el-form-item>
        <el-form-item label="幻灯片项内容">
          <el-input v-model="itemForm.item_text" readonly @focus="showTabDialog">

          </el-input>
        </el-form-item>
        <el-form-item label="图片">
          <br>
          <el-upload
            class="avatar-uploader"
            :action="fileUploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="uploadImgSuccess">
            <img v-if="itemForm.img_url" :src="itemForm.img_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="itemAddDialog=false">取消</el-button>
    <el-button type="primary" @click="addItemData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="更新幻灯片项" :visible.sync="itemUpdateDialog">
      <el-form :model="itemForm" :rules="itemDataRules">
        <el-form-item label="幻灯片项名称" prop="name">
          <el-input v-model="itemForm.name">

          </el-input>
        </el-form-item>
        <el-form-item label="导航项权重">
          <el-input v-model="itemForm.list_order">

          </el-input>
        </el-form-item>
        <el-form-item label="导航项内容">
          <el-input v-model="itemForm.item_text" readonly @focus="showTabDialog">

          </el-input>
        </el-form-item>
        <el-form-item label="图片">
          <br>
          <el-upload
            class="avatar-uploader"
            :action="fileUploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="uploadImgSuccess">
            <img v-if="itemForm.img_url" :src="itemForm.img_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="itemUpdateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateItemData">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择导航项内容" :visible.sync="tabDialog">
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="栏目" name="first">
          <el-tree ref="tree" node-key="id" :data="categories" :props="{label:'name'}" class="categoryTree" default-expand-all	>
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
    name: "slide",
    data(){
      return{
        currentPage:1,
        pageSize:10,
        total:0,
        selection:[],
        selectionItem:[],
        addDialog:false,
        updateDialog:false,
        itemDialog:false,
        itemAddDialog:false,
        itemUpdateDialog:false,
        treeDialog:false,
        tabDialog:false,
        tabActiveName:'first',
        slides:[],
        nowSlideId:0,//正在显示列表的导航组id
        slideItems:[],
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
            {required: true, message: '请填写幻灯片组名称', trigger: 'blur'}
          ]
        },
        itemForm:{
          slide_id:'',
          name:'',
          type:'',
          item_id:'',
          item_text:'',
          more:{},
          list_order:0,
          link:'',
          img_url:'',
        },
        itemDataRules:{
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
        uploadHeaders:{token:utils.getToken()}
      }
    },
    mounted(){
      this.getData();
    },
    computed:{
      fileUploadUrl(){
        return this.$baseURL+"/api/file/add";
      }
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
        this.$axios.post('/api/slide/get',{
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
        this.nowSlideId=id;
        this.itemForm.slide_id=id;
        this.slideItems=[];
        this.getItemData();
        this.itemDialog=true;
      },
      showAddItemDialog(){
        this.itemForm={
          slide_id:this.nowSlideId,
          name:'',
          type:'',
          item_id:'',
          item_text:'',
          more:{},
          list_order:0,
          img_url:''
        };
        this.itemAddDialog=true;
      },
      showUpdateItemDialog(row){
        this.$axios.post('/api/slide/item/get',{
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
            this.itemForm=itemForm;
            this.itemUpdateDialog=true;
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
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
      selectChange(selection){
        this.selection=selection;
      },
      addData(){
        this.form.more=JSON.stringify(this.form.more);
        this.$axios.post('/api/slide/add',this.form,{
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
            this.$axios.post('/api/slide/delete',{
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
        this.$axios.post('/api/slide/update',this.form,{
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
        this.$axios.post('/api/slide/getByPage',{
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
              this.slides=data.data.pageData;
              this.total=data.data.total;
            }
          })
          .catch(err=>{
            utils.handleErr.call(this,err);
          })
      },
      deleteDataBySelection(){
        let ids=this.selection.map(item=>item.id);
        this.$confirm('确认删除该项？')
          .then(()=> {
            this.$axios.post('/api/slide/delete',{
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
      selectItemChange(selection){
        this.selectionItem=selection;
      },
      addItemData(){
        let itemForm=this.itemForm;
        itemForm.more=JSON.stringify(itemForm.more);
        this.$axios.post('/api/slide/item/add',itemForm,{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.$message.success('添加幻灯片项成功');
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
        this.$axios.post('/api/slide/item/update',itemForm,{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.$message.success('更新幻灯片项成功');
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
            this.$axios.post('/api/slide/item/delete',{
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
        let id=this.nowSlideId;
        this.$axios.get('/api/slide/getItemOfSlide',{
          params:{
            id:id
          },
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.slideItems=data.data;
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
      },
      deleteItemDataBySelection(){
        let ids=this.selectionItem.map(item=>item.id);
        this.$confirm('确认删除该项？')
          .then(()=> {
            this.$axios.post('/api/slide/item/delete',{
              ids:ids
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
      uploadImgSuccess(res,file){
        if(res.status=='200'){
          this.$set(this.itemForm,'img_url',res.data.url);
          this.$notify({
            title:'上传',
            message: '上传成功',
            type:'success'
          });
        }
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
  .categoryTree{
    margin-bottom: 10px;
  }
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
