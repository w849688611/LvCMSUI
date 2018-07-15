<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-button size="small" type="success" @click="showAddDialog"><i class="el-icon-third-add1"></i>新增文章</el-button>
      </el-col>
      <el-col :span="6" :offset="8">
        <el-input v-model="searchText"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button icon="el-icon-search" type="primary" @click="searchData"></el-button>
      </el-col>
    </el-row>
    <el-table :data="posts" v-loading="loading" border size="medium" style="margin:10px auto;">
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
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="showCommentDialog(scope.row)">文章下评论</el-button>
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
    <el-dialog title="添加文章" :visible.sync="addDialog" fullscreen>
      <el-form :model="form" :rules="dataRules">
        <el-row :gutter="30">
          <el-col :span="18">
            <el-card style="margin-bottom:20px;">
              <div slot="header">文章信息</div>
              <el-form-item label="所属栏目">
                <el-input readonly :value="categoryNames" @focus="showCategorySelectDialog"></el-input>
              </el-form-item>
              <el-form-item label="文章标题" prop="title">
                <el-input v-model="form.title" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="文章作者">
                <el-input v-model="form.author" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="发布日期">
                <br>
                <el-date-picker
                  v-model="form.published_time"
                  type="datetime"
                  value-format="timestamp"
                  placeholder="选择日期时间" style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="关键字">
                <el-input v-model="form.keywords" auto-complete="off" ></el-input>
              </el-form-item>
              <el-form-item label="摘要">
                <el-input v-model="form.excerpt" auto-complete="off" type="textarea" :rows="3" ></el-input>
              </el-form-item>
              <el-form-item label="文章内容">
                <br>
                <vue-neditor id="addEditor" height="500px" :content="form.content" ref="addEditor"></vue-neditor>
              </el-form-item>
            </el-card>
            <el-card style="margin-bottom:20px;">
              <div slot="header">附件</div>
              <el-form-item label="附件">
                <br>
                <el-table :data="form.more.fileList" border>
                  <el-table-column label="文件名" prop="name">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="路径" prop="url"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="small" @click.native.prevent="deleteFileRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="height: 10px;"></div>
                <el-upload
                  :action="fileUploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="uploadFileSuccess">
                  <el-button type="primary" size="small">添加附件</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="图集">
                <br>
                <el-table :data="form.more.imageList" border>
                  <el-table-column label="缩略图">
                    <template slot-scope="scope">
                      <img :src="scope.row.url">
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="small" @click.native.prevent="deleteImageRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="height: 10px;"></div>
                <el-upload
                  :action="fileUploadUrl"
                  :headers="uploadHeaders"
                  :before-upload="beforeImageUpload"
                  :show-file-list="false"
                  :on-success="uploadImageSuccess">
                  <el-button type="primary" size="small">添加图片</el-button>
                </el-upload>
              </el-form-item>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card style="margin-bottom:20px;">
              <div slot="header">文章封面</div>
              <el-form-item>
                <br>
                <el-upload
                  class="avatar-uploader"
                  :action="fileUploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="uploadThumbnailSuccess">
                  <img v-if="form.more.thumbnail" :src="form.more.thumbnail" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-card>
            <el-card style="margin-bottom:20px;">
              <div slot="header">状态信息</div>
              <el-form-item label="文章状态">
                <el-radio-group v-model="form.post_status">
                  <el-radio :label="1">显示</el-radio>
                  <el-radio :label="0">不显示</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否置顶">
                <el-radio-group v-model="form.is_top">
                  <el-radio :label="0">普通</el-radio>
                  <el-radio :label="1">置顶</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否推荐">
                <el-radio-group v-model="form.is_recommend">
                  <el-radio :label="0">普通</el-radio>
                  <el-radio :label="1">推荐</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="评论状态">
                <el-radio-group v-model="form.comment_status">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-card>
            <el-card style="margin-bottom:20px;">
              <div slot="header">文章模版</div>
              <el-form-item>
                <el-select v-model="form.template_id" placeholder="请选择模版" style="width: 100%;">
                  <el-option
                    v-for="item in templates"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑内容" :visible.sync="updateDialog" fullscreen>
      <el-form :model="form" :rules="dataRules">
        <el-row :gutter="30">
          <el-col :span="18">
            <el-card style="margin-bottom:20px;">
              <div slot="header">文章信息</div>
              <el-form-item label="所属栏目">
                <el-input readonly :value="categoryNames" @focus="showCategorySelectDialog"></el-input>
              </el-form-item>
              <el-form-item label="文章标题" prop="title">
                <el-input v-model="form.title" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="文章作者">
                <el-input v-model="form.author" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="发布日期">
                <br>
                <el-date-picker
                  v-model="form.published_time"
                  type="datetime"
                  value-format="timestamp"
                  placeholder="选择日期时间" style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="关键字">
                <el-input v-model="form.keywords" auto-complete="off" ></el-input>
              </el-form-item>
              <el-form-item label="摘要">
                <el-input v-model="form.excerpt" auto-complete="off" type="textarea" :rows="3" ></el-input>
              </el-form-item>
              <el-form-item label="文章内容">
                <br>
                <vue-neditor id="addEditor" height="500px" :content="form.content" ref="updateEditor"></vue-neditor>
              </el-form-item>
            </el-card>
            <el-card style="margin-bottom:20px;">
              <div slot="header">附件</div>
              <el-form-item label="附件">
                <br>
                <el-table :data="form.more.fileList" border>
                  <el-table-column label="文件名" prop="name">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="路径" prop="url"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="small" @click.native.prevent="deleteFileRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="height: 10px;"></div>
                <el-upload
                  :action="fileUploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="uploadFileSuccess">
                  <el-button type="primary" size="small">添加附件</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="图集">
                <br>
                <el-table :data="form.more.imageList" border>
                  <el-table-column label="缩略图">
                    <template slot-scope="scope">
                      <img :src="scope.row.url">
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="small" @click.native.prevent="deleteImageRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="height: 10px;"></div>
                <el-upload
                  :action="fileUploadUrl"
                  :headers="uploadHeaders"
                  :before-upload="beforeImageUpload"
                  :show-file-list="false"
                  :on-success="uploadImageSuccess">
                  <el-button type="primary" size="small">添加图片</el-button>
                </el-upload>
              </el-form-item>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card style="margin-bottom:20px;">
              <div slot="header">文章封面</div>
              <el-form-item>
                <br>
                <el-upload
                  class="avatar-uploader"
                  :action="fileUploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="uploadThumbnailSuccess">
                  <img v-if="form.more.thumbnail" :src="form.more.thumbnail" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-card>
            <el-card style="margin-bottom:20px;">
              <div slot="header">状态信息</div>
              <el-form-item label="文章状态">
                <el-radio-group v-model="form.post_status">
                  <el-radio :label="1">显示</el-radio>
                  <el-radio :label="0">不显示</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否置顶">
                <el-radio-group v-model="form.is_top">
                  <el-radio :label="0">普通</el-radio>
                  <el-radio :label="1">置顶</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否推荐">
                <el-radio-group v-model="form.is_recommend">
                  <el-radio :label="0">普通</el-radio>
                  <el-radio :label="1">推荐</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="评论状态">
                <el-radio-group v-model="form.comment_status">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-card>
            <el-card style="margin-bottom:20px;">
              <div slot="header">文章模版</div>
              <el-form-item>
                <el-select v-model="form.template_id" placeholder="请选择模版" style="width: 100%;">
                  <el-option
                    v-for="item in templates"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
    <el-button @click="updateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateData">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="选择栏目" :visible.sync="categorySelectDialog">
      <el-table ref="categoryTreeTable" :data="categories" @selection-change="selectCategoryChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="栏目名称">
          <template slot-scope="scope">
            <span :style="{paddingLeft:scope.row.level*20+'px'}"><i class="el-icon-third-form_fill_light"></i>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
    <el-button  @click="categorySelectDialog=false;">关闭</el-button>
        <el-button type="primary" @click="confirmSelectCategory">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="评论" :visible.sync="commentDialog" width="80%">
      <el-table :data="comments" border>
        <el-table-column label="楼层" prop="floor" width="60"></el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <span v-html="scope.row.content"></span>
            <span>{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户" prop="user.account"  width="130"></el-table-column>
        <el-table-column label="状态" width="160">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value=1
              :inactive-value=0
              active-text="显示"
              inactive-text="隐藏" @change="toggleCommentStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="deleteComment(scope.row)" type="danger">删除评论</el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.childComment" v-if="scope.row.childComment" border>
              <el-table-column label="内容">
                <template slot-scope="childScope">
                  <span v-html="childScope.row.content"></span>
                </template>
              </el-table-column>
              <el-table-column label="用户" prop="user.account" width="130"></el-table-column>
              <el-table-column label="状态" width="160">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    :active-value=1
                    :inactive-value=0
                    active-text="显示"
                    inactive-text="隐藏" @change="toggleCommentStatus(scope.row)">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="childScope">
                  <el-button size="mini" @click="deleteComment(childScope.row)" type="danger">删除评论</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="currentCommentPage"
        :page-size="commentPageSize"
        :total="commentTotal"
        @current-change="pageChange"
      ></el-pagination>
      <el-button  @click="commentDialog=false;">关闭</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import utils from '../../utils/utils'
  export default {
    name: "post",
    data(){
      return{
        loading:false,
        searchText:'',
        getDataType:'1',//1为普通获取，2为搜索获取
        currentPage:1,
        pageSize:10,
        total:0,
        currentCommentPage:1,
        commentPageSize:10,
        commentPostId:0,//当前正在查看评论的文章id，保存一下便于翻页查看评论
        commentTotal:0,
        addDialog:false,
        updateDialog:false,
        categorySelectDialog:false,
        commentDialog:false,
        categories:[],
        posts:[],
        templates:[],
        comments:[],
        form:{
          title:'',
          author:'',
          published_time:'',
          post_status:1,
          comment_status:1,
          is_top:0,
          is_recommend:0,
          keywords:'',
          excerpt:'',
          content:'',
          category:[],
          more:{}
        },
        //由于element本身的表格组件没有提供获取勾选项的方法，
        //单纯的使用select-change事件改变form.category会导致每次显示前清空时候带着form.category也清空了
        //因此加一个中间属性
        tempSelectCategory:[],
        dataRules:{
          title:[
            {required: true, message: '请填写文章标题', trigger: 'blur'}
          ],
          published_time:[
            {required: true, message: '请选择发布时间', trigger: 'blur'}
          ]
        },
        uploadHeaders:{token:utils.getToken()},
      }
    },
    computed:{
      categoryNames(){
        let name='';
        if(Array.isArray(this.form.category)){
          this.form.category.forEach(item=>{
            name+=(item.name+' ')
          });
        }
        return name;
      },
      fileUploadUrl(){
        return this.$baseURL+"/api/file/add";
      }
    },
    mounted(){
      this.getData();
      this.getCategory();
    },
    methods:{
      showAddDialog(){
        this.form={
          title:'',
            author:'',
            published_time:new Date(),
            post_status:1,
            comment_status:1,
            is_top:0,
            is_recommend:0,
            keywords:'',
            excerpt:'',
            content:'',
            category:[],
            more:{}
        };
        this.addDialog=true;
        this.$nextTick(()=>{
          this.$refs.addEditor.setContent('');
        });
      },
      showUpdateDialog(row){
        this.$axios.post('/api/post/get',{
          id:row.id
        },{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.form=data.data;
            if(!this.form.published_time){
              this.form.published_time='';
            }
            if(this.form.published_time.toString().length==10){
              this.form.published_time*=1000;
            }
            if(!this.form.more) {
              this.form.more = {};
            }
            this.updateDialog=true;
          }else{
            this.$message.error(data.msg);
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        })
      },
      showCategorySelectDialog(){
        this.categorySelectDialog = true;
        this.$nextTick(()=>{
          this.$refs.categoryTreeTable.clearSelection();
          if(Array.isArray(this.form.category)){
            this.form.category.forEach(item=>{
              for(let i=0,len=this.categories.length;i<len;i++){
                if(this.categories[i].id===item.id){
                  this.$refs.categoryTreeTable.toggleRowSelection(this.categories[i],true);
                  break;
                }
              }
            });
          }
        });
      },
      showCommentDialog(row){
        this.commentPostId=row.id;
        this.currentCommentPage=1;
        this.commentPageSize=10;
        this.getComment();
        this.commentDialog=true;
      },
      selectCategoryChange(data){
        this.tempSelectCategory=data;
      },
      confirmSelectCategory(){
        this.categorySelectDialog=false;
        this.form.category=this.tempSelectCategory;
      },
      pageChange(page){
        this.currentPage=page;
        if(this.getDataType=='1'){
          this.getData();
          return;
        }
        if(this.getDataType=='2') {
          this.searchData();
          return;
        }
      },
      addData(){
        //浅克隆一下，避免影响真实数据,克隆出来时间对象变字符串了，因此还是用原来对象的获取一下（待优化）
        let form=JSON.parse(JSON.stringify(this.form));
        //如果发布时间是对象则转换其为时间戳
        if(this.form.published_time.getTime){
          form.published_time=this.form.published_time.getTime();
        }
        if(form.published_time.toString().length==13){
          form.published_time=form.published_time.toString().slice(0,-3);
        }
        form.category=JSON.stringify(form.category);
        form.more=JSON.stringify(this.form.more);
        form.content=this.$refs.addEditor.getContent();
        this.$axios.post('/api/post/add',form,{
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
            this.$axios.post('/api/post/delete',{
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
        //浅克隆一下，避免影响真实数据
        let form=JSON.parse(JSON.stringify(this.form));
        //如果发布时间包含getTime方法即发布时间为对象则转换其为时间戳
        if(this.form.published_time.getTime){
          form.published_time=this.form.published_time.getTime();
        }
        if(form.published_time.toString().length==13){
          form.published_time=form.published_time.toString().slice(0,-3);
        }
        form.category=JSON.stringify(this.form.category);
        form.more=JSON.stringify(this.form.more);
        form.content=this.$refs.updateEditor.getContent();
        this.$axios.post('/api/post/update',form,{
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
        this.loading=true;
        this.$axios.post('/api/post/getByPage',{
          page:this.currentPage,
          pageSize:this.pageSize
        },{
          headers:{
            token:utils.getToken()
          }
        })
          .then(res=>{
            this.loading=false;
            let data=res.data;
            if(data.status=='200'){
              this.posts=data.data.pageData;
              this.total=data.data.total;
            }
          })
          .catch(err=>{
            utils.handleErr.call(this,err);
          });
      },
      searchData(){
        if(this.searchText.trim()==''){
          this.currentPage=1;
          this.pageSize=10;
          this.getDataType=1;
          this.getData();
          return;
        }
        //若为首次搜索，则改变数据获取类型标识，并归位分页
        if(this.getDataType=='1'){
          this.getDataType='2';
          this.currentPage=1;
          this.pageSize=10;
        }
        this.loading=true;
        this.$axios.post('/api/post/search',{
          keyword:this.searchText,
          page:this.currentPage,
          pageSize:this.pageSize
        },{
          headers:{
            token:utils.getToken(),
          }
        }).then(res=>{
          this.loading=false;
          let data=res.data;
          if(data.status=='200'){
            this.posts=data.data.pageData;
            this.total=data.data.total;
          }
          else{
            this.$message.error(util.responseToString(data.msg));
          }
        }).catch(err=>{
          util.handleErr.call(this,err);
        });
      },
      getCategory(id=0){
        this.$axios.get('/api/category/getTree',{
          params:{
            postId:id,
            type:1
          },
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
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
      getTemplate(){
        this.$axios.get('api/template/getPostTemplate',{
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
      getComment(){
        this.$axios.get('/api/post/getCommentOfPost',{
          params:{
            id:this.commentPostId,
            page:this.currentCommentPage,
            pageSize:this.commentPageSize
          },
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.comments=data.data.pageData;
            this.commentTotal=data.data.total;
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        });
      },
      toggleCommentStatus(row){
        let id=row.id;
        let status=row.status;
        console.log(status);
        this.$axios.post('/api/comment/update',{
          id:id,
          status:status
        },{
          headers:{
            token:utils.getToken()
          }
        }).then(res=>{
          let data=res.data;
          if(data.status=='200'){
            this.$message.success('更新状态成功');
          }
          else{
            this.$message.error(utils.responseToString(data.msg));
          }
        }).catch(err=>{
          utils.handleErr.call(this,err);
        })
      },
      deleteComment(row){
        this.$confirm('确定删除该条评论？').then(()=>{
          let id=row.id;
          this.$axios.post('/api/comment/delete',{
            id:id
          },{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.$message.success(res.data.msg);
              this.getComment();
            }
            else{
              this.$message.error(utils.responseToString(res.data.msg));
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          })
        });
      },
      uploadThumbnailSuccess(res,file){
        if(res.status=='200'){
          if(this.form.more.thumbnail){
            this.$delete(this.form.more,'thumbnail');
          }
          this.$set(this.form.more,'thumbnail',res.data.url);
          // more.thumbnail=res.data.url;
          //Vue.set(this.form.more,'thumbnail',res.data.url);
        }
      },
      uploadFileSuccess(res,file){
        if(res.status=='200'){
          if(!this.form.more){
            this.form.more={}
            this.$set(this.form,'more',{});
          }
          if(!this.form.more.fileList){
            this.$set(this.form.more,'fileList',[]);
          }
          let fileList=this.form.more.fileList;
          fileList.push({name:'附件',url:res.data.url});
          this.$set(this.form.more,'fileList',fileList);
        }
      },
      deleteFileRow(index){
        if(this.form.more&&this.form.more.fileList){
          this.form.more.fileList.splice(index,1);
        }
      },
      beforeImageUpload(file){
        const isJPG = file.type === 'image/jpeg';
        const isPNG=file.type === 'image/png';
        const isGIF=file.type === 'image/gif';
        const isBMP=file.type === 'image/bmp';
        if(isJPG||isPNG||isGIF||isBMP){
          return true;
        }
        this.$message.error('图片格式不符合要求');
        return false;
      },
      uploadImageSuccess(res,file){
        if(res.status=='200'){
          if(!this.form.more){
            this.form.more={};
            this.$set(this.form,'more',{});
          }
          if(!this.form.more.imageList){
            this.$set(this.form.more,'imageList',[]);
          }
          let imageList=this.form.more.imageList;
          imageList.push({url:res.data.url});
          this.$set(this.form.more,'imageList',imageList);
        }
      },
      deleteImageRow(index){
        if(this.form.more&&this.form.more.imageList){
          this.form.more.imageList.splice(index,1);
        }
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
  .open{
    display: inline-block;
    color: #FF5722;
  }
  .close{
    display: inline-block;
    color: #009688;
  }
  /*.postContentEditor .ql-container{*/
    /*min-height: 300px;*/
  /*}*/
  /*.postContentEditor .ql-editor{*/
    /*min-height: 300px;*/
  /*}*/
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
