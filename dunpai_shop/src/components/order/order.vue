<template>
  <div class="customConiter">
    <el-row class="row">
      <el-col :span="6">
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <br>
    <el-row class="search">
      <el-col :span="7">
        <el-date-picker
          v-model="downloadDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-download" @click="download" plain>下载报表</el-button>
      </el-col>
      <el-col :span="6" :offset="7">
        <el-input placeholder="请输入订单编号查询" clearable v-model="customId"></el-input>
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
        <el-table-column
          prop="status"
          label="状态"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.status | getStatus }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="updateComponent(scope.row)">更新</el-button>
            <el-button type="text" size="medium" @click="canUsedByStatus(scope.row,'1')">启用</el-button>
            <el-button type="text" size="medium" @click="canUsedByStatus(scope.row,'0')">禁用</el-button>
          </template>
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
        resultCount: 1, // 记录总条数
        display: 10,   // 每页显示条数
        currentPage: 1,   // 当前的页数
        tableList : [],
        customId: '', // 搜索的会员编号
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }, // 日期选项初始值
        downloadDate: '',
        loading: true,
      }
    },
    methods: {
      handleCurrentChange(currentPage){
        console.log(`当前页:`+currentPage);
        if(currentPage && Number(currentPage)){
          this.currentPage = currentPage;
        }
      },
      handleSizeChange(pageSize){
        console.log(`当前记录条数: `+pageSize);
        if(pageSize && Number(pageSize)){
          this.display = pageSize;
        }
      },
      search() {
        console.log("搜索。。。");
      },
      download(){
        console.log("下载....");
        console.log("日期:"+this.downloadDate);
      }
    },
    mounted(){
      this.$emit("config", "order");
    },
    components: {pageComponent},
    filters:{
      /**
       * 状态
       * @param val
       * @returns {string}
       */
      getStatus(val) {
        let status = "启用";
        if (Number(val) == 0) {
          status = "禁用"
        }
        return status;
      }
    }
  }
</script>

<style scoped>
  .customConiter{
    padding: 1rem;
  }
</style>
