<template>
  <div id="leftComp">
    <el-col :span="4">
      <el-menu
        :default-active="active"
        class="el-menu-vertical-demo">
        <el-menu-item index="member" @click="config('member')">
          <i class="el-icon-setting"></i>
          <span slot="title">设计师管理</span>
        </el-menu-item>
        <el-menu-item index="custom" @click="config('custom')">
          <i class="el-icon-setting"></i>
          <span slot="title">客户管理</span>
        </el-menu-item>
        <el-menu-item index="order" @click="config('order')">
          <i class="el-icon-setting"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
        <el-menu-item index="params" @click="config('params')">
          <i class="el-icon-setting"></i>
          <span slot="title">设计属性参数管理</span>
        </el-menu-item>
        <el-menu-item index="preferences" @click="config('preferences')">
          <i class="el-icon-setting"></i>
          <span slot="title">客户喜好素材管理</span>
        </el-menu-item>
        <el-menu-item index="room" @click="config('room')">
          <i class="el-icon-setting"></i>
          <span slot="title">房间管理</span>
        </el-menu-item>
        <el-menu-item index="project" @click="config('project')">
          <i class="el-icon-setting"></i>
          <span slot="title">项目管理</span>
        </el-menu-item>
        <el-menu-item index="business" @click="config('business')">
          <i class="el-icon-setting"></i>
          <span slot="title">交易管理</span>
        </el-menu-item>
        <!--<el-submenu index="5">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>设计属性参数管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="5-1">选项1</el-menu-item>
            <el-menu-item index="5-2">选项2</el-menu-item>
          </el-menu-item-group>
        </el-submenu>-->
      </el-menu>
    </el-col>
    <el-col :span="20">
      <router-view @config="config"/>
    </el-col>
  </div>
</template>

<script>
  import util from '../../../utils'
  export default {
    name: "left-component",
    data() {
      return {
        active: "custom"
      }
    },
    mounted(){
    },
    methods:{
      config(pageName){
        if(util.isExist(pageName)){
          this.setMenu(pageName);
          if(pageName == "params"){
            this.$router.push("/home/settings");
          }else if(pageName == "member"){
            this.$router.push("/home/member");
          }else if(pageName == "custom"){
            this.$router.push("/home/custom");
          }else if(pageName == "order"){
            this.$router.push("/home/order");
          }else if(pageName == "preferences"){
            this.$router.push("/home/customerPreferences");
          }else if(pageName == "room"){
            this.$router.push("/home/room");
          }else if(pageName == "project"){
            this.$router.push("/home/project");
          }else if(pageName == "business"){
            this.$router.push("/home/business");
          }
        }
      },
      setMenu(menuName){
        if(util.isExist(menuName)){
          this.active = menuName;
        }
      }
    }
  }
</script>

<style scoped>

</style>
