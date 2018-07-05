<template>
  <div class="customConiter">
    <el-row class="row">
      <el-col :span="6">
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>参数设计管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <br>
    <el-row class="search">
      <el-col :span="2">
        <el-button type="primary" @click="showComponent('add',null)">添加</el-button>
      </el-col>
      <el-col :span="6" :offset="14">
        <el-input placeholder="请输入参数的编号查询" clearable v-model="customId"></el-input>
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
          prop="code"
          label="代码"
          align="center">
        </el-table-column>
        <el-table-column
          prop="paramKey"
          label="参数键"
          align="center">
        </el-table-column>
        <el-table-column
          prop="paramValue"
          label="参数值"
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
            <el-button type="text" size="medium" @click="showComponent('update',scope.row)">更新</el-button>
            <el-button type="text" size="medium" @click="canUsedByStatus(scope.row,'1')">启用</el-button>
            <el-button type="text" size="medium" @click="canUsedByStatus(scope.row,'0')">禁用</el-button>
            <el-button type="text" size="medium" @click="delParam(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <br>
    <el-row class="row">
      <pageComponent :resultCount="resultCount" :currentPage='currentPage' @handleCurrentChange="handleCurrentChange"
                     @handleSizeChange="handleSizeChange"></pageComponent>
    </el-row>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="paramForm" ref="paramForm">
        <el-form-item label="代码" :label-width="formLabelWidth" prop="code">
          <el-input v-model.trim="paramForm.code" auto-complete="off" clearable placeholder="请输入代码"></el-input>
        </el-form-item>
        <el-form-item label="参数键" :label-width="formLabelWidth" prop="paramKey">
          <el-input v-model.trim="paramForm.paramKey" auto-complete="off" clearable placeholder="请输入参数键"></el-input>
        </el-form-item>
        <el-form-item label="参数值" :label-width="formLabelWidth" prop="paramValue">
          <el-input v-model.trim="paramForm.paramValue" auto-complete="off" clearable placeholder="请输入参数值"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="paramForm.status" placeholder="请选择参数状态" clearable>
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
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
        resultCount: 1,     // 记录总条数
        display: 10,   // 每页显示条数
        currentPage: 1,   // 当前的页数
        tableList: [],
        customId: '', // 搜索的会员编号
        loading: true,
        dialogFormVisible: false,
        paramForm:{
          id:'',
          code:'',
          paramKey:'',
          paramValue:'',
          status:'',
          token:''
        },
        formLabelWidth:"120px",
        title:"参数设计管理更新"
      }
    },
    methods: {
      handleCurrentChange(currentPage) {
        if (currentPage && Number(currentPage)) {
          this.currentPage = currentPage;
          this.init();
        }
      },
      handleSizeChange(pageSize) {
        if (pageSize && Number(pageSize)) {
          this.display = pageSize;
          this.init();
        }
      },
      search() {
        this.tableList = [];
        this.init();
      },
      init() {
        const user = util.dbGet("userInfo");
        if (util.isExist(user)) {
          let param = {
            pageIndex: this.currentPage,
            pageSize: this.display,
            token: user.token,
            search: this.customId
          }
          api.queryByPage(param).then(res => {
            this.loading = false;
            if (res.body.result == 0) {
              console.log(res.body);
              this.tableList = res.body.data.result;
              this.resultCount = res.body.data.resultCount;
              this.currentPage = res.body.data.pageIndex;
            } else if (res.body.result == 2) {
              this.$router.push("/")
            } else {
              this.$message.error(res.body.msg);
            }
          })
        }else{
          this.$router.push("/")
        }
      },
      update(opt) {
        console.log("更新")
        if(util.isExist(opt)){
          this.showComponent(opt);
        }
      },
      showComponent(type,opt){
        this.dialogFormVisible = true;
        if(util.isExist(type)){
          if(type == "add"){
            if(null == opt){
              this.formConfig();
            }
          }else if(type == "update"){
            debugger
            if(util.isExist(opt)){
              opt.status = opt.status + "";
              this.paramForm = opt;
            }
          }
        }
      },
      submitForm(){
        this.loading = true;
        if(util.isExist(this.paramForm.id)){
          const user = util.dbGet("userInfo");
          if (util.isExist(user)) {
            this.paramForm.token = user.token;
            api.update(this.paramForm).then(res => {
              this.loading = false;
              if(res.body.result == 0){
                console.log(res.body);
                this.$message.success("更新成功");
                this.dialogFormVisible = false;
                this.init();
              }else if(res.body.result == 2){
                this.$router.push("/")
              }else{
                this.$message.error(res.body.msg);
              }
            })
          }else{
            this.$router.push("/")
          }
        }else{
          const user = util.dbGet("userInfo");
          if (util.isExist(user)) {
            this.paramForm.token = user.token;
            api.addParams(this.paramForm).then(res => {
              this.loading = false;
              if(res.body.result == 0){
                console.log(res.body);
                this.$message.success("添加成功");
                this.dialogFormVisible = false;
                this.init();
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
      resetForm(){
        this.dialogFormVisible = false;
        this.formConfig();
      },
      formConfig(){
        this.paramForm = {
          id:'',
            code:'',
            paramKey:'',
            paramValue:'',
            status:'',
            token:''
        }
      },
      canUsedByStatus(opt,status){
        const user = util.dbGet("userInfo");
        if(util.isExist(user)){
          if(util.isExist(opt)){
            let param = {
              id: opt.id,
              token: user.token
            }
            if(!isNaN(status)){
              param.status = status;
            }

            api.update(param).then(res => {
              if(res.body.result == 0){
                console.log(res.body);
                this.$message.success("状态更新成功");
                this.init();
              }else if(res.body.result == 2){
                this.$router.push("/")
              }else{
                this.$message.error(res.body.msg);
              }
            })
          }
        }else{
          this.$router.push("/")
        }
      },
      delParam(opt){
        const user = util.dbGet("userInfo");
        if(util.isExist(user)){
          if(util.isExist(opt)){
            debugger
            let param = {
              id: opt.id,
              token: user.token
            }
            this.confirm(param);
          }
        }else{
          this.$router.push("/")
        }
      },
      confirm(param){
        this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delete(param).then(res => {
            if(res.body.result == 0){
              this.$message.success('删除成功!');
              this.init();
            }else if(res.body.result == 2){
              this.$router.push("/")
            }else{
              this.$message.error(res.body.msg);
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
    },
    mounted() {
      this.$emit("config", "params");
      this.init();
    },
    components: {pageComponent},
    filters: {
      getStatus(val) {
        let status = "";
        if (Number(val) == 0) {
          status = "禁用"
        } else if (Number(val) == 1){
          status = "启用";
        }
        return status;
      }
    }
  }
</script>

<style scoped>
  .customConiter {
    padding: 1rem;
  }
</style>
