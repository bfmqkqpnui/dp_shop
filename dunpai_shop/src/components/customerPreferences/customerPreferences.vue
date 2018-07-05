<template>
  <div class="customConiter">
    <el-row class="row">
      <el-col :span="6">
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>客户喜好素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="2">
        <el-button type="primary" @click="addComponent('add',null)">添加</el-button>
      </el-col>
      <el-col :span="4" :offset="12">
        <el-select v-model="areaArraySelectId" placeholder="请选择地区" clearable>
          <el-option :label="item.paramValue" :value="item.id" v-for="item in areaArray" :key="item.id">{{item.paramValue}}</el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="hobbyArraySelectId" placeholder="请选择喜好" clearable>
          <el-option :label="item.paramValue" :value="item.id" v-for="item in hobbyArray" :key="item.id">{{item.paramValue}}</el-option>
        </el-select>
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
          prop="area"
          label="地区"
          align="center">
        </el-table-column>
        <el-table-column
          prop="hobby"
          label="喜好"
          align="center">
        </el-table-column>
        <el-table-column
          prop="picUrl"
          label="图片"
          align="center">
          <template slot-scope="scope">
            <img  :src="scope.row.picUrl" alt="" style="height: 22px" >
          </template>
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
            <el-button type="text" size="medium" @click="addComponent('update',scope.row)">更新</el-button>
            <el-button type="text" size="medium" @click="canUsed(scope.row,'enabled')">启用</el-button>
            <el-button type="text" size="medium" @click="canUsed(scope.row,'disabled')">禁用</el-button>
            <el-button type="text" size="medium" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <br>
    <el-row class="row">
      <pageComponent :resultCount="resultCount" :currentPage='currentPage' @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pageComponent>
    </el-row>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="customerHobbyForm">
        <el-form-item label="地区" :label-width="formLabelWidth" prop="areaId">
          <el-select v-model="customerHobbyForm.areaId" placeholder="请选择地区" clearable>
            <el-option :label="item.paramValue" :value="item.id" v-for="item in areaArray" :key="item.id" >{{item.paramValue}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="喜好" :label-width="formLabelWidth" prop="hobbyId">
          <el-select v-model="customerHobbyForm.hobbyId" placeholder="请选择喜好" clearable>
            <el-option :label="item.paramValue" :value="item.id" v-for="item in hobbyArray" :key="item.id">{{item.paramValue}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <div v-text="customerHobbyForm.picUrl"></div>
        </el-form-item>
        <el-upload
          class="upload-img"
          :action="action"
          :limit="1"
          multiple
          :on-exceed="handleExceed"
          :before-upload="handleBefore"
          :http-request="imageUpload"
          list-type="picture">
          <el-button size="small" type="primary">素材图片上传</el-button>
        </el-upload>
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
    name: "custom_Preference",
    data() {
      return {
        fileList: [],
        action: "/apiPath/file/upload", //上传图片服务器 https://jsonplaceholder.typicode.com/posts/ /apiPath/file/upload
        resultCount: 0,     // 记录总条数
        display: 10,   // 每页显示条数
        currentPage: 1,   // 当前的页数
        tableList : [],
        customId: '', // 搜索的会员编号
        loading: true,
        title: '添加客户喜好素材',
        dialogFormVisible: false,
        customerHobbyForm:{
          id:'',
          areaId:'',
          hobbyId:'',
          picUrl:''
        },
        formLabelWidth:"10rem",
        areaArray:[],
        hobbyArray:[],
        areaArraySelectId:'',
        hobbyArraySelectId:''
      }
    },
    methods: {
      imageUpload(item){
        let formData = new FormData()
        formData.append('file', item.file)
        this.$http.post(item.action,formData).then(res => {
          if(res.body.result == 0){
            let list = res.body.data;
            if(list && list.length > 0){
              let arr = [];
              for(let i in list){
                let fileObj = {
                  name: list[i].name,
                  url: list[i].url
                }
                arr.push(fileObj);
              }
              if(arr.length > 0){
                this.fileList = arr;
                this.customerHobbyForm.picUrl = this.fileList[0].url;
              }
            }
          }else{
            this.$message.error(res.body.msg);
          }
        }).catch(err => {
          this.$message.error('上传失败，请重新上传')
          console.log('报错', err)
        });
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      handleBefore(file){
        this.fileList = [];
        const extension = file.name.split('.')[1] === 'png'
        const extension2 = file.name.split('.')[1] === 'jpg'
        const extension3 = file.name.split('.')[1] === 'jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!extension && !extension2 && !extension3) {
          console.log('上传模板只能上传jpg/png文件格式!')
          this.$message.warning("上传模板只能上传jpg/png文件格式!");
        }
        if (!isLt2M) {
          console.log('上传图片大小不能超过 2MB!')
        }
        return extension || extension2 || extension3  && isLt2M
      },
      search(){
        this.init();
      },
      /**
       * 分页改变页码数
       * @param currentPage
       */
      handleCurrentChange(currentPage){
        if(currentPage && Number(currentPage)){
          this.currentPage = currentPage;
          this.init();
        }
      },
      /**
       * 分页改变size
       * @param pageSize
       */
      handleSizeChange(pageSize){
        if(pageSize && Number(pageSize)){
          this.display = pageSize;
          this.init();
        }
      },
      addComponent(type,opt){
        this.dialogFormVisible = true;
        if(type == "update"){
          console.log("更新展示的组件")
          this.customerHobbyForm.id = opt.id;
          this.customerHobbyForm.areaId = opt.areaId;
          this.customerHobbyForm.hobbyId = opt.hobbyId;
          this.customerHobbyForm.picUrl = opt.picUrl;
        }else if(type == "add"){
          console.log("添加的组件")
          this.formConfig();
        }
      },
      queryComponentConfig(code){
        const user = util.dbGet("userInfo");
        if(util.isExist(user)){
          if(util.isExist(code)){
            if(code == "areaId" || code == "hobbyId"){
              let param = {
                code: code,
                token: user.token
              }
              api.queryByCode(param).then(res => {
                if(res.body.result == 0){
                  this.dialogFormVisible = false;
                  if(code == "areaId"){
                    this.areaArray = res.body.data;
                  }else if(code == "hobbyId"){
                    this.hobbyArray = res.body.data;
                  }
                }else {
                  if(res.body.result == 2){
                    this.$router.push("/");
                  }else{
                    this.$message.error(res.body.msg)
                  }
                }
              });
            }
          }
        }else{
          this.$router.push("/");
        }
      },
      formConfig(){
        this.customerHobbyForm = {
          id:'',
          areaId:'',
            hobbyId:'',
            picUrl:''
        }
      },
      resetForm(){
        this.formConfig();
        this.dialogFormVisible = false;
      },
      submitForm(){
        const user = util.dbGet("userInfo");
        if(util.isExist(user)){
          this.customerHobbyForm.token = user.token;
          if(util.isExist(this.customerHobbyForm.id)){
            //更新
            console.log("更新订单")
            api.updateResources(this.customerHobbyForm).then(res => {
              if(res.body.result == 0){
                this.$message.success("更新成功");
                this.dialogFormVisible = false;
                this.init();
              }else {
                if(res.body.result == 2){
                  this.$router.push("/");
                }else{
                  this.$message.error(res.body.msg)
                }
              }
            })
          }else{
            console.log("新增订单")
            //新增
            api.addResources(this.customerHobbyForm).then(res => {
              if(res.body.result == 0){
                this.$message.success("添加成功");
                this.dialogFormVisible = false;
                this.init();
              }else {
                if(res.body.result == 2){
                  this.$router.push("/");
                }else{
                  this.$message.error(res.body.msg)
                }
              }
            });
          }
        }else{
          this.$router.push("/");
        }
      },
      init(){
        this.tableList = [];
        const user = util.dbGet("userInfo");
        if(util.isExist(user)){
          let params = {
            areaId: this.areaArraySelectId,
            hobbyId: this.hobbyArraySelectId,
            pageIndex: this.currentPage,
            pageSize: this.display,
            token: user.token
          }
          api.queryByPage(params).then(res => {
            if(res.body.result == 0){
              console.log(JSON.stringify(res.body))
              this.tableList = res.body.data.result;
              this.resultCount = res.body.data.resultCount;
              this.currentPage = res.body.data.pageIndex
            }else {
              if(res.body.result == 2){
                this.$router.push("/");
              }else{
                this.$message.error(res.body.msg)
              }
            }
          })
        }else{
          this.$router.push("/")
        }
      },
      canUsed(opt,type){
        //enabled
        //disabled
        const user = util.dbGet("userInfo");
        if(util.isExist(user)){
          if(util.isExist(opt) && util.isExist(type)){
            let status = '';
            if(type == "enabled"){
              status = "1";
            }else if(type == "disabled"){
              status = "0";
            }
            let param = {
              id: opt.id,
              status: status,
              token: user.token
            }

            api.changeStatus(param).then(res => {
              if(res.body.result == 0){
                this.$message.success("状态更新成功");
                this.init();
              }else {
                if(res.body.result == 2){
                  this.$router.push("/");
                }else{
                  this.$message.error(res.body.msg)
                }
              }
            });
          }
        }else{
          this.$router.push("/")
        }
      },
      del(opt){
        const user = util.dbGet("userInfo");
        if(util.isExist(user)){
          if(util.isExist(opt)){
            this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let param = {
                id: opt.id,
                token: user.token
              }

              api.deleteById(param).then(res => {
                if(res.body.result == 0){
                  this.$message.success("记录删除成功");
                  this.init();
                }else {
                  if(res.body.result == 2){
                    this.$router.push("/");
                  }else{
                    this.$message.error(res.body.msg)
                  }
                }
              });
            }).catch(() => {
              this.$message.info('已取消删除');
            });
          }
        }else{
          this.$router.push("/")
        }
      }
    },
    components: {pageComponent},
    mounted(){
      this.$emit("config",'preferences');
      this.loading = false;
      this.areaArray = this.queryComponentConfig("areaId");
      this.hobbyArray = this.queryComponentConfig("hobbyId");
      this.init();
    },
    filters:{
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
  .customConiter{
    padding: 1rem;
  }
  .upload-img{
    margin-left: 3rem;
  }
</style>
