<template>
    <div>
      <div v-for="(item,index) in data">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-checkbox v-if="item.checked&&item.checked==1" checked></el-checkbox>
            <el-checkbox v-else></el-checkbox>
          </el-col>
          <el-col :span="20">
            <div :style="{marginLeft:offset*level+'px'}">
              {{item.name}}
            </div>
          </el-col>
        </el-row>
        <div v-if="item.children&&item.children.length>0">
          <category-choose-table :data="item.children" :offset="offset" :level="level+1"></category-choose-table>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "category-choose-table",
      props:{
          data:{
            required:true
          },
        offset:{
            default:20
        },
        level:{
            default:0
        }
      }
    }
</script>

<style scoped>

</style>
