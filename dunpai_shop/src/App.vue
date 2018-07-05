<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app{
    font-size: .2rem;
    font-family: 微软雅黑;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border: 0;
    table-layout: fixed;
  }

  table tr {
    height: 2rem;
  }

  table tr td,.el-table .cell {
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    -moz-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    font-size:14px;
    text-align:center;
    vertical-align:middle;
  }
</style>
