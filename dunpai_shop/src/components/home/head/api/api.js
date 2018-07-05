import Vue from 'vue'

export default {
  update: params => {
    return Vue.http.post('/apiPath/admin/updateAdminPassWord', params);
  }
}
