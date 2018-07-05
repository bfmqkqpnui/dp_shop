import Vue from 'vue'

export default {
  queryByPage: params => {
    return Vue.http.post('/apiPath/param/queryAllPage', params);
  },
  update: params => {
    return Vue.http.post('/apiPath/param/update', params);
  },
  delete: params => {
    return Vue.http.post('/apiPath/param/delete', params);
  },
  addParams: params => {
    return Vue.http.post('/apiPath/param/insert', params);
  }
}
