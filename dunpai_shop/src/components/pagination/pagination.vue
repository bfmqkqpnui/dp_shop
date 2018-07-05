<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="resultCount">
    </el-pagination>
  </div>
</template>

<script>
  //Js部分尽量采用ES6语法，webpack babel插件会转义兼容
  export default {
    //组件私有数据（必须是function，而且要return对象类型）
    props: {
      resultCount : 0,
    },
    data() {
      return {
        currentPage:1,
      }
    },
    //计算属性
    computed: {},
    //函数集，自己封装，便于开发使用
    methods: {
      handleSizeChange(val) {
        this.$emit('handleSizeChange', val);
      },
      handleCurrentChange(val) {
        this.$emit('handleCurrentChange', val);
      }
    },
    //生命周期钩子：组件实例渲染完成时调用
    mounted() {
    },
    //要用到哪些子组件（如果组件已是最小粒度，那么可省略该属性）
    components: {}
  }
</script>

<style>
</style>
