import Vue from 'vue'

export default {
  login: params => {
    return Vue.http.post('/apiPath/admin/login', params);
  }
}
