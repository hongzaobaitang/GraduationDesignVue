<!--  -->
<template>
  <div class="app">
    <el-descriptions class="margin-top" title="系统设置" :column="1" style="height: 800px">
      <el-descriptions-item label="在线时隐身" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">
        <el-switch
            style="position: relative;top: 12px;left: 20px"
            width="60"
            v-model="invisible"
            active-text="开启"
            inactive-text="关闭"
            active-value="0"
            inactive-value="1"
            @change="updateUserOnlineStatus">
        </el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="通过手机号找到我" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">
        <el-switch
            style="position: relative;top: 12px;left: 20px"
            width="60"
            v-model="invisible"
            active-text="允许"
            inactive-text="不允许"
            active-value="0"
            inactive-value="1"
            @change="">
        </el-switch>

      </el-descriptions-item>
      <el-descriptions-item label="居住地" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}"></el-descriptions-item>
      <el-descriptions-item label="备注" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}"></el-descriptions-item>
      <el-descriptions-item label="联系地址" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}"></el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
//这里可以导入其他文件(比如:组件,工具js,第三方插件js,json文件,图片文件等等）
//例如:import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    el: ".app"
    name: 'zousir'
//这里存放数据
    return {
      invisible: this.$session.get("onlineStatus") == null ? 0 : this.$session.get("onlineStatus"),
    };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {

    updateUserOnlineStatus() {


      this.request.post("/user/update", {
        //参数 例 key: this.data
        id: this.$session.get("presentUserId"),
        userOnlineStatus: this.invisible
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          this.$session.set("onlineStatus",this.invisible)
        }
      });


    }

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

</style>

