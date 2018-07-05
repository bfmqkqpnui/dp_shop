<template>
  <el-form label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">顿拍店管理系统登录</h3>
    <el-input type="text" v-model.trim="loginAccout" placeholder="账号" class="dist"></el-input>
    <el-input type="password" v-model.trim="passWord" placeholder="密码" class="dist" @keyup.enter.native="login"></el-input>
    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
    <el-form-item style="width:100%;" class="dist">
      <el-button type="primary" style="width:100%;" @click.stop="login">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import api from './api/api';
  import util from '../../utils'
  export default {
    data() {
      return {
        loginAccout: '',
        passWord: '',
      };
    },
    methods: {
      login() {
        if(util.isExist(this.loginAccout) && util.isExist(this.passWord)){
          let param = {
            loginAccout: this.loginAccout,
            passWord: this.passWord
          }
          api.login(param).then(res => {
            console.log(res.body)
            if (res.body.result == 0) {
              util.dbSet("userInfo",res.body.data);
              this.$router.push("/home");
            } else {
              this.$message.error(res.body.msg);
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login-container .title {
    text-align: center;
    color: #505458;
    font-size: 2rem;
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
