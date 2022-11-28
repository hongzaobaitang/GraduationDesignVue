<!--  -->
<template>
  <div class="app">
    <el-descriptions class="margin-top" title="账号设置" size="medium"  style="height: 800px;" :column="1">
      <el-descriptions-item label="用户账号" :contentStyle="{'font-size': '30px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">
        <span>&nbsp;&nbsp;&nbsp;&nbsp;{{ userAccountInfo.userId }}</span>
      </el-descriptions-item>

      <el-descriptions-item label="手机号码" :contentStyle="{'font-size': '30px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">
        <el-tooltip placement="right" effect="light">
          <div slot="content"><el-button type="text" @click="showUpdateUserPhoneDialog=true">修改</el-button></div>
          <span v-if="userAccountInfo.userPhone != ''">  &nbsp;&nbsp;&nbsp;&nbsp;{{ userAccountInfo.userPhone }}</span>
          <span v-if="userAccountInfo.userPhone == ''" >  &nbsp;&nbsp;&nbsp;&nbsp;<el-tag type="warning">未绑定</el-tag>
          </span>
        </el-tooltip>
      </el-descriptions-item>



      <el-descriptions-item label="邮箱地址" :contentStyle="{'font-size': '30px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">
        <el-tooltip placement="right" effect="light">
          <div slot="content"><el-button type="text" @click="showUpdateUserEmailDialog = true">修改</el-button></div>
          <span v-if="userAccountInfo.userEmail != ''">  &nbsp;&nbsp;&nbsp;&nbsp;{{ userAccountInfo.userEmail }}</span>
          <span v-if="userAccountInfo.userEmail == ''">  &nbsp;&nbsp;&nbsp;&nbsp;
            <el-tag type="warning">未绑定</el-tag>
          </span>
        </el-tooltip>
      </el-descriptions-item>

      <el-descriptions-item label="Q Q号码" :contentStyle="{'font-size': '30px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">
        <el-tooltip placement="right" effect="light">
          <div slot="content"><el-button type="text" @click="updateUserQQ = true">修改</el-button></div>
          <span v-show="updateUserQQ== false" v-if="userAccountInfo.userQQ != ''">  &nbsp;&nbsp;&nbsp;&nbsp;{{ userAccountInfo.userQQ }}</span>
          <span v-show="updateUserQQ== false" v-if="userAccountInfo.userQQ == ''">  &nbsp;&nbsp;&nbsp;&nbsp;
            <el-tag type="warning">未绑定</el-tag>
          </span>
        </el-tooltip>

        <el-input style="width: 200px;left: 40px" v-if="updateUserQQ" v-model="userAccountInfo.userQQ">
        </el-input>
        <el-button  v-if="updateUserQQ" style="position: relative;left: 45px" icon="el-icon-success" @click="updateUserInfo()" type="primary">保存</el-button>
        <el-button  v-if="updateUserQQ" style="position: relative;left: 40px"  @click="updateUserQQ = false;reload()" icon="el-icon-error" type="danger">取消</el-button>
      </el-descriptions-item>

      <el-descriptions-item label="微信号码" :contentStyle="{'font-size': '30px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">

        <el-tooltip placement="right" effect="light">
          <div slot="content"><el-button type="text" @click="updateUserWx = true">修改</el-button></div>
          <span v-show="updateUserWx== false" v-if="userAccountInfo.userWx != ''">  &nbsp;&nbsp;&nbsp;&nbsp;{{ userAccountInfo.userWx }}</span>
          <span v-show="updateUserWx== false" v-if="userAccountInfo.userWx == ''">  &nbsp;&nbsp;&nbsp;&nbsp;
            <el-tag type="warning">未绑定</el-tag>
          </span>
        </el-tooltip>
        <el-input style="width: 200px;left: 40px" v-if="updateUserWx" v-model="userAccountInfo.userWx">
        </el-input>
        <el-button  v-if="updateUserWx" style="position: relative;left: 45px" icon="el-icon-success" @click="updateUserInfo()" type="primary">保存</el-button>
        <el-button  v-if="updateUserWx" style="position: relative;left: 40px"  @click="updateUserWx = false;reload()" icon="el-icon-error" type="danger">取消</el-button>
      </el-descriptions-item>


      <el-descriptions-item label="用户密码" :contentStyle="{'font-size': '30px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">

        <el-button style="position: relative;left: 40px;width: 150px;"  type="primary" plain @click="showUpdateUserPwdDialog = true">修改密码</el-button>
      </el-descriptions-item>
    </el-descriptions>



    <el-dialog
        title="修改密码"
        :visible.sync="showUpdateUserPwdDialog"
        :close-on-click-modal="false"
        width="50%"
        style="position:relative ;top: -900px;left: -50px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input type="password" v-model="ruleForm.oldPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="ruleForm.newPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="newAgain">
          <el-input v-model="ruleForm.newAgain" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUserPwd('ruleForm')">确 定</el-button>
          <el-button @click="showUpdateUserPwdDialog = false;reload()">取 消</el-button>
        </el-form-item>
      </el-form>
      <br/>
    </el-dialog>

    <el-dialog
        title="更换手机号码"
        :visible.sync="showUpdateUserPhoneDialog"
        :close-on-click-modal="false"
        width="50%"
        style="position:relative ;top: -900px;left: -50px">
      <div>
        <el-input style="width: 300px;left: 40px"  v-model="inputPhone" placeholder="请输入手机号">
          <el-button slot="suffix" :disabled="canSendPhoneCode" @click="sendPhoneCode()" type="text">  {{ codeMsgForPhone }}</el-button>
        </el-input>

      </div>
      <br/>
      <div><el-input style="width: 300px;left: 40px" v-model="phoneCode" placeholder="请输入验证码"></el-input></div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="showUpdateUserPhoneDialog = false;reload()">取 消</el-button>
          <el-button type="primary" @click="updateUserPhoneFunc">保 存</el-button>
        </span>
    </el-dialog>

    <el-dialog
        title="更换电子邮箱"
        :visible.sync="showUpdateUserEmailDialog"
        :close-on-click-modal="false"
        width="50%"
        style="position:relative ;top: -900px;left: -40px">
      <div>
        <el-input style="width: 300px;left: 40px"  v-model="inputEmail" placeholder="请输入邮箱地址">
          <el-button style="position: relative" slot="suffix" :disabled="canSendEmailCode" @click="sendEmailCode()" type="text">{{ codeMsgForEmail }}</el-button>
        </el-input>
      </div>
      <br/>
      <div><el-input style="width: 300px;left: 40px" v-model="emailCode" placeholder="请输入验证码"></el-input></div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="showUpdateUserEmailDialog = false;reload()">取 消</el-button>
          <el-button type="primary" @click="updateUserEmailFun">保 存</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
//这里可以导入其他文件(比如:组件,工具js,第三方插件js,json文件,图片文件等等）
//例如:import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
  components: {},
  inject:['reload'],
  data() {
    el: ".app"
    name: 'zousir'
    var oldPwdCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    var newPwdCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        callback();
      }
    };
    var newAgainCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
//这里存放数据
    return {
      codeMsgForPhone: '获取验证码',
      codeMsgForEmail: '发送验证码',
      inputEmail: '',
      inputPhone: '',
      canSendPhoneCode: false,
      canSendEmailCode: false,
      userAccountInfo: {
        userPhone: '',
        userEmail: '',
        userId: '',
        userQQ: '',
        userWx: ''
      },
      rules: {
        oldPwd: [
          { validator: oldPwdCheck, trigger: 'blur' }
        ],
        newPwd: [
          { validator: newPwdCheck, trigger: 'blur' }
        ],
        newAgain: [
          { validator: newAgainCheck, trigger: 'blur' }
        ]
      },
      ruleForm: {
        oldPwd: '',
        newPwd: '',
        newAgain: ''
      },
      phoneCode: '',
      emailCode: '',
      updateUserPhone: false,
      updateUserQQ: false,
      updateUserWx: false,
      updateUserEmail: false,
      num: 60,
      showUpdateUserPhoneDialog: false,
      showUpdateUserEmailDialog: false,
      showUpdateUserPwdDialog: false,



    };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {

    /**
     * 修改密码
     */
    updateUserPwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.request.post("/user/updateUserPwd", {
            //参数 例 key: this.data
            id: this.$session.get("presentUserId"),
            oldPwd: this.ruleForm.oldPwd,
            newPwd: this.ruleForm.newPwd
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: '密码修改成功!',
                type: 'success'
              })
              this.showUpdateUserPwdDialog = false;
            }
          });

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    initUserInfo() {
      let user = this.$session.get("user");
      this.userAccountInfo.userPhone = user.userPhone;
      this.userAccountInfo.userEmail = user.userEmail == null ? '':user.userEmail;
      this.userAccountInfo.userId = user.userId == null ? '':user.userId;
      this.userAccountInfo.userQQ = user.userQq == null ? '':user.userQq;
      this.userAccountInfo.userWx = user.userWx == null ? '':user.userWx ;
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
          userQq: this.userAccountInfo.userQQ,
          userWx: this.userAccountInfo.userWx
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
    },


    updateUserEmailFun() {

      if (this.emailCode == ''){
        this.$message({
          message: '请输入验证码',
          type: 'warning'
        })
      }else{
        this.request.post("/user/changeUserEmail", {
          //参数 例 key: this.data
          id: this.$session.get('presentUserId'),
          userEmail: this.inputEmail,
          emailCode: this.emailCode

        }).then(res => {
          if (res.code == 0) {
            let id = this.$session.get('presentUserId');
            this.request.get(`/user/info/${id}`, {
              params: {
                //参数
              }
            }).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: '绑定成功!',
                  type: 'success'
                })
                this.showUpdateUserEmailDialog = false;
                this.$session.set('user',res.user);
                this.initUserInfo();
                this.reload();
              }
            });
          }else if (res.code == 5) {
            this.$message({
              message: '验证码输入错误',
              type: 'warning'
            })
          }else{
            this.$message({
              message: '修改失败',
              type: 'warning'
            })
          }
        });

      }
    },

    updateUserPhoneFunc() {
      if (this.phoneCode == ''){
        this.$message({
          message: '请输入验证码',
          type: 'warning'
        })
      }else{
        this.request.post("/user/changeUserPhone", {
          //参数 例 key: this.data
          id: this.$session.get('presentUserId'),
          userPhone: this.inputPhone,
          phoneCode: this.phoneCode

        }).then(res => {
          if (res.code == 0) {

            let id = this.$session.get('presentUserId');
            this.request.get(`/user/info/${id}`, {
              params: {
                //参数
              }
            }).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: '绑定成功!',
                  type: 'success'
                })
                this.showUpdateUserPhoneDialog = false;
                this.$session.set('user',res.user);
                this.initUserInfo();
                this.reload();

              }
            });
          }else if (res.code == 5) {
            this.$message({
              message: '验证码输入错误',
              type: 'warning'
            })
          }else{
            this.$message({
              message: '修改失败',
              type: 'warning'
            })
          }
        });

      }
    },
    sendPhoneCode() {
      if (this.inputPhone == '') {
        this.$message({
          message: '电话号码不可为空',
          type: 'warning'
        })
      }else{
        const reg =/^[1][3-9][0-9]{9}$/;
        if (!reg.test(this.inputPhone)){
          this.$message({
            message: '请输入正确的电话号码',
            type: 'warning'
          })
        }else{
          if(this.canSendPhoneCode == true){

          }else{
            this.request.get(`/user/sendCode?phone=${this.inputPhone}`, {
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
            this.timeoutChangeStyleForPhone();
          }
        }
      }
    },


    sendEmailCode() {
      if (this.inputEmail == '') {
        this.$message({
          message: '请填写邮箱地址',
          type: 'warning'
        })
      }else{
        const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        if (!reg.test(this.inputEmail)){
          this.$message({
            message: '请输入正确的邮箱地址',
            type: 'warning'
          })
        }else{
          if(this.canSendEmailCode == true){


          }else{
            this.request.get(`/user/sendEmail?email=${this.inputEmail}`, {
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
            this.timeoutChangeStyleForEmail();
          }
        }
      }
    },
    timeoutChangeStyleForPhone(){
      this.canSendPhoneCode = true;
      if (this.num == 0){
        this.codeMsgForPhone = "发送验证码"
        this.num = 60;
        this.canSendPhoneCode = false;
      }else{
        var str = this.num + "s";
        let _this = this;
        this.codeMsgForPhone = str
        //一秒后再次调用该方法
        setTimeout(function()  {

          _this.timeoutChangeStyleForPhone()
        }, 1000);
        this.num--;
      }
    },

    timeoutChangeStyleForEmail(){
      this.canSendEmailCode = true;
      if (this.num == 0){
        this.codeMsgForEmail = "发送验证码"
        this.num = 60;
        this.canSendEmailCode = false;
      }else{
        var str = this.num + "s";
        let _this = this;
        this.codeMsgForEmail = str
        //一秒后再次调用该方法
        setTimeout(function()  {
          _this.timeoutChangeStyleForEmail()
        }, 1000);
        this.num--;
      }
    },



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

