import Vue from 'vue'

export default {
  queryByCode: params => {
    return Vue.http.post('/apiPath/param/queryByCode', params);
  },
  addResources: params => {
    return Vue.http.post('/apiPath/picResource/insert', params);
  },
  updateResources: params => {
    return Vue.http.post('/apiPath/picResource/update', params);
  },
  changeStatus: params => {
    return Vue.http.post('/apiPath/picResource/updateStatus', params);
  },
  queryByPage: params => {
    return Vue.http.post('/apiPath/picResource/queryAllPage', params);
  },
  deleteById: params =>{
    return Vue.http.post('/apiPath/picResource/delete', params);
  }
}
