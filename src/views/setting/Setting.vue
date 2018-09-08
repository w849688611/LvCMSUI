<template>
    <div>
      <el-row>
        <el-button size="small" type="success" @click="showAddDialog" icon="el-icon-plus"></el-button>
        <el-button size="small" type="danger" @click="deleteDataBySelection" icon="el-icon-delete"></el-button>
        <el-button size="small" icon="el-icon-refresh" @click="getData"></el-button>
      </el-row>
      <el-table :data="settingsReal" border stripe size="medium" style="margin:10px auto;" @selection-change="selectChange">
        <el-table-column
          width="60"
          type="selection"
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
            <el-button type="warning" size="mini" @click="showItemDialog(scope.row)">组下配置项</el-button>
            <span v-if="scope.row.id!=0">
              <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
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
      <el-dialog title="添加配置组" :visible.sync="addDialog" >
        <el-form :model="form" :rules="dataRules">
          <el-form-item label="配置组名" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.excerpt" type="textarea" auto-complete="off" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
      </el-dialog>
      <el-dialog title="编辑配置组" :visible.sync="updateDialog">
        <el-form :model="form" :rules="dataRules">
          <el-form-item label="配置组名" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.excerpt" type="textarea" auto-complete="off" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
    <el-button @click="updateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateData">确定</el-button>
    </span>
      </el-dialog>
      <el-dialog title="配置项列表" :visible.sync="itemDialog" width="70%">
        <el-row>
          <el-col>
            <el-button size="small" type="success" @click="showAddItemDialog" icon="el-icon-plus"></el-button>
            <el-button size="small" type="danger" @click="deleteItemDataBySelection" icon="el-icon-delete"></el-button>
            <el-button size="small" icon="el-icon-refresh" @click="getItemData"></el-button>
          </el-col>
        </el-row>
        <el-table :data="settingItems" border size="medium" style="margin:10px auto;" @selection-change="selectItemChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="配置名" prop="name">
          </el-table-column>
          <el-table-column label="描述" prop="excerpt" width="200">
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
                           @click.prevent="showUpdateItemDialog(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle
                           size="mini"
                           @click="deleteItemData(scope.row)"></el-button>
        </span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="添加配置项" :visible.sync="itemAddDialog">
        <el-form :model="itemForm" :rules="itemDataRules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="itemForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="itemForm.excerpt"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="itemForm.type" placeholder="请选择">
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
            <span v-if="itemForm.type==0">
              <el-input v-model="itemForm.content"></el-input>
            </span>
            <span v-if="itemForm.type==1">
              <el-input type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}" v-model="itemForm.content"></el-input>
            </span>
            <span v-if="itemForm.type==2">
              <br>
            <el-upload
              class="avatar-uploader"
              :action="fileUploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="uploadSuccess">
              <img v-if="itemForm.content&&itemForm.type==2" :src="itemForm.content" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </span>
            <span v-if="itemForm.type==3">
              <el-upload
                :action="fileUploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="uploadSuccess">
                <el-row>
                  <el-col :span="16">
                    <el-input :value="itemForm.content" disabled></el-input>
                  </el-col>
                  <el-col  :span="8">
                     <el-button size="small" type="primary">点击上传</el-button>
                  </el-col>
                </el-row>
              </el-upload>
            </span>
          </el-form-item>
        </el-form>
        <span slot="footer">
    <el-button @click="itemAddDialog=false">取消</el-button>
    <el-button type="primary" @click="addItemData">确定</el-button>
  </span>
      </el-dialog>
      <el-dialog title="更新配置项" :visible.sync="itemUpdateDialog">
        <el-form :model="itemForm" :rules="itemDataRules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="itemForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="itemForm.excerpt"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="itemForm.type" placeholder="请选择">
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
            <span v-if="itemForm.type==0">
              <el-input v-model="itemForm.content"></el-input>
            </span>
            <span v-if="itemForm.type==1">
              <el-input type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}" v-model="itemForm.content"></el-input>
            </span>
            <span v-if="itemForm.type==2">
              <br>
            <el-upload
              class="avatar-uploader"
              :action="fileUploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="uploadSuccess">
              <img v-if="itemForm.content&&itemForm.type==2" :src="itemForm.content" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </span>
            <span v-if="itemForm.type==3">
              <el-upload
                :action="fileUploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="uploadSuccess">
                <el-row>
                  <el-col :span="16">
                    <el-input :value="itemForm.content" disabled></el-input>
                  </el-col>
                  <el-col  :span="8">
                     <el-button size="small" type="primary">点击上传</el-button>
                  </el-col>
                </el-row>
              </el-upload>
            </span>
          </el-form-item>
        </el-form>
        <span slot="footer">
    <el-button @click="itemUpdateDialog=false">取消</el-button>
    <el-button type="primary" @click="updateItemData">确定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
  import utils from '../../utils/utils'
    export default {
        name: "setting",
      data(){
          return{
            activeName:"group",
            uploadHeaders:{token:utils.getToken()},
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
            settings:[],
            nowSettingId:0,//正在显示列表的组id
            settingItems:[],
            form:{
              name:'',
              excerpt:'',
            },
            dataRules:{
              name:[
                {required: true, message: '请填写组名称', trigger: 'blur'}
              ]
            },
            itemForm:{
              setting_id:'',
              name:'',
              excerpt:'',
              type:0,
              status:1,
              content:'',
              more:{}
            },
            itemDataRules:{
              name:[{required: true, message: '请填写配置名称', trigger: 'blur'}]
            },
          }
      },
      computed:{
        fileUploadUrl(){
          return this.$baseURL+"/api/file/add";
        },
        settingsReal(){
          /**
           *将默认组添加至数据中
           */
          let settings=this.settings;
          settings.unshift({
            id:0,
            name:'默认组',
            excerpt:'默认全局配置'
          });
          return settings;
        }
      },
      mounted(){
          this.getData();
      },
      methods:{
        showAddDialog(){
          this.form={
            name:'',
            excerpt:''
          };
          this.addDialog=true;
        },
        showUpdateDialog(row){
          this.$axios.post('/api/setting/get',{
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
        showItemDialog(row){
          let id=row.id;
          this.nowSettingId=id;
          this.itemForm.setting_id=id;//便于为组添加项
          this.settingItems=[];
          this.getItemData();
          this.itemDialog=true;
        },
        showAddItemDialog(){
          this.itemForm={
            setting_id:this.nowSettingId,
            name:'',
            type:0,
            status:1,
            content:'',
            more:{}
          };
          this.itemAddDialog=true;
        },
        showUpdateItemDialog(row){
          this.$axios.post('/api/setting/item/get',{
            id:row.id
          },{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              let itemForm=data.data;
              this.itemForm=itemForm;
              this.itemUpdateDialog=true;
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          });
        },
        pageChange(page){
          this.currentPage=page;
          this.getData();
        },
        selectChange(selection){
          this.selection=selection;
        },
        addData(){
          this.$axios.post('/api/setting/add',this.form,{
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
              this.$axios.post('/api/setting/delete',{
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
          this.$axios.post('/api/setting/update',this.form,{
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
          this.$axios.post('/api/setting/getByPage',{
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
                this.settings=data.data.pageData;
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
              this.$axios.post('/api/setting/delete',{
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
          this.$axios.post('/api/setting/item/add',itemForm,{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.$message.success('添加配置项成功');
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
          this.$axios.post('/api/setting/item/update',itemForm,{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.$message.success('更新配置项成功');
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
              this.$axios.post('/api/setting/item/delete',{
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
          let id=this.nowSettingId;
          this.$axios.get('/api/setting/getItemOfSetting',{
            params:{
              id:id
            },
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.settingItems=data.data;
            }
          }).catch(err=>{
            utils.handleErr.call(this,err);
          });
        },
        deleteItemDataBySelection(){
          let ids=this.selectionItem.map(item=>item.id);
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
        uploadSuccess(res,file){
          if(res.status=='200'){
            this.$set(this.itemForm,'content',res.data.url);
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
