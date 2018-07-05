<template>
  <div class="customConiter">
    <el-row class="row">
      <el-col :span="6">
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <br>
    <el-row class="search">
      <el-col :span="6" :offset="16">
        <el-input placeholder="请输入客户编号查询" clearable v-model="customId"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-col>
    </el-row>

    <br>

    <el-row class="row">
      <el-table
        :data="tableList"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column
          prop="nickName"
          label="昵称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          align="center">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱地址"
          align="center">
        </el-table-column>
      </el-table>
    </el-row>

    <br>

    <el-row class="row">
        <pageComponent :resultCount="resultCount" :currentPage='currentPage' @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pageComponent>
    </el-row>
  </div>
</template>

<script>
  import pageComponent from '@/components/pagination/pagination'
  import api from './api/api'
  import util from '../../utils'
  export default {
    name: "custom",
    data() {
      return {
        resultCount: 0,     // 记录总条数
        display: 10,   // 每页显示条数
        currentPage: 1,   // 当前的页数
        tableList : [],
        customId: '', // 搜索的会员编号
        loading: true,
      }
    },
    methods: {
      handleCurrentChange(currentPage){
        if(currentPage && Number(currentPage)){
          this.currentPage = currentPage;
          this.init();
        }
      },
      handleSizeChange(pageSize){
        if(pageSize && Number(pageSize)){
          this.display = pageSize;
          this.init();
        }
      },
      search() {
        this.tableList = [];
        this.init();
      },
      init(){
        const user = util.dbGet("userInfo");
        if(util.isExist(user)){
          let param = {
            adminId: user.id,
            pageIndex: this.currentPage,
            pageSize: this.display,
            token: user.token,
            search:  this.customId
          }
          api.queryByPage(param).then(res => {
            this.loading = false;
            if(res.body.result == 0){
              console.log(res.body);
              this.tableList = res.body.data.result;
              this.resultCount = res.body.data.resultCount;
              this.currentPage = res.body.data.pageIndex
            }else if(res.body.result == 2){
              this.$router.push("/")
            }else{
              this.$message.error(res.body.msg);
            }
          })
        }else{
          this.$router.push("/")
        }
      }
    },
    components: {pageComponent},
    mounted(){
      this.$emit("config", "custom");
      this.init();
    }
  }
</script>

<style scoped>
.customConiter{
  padding: 1rem;
}
</style>
