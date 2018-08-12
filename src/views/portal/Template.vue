<template>
    <div>
      <el-button size="small" type="success" @click="showAddDialog">新增模版</el-button>
      <el-tabs v-model="activeName">
        <el-tab-pane label="栏目模版" name="first">
          <el-table border size="medium" :data="categoryTemplates">
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column prop="url" label="URL">
            </el-table-column>
            <el-table-column label="是否默认">
              <template slot-scope="scope">
                <span v-if="scope.row.is_default==1">
                  <el-tag><i class="el-icon-third-round_crown_fill"></i>默认</el-tag>
                </span>
                <span v-if="scope.row.is_default==0">
                  <el-tag type="warning">普通</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="mini" @click="deleteData(scope.row)">
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <!--<el-pagination-->
            <!--background-->
            <!--layout="prev, pager, next"-->
            <!--:current-page.sync="currentCategoryTemplatePage"-->
            <!--:page-size="categoryTemplatePageSize"-->
            <!--:total="categoryTemplateTotal"-->
            <!--@current-change="categoryTemplatePageChange"-->
          <!--&gt;-->
          <!--</el-pagination>-->
        </el-tab-pane>
        <el-tab-pane label="内容模版" name="second">
          <el-table border size="medium" :data="postTemplates">
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column prop="url" label="URL">
            </el-table-column>
            <el-table-column label="是否默认">
              <template slot-scope="scope">
                <span v-if="scope.row.is_default==1">
                  <el-tag><i class="el-icon-third-round_crown_fill"></i>默认</el-tag>
                </span>
                <span v-if="scope.row.is_default==0">
                  <el-tag type="warning">普通</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="mini" @click="deleteData(scope.row)">
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <!--<el-pagination-->
            <!--background-->
            <!--layout="prev, pager, next"-->
            <!--:current-page.sync="currentPostTemplatePage"-->
            <!--:page-size="postTemplatePageSize"-->
            <!--:total="postTemplateTotal"-->
            <!--@current-change="postTemplatePageChange"-->
          <!--&gt;-->
          <!--</el-pagination>-->
        </el-tab-pane>
        <el-tab-pane label="单页模版" name="third">
          <el-table border size="medium" :data="singleTemplates">
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column prop="url" label="URL">
            </el-table-column>
            <el-table-column label="是否默认">
              <template slot-scope="scope">
                <span v-if="scope.row.is_default==1">
                  <el-tag><i class="el-icon-third-round_crown_fill"></i>默认</el-tag>
                </span>
                <span v-if="scope.row.is_default==0">
                  <el-tag type="warning">普通</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="mini" @click="deleteData(scope.row)">
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <!--<el-pagination-->
            <!--background-->
            <!--layout="prev, pager, next"-->
            <!--:current-page.sync="currentSingleTemplatePage"-->
            <!--:page-size="singleTemplatePageSize"-->
            <!--:total="singleTemplateTotal"-->
            <!--@current-change="singleTemplatePageChange"-->
          <!--&gt;-->
          <!--</el-pagination>-->
        </el-tab-pane>
      </el-tabs>
      <el-dialog title="添加模版" :visible.sync="addDialog">
        <el-form :model="form"  :rules="dataRules">
          <el-form-item label="标题" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="URL" prop="url">
            <el-input v-model="form.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type">
              <el-option label="栏目模版" :value=1></el-option>
              <el-option label="单页模版" :value=2></el-option>
              <el-option label="内容模版" :value=3></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否默认模版">
            <el-radio v-model="form.is_default" :label=0>普通</el-radio>
            <el-radio v-model="form.is_default" :label=1>默认</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
    </span>
      </el-dialog>
      <el-dialog title="编辑模版" :visible.sync="updateDialog">
        <el-form :model="form"  :rules="dataRules">
          <el-form-item label="标题" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="URL" prop="url">
            <el-input v-model="form.url" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type">
              <el-option label="栏目模版" :value=1></el-option>
              <el-option label="单页模版" :value=2></el-option>
              <el-option label="内容模版" :value=3></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否默认模版">
            <el-radio v-model="form.is_default" :label=0>普通</el-radio>
            <el-radio v-model="form.is_default" :label=1>默认</el-radio>
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
        name: "template",
      data(){
          return{
            activeName:'first',
            addDialog:false,
            updateDialog:false,
            categoryTemplates:[],
            // currentCategoryTemplatePage:1,
            // categoryTemplatePageSize:10,
            // categoryTemplateTotal:0,
            postTemplates:[],
            // currentPostTemplatePage:1,
            // postTemplatePageSize:10,
            // postTemplateTotal:0,
            singleTemplates:[],
            // currentSingleTemplatePage:1,
            // singleTemplatePageSize:10,
            // singleTemplateTotal:0,
            form:{
              name:'',
              url:'',
              is_default:0,
              type:''
            },
            dataRules:{
              name:[
                {required:true,message:'请填写模版名称',trigger:blur}
              ],
              url:[
                {required:true,message:'请填写模版链接',trigger:blur}
              ],
              type:[
                {required:true,message:'请选择模版类型',trigger:blur}
              ]
            }
          }
      },
      mounted(){
          this.getData();
      },
      methods:{
        showAddDialog(){
          this.form={
            name:'',
              url:'',
              is_default:0,
              type:''
          };
          this.addDialog=true;
        },
        showUpdateDialog(row){
          this.$axios.post('/api/template/get',{
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
          })
        },
        // categoryTemplatePageChange(){
        //
        // },
        // postTemplatePageChange(){
        //
        // },
        // singleTemplatePageChange(){
        //
        // },
        addData(){
          this.form.more=JSON.stringify(this.form.more);
          this.$axios.post('/api/template/add',this.form,{
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
              this.$axios.post('/api/template/delete',{
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
          this.$axios.post('/api/template/update',this.form,{
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
          this.$axios.get('/api/template/getCategoryTemplate',{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.categoryTemplates=data.data;
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          })
            .catch(err=>{
              utils.handleErr.call(this,err);
            });
          this.$axios.get('/api/template/getSingleTemplate',{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.singleTemplates=data.data;
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          })
            .catch(err=>{
              utils.handleErr.call(this,err);
            });
          this.$axios.get('/api/template/getPostTemplate',{
            headers:{
              token:utils.getToken()
            }
          }).then(res=>{
            let data=res.data;
            if(data.status=='200'){
              this.postTemplates=data.data;
            }
            else{
              this.$message.error(utils.responseToString(data.msg));
            }
          })
            .catch(err=>{
              utils.handleErr.call(this,err);
            });
        }
      }
    }
</script>

<style scoped>

</style>
