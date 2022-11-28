<!--  -->
<template>
  <div class="app">
    <el-carousel indicator-position="outside" arrow="hover">
      <el-carousel-item v-for="img in 6" :key="img">
        <img style="width: 1400px;height: 300px" :src="require(`../assets/img/index0${img}.jpg`)"  alt="">
      </el-carousel-item>
    </el-carousel>
    <el-collapse v-model="activeNames" @change="handleChange" accordion style=";position: relative; top:30px;width: 600px;height: 600px">
      <el-collapse-item title="平台介绍"  name="1" style="caret-color: transparent">
        <div>校园服务平台是一个让学生、老师和在校人员进行交流的平台。</div>
        <div>在该平台上，用户可以出售或购买闲置物品，还可以发布跑腿任务，接单等操作</div>
        <div>老师也可以发布一些活动供学生参与，学生通过完成活动来赚取学分等奖励</div>
        <div>该平台也提供交流论坛供用户进行交流。</div>
      </el-collapse-item>
      <el-collapse-item title="平台公规" name="2" style="caret-color: transparent;">
        <div>1.不得在平台上发布违法言论，违法图片</div>
        <div>2.不得恶意带其他平台或APP的节奏</div>
        <div>构建绿色平台，需要你我共同努力！</div>
      </el-collapse-item>
      <el-collapse-item title="意见反馈" name="3" style="caret-color: transparent;">
        <div>如果您在使用过程中有遇到问题或对该平台有任何意见或建议，欢迎与我交流</div>
        <div>QQ：2856674012</div>
        <div>WX：SloooFish</div>
        <div>email：SloooFish@163.com</div>
      </el-collapse-item>
      <el-collapse-item title="关于开发者" name="4" style="caret-color: transparent;">
        <div>Zousir，一名大四在校生，喜欢唱跳rap，梦想是发财，单身，喜欢女生。</div>
      </el-collapse-item>
    </el-collapse>



  </div>



</template>

<script>
//这里可以导入其他文件(比如:组件,工具js,第三方插件js,json文件,图片文件等等）
//例如:import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return{
      activeNames: ['1'],
      value: new Date(),
      count: 0,
      tableData: [{
        date: '2016-05-02',
      }]

    }
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },

    load () {
      this.count += 2
    },
    handleChange(val) {
      console.log(val);
    },
  },
//生命周期 - 创建完成(可以访问当前this实例)
  created() {

  },
//生命周期 - 挂载完成(可以访问DOM元素)
  mounted() {

  },
  beforeCreate() {
  }, //生命周期 - 创建之前
  beforeMount() {
  }, //生命周期 - 挂载之前
  beforeUpdate() {
  }, //生命周期 - 更新之前
  updated() {
  }, //生命周期 - 更新之后
  beforeDestroy() {
  }, //生命周期 - 销毁之前
  destroyed() {
  }, //生命周期 - 销毁完成
  activated() {
  }, //如果页面有keep-alive缓存功能,这个函数会触发
}
</script>
<style scoped>
/* @import url(); 引入公共css类 */
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.text {
  font-size: 14px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 300px;
  height: 310px;
  position: relative;
  top:30px;
}

</style>

