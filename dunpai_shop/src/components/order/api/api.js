import Vue from 'vue'

export default {
  addMember: params => {
    return Vue.http.post('/apiPath/admin/insert', params);
  },
  updateMember: params => {
    return Vue.http.post('/apiPath/admin/update', params);
  },
  queryByPage: params => {
    return Vue.http.post('/apiPath/admin/queryAllPage', params);
  },
  changeStatus: params => {
    return Vue.http.post('/apiPath/admin/updateAdminStatus', params);
  }
}
