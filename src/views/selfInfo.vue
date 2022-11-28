<!--  -->
<template>
  <div class="app">
    <el-descriptions class="margin-top" title="个人资料" :column="1" :size="size"  style="height: 800px" v-if="this.$session.get('user') != null">
      <el-descriptions-item :contentStyle="{'font-size': '30px'}" label="用户账号" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo.userId }}</span>
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'font-size': '30px'}" label="用户姓名" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">
        <el-tooltip placement="right" effect="light">
          <div slot="content"><el-button type="text" @click="updateUserName = true">修改</el-button></div>
          <span v-if="userInfo.userName != ''" v-show="updateUserName == false">  &nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo.userName }}</span>
          <span v-if="userInfo.userName == ''" v-show="updateUserName == false">  &nbsp;&nbsp;&nbsp;&nbsp;<el-tag type="warning">未设置</el-tag>
          </span>
        </el-tooltip>
        <el-input style="width: 200px;left: 40px" v-if="updateUserName" v-model="userInfo.userName">
        </el-input>

        <el-button style="position: relative;left: 45px" v-if="updateUserName" icon="el-icon-success" @click="updateUserInfo()" type="primary">保存</el-button>
        <el-button style="position: relative;left: 45px" v-if="updateUserName" @click="updateUserName = false;reload()" icon="el-icon-error" type="danger">取消</el-button>
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'font-size': '30px'}" label="用户性别" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">
        <el-tooltip placement="right" effect="light">
          <div slot="content"><el-button type="text" @click="updateUserGeneder = true">修改</el-button></div>
          <span  v-show="updateUserGeneder == false" v-if="userInfo.userGeneder != ''"> &nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo.userGeneder }}</span>
          <span  v-show="updateUserGeneder == false" v-if="userInfo.userGeneder == ''"> &nbsp;&nbsp;&nbsp;&nbsp;
            <el-tag type="warning">未设置</el-tag>
          </span>
        </el-tooltip>
        <el-select style="position: relative;left: 40px;width: 200px" v-if="updateUserGeneder" v-model="userInfo.userGeneder" placeholder="请选择">
          <el-option
              v-for="item in geneders"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button  v-if="updateUserGeneder" style="position: relative;left: 45px" icon="el-icon-success" @click="updateUserInfo()" type="primary">保存</el-button>
        <el-button v-if="updateUserGeneder" style="position: relative;left: 40px"  @click="updateUserGeneder = false;reload()" icon="el-icon-error" type="danger">取消</el-button>
        </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'font-size': '30px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}" label="出生日期">
        <el-tooltip placement="right" effect="light">
          <div slot="content"><el-button type="text" @click="updateUserBirthday = true">修改</el-button></div>
          <span v-show="updateUserBirthday == false" v-if="userInfo.userBirthday != ''"> &nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo.userBirthday }}</span>
          <span v-show="updateUserBirthday == false" v-if="userInfo.userBirthday == ''"> &nbsp;&nbsp;&nbsp;&nbsp;
            <el-tag type="warning">未设置</el-tag>
          </span>
        </el-tooltip>
        <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="position: relative;left: 40px;width: 200px"
            v-if="updateUserBirthday"
            v-model="userInfo.userBirthday"
            type="date"
            placeholder="选择日期">
        </el-date-picker>
        <el-button  v-if="updateUserBirthday" style="position: relative;left: 45px" icon="el-icon-success" @click="updateUserInfo()" type="primary">保存</el-button>
        <el-button v-if="updateUserBirthday" style="position: relative;left: 40px"  @click="updateUserBirthday = false;reload()" icon="el-icon-error" type="danger">取消</el-button>
      </el-descriptions-item>

      <el-descriptions-item :contentStyle="{'font-size': '30px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}" label="入学年月">
        <el-tooltip placement="right" effect="light">
          <div slot="content"><el-button type="text" @click="updateUserGrade = true">修改</el-button></div>
          <span v-show="updateUserGrade == false" v-if="userInfo.userGrade != ''"> &nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo.userGrade }}</span>
          <span v-show="updateUserGrade == false" v-if="userInfo.userGrade == ''"> &nbsp;&nbsp;&nbsp;&nbsp;
              <el-tag type="warning">未设置</el-tag>
          </span>
        </el-tooltip>

        <el-date-picker
            v-if="updateUserGrade"
            v-model="userInfo.userGrade"
            type="month"
            style="position: relative;left: 40px;width: 200px"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月">
        </el-date-picker>
        <el-button   v-if="updateUserGrade" style="position: relative;left: 45px" icon="el-icon-success" @click="updateUserInfo()" type="primary">保存</el-button>
        <el-button  v-if="updateUserGrade" style="position: relative;left: 40px"  @click="updateUserGrade = false;reload()" icon="el-icon-error" type="danger">取消</el-button>
      </el-descriptions-item>


      <el-descriptions-item :contentStyle="{'font-size': '30px'}":labelStyle="{'font-size': '30px','color' : '#78B7F8'}" label="学院专业">
        <el-tooltip placement="right" effect="light">
          <div slot="content"><el-button type="text" @click="updateUserMajor = true">修改</el-button></div>
          <span v-show="updateUserMajor == false" v-if="userInfo.userMajor != ''">&nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo.userMajor }}</span>
          <span v-show="updateUserMajor == false" v-if="userInfo.userMajor == ''">&nbsp;&nbsp;&nbsp;&nbsp;
            <el-tag type="warning">未设置</el-tag>
          </span>
        </el-tooltip>
        <el-select  style="position: relative;left: 40px;width: 200px" v-if="updateUserMajor" v-model="userInfo.userMajor" filterable placeholder="请选择">
          <el-option
              v-for="item in majors"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button  v-if="updateUserMajor" style="position: relative;left: 45px" icon="el-icon-success" @click="updateUserInfo()" type="primary">保存</el-button>
        <el-button  v-if="updateUserMajor" style="position: relative;left: 40px"  @click="updateUserMajor = false;reload()" icon="el-icon-error" type="danger">取消</el-button>
        </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'font-size': '30px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}" label="用户头像">
        &nbsp;&nbsp;&nbsp;&nbsp;
        <div style="position: relative;top: 10px;left: 40px" >
          <change-head-img></change-head-img>

        </div>
        <div style="position: relative;top: 0px;left: 40px">
          <el-tag type="success" style="">点击图片更换头像</el-tag>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
//这里可以导入其他文件(比如:组件,工具js,第三方插件js,json文件,图片文件等等）
//例如:import 《组件名称》 from '《组件路径》';
import ChangeHeadImg from "../components/upload/changeHeadImg";
import {policy} from "@/components/upload/policy";
import {getUUID} from "@/utils";
export default {
  inject:['reload'],
//import引入的组件需要注入到对象中才能使用
  components: {ChangeHeadImg},

  data() {
    el: ".app"
    name: 'zousir'
//这里存放数据
    return {
      size: 'medium',
      updateUserName: false,
      updateUserGeneder: false,
      updateUserMajor: false,
      updateUserGrade: false,
      updateUserBirthday: false,
      majors: [{
        value: '工学院-软件工程',
      }, {
        value: '工学院-网络工程',
      },],
      geneders: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      },],
      userInfo: {
        id: '',
        userName: '',
        userHeadImg: '',
        userId: '',
        userGeneder: '',
        userBirthday: '',
        userMajor: '',
        userGrade: '',
      },
      userHeadImg: '',

    };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {

    initUserInfo() {
      let user = this.$session.get("user");
      this.userInfo.userName = user.userName == null ? '' : user.userName;
      this.userInfo.userHeadImg = user.userHeadImg;
      this.userInfo.userBirthday = user.userBirthday == null ? '' : user.userBirthday;
      this.userInfo.userGeneder = user.userGeneder == null ? '' : user.userGeneder;
      this.userInfo.userGrade = user.userGrade == null ? '' : user.userGrade;
      this.userInfo.userId = user.userId;
      this.userInfo.userMajor = user.userMajor == null ? '' : user.userMajor;

    },


    updateUserInfo() {
      this.$confirm('您确定进行修改吗', '修改资料', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.post("/user/update", {
          //参数 例 key: this.data
          id: this.$session.get('presentUserId'),
          userName: this.userInfo.userName,
          userGeneder: this.userInfo.userGeneder,
          userMajor: this.userInfo.userMajor,
          userGrade: this.userInfo.userGrade,
          userBirthday: this.userInfo.userBirthday,
        }).then(res => {
          if (res.code == 0) {
            /**
             * 修改资料成功后重新查询，并更新 session中的user
             *
             */
            let id = this.$session.get('presentUserId');

            this.request.get(`/user/info/${id}`, {
              params: {
                //参数
              }

            }).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: '修改成功!',
                  type: 'success'
                })
                this.$session.set('user',res.user);
                this.initUserInfo();
                this.reload();
              }
            });
          }else{
            this.$message({
              message: '修改失败，服务器出错!',
              type: 'warning'
            })
          }
        });
      }).catch(()=>{

      });
    }

  },
//生命周期 - 创建完成(可以访问当前this实例)
  created() {

    this.initUserInfo();
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

