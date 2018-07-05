import Vue from 'vue'

export default {
  queryByPage: params => {
    return Vue.http.post('/apiPath/user/queryAllPage', params);
  },
  queryById: params => {
    return Vue.http.post('/apiPath/user/queryById', params);
  }
}
