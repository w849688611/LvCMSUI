<template>
  <div>
    <el-row>
      <el-col>
        <el-button size="small" type="success" @click="showAddDialog" icon="el-icon-plus"></el-button>
        <el-button size="small" type="danger" @click="deleteDataBySelection" icon="el-icon-delete"></el-button>
        <el-button size="small" icon="el-icon-refresh" @click="getData"></el-button>
      </el-col>
    </el-row>
    <el-table :data="links" v-loading="loading" border size="medium" style="margin:10px auto;" @selection-change="selectChange">
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        label="名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="链接">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" style="color:#01AAED;">{{scope.row.url}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tooltip content="切换友情链接显示状态" placement="top">
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
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
          </el-button-group>
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

    <el-dialog title="添加" :visible.sync="addDialog" >
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="显示" value=1></el-option>
            <el-option label="不显示" value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="form.list_order" auto-complete="off" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialog=false">取消</el-button>
    <el-button type="primary" @click="addData">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="updateDialog">
      <el-form :model="form" :rules="dataRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="显示" value=1></el-option>
            <el-option label="不显示" value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="form.list_order" auto-complete="off" type="number"></el-input>
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
        name: "friend-link",
      data(){
          return {
            currentPage:1,
            pageSize:10,
            total:0,
            selection:[],
            addDialog:false,
            updateDialog:false,
            links:[],
            loading:false,
            form:{
              name:'',
              url:'',
              status:'1',
              list_order:'0',
            },
            dataRules:{
              name:[
                {required: true, message: '请填写链接名称', trigger: 'blur'}
              ],
              url:[
                {required: true, message: '请填写链接地址', trigger: 'blur'}
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
            status:'1',
            list_order:'0',
          };
          this.addDialog=true;
        },
        showUpdateDialog(row){
          console.log(row);
          this.$axios.post('/api/plugin/friendLink/get',{
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
          this.$axios.post('/api/plugin/friendLink/add',this.form,{
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
              this.$axios.post('/api/plugin/friendLink/delete',{
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
          this.$axios.post('/api/plugin/friendLink/update',this.form,{
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
          this.$axios.post('/api/plugin/friendLink/getByPage',{
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
                this.links=data.data.pageData;
                this.total=data.data.total;
              }
            })
            .catch(err=>{
              utils.handleErr.call(this,err);
            })
            .finally(()=>{
              this.loading=false;
          });
        },
        deleteDataBySelection(){
          let ids=this.selection.map(item=>item.id);
          this.$confirm('确认删除所选项？')
            .then(()=> {
              this.$axios.post('/api/plugin/friendLink/delete',{
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
        toggleStatus(row){
          this.$axios.post('/api/plugin/friendLink/update',{
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

<style scoped>

</style>
