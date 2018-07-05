<template>
  <div>
    <el-menu >
      <el-menu-item>顿拍店后台管理系统</el-menu-item>
    </el-menu>
    <div class="topbar-account topbar-btn">
      <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">
            <i class="iconfont icon-user"></i> {{adminName}}   <i class="el-icon-caret-bottom"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <div @click="jumpTo('/user/profile')"><span style="color: #555;font-size: 14px;">个人信息</span></div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="jumpTo('/user/changepwd')"><span style="color: #555;font-size: 14px;">修改密码</span></div>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>

</template>

<script>
  export default {
    name: "head-component",
    data() {
      return {
        adminName: '管理員'
      }
    },
    methods: {
      signOut() {
        console.log('退出登录')
      },
      changePassword() {
        console.log("密碼修改")
      }
    }
  }
</script>

<style scoped>

</style>
