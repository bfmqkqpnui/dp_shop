<template>
  <div class="customConiter">
    <el-row class="row">
      <el-col :span="6">
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>房间管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <br>
    <el-row class="search">
      <el-col :span="2">
        <el-button type="primary" @click="showComponent('add',null)">添加</el-button>
      </el-col>
      <el-col :span="6" :offset="14">
        <el-input placeholder="请输入房间名查询" clearable v-model="customId"></el-input>
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
          prop="name"
          label="房间名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nameJP"
          label="房间名(日文)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nameEn"
          label="房间名(英文)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="roomType"
          label="房间类型"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="updateComponent(scope.row)">更新</el-button>
            <el-button type="text" size="medium" @click="deleteRoom(scope.row)">删除</el-button>
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
        <el-form-item label="房间名" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="paramForm.name" auto-complete="off" clearable placeholder="请输入房间名"></el-input>
        </el-form-item>
        <el-form-item label="房间名(日文)" :label-width="formLabelWidth" prop="nameJP">
          <el-input v-model.trim="paramForm.nameJP" auto-complete="off" clearable placeholder="请输入房间名日文"></el-input>
        </el-form-item>
        <el-form-item label="房间名(英文)" :label-width="formLabelWidth" prop="nameEn">
          <el-input v-model.trim="paramForm.nameEn" auto-complete="off" clearable placeholder="请输入房间名英文"></el-input>
        </el-form-item>
        <el-form-item label="房间类型" :label-width="formLabelWidth" prop="roomTypeId">
          <el-select v-model="paramForm.roomTypeId" placeholder="请选择房间类型" clearable>
            <el-option :label="item.paramValue" :value="item.id" v-for="item in roomArray" :key="item.id">
              {{item.paramValue}}
            </el-option>
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
    name: "room",
    data() {
      return {
        resultCount: 1, // 记录总条数
        display: 10,   // 每页显示条数
        currentPage: 1,   // 当前的页数
        tableList: [],
        title: '新增房间',
        dialogFormVisible: false,
        paramForm: {
          name: '',
          nameJP: '',
          nameEn: '',
          roomTypeId: '',
          id: ''
        },
        loading: false,
        customId: '', // 搜索关键词
        formLabelWidth: "120px",
        roomArray: [], // 房间类型集合
      }
    },
    mounted() {
      this.$emit("config", "room");
      this.rooConfig();
      this.init();
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
        this.init();
        this.customId = '';
      },
      formConfig() {
        this.paramForm = {
          name: '',
          nameJP: '',
          nameEn: '',
          roomTypeId: '',
          id: ''
        };
      },
      rooConfig() {
        const user = util.dbGet("userInfo");
        if (util.isExist(user)) {
          let params = {
            code: 'roomType',
            token: user.token
          }
          api.queryRoomTypes(params).then(res => {
            if (res.body.result == 0) {
              console.log(res.body);
              this.roomArray = res.body.data;
            } else if (res.body.result == 2) {
              this.$router.push("/")
            } else {
              this.$message.error(res.body.msg);
            }
          })
        } else {
          this.$router.push("/")
        }
      },
      resetForm(){
        this.dialogFormVisible = false;
        this.formConfig();
      },
      showComponent(type,opt){
        if(util.isExist(type)){
          this.dialogFormVisible = true;
          if(type == "update" && util.isExist(opt)){
            this.paramForm = opt;
          }
        }
      },
      updateComponent(opt){
        if(util.isExist(opt)){
          this.showComponent("update",opt);
        }
      },
      submitForm(){
        const user = util.dbGet("userInfo");
        if (util.isExist(user)) {
          if(!util.isExist(this.paramForm.name)){
            this.$message.error("房间名不能为空")
          }
          if(!util.isExist(this.paramForm.nameEn)){
            this.$message.error("房间名(英文)不能为空")
          }
          if(!util.isExist(this.paramForm.nameJP)){
            this.$message.error("房间名(日文)不能为空")
          }
          if(!util.isExist(this.paramForm.roomTypeId)){
            this.$message.error("请选择房间类型")
          }
          this.paramForm.token = user.token;
          this.loading = true;
          if(util.isExist(this.paramForm.id)){
            api.updateRoom(this.paramForm).then(res => {
              this.loading = false;
              if (res.body.result == 0) {
                console.log(res.body);
                this.$message.success("更新成功");
                this.dialogFormVisible = false;
                this.formConfig();
                this.init();
              } else if (res.body.result == 2) {
                this.$router.push("/")
              } else {
                this.$message.error(res.body.msg);
              }
            })
          }else{
            api.addRoom(this.paramForm).then(res => {
              this.loading = false;
              if (res.body.result == 0) {
                console.log(res.body);
                this.$message.success("添加成功");
                this.dialogFormVisible = false;
                this.formConfig();
                this.init();
              } else if (res.body.result == 2) {
                this.$router.push("/")
              } else {
                this.$message.error(res.body.msg);
              }
            })
          }
        }else{
          this.$router.push("/");
        }
      },
      init(){
        this.tableList = [];
        const user = util.dbGet("userInfo");
        if (util.isExist(user)) {
          this.loading = true;
          let params = {
            search: this.customId,
            pageIndex: this.currentPage,
            pageSize: this.display,
            token: user.token
          }
          api.queryByPage(params).then(res => {
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
      deleteRoom(opt){
        console.log("shanchu")
        const user = util.dbGet("userInfo");
        if (util.isExist(user)) {
          this.loading = true;
          if(util.isExist(opt)){
            let params = {
              id: opt.id,
              token: user.token
            }
            api.delRoom(params).then(res => {
              this.loading = false;
              if (res.body.result == 0) {
                console.log(res.body);
                this.$message.success("删除成功");
                this.dialogFormVisible = false;
                this.formConfig();
                this.init();
              } else if (res.body.result == 2) {
                this.$router.push("/")
              } else {
                this.$message.error(res.body.msg);
              }
            })
          }
        }else{
          this.$router.push("/")
        }
      }
    },
    components:{
      pageComponent
    }
  }
</script>

<style scoped>
  .customConiter {
    padding: 1rem;
  }
</style>
