<!--  -->
<template>
<div id="app">
  <el-row :gutter="20" >
    <el-col :offset="2" :span="20">
      <div class="grid-content bg-purple">
        <el-header style="padding: 0px;position: relative">
          <el-menu  :default-active="activeIndex == null ? '/' : activeIndex " class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="true"
                   background-color="#606266"
                   text-color="#fff"
                   active-text-color="#ffd04b">
            <el-menu-item class="item" index="/" style="caret-color: transparent;">首页</el-menu-item>
            <el-menu-item class="item" index="/secondHands" style="caret-color: transparent;">二手商城</el-menu-item>
            <el-menu-item class="item" index="/dispatching" style="caret-color: transparent;">跑腿中心</el-menu-item>
            <el-menu-item class="item" index="/loseAndFound" style="caret-color: transparent;">失物寻物</el-menu-item>
            <el-menu-item class="item" index="/activity" style="caret-color: transparent;">校园活动</el-menu-item>
            <el-menu-item class="item" index="/forum" style="caret-color: transparent;">校园贴吧</el-menu-item>
            <el-menu-item class="item" @click="checkLogin()" :index="selfCenterIndex" style="caret-color: transparent;">个人中心</el-menu-item>
          </el-menu>


          <div id="headImg" v-if="headImg !=  null" class="block" style="position: absolute;top: 5px;right: 80px">
            <el-badge :is-dot="haveMsg" class="item">
              <el-dropdown @command="handleCommand" trigger="click">
                <el-avatar :size="50" :src="headImg"></el-avatar>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="myChat" >
                      私信
                      <el-badge :value="msgCount" class="item" v-if="msgCount > 0"></el-badge>
                    </el-dropdown-item>
                  <el-dropdown-item >系统消息</el-dropdown-item>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-badge>
          </div>
          <div v-if="headImg ==  null" class="block" style="position: absolute;top: 10px;right: 10px"> <el-button type="text" style="color: #F56C6C" @click="showLoginForm" >还未登录，点击登录</el-button></div>
        </el-header>
        <el-container>
          <el-main>
            <router-view v-if="isRouterAlive"></router-view>
          </el-main>
        </el-container>
    </div>
    </el-col>
  </el-row>


  <transition name="el-zoom-in-bottom">
<!--  <el-collapse-transition>-->
    <div v-show="show1">
      <el-dialog title="用户登录" :visible.sync="loginFormVisible" style="width: 1000px;left: 320px;top: 50px" :close-on-click-modal="false" >
        <el-form :rules="loginRules" :model="ruleForm" class="demo-ruleForm" ref="ruleForm">
          <el-form-item label="账号" :label-width="formLabelWidth" prop="username">

            <el-input  prefix-icon="el-icon-user"  placeholder="学号/教师号/电话号码" v-model="ruleForm.username"  autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="pwd">
            <el-input  prefix-icon="el-icon-lock" @keypress.native.enter="submit('ruleForm')" type="password" v-model="ruleForm.pwd" autocomplete="off" style="width: 270px"></el-input>
            <el-link type="primary" style="position: relative;left: 1px"   @click="showForgetPwdForm">忘记密码？</el-link>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="loginFormVisible = false" style="position: relative;left: 90px">取 消</el-button>
          <el-button type="primary"  @click="submit('ruleForm')" style="position: relative;left: 240px">确 定</el-button>
        </div>
        <div class="dialog-footer">
          <el-link type="primary" style="position: relative;left: 300px" @click="showRegisterForm">还没有账号？去注册>></el-link>
        </div>
        <Vcode
            :imgs="[Img1, Img2,Img3,Img4,Img5]"
            :show="isShow"
            @success="success"
            @close="close"
        />
      </el-dialog>
    </div>
  </transition>
<!--  </el-collapse-transition>-->

  <transition name="el-zoom-in-bottom">
    <!--  <el-collapse-transition>-->
    <div v-show="show3">
      <el-dialog title="找回密码" :visible.sync="forgetPwdForm" style="width: 1000px;left: 320px;top: 10px"  :close-on-click-modal="false" >
        <el-form :rules="registerRules" :model="ruleForm" class="demo-ruleForm" ref="ruleForm">
          <el-form-item label="账号" :label-width="formLabelWidth" prop="username">
            <el-input prefix-icon="el-icon-user"  placeholder="学号/教师号" v-model="ruleForm.username"  autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="pwd">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="ruleForm.pwd" autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="rePwd">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="ruleForm.rePwd" autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phone">
            <el-input prefix-icon="el-icon-mobile-phone" placeholder="注册时电话号码" v-model="ruleForm.phone" autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="验证码" :label-width="formLabelWidth" prop="phoneCode">
            <el-input  prefix-icon="el-icon-message" v-model="ruleForm.phoneCode" autocomplete="off" style="width: 270px"></el-input>
            <el-button type="primary"  @click="sendCode" :disabled="canSendCode">{{ codeMsg }}</el-button>
          </el-form-item>
          <el-form-item label="身份" :label-width="formLabelWidth" prop="role">
            <el-radio v-model="ruleForm.role" label="我是老师" border value="teacher"></el-radio>
            <el-radio v-model="ruleForm.role" label="我是学生" border value="student"></el-radio>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="backToLoginFromForgetForm" style="position: relative;left: 90px">返 回</el-button>
          <el-button type="primary"  @click="resetPwd('ruleForm')" style="position: relative;left: 240px">确 定</el-button>
        </div>
        <Vcode
            :imgs="[Img1, Img2,Img3,Img4,Img5]"
            :show="isShow"
            @success="success"
            @close="close"
        />
      </el-dialog>
    </div>
  </transition>
  <!--  </el-collapse-transition>-->

  <transition name="el-zoom-in-bottom">
<!--  <el-collapse-transition>-->
    <div v-show="show2" class="transition-box">
      <el-dialog title="用户注册" :visible.sync="registerFormVisible" style="width: 1000px;left: 320px;top: 10px"  :close-on-click-modal="false" >
        <el-form :rules="registerRules" :model="ruleForm" class="demo-ruleForm" ref="ruleForm">
          <el-form-item  label="账号" :label-width="formLabelWidth" prop="username">
            <el-input prefix-icon="el-icon-user" placeholder="学号/教师号(一旦注册成功不可更改)" v-model="ruleForm.username"  autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="pwd">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="ruleForm.pwd" autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="rePwd">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="ruleForm.rePwd" autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
            <el-input prefix-icon="el-icon-mobile-phone" v-model="ruleForm.phone" autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="验证码" :label-width="formLabelWidth" prop="phoneCode">
            <el-input prefix-icon="el-icon-message" v-model="ruleForm.phoneCode" autocomplete="off" style="width: 270px"></el-input>
            <el-button  type="primary" round  @click="sendCode" :disabled="canSendCode">{{ codeMsg }}</el-button>
          </el-form-item>
          <el-form-item label="身份" :label-width="formLabelWidth" prop="role">
            <el-radio v-model="ruleForm.role" label="我是老师" border value="teacher"></el-radio>
            <el-radio v-model="ruleForm.role" label="我是学生" border value="student"></el-radio>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="backFromRegisterToLogin" style="position: relative;left: 90px">返回</el-button>
          <el-button type="primary"  @click="regsiter('ruleForm')" style="position: relative;left: 240px">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </transition>
<!--  </el-collapse-transition>-->

  <chat-window ref="chatWindow" @func="msgNotify" v-show="myChat" @reloadVue="reloadView"></chat-window>
</div>


</template>

<script>
import Vcode from "vue-puzzle-vcode";
import Img1 from './assets/img/index01.jpg';
import Img2 from './assets/img/index02.jpg';
import Img3 from './assets/img/index03.jpg';
import Img4 from './assets/img/index04.jpg';
import Img5 from './assets/img/index05.jpg';
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
import chatWindow from "@/views/chatWindow";
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

import Vue from 'vue'
import ChatWindow from "@/views/chatWindow";

Vue.component(CollapseTransition.name, CollapseTransition)

export default {
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reloadView: this.reloadView
    }
  },
  data() {
    return {
      badgeHidden: false,
      chatWithSaleManVisible: false,
      canSendCode: false,
      show2: false,
      show1: false,
      selfCenterVisible: this.$session.get("selfCenterVisible") == null ? '/selfCenter/selfInfo' : this.$session.get("selfCenterVisible"),
      show3: false,
      activeIndex: this.$session.get("activeIndex"),
      Img1,
      Img2,
      Img3,
      Img4,
      Img5,
      isShow: false, // 验证码模态框是否出现
      loginRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],

        role: [
          { required: true, message: '请选择身份', trigger: 'change' }
        ],

      },
      registerRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 10, max: 10, message: '必须为10位学号或教师号', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        rePwd: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],

        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '非规范手机号', trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, message: '验证码不可为空', trigger: 'blur' },
        ],

        role: [
          { required: true, message: '请选择身份', trigger: 'change' }
        ],

      },
      gridData: [{

      }],
      selfCenterIndex: this.$session.get("selfCenterIndex") == null ? '' : this.$session.get("selfCenterIndex"),
      haveMsg: false,
      msgCount: 0,
      num: 60,
      userType: '',
      registerFormVisible: false,
      loginFormVisible: false,
      forgetPwdForm: false,
      codeMsg:"获取验证码",
      myChat: false,
      isRouterAlive: true,
      ruleForm: {
        username: '',
        pwd: '',
        role: '',
        rePwd: '',
        phone: '',
        phoneCode: ''
      },
      formLabelWidth: '120px',
      userinfo: {},
      headImg: this.$session.get("headImg")
    };
  },
  components: {
    ChatWindow,
    Vcode,
    Img1,
    Img2,
    Img3,
    Img4,
    Img5,
  },
  methods: {

    handleClick() {
      alert('button click');
    },

    resetPwd(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.ruleForm.role == "我是老师"){
            this.ruleForm.role = "0"
          }else{
            this.ruleForm.role = "1"
          }
          if (this.ruleForm.pwd == this.ruleForm.rePwd){
            this.request.post("/user/resetPwd", {
              //参数 例 key: this.data
              username: this.ruleForm.username,
              pwd: this.ruleForm.pwd,
              role: this.ruleForm.role,
              phone: this.ruleForm.phone,
              phoneCode: this.ruleForm.phoneCode
            }).then(res => {
              if (res.code == 0){
                this.$message({
                  message: '修改密码成功',
                  type: 'success'
                })
                this.backToLoginFromForgetForm()
              }else if(res.code == 2){
                this.$message({
                  message: '修改密码失败,该用户不存在',
                  type: 'warning'
                })
              }else if (res.code == 3){
                this.$message({
                  message: '验证码有误',
                  type: 'warning'
                })
              }else{
                this.$message({
                  message: '系统未知异常',
                  type: 'warning'
                })
              }

            });

          }else{
            this.$message({
              message: '两次密码输入不一致',
              type: 'warning'
            })
          }

        } else {
          return false;
        }
      });
    },
    regsiter(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.ruleForm.role == "我是老师"){
            this.ruleForm.role = "0"
          }else{
            this.ruleForm.role = "1"
          }
          if (this.ruleForm.pwd == this.ruleForm.rePwd){
            this.request.post("/user/register", {
              //参数 例 key: this.data
              username: this.ruleForm.username,
              pwd: this.ruleForm.pwd,
              role: this.ruleForm.role,
              phone: this.ruleForm.phone,
              phoneCode: this.ruleForm.phoneCode
            }).then(res => {
              if (res.code == 0){
                this.$message({
                  message: '注册成功',
                  type: 'success'
                })
                this.backFromRegisterToLogin();
              }else if (res.code == 2){
                this.$message({
                  message: '该账号或手机号已被注册!',
                  type: 'warning'
                })
              }else if (res.code == 4){
                this.$message({
                  message: '服务器出现异常!',
                  type: 'warning'
                })
              } else if (res.code == 5){
                this.$message({
                  message: '验证码错误!',
                  type: 'warning'
                })
              }
            });
          }else{
            this.$message({
              message: '两次密码输入不一致',
              type: 'warning'
            })
          }
        } else {
          return false;
        }
      });

    },
    handleSelect(key, keyPath) {

      this.$session.set("activeIndex",key);
      if(key.split("/")[2] == 'selfCenter' && this.$session.get("user")!=null) {
          this.selfCenterIndex = this.$session.get("selfCenterIndex");
      }
      if(key.split("/")[2] == 'selfCenter' && this.$session.get("user")==null) {
        window.location = "http://localhost:9000/";
      }

    },
    sendCode() {
      if (this.ruleForm.phone == ""){
        this.$message({
          message: '请填写手机号码',
          type: 'warning'
        })
      }else{
        if(this.canSendCode == true){

        }else{
          this.request.get(`/user/sendCode?phone=${this.ruleForm.phone}`, {
            param: {

            }
          }).then(res => {
            if (res.code == 0){
              this.$message({
                message: '发送成功',
                type: 'success'
              });

            }else if (res.code == 3){
              this.$message({
                message: '验证码获取频率太高，请稍候再试',
                type: 'warning'
              });
            }
          });
          this.timeoutChangeStyle();
      }


      }
    },

    timeoutChangeStyle(){
      this.canSendCode = true;
      if (this.num == 0){
       this.codeMsg = "发送验证码"
        this.num = 60;
        this.canSendCode = false;
      }else{
        var str = this.num + "s 可后再次发送验证码";
        let _this = this;
        this.codeMsg = str
        //一秒后再次调用该方法
        setTimeout(function()  {

          _this.timeoutChangeStyle()

        }, 1000);
        this.num--;
      }
    },
    submit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loginFormVisible = false
          this.isShow = true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },

    checkHaveMsg() {
      if (this.$session.get("user")!= null){
        this.request.get("/chat/checkHaveMsg", {
          params: {
            //参数
            id: this.$session.get('presentUserId')
          }
        }).then(res => {
          if (res.code == 0  && res.data > 0) {
            this.haveMsg = true;
            if (res.data == 0){
              this.badgeHidden = true;
            }else{
              this.msgCount =  res.data;
            }
          }else{
            this.haveMsg = false;
            this.msgCount =  0;
          }
        });
      }
    },

    // 用户通过了验证
    success(msg){
      this.isShow = false; // 通过验证后，需要手动隐藏模态框
      this.request.post("/user/login", {
        //参数 例 key: this.data
        username: this.ruleForm.username,
        pwd: this.ruleForm.pwd,
      }).then(res => {
        if (res.code == 0){
          this.$message({
            message: '登录成功',
            type: 'success'
          });
          this.userinfo = res.data
          this.$session.set("headImg",res.data.userHeadImg); //存session
          this.$session.set("user",res.data); //存session
          this.$session.set('presentUserId', res.data.id);
          this.checkHaveMsg(res.data.id)
          this.selfCenterVisible = "/selfCenter/selfInfo";
          this.$session.set("selfCenterIndex","/selfCenter/selfInfo")
          localStorage.setItem("token", res.data);
          location.reload()
        }else {
          this.$message({
            message: '账号或密码错误',
            type: 'warning'
          });
        }
      });


    },
    // 用户点击遮罩层，应该关闭模态框
    close(){
      this.isShow = false;
      this.loginFormVisible = true;
    },

    showForgetPwdForm(){
      this.ruleForm.pwd = ''
      this.ruleForm.rePwd = ''
      this.ruleForm.role = ''
      this.ruleForm.phone = ''
      this.show1 = false;
      this.loginFormVisible = false
      this.show3 = true;
      this.forgetPwdForm = true

    },

    backToLoginFromForgetForm(){

      this.ruleForm.pwd = ''
      this.show3 = false;
      this.forgetPwdForm = false
      this.show1 = true;
      this.loginFormVisible = true
    },

    backFromRegisterToLogin(){
      this.ruleForm.pwd = ''
      this.show2 = false
      this.show1 = true
      this.registerFormVisible = false
      this.loginFormVisible = true
    },
    showLoginForm(){
      this.ruleForm.username = '';
      this.ruleForm.pwd = ''
      this.loginFormVisible = true
      this.show1 = true
    },


    showRegisterForm(){
      this.ruleForm.pwd = ''
      this.ruleForm.rePwd = ''
      this.ruleForm.role = ''
      this.ruleForm.phone = ''
      this.show1 = false;
      this.loginFormVisible = false
      this.show2 = true
      this.registerFormVisible = true
    },

    logout() {
      this.$confirm('您确定要退出吗？', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth()+1;
        let dd = new Date().getDate();
        let hh = new Date().getHours();
        let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
        let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
        let logoutTime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
        if (this.$session.get('user') != null) {
          this.request.get("/user/logout", {
            params: {
              //参数
              id: this.$session.get('user').id,
              stuLastLogoutTime: logoutTime
            }
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: '退出成功',
                type: 'success'
              });
              this.$session.remove('user');
              this.$session.remove("headImg");
              this.$session.remove("presentUserId");
              this.$session.remove("selfCenterVisible");
              this.$session.remove("selfCenterIndex")
              this.userinfo = {};
              this.userType = '';

              this.activeIndex = "/"
              this.$session.set("activeIndex","/")
              window.location = "http://localhost:9000/"

              setTimeout(function()  {
                location.reload()
              }, 1000);
            }else if(res.code ==1 ){
              alert("出问题了")
            }else{
              alert("出大问题")
            }
          });
        }
      }).catch(() => {

      });
    },

    getTheLastOneChatWithMe(){
      this.request.get("/chat/theLastOneMan", {
        params: {
          //参数
          id: this.$session.get("presentUserId")
        }
      }).then(res => {
        if (res.code == 0) {
          this.$nextTick(() => {
            this.$refs.chatWindow.changeChatUser(res.data.id, res.data.userName , res.data.userHeadImg);
          })
        }
      });


    },
    handleCommand(command) {
      if (command == 'logout') {
        this.logout();
      }
      if (command == 'myChat'){
        this.myChat = true;
        this.getTheLastOneChatWithMe();
      }
    },

    reloadView () {
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;         //再打开
      })
    },

    joinFun() {
      let user = this.$session.get('user');
      if (user == null || user.id == '') {
        return;
      }
      let url = 'ws://192.168.0.14:10000/ws/' + user.id;
      this.ws = new WebSocket(url);
      this.ws.onopen = function () {
        console.log("建立 websocket 链接...." + user.id)
      };
    },

    async msgNotify() {
      const h = this.$createElement;
      this.$notify({
        title: '私信通知',
        message: h('i', { style: 'color: teal'}, '您有一条新的消息')
      });
    },


    selectMyMsg(id) {
      this.request.get("/student/selectMyMsg", {
        params: {
          //参数
          id: id
        }

      }).then(res => {
        if (res.code == 0) {

        }
      })


    },
    checkLogin() {
      if (this.$session.get('user') != null){
        localStorage.setItem("token",this.$session.get('user'))
        return true;
      }else {

        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        });
      }
    }


  },
  created() {
    this.joinFun();
  },
  updated() {
    this.checkHaveMsg()
  }
}
</script>
<style>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}



.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  /*text-align: center;*/
}


.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}


.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}

body{
  padding-right:0 !important;
  overflow: hidden;
  background-image: url("./assets/img/bg01.jpg") ;
  background-size:cover;
  margin: 0px;
  padding: 0px;


}

.item{
  -moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#headImg{
  -moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  caret-color: transparent;
}

</style>
