<template>
<div>
  <el-row>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model.trim="searchName"></el-input>
      </el-form-item>
      <el-form-item label="配置组">
        <el-select v-model="searchSetting" placeholder="请选择">
          <el-option
            label="全部"
            :value=-1>
          </el-option>
          <el-option v-for="item in settings" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="searchType" placeholder="请选择">
          <el-option
            label="全部"
            :value=-1>
          </el-option>
          <el-option
            label="文本"
            :value=0>
          </el-option>
          <el-option
            label="长文本"
            :value=1>
          </el-option>
          <el-option
            label="图片"
            :value=2>
          </el-option>
          <el-option
            label="文件"
            :value=3>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchStatus" placeholder="请选择">
          <el-option
            label="全部"
            :value=-1>
          </el-option>
          <el-option
            label="开启"
            :value=1>
          </el-option>
          <el-option
            label="关闭"
            :value=0>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="searchData">搜索</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>
    <el-button size="small" type="success" @click="showAddDialog" icon="el-icon-plus"></el-button>
    <el-button size="small" type="danger" @click="deleteDataBySelection" icon="el-icon-delete"></el-button>
    <el-button size="small" icon="el-icon-refresh" @click="getData"></el-button>
  </el-row>
  <el-table :data="settingItems" border stripe size="medium" style="margin:10px auto;" @selection-change="selectChange">
    <el-table-column type="selection"></el-table-column>
    <el-table-column label="配置名" prop="name">
    </el-table-column>
    <el-table-column label="描述" prop="excerpt" width="250">
    </el-table-column>
    <el-table-column label="内容">
      <template slot-scope="scope">
              <span v-if="scope.row.type==0">
                {{scope.row.content}}
              </span>
        <span v-if="scope.row.type==1">
                {{scope.row.content}}
              </span>
        <span v-if="scope.row.type==2">
                <img :src="scope.row.content" :alt="scope.row.name" style="width: 100%;height: auto;">
              </span>
        <span v-if="scope.row.type==3">
                {{scope.row.content}}
              </span>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100">
      <template slot-scope="scope">
        <el-tooltip content="切换状态" placement="top">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value=1
            :inactive-value=0
            @change="toggleStatus(scope.row)"
          >
          </el-switch>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
            <span>
                <el-button type="primary" icon="el-icon-edit" circle
                           size="mini"
                           @click.prevent="showUpdateDialog(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle
                           size="mini"
                           @click="deleteData(scope.row)"></el-button>
        </span>
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
  <el-dialog title="添加配置" :visible.sync="addDialog" >
    <el-form :model="form" :rules="dataRules">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.excerpt"></el-input>
        </el-form-item>
        <el-form-item label="配置组">
          <el-select v-model="form.setting_id">
            <el-option
              label="默认组"
              :value=0>
            </el-option>
            <el-option v-for="item in settings" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              label="文本"
              :value=0>
            </el-option>
            <el-option
              label="长文本"
              :value=1>
            </el-option>
            <el-option
              label="图片"
              :value=2>
            </el-option>
            <el-option
              label="文件"
              :value=3>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
            <span v-if="form.type==0">
              <el-input v-model="form.content"></el-input>
            </span>
          <span v-if="form.type==1">
              <el-input type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}" v-model="form.content"></el-input>
            </span>
          <span v-if="form.type==2">
              <br>
            <el-upload
              class="avatar-uploader"
              :action="fileUploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="uploadSuccess">
              <img v-if="form.content&&form.type==2" :src="form.content" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </span>
          <span v-if="form.type==3">
              <el-upload
                :action="fileUploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="uploadSuccess">
                <el-row>
                  <el-col :span="16">
                    <el-input :value="form.content" disabled></el-input>
                  </el-col>
                  <el-col  :span="8">
                     <el-button size="small" type="primary">点击上传</el-button>
                  </el-col>
                </el-row>
              </el-upload>
            </span>
        </el-form-item>
      </el-form>
    </el-form>
    <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
  </el-dialog>
  <el-dialog title="编辑配置" :visible.sync="updateDialog">
    <el-form :model="form" :rules="dataRules">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.excerpt"></el-input>
        </el-form-item>
        <el-form-item label="配置组">
          <el-select v-model="form.setting_id">
            <el-option
              label="默认组"
              :value=0>
            </el-option>
            <el-option v-for="item in settings" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              label="文本"
              :value=0>
            </el-option>
            <el-option
              label="长文本"
              :value=1>
            </el-option>
            <el-option
              label="图片"
              :value=2>
            </el-option>
            <el-option
              label="文件"
              :value=3>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
            <span v-if="form.type==0">
              <el-input v-model="form.content"></el-input>
            </span>
          <span v-if="form.type==1">
              <el-input type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}" v-model="form.content"></el-input>
            </span>
          <span v-if="form.type==2">
              <br>
            <el-upload
              class="avatar-uploader"
              :action="fileUploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="uploadSuccess">
              <img v-if="form.content&&form.type==2" :src="form.content" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </span>
          <span v-if="form.type==3">
              <el-upload
                :action="fileUploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="uploadSuccess">
                <el-row>
                  <el-col :span="16">
                    <el-input :value="form.content" disabled></el-input>
                  </el-col>
                  <el-col  :span="8">
                     <el-button size="small" type="primary">点击上传</el-button>
                  </el-col>
                </el-row>
              </el-upload>
            </span>
        </el-form-item>
      </el-form>
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
        name: "setting-item",
      data(){
          return{
            searchName:'',
            searchType:-1,//-1表示搜索所有类型
            searchStatus:-1,//－1表示搜索所有状态的
            searchSetting:-1,//－1表示从全部数据搜索配置项
            currentPage:1,
            pageSize:10,
            total:0,
            selection:[],
            addDialog:false,
            updateDialog:false,
            settings:[],
            settingItems:[],
            form:{
              setting_id:0,
              name:'',
              excerpt:'',
              type:0,
              status:1,
              content:'',
              more:{}
            },
            dataRules:{
              name:[
                {required: true, message: '请填写配置名称', trigger: 'blur'}
              ]
            },
          }
      },
      computed:{
        fileUploadUrl(){
          return this.$baseURL+"/api/file/add";
        }
      },
      mounted(){
          this.getData();
          this.getSetting();
      },
      activated(){
        this.getSetting();
      },
      methods:{
        showAddDialog(){
          this.form={
            setting_id:0,
            name:'',
            excerpt:'',
            type:0,
            status:1,
            content:'',
            more:{}
          };
          this.addDialog=true;
        },
        showUpdateDialog(row){
          this.$axios.post('/api/setting/item/get',{
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
              this.$message.error(utils.responseToString(data.msg));
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          })
        },
        pageChange(page){
          this.currentPage=page;
          this.getData();
        },
        selectChange(selection){
          this.selection=selection;
        },
        addData(){
          let form=this.form;
          form.more=JSON.stringify(form.more);
          this.$axios.post('/api/setting/item/add',form,{
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
              this.$axios.post('/api/setting/item/delete',{
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
          let form=this.form;
          form.more=JSON.stringify(form.more);
          this.$axios.post('/api/setting/item/update',form,{
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
          let query={
            page:this.currentPage,
            pageSize:this.pageSize
          };
          if(this.searchName!=''){
            query.name=this.searchName
          }
          if(this.searchType!=-1){
            query.type=this.searchType
          }
          if(this.searchSetting!=-1){
            query.setting_id=this.searchSetting
          }
          if(this.searchStatus!=-1){
            query.status=this.searchStatus
          }
          this.$axios.post('/api/setting/item/getByPage',query,{
            headers:{
              token:utils.getToken()
            }
          })
            .then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.settingItems=data.data.pageData;
                this.total=data.data.total;
              }
            })
            .catch(err=>{
              utils.handleErr.call(this,err);
            })
        },
        searchData(){
          this.currentPage=1;
          this.getData();
        },
        deleteDataBySelection(){
          let ids=this.selection.map(item=>item.id);
          this.$confirm('确认删除该项？')
            .then(()=> {
              this.$axios.post('/api/setting/item/delete',{
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
        uploadSuccess(res,file){
          if(res.status=='200'){
            this.$set(this.form,'content',res.data.url);
          }
        },
        toggleStatus(row){
          this.$axios.post('/api/setting/item/update',{
            id:row.id,
            status:row.status
          },{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.$message.success('切换成功');
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          });
        },
        getSetting(){
          this.$axios.get('/api/setting/getByPage',{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.settings=data.data.pageData;
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          });
        }
      }
    }
</script>

<style>
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
