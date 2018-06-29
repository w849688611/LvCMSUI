<template>
<div>
  <span v-for="(item,index) in menu">
    <el-menu-item v-if="!item.children||item.children.length==0" :index="`${level}-${index}`">
      <template slot="title">
        <i :class="item.more.icon" v-if="item.more&&item.more.icon"></i>
            <span>{{item.name}}</span>
      </template>
    </el-menu-item>
    <el-submenu v-else :index="`${level}-${index}`">
       <template slot="title">
        <i :class="item.more.icon" v-if="item.more&&item.more.icon"></i>
            <span>{{item.name}}</span>
      </template>
      <nav-menu-circle :menu="item.children" :level="`${level}-${index}`"></nav-menu-circle>
    </el-submenu>
  </span>
</div>
</template>

<script>
    export default {
        name: "nav-menu-circle",
      props:['menu','level']
    }
</script>

<style scoped>

</style>
