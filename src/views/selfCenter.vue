<!--  -->
<template>
  <div class="app">
    <el-row class="tac">
          <el-col :span="4">
            <el-aside width="200px" style="height: 226px">
            <el-menu
                :default-active="selfCenterIndex"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                @select="handleSelect"
                :router="true">
              <el-menu-item index="/selfCenter/selfInfo">
                <i class="el-icon-user-solid"></i>
                <span slot="title" >个人资料</span>
              </el-menu-item>
              <el-menu-item index="/selfCenter/accountSet">
                <i class="el-icon-menu"></i>
                <span slot="title">账号设置</span>
              </el-menu-item>
              <el-menu-item index="/selfCenter/selfFriend">
                <i class="el-icon-chat-line-round"></i>
                <span slot="title">好友管理</span>
              </el-menu-item>
              <el-menu-item index="/selfCenter/systemSetting">
                <i class="el-icon-setting"></i>
                <span slot="title">系统设置</span>
              </el-menu-item>
            </el-menu>
            </el-aside>
          </el-col>
      <el-col :span="18">
        <el-container>
          <el-main>
            <router-view v-if="isRouterAlive"/>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<!--<template>-->
<!--  <div class="app">-->
<!--    -->
<!--    -->
<!--    <el-row style="background-color: white">-->
<!--      <el-col :span="23" offset="1" >-->
<!--        <div>-->
<!--          <el-avatar :size="100" :src="userHeadImg"></el-avatar>-->
<!--          <span style="font-family: 'Microsoft YaHei';font-size: 50px">{{ this.$session.get('user').userName }}</span>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--  </div>-->
<!--</template>-->

<script>
//这里可以导入其他文件(比如:组件,工具js,第三方插件js,json文件,图片文件等等）
//例如:import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
  components: {},
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data() {
    el: ".app"
    name: 'zousir'
//这里存放数据
    return {
      isRouterAlive: true,
      userHeadImg: this.$session.get("userHeadImg") == null ? "https://cspzousir.oss-cn-hangzhou.aliyuncs.com/defaultHeadImg.jpg" : this.$session.get("userHeadImg"),
      selfCenterIndex: this.$session.get("selfCenterIndex") == null ? "/selfCenter/selfInfo" : this.$session.get("selfCenterIndex")
     };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {
    reload () {
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;         //再打开
      })
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);

    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key)
      this.$session.set("selfCenterIndex",key);
      this.$session.set("selfCenterVisible",key)
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

</style>

