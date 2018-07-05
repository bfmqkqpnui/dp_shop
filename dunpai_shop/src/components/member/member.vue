<template>
  <div class="customConiter">
    <el-row class="row">
      <el-col :span="6">
        <el-breadcrumb separator-class="el-icon-d-arrow-right">
          <el-breadcrumb-item>设计师管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <br>
    <el-row class="search">
      <el-col :span="4">
        <el-button type="primary" @click="addComponent">添加</el-button>
      </el-col>
      <el-col :span="6" :offset="10">
        <el-input placeholder="请输入设计师联系电话查询" clearable v-model="customPhone"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-col>
    </el-row>

    <br>

    <el-row class="row">
      <el-table
        :data="tableList"
        border
        style="width: 100%">
        <el-table-column
          prop="loginAccout"
          label="账号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="adminName"
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.sex | getSex }}
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="province"
          label="省份"
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
      <pageComponent :resultCount="resultCount" :currentPage='currentPage' @handleCurrentChange="handleCurrentChange"
                     @handleSizeChange="handleSizeChange"></pageComponent>
    </el-row>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="memberForm" ref="memberForm" :rules="rules" name="memberForm">
        <el-form-item label="账号" :label-width="formLabelWidth" prop="loginAccout">
          <el-input v-model.trim="memberForm.loginAccout" auto-complete="off" clearable
                    placeholder="请输入登陆账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="passWord">
          <el-input v-model.trim="memberForm.passWord" auto-complete="off" type="password" clearable
                    placeholder="请输入登陆密码"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth" prop="adminName">
          <el-input v-model.trim="memberForm.adminName" auto-complete="off" clearable placeholder="请输入账号昵称"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="memberForm.sex" placeholder="请选择性别" clearable>
            <el-option label="男" value="2"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model.trim="memberForm.phone" auto-complete="off" clearable placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model.trim="memberForm.email" auto-complete="off" clearable placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="省份" :label-width="formLabelWidth" prop="provinceCode">
          <el-select v-model="memberForm.provinceCode" placeholder="请选择所在省份" clearable @change="chooseProv">
            <el-option :label="item.name" :value="item.key" v-for="item in provArray" :key="item.key">{{item.name}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="cityCode">
          <el-select v-model="memberForm.cityCode" placeholder="请选择所在城市" clearable @change="chooseCity">
            <el-option :label="item.name" :value="item.key" v-for="item in cityArray" :key="item.key">{{item.name}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" :label-width="formLabelWidth" prop="districtCode">
          <el-select v-model="memberForm.districtCode" placeholder="请选择所在地区" clearable>
            <el-option :label="item.name" :value="item.key" v-for="item in distArray" :key="item.key">{{item.name}}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('memberForm',memberForm)">取 消</el-button>
        <el-button type="primary" @click="submitForm(memberForm)">确 定</el-button>
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
        resultCount: 0,     // 记录总条数
        display: 10,   // 每页显示条数
        currentPage: 1,   // 当前的页数
        tableList: [],
        customPhone: '', // 搜索的会员手机号码
        title: '添加设计师',
        dialogFormVisible: false,
        memberForm: {
          loginAccout: '', //账号
          passWord: '',  //  密码
          adminName: '', //昵称
          sex: '', // 性别
          phone: '', // 联系电话
          email: '', // 邮箱
          province: '',  //省份
          provinceCode: '', //省份编码
          city: '',  // 城市
          cityCode: '', //城市编码
          district: '', // 地区
          districtCode: '', //地区编码
          id: '' // 编号
        },
        formLabelWidth: '6.25rem',
        rules: {
          loginAccout: [{
            required: true, message: '账号不能为空', trigger: 'blur'
          }],
          passWord: [{
            required: true, message: '密码不能为空', trigger: 'blur'
          }],
          adminName: [{
            required: true, message: '昵称不能为空', trigger: 'blur'
          }],
          sex: [{
            required: true, message: '请选择性别', trigger: 'blur'
          }],
          phone: [{
            required: true, message: '联系电话不能为空', trigger: 'blur'
          }, {
            pattern: /^[1][0-9]{10}$/, trigger: 'blur', message: '联系电话格式不正确'
          }],
          email: [{
            required: true, message: '邮箱不能为空', trigger: 'blur'
          }, {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+[\.][a-zA-Z0-9_-]+$/, trigger: 'blur', message: '邮箱格式不正确'
          }],
          provinceCode: [{
            required: true, message: '所在省份不能为空', trigger: 'blur'
          }],
          cityCode: [{
            required: true, message: '所在城市不能为空', trigger: 'blur'
          }],
          districtCode: [{
            required: true, message: '所在地区不能为空', trigger: 'blur'
          }]
        },
        memberToken: '',
        area: {}, //省市区总集合
        provArray: [], //省份集合
        cityArray: [], //市集合
        distArray: [], //地区集合
        allCity: [], // 全部市的集合
        allDist: [], // 全部区域的集合
      }
    },
    methods: {
      /**
       * 分页改变页码数
       * @param currentPage
       */
      handleCurrentChange(currentPage) {
        if (currentPage && Number(currentPage)) {
          this.currentPage = currentPage;
          this.init();
        }
      },
      /**
       * 分页改变size
       * @param pageSize
       */
      handleSizeChange(pageSize) {
        if (pageSize && Number(pageSize)) {
          this.display = pageSize;
          this.init();
        }
      },
      /**
       * 搜索
       */
      search() {
        this.tableList = [];
        this.init();
      },
      /**
       * 展示添加组件
       */
      addComponent() {
        this.distArray = [];
        this.cityArray = [];
        this.showComponent();
      },
      /**
       *  更新展示组件
       */
      updateComponent(opt) {
        this.showComponent("update", opt);
      },
      /**
       * 根据类型展示添加组件
       */
      showComponent(type, opt) {
        if (type == "update") {
          opt.sex = opt.sex + "";
          if (util.isCode(opt.provinceCode)) {
            opt.province = this.getAreaName(opt.provinceCode, this.provArray);
          }
          if (util.isCode(opt.cityCode)) {
            opt.city = this.getAreaName(opt.cityCode, this.allCity);
          }
          if (util.isCode(opt.districtCode)) {
            opt.district = this.getAreaName(opt.districtCode, this.allDist);
          }
          this.memberForm = opt;
          if (util.isCode(opt.provinceCode)) {
            this.chooseProv(opt.provinceCode);
          }
          if (util.isCode(opt.cityCode)) {
            this.chooseCity(opt.cityCode);
          }
        } else {
          this.formConfig();
        }
        this.dialogFormVisible = true;
      },
      /**
       * 初始化组件数据
       */
      formConfig() {
        this.memberForm = {
          loginAccout: '', //账号
          passWord: '',  //  密码
          adminName: '', //昵称
          sex: '', // 性别
          phone: '', // 联系电话
          email: '', // 邮箱
          province: '',  //省份
          city: '',  // 城市
          district: '', // 地区
          id: '', //编号
          districtCode: '', //地区编码
          provinceCode: '', //省份编码
          cityCode: '', //城市编码
        };
      },
      /**
       * 提交表单
       */
      submitForm() {
        this.$refs.memberForm.validate((valid) => {
          if (valid) {
            const user = util.dbGet("userInfo");
            if (util.isExist(user)) {
              let param = this.memberForm;
              if (util.isCode(param.provinceCode)) {
                param.province = this.getAreaName(param.provinceCode, this.provArray);
              }
              if (util.isCode(param.cityCode)) {
                param.city = this.getAreaName(param.cityCode, this.allCity);
              }
              if (util.isCode(param.districtCode)) {
                param.district = this.getAreaName(param.districtCode, this.allDist);
              }
              param.token = user.token;
              if (util.isExist(param.id)) {
                api.updateMember(param).then(res => {
                  if (res.body.result == 0) {
                    this.dialogFormVisible = false;
                    this.$message.success("更新成功");
                    this.formConfig();
                    this.init();
                  } else {
                    if (res.body.result == 2) {
                      this.$router.push("/");
                    } else {
                      this.$message.error(res.body.msg)
                    }
                  }
                })
              } else {
                api.addMember(param).then(res => {
                  if (res.body.result == 0) {
                    this.dialogFormVisible = false;
                    this.$message.success("添加成功");
                    this.formConfig();
                    this.init();
                  } else {
                    if (res.body.result == 2) {
                      this.$router.push("/");
                    } else {
                      this.$message.error(res.body.msg)
                    }
                  }
                })
              }
            }
          } else {
            console.log("error");
            return false;
          }
        })
      },
      /**
       * 重置表单
       * @param formName
       */
      resetForm(formName, opt) {
        if (util.isExist(opt) && util.isExist(opt.id)) {
        } else {
          this.$nextTick(function () {
            this.$refs[formName].resetFields();
          });
        }
        this.dialogFormVisible = false;
      },
      /**
       * 获取省份
       */
      getAreaData() {
        this.$http.get("../../../static/lib/area/area.json").then(res => {
          this.area = res.body;
          this.provArray = this.convert(this.area);// 获取省份集合
          this.allCity = this.getAreaArr("city");
          this.allDist = this.getAreaArr("dist");
          console.log("读取本地数据成功");
        });
      },
      /**
       * 获取市级和区县集合数据
       */
      getAreaArr(type) {
        let arr = [];
        if (util.isExist(type) && "city" == type) {
          for (let i in this.area) {
            for (let j in this.area[i].child) {
              let cityObj = {};
              cityObj.key = j;
              cityObj.name = this.area[i].child[j].name;
              arr.push(cityObj);
            }
          }
        } else {
          for (let i in this.area) {
            for (let j in this.area[i].child) {
              for (let k in this.area[i].child[j].child) {
                let distObj = {};
                distObj.key = k;
                distObj.name = this.area[i].child[j].child[k];
                arr.push(distObj);
              }
            }
          }
        }
        return arr;
      },
      /**
       * 获取省市区对应数据集合
       * @param opt
       * @param type
       * @returns {Array}
       */
      convert(opt, type) {
        if (util.isExist(opt)) {
          let arr = [];
          for (let key in opt) {
            let obj = {};
            if (util.isExist(type) && type == "flag") {
              obj.name = opt[key];
              obj.key = key;
            } else {
              obj.name = opt[key].name;
              obj.key = key;
            }
            arr.push(obj);
          }
          return arr;
        }
      },
      /**
       * 获取城市集合
       * @param e
       */
      chooseProv(e) {
        this.memberForm.city = '';
        this.memberForm.district = '';
        for (let code in this.provArray) {
          if (e == this.provArray[code].key) {
            if (util.isExist(this.area)) {
              let obj = {};
              obj = this.area[e].child;
              this.cityArray = this.convert(obj);
            }
          }
        }
      },
      /**
       * 获取区域集合
       * @param e
       */
      chooseCity(e) {
        this.memberForm.district = '';
        for (let code in this.allCity) {
          if (e == this.allCity[code].key) {
            if (util.isExist(this.area)) {
              let obj = {};
              obj = this.area[this.memberForm.provinceCode].child[e].child;
              this.distArray = this.convert(obj, "flag");
            }
          }
        }
      },
      /**
       * 获取名字
       * @param key
       * @param list
       */
      getAreaName(key, list) {
        for (let index in list) {
          if (key == list[index].key) {
            return list[index].name;
          }
        }
      },
      /**
       * 初始化搜索数据
       */
      init() {
        const user = util.dbGet("userInfo");
        if (util.isExist(user)) {
          let param = {
            search: this.customPhone,
            pageIndex: this.currentPage,
            pageSize: this.display,
            token: user.token
          }
          api.queryByPage(param).then(res => {
            if (res.body.result == 0) {
              console.log(res.body);
              this.tableList = res.body.data.result;
              this.currentPage = res.body.data.pageIndex;
              this.resultCount = res.body.data.resultCount;
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
      canUsedByStatus(opt, status) {
        const user = util.dbGet("userInfo");
        if (util.isExist(user) && util.isExist(opt)) {
          let param = {
            id: opt.id,
            status: status,
            token: user.token
          }
          api.changeStatus(param).then(res => {
            if (res.body.result == 0) {
              this.$message.success("状态更新成功");
              this.init();
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
    },
    components: {pageComponent},
    mounted() {
      this.$emit("config", "member");
      this.getAreaData();
      this.init();
    },
    filters: {
      /**
       * 性别
       * @param val
       * @returns {string}
       */
      getSex(val) {
        let sex = "女";
        if (Number(val)) {
          if (Number(val) == 2) {
            sex = "男"
          }
        }
        return sex;
      },
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
  .customConiter {
    padding: 1rem;
  }
</style>
