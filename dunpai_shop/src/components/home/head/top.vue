<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo">顿拍店后台管理系统</div>
      <div class="topbar-account topbar-btn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">
            <i class="iconfont icon-user"></i> {{nickname}}   <i class="el-icon-caret-bottom"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="showChangeComponent">
                <span style="color: #555;font-size: 14px;">修改密码</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided >
              <div @click="logout">
                <span style="color: #555;font-size: 14px;">退出登录</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
    <div class="toast" v-if="canShowFlag">
      <el-form label-position="left" label-width="0px" class="demo-ruleForm login-container">
          <h3 class="title">密码修改</h3>
          <el-input type="text" v-model.trim="protoPassword" placeholder="原密码" class="dist"></el-input>
          <el-input type="password" v-model.trim="newPassword" placeholder="新密码" class="dist"></el-input>
        <el-input type="password" v-model.trim="newPassword2" placeholder="确认密码" class="dist"></el-input>
          <el-form-item style="width:100%;text-align: center" class="dist">
            <el-button type="primary" @click.stop="update">修改</el-button>
            <el-button @click.stop="close">关闭</el-button>
          </el-form-item>
      </el-form>
    </div>
  </el-row>
</template>

<script>
  import api from './api/api';
  import util from '../../../utils'
  export default {
    name: "top",
    data() {
      return {
        nickname: '',
        collapsed: true,
        canShowFlag: false,
        protoPassword: '',
        newPassword: '',
        newPassword2: '',
      }
    },
    methods: {
      showChangeComponent() {
        this.canShowFlag = true;
      },
      logout() {
        util.dbRemove("userInfo");
        this.$router.push("/login");
      },
      close() {
        this.canShowFlag = false;
      },
      update(){
        if(this.isVilidata()){
          const user = util.dbGet("userInfo");
          if(util.isExist(user)){
            let param = {
              id: user.id,
              token: user.token,
              oldPassWord: this.protoPassword,
              newPassWord: this.newPassword
            }
            api.update(param).then(res => {
              if(res.body.result == 0){
                this.$message.success("密码修改成功");
                let that = this;
                util.dbRemove("userInfo");
                setTimeout(() => {
                  that.$router.push("/");
                },2000);
              }else{
                if(res.body.result == 2){
                  this.$router.push("/");
                }else{
                  this.$message.error(res.body.msg);
                }

              }
            })
          }
        }
      },
      isVilidata(){
        if(this.protoPassword == null || this.protoPassword == ""){
          this.$message.error("原始密码不能为空")
          return false;
        }
        if(this.newPassword == null || this.newPassword == ""){
          this.$message.error("新密码不能为空")
          return false;
        }
        if(this.newPassword != this.newPassword2){
          this.$message.error("新密码和确认密码不一致")
          return false;
        }
        return true;
      },
      config(){
        const user = util.dbGet("userInfo");
        if(util.isExist(user)){
          this.nickname = user.adminName;
        }
      }
    },
    mounted(){
      this.config();
    }
  }
</script>

<style scoped>
  .container {
    font-size: 1rem;
    font-family: 微软雅黑;
    color: #333;
    border-bottom: 1px solid #ccc;
  }

  .topbar-wrap {
    height: 3.75rem;
    line-height: 3.75rem;
  }

  .topbar-wrap div {
    display: inline-block;
  }

  .topbar-wrap .topbar-account {
    position: absolute;
    right: 1.25rem;
  }

  .topbar-wrap .topbar-logo {
    margin-left: 1.5625rem;
  }

  .toast {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);
    z-index: 100;
  }

  .toast .mask_body {
    width: 6rem;
    height: 3rem;
    margin: 2rem auto;
    background: antiquewhite;
  }

  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 0 auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    position:fixed;
    top:30%; left:30%;
  }

  .login-container .title {
    text-align: center;
    color: #505458;
    font-size: 1.5rem;
  }

  .login-container .remember {
    margin: 0px 0px 35px 0px;
  }

  .login-container h3{
    margin-top: 1rem;
  }

  .login-container .dist{
    margin-bottom: 1rem;
  }
</style>
