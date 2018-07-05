import Vue from 'vue'

export default {
  queryByPage: params => {
    return Vue.http.post('/apiPath/room/queryAll', params);
  },
  queryRoomTypes: params => {
    return Vue.http.post('/apiPath/param/queryByCode', params);
  },
  addRoom: params => {
    return Vue.http.post('/apiPath/room/insert', params);
  },
  updateRoom: params => {
    return Vue.http.post('/apiPath/room/update', params);
  },
  delRoom: params => {
    return Vue.http.post('/apiPath/room/delete', params);
  }
}
