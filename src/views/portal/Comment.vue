<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="关键字检索" name="first">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input v-model.trim="commentSearchContent"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="searchCommentBtnClick">搜索</el-button>
          </el-col>
        </el-row>
        <br>
        <el-table :data="comments" stripe border size="medium">
          <el-table-column label="内容">
            <template slot-scope="scope">
              <div v-html="scope.row.content"></div>
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
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" @click="showCommentDialog(scope.row)" type="warning">详细</el-button>
                <el-button size="mini" @click="deleteComment(scope.row)" type="danger">删除评论</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page.sync="currentCommentPage"
          :page-size="commentPageSize"
          :total="commentTotal"
          @current-change="commentPageChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="文章检索" name="second">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input v-model.trim="postSearchContent"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="searchPostBtnClick">搜索</el-button>
          </el-col>
        </el-row>
        <el-table :data="posts" border size="medium" style="margin:10px auto;">
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
            label="操作">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="showCommentListDialog(scope.row)">文章下评论</el-button>
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
    </el-tabs>
    <el-dialog :visible.sync="commentDialog" title="详细">
      <h4>内容</h4>
      <div v-if="comment.content">
        <span v-html="comment.content"></span>
      </div>
      <h5>所属文章</h5>
      <div v-if="comment.post">
        <span>{{comment.post.title}}</span>
      </div>
      <h5>用户</h5>
      <div v-if="comment.user">
        <span>{{comment.user.account}}</span>
      </div>
      <div v-if="comment.reply_user_id&&comment.reply_user_id!=0">
        <h5>回复给:</h5>
        <span>{{comment.reply_user.account}}</span>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="commentDialog=false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="评论" :visible.sync="commentListDialog" width="80%">
      <el-table :data="postComments" border>
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
        :current-page.sync="currentPostCommentPage"
        :page-size="postCommentPageSize"
        :total="postCommentTotal"
        @current-change="postCommentPageChange"
      ></el-pagination>
      <el-button  @click="commentListDialog=false;">关闭</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import apis from '../../api/apis'
  import utils from '../../utils/utils'
    export default {
        name: "comment",
      data(){
          return{
            activeName:'first',
            commentDialog:false,
            commentListDialog:false,
            commentSearchContent:'',
            postSearchContent:'',
            currentCommentPage:1,
            commentPageSize:10,
            currentPostPage:1,
            postPageSize:10,
            currentPostCommentPage:1,
            postCommentPageSize:10,
            commentTotal:0,
            postTotal:0,
            postCommentTotal:0,
            comments:[],
            posts:[],
            postComments:[],
            comment:{},
            commentPostId:0
          }
      },
      mounted(){

      },
      methods:{
          searchCommentBtnClick(){
            this.currentCommentPage=1;
            this.commentPageSize=10;
            this.searchComment();
          },
        searchPostBtnClick(){
          this.currentPostPage=1;
          this.postPageSize=10;
          this.searchPost();
        },
        searchComment(){
            apis.searchComment(
              {
                keyword:this.commentSearchContent,
                page:this.currentCommentPage,
                pageSize:this.commentPageSize
              }
              ).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.comments=data.data.pageData;
              this.commentTotal=data.data.total;
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          });
        },
        searchPost(){
            apis.getPosts({
              title:this.postSearchContent,
              page:this.currentPostPage,
              pageSize:this.postPageSize
            }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.posts=data.data.pageData;
              this.postTotal=data.data.total;
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          })
        },
        toggleCommentStatus(row){
          let id=row.id;
          let status=row.status;
          apis.updateComment({
            id:id,
            status:status
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.$message.success('更新状态成功');
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          });
        },
        deleteComment(row){
          this.$confirm('确定删除该条评论？').then(()=>{
            let id=row.id;
            apis.deleteComment({id:id}).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.$message.success(res.data.msg);
                this.searchComment();
              }
              else{
                this.$message.error(utils.responseToString(res.data.msg));
              }
            });
          });
        },
        showCommentDialog(row){
           this.comment={};
            apis.getComment({id:row.id}).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.comment=data.data;
                this.commentDialog=true;
              }
              else{
                this.$message.error(utils.responseToString(data.msg));
              }
            });
        },
        showCommentListDialog(row){
          this.commentPostId=row.id;
          this.currentPostCommentPage=1;
          this.postCommentPageSize=10;
          this.getPostComment();
          this.commentListDialog=true;
        },
        getPostComment(){
            apis.getCommentOfPost({
              id:this.commentPostId,
              page:this.currentPostCommentPage,
              pageSize:this.postCommentPageSize
            }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.postComments=data.data.pageData;
              this.postCommentTotal=data.data.total;
            }
          });
        },
        commentPageChange(page){
            this.currentCommentPage=page;
            this.searchComment();
        },
        postPageChange(page){
            this.currentPostPage=page;
            this.searchPost();
        },
        postCommentPageChange(page){
            this.currentPostCommentPage=page;
            this.getPostComment();
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

<style scoped>

</style>
