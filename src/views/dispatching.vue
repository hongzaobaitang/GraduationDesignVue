<!--  -->
<template>
  <div class="app">

    <el-row>
      <el-col :span="4">
        <div>
          <el-button type="primary" style="width: 232px" @click="putADispatching">
            发布跑腿任务
          </el-button>
        </div>

        <div>
          <el-button type="primary" style="width: 232px;top: 5px;position: relative" @click="getMyDispatchingOrder">
            我配送的
          </el-button>
        </div>

        <div>
          <el-button type="primary" style="width: 232px;top: 10px;position: relative" @click="showIPut">
            我发布的
          </el-button>
        </div>

        <div>
          <el-card class="box-card" style="top: 20px;height: 550px;position: relative">
            <div slot="header" class="clearfix" >
              <el-badge value="hot" class="item">
                <span>配送六侠</span>
              </el-badge>
              <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-refresh" @click="showSuperDispatchingMan">刷新</el-button>
            </div>
            <div>
              <div v-for="o in superDispatchingMan" :key="o.id" class="text item" >
                <el-avatar :size="50" :src="o.userHeadImg"></el-avatar>
                <div style="position: relative;top: -35px; left: 60px;font-size: 20px">
                  {{ o.userName }}
                  <span style="color: red"> {{ o.dispCount }}单</span></div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="19" :offset="1">
        <el-scrollbar style="height: 100%">
          <div style="height: 700px;">
            <el-descriptions  v-for="item in dispatchinglist" :column="4" :colon="false">
              <el-descriptions-item label="内容" :contentStyle="{'font-size': '20px'}" :span="3" :labelStyle="{'font-size': '15px','color' : '#EA950D','padding-left': '10px'}">{{ item.dispDescribe }}</el-descriptions-item>
              <el-descriptions-item label="手机号" :contentStyle="{'font-size': '20px'}" :labelStyle="{'font-size': '15px','color' : '#EA950D'}">{{ item.dispPhone }}</el-descriptions-item>
              <el-descriptions-item label="地址" :contentStyle="{'font-size': '20px'}" :span="3" :labelStyle="{'font-size': '15px','color' : '#EA950D','padding-left': '10px'}"> {{ item.dispLocation }}</el-descriptions-item>
              <el-descriptions-item label="配送费" :contentStyle="{'font-size': '20px','color' : 'red'}"  :labelStyle="{'font-size': '15px','color' : '#EA950D'}"> ￥{{ item.dispPrice }}</el-descriptions-item>
              <el-descriptions-item label="发起时间" :contentStyle="{'font-size': '20px'}"  :span="3" :labelStyle="{'font-size': '15px','color' : '#EA950D','padding-left': '10px'}">{{ (item.dispCreatetime|| '').split('.')[0]}}</el-descriptions-item>
              <el-descriptions-item v-if="item.dispSenderId != $session.get('presentUserId')" label="操作"  :contentStyle="{'font-size': '20px'}" :labelStyle="{'font-size': '15px','color' : '#EA950D'}" >
                  <el-button type="success" @click="getThisDispatching(item.id)">立即抢单</el-button>
                  <el-button type="primary" @click="chatWithPutMan(item.dispSenderId)">聊聊</el-button>
              </el-descriptions-item>
              <el-descriptions-item v-if="item.dispSenderId == $session.get('presentUserId')" label="操作"  :contentStyle="{'font-size': '20px'}" :labelStyle="{'font-size': '15px','color' : '#EA950D'}" >
                <el-button type="danger" @click="cancelDispatchingRelease(item.id)">撤回</el-button>
              </el-descriptions-item>
                <el-descriptions-item >
                <el-divider></el-divider>
                </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>


    <el-dialog title="发布跑腿" :visible.sync="releaseDispatchingDialog" :close-on-click-modal="false">
      <el-form :model="releaseDispatchingForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="内容" prop="dispDescribe">
          <el-input v-model="releaseDispatchingForm.dispDescribe" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="配送地址" prop="dispLocation">
          <el-input v-model="releaseDispatchingForm.dispLocation" placeholder="请输入收货地址"></el-input>
        </el-form-item>
        <el-form-item label="配送费" prop="dispPrice">
          <el-input v-model.number="releaseDispatchingForm.dispPrice"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="dispPhone">
          <el-input v-model.number="releaseDispatchingForm.dispPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="releaseDispatching('ruleForm')">立即发布</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="我配送的" :visible.sync="myDispatchingDialog" width="1500px">
      <el-table
          :data="myDispatchingTable"
          style="width: 100%"
          max-height="600">
        <el-table-column
            prop="dispDescribe"
            label="配送内容"
            width="300">

        </el-table-column>
        <el-table-column
            prop="dispLocation"
            label="配送地址"
            width="300">
        </el-table-column>

        <el-table-column
            prop="dispPhone"
            label="联系电话"
            width="120">
        </el-table-column>

        <el-table-column

            label="配送费"
            width="120"
            prop="dispPrice">
        </el-table-column>

        <el-table-column
            prop="dispUpdatetime"
            label="接单时间"
            width="200">

        </el-table-column>
        <el-table-column
            label="状态"
            width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.dispStatus == 0" type="primary">正在配送</el-tag>
            <el-tag v-if="scope.row.dispStatus == 1" type="success">已完成</el-tag>
          </template>

        </el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger"
                @click="deleteMyDispatching(scope.row.id)" v-if="scope.row.dispStatus == 0">我不接了</el-button>

            <el-button
                size="mini"
                type="success"
                @click="finishThisDispatching(scope.row.id,scope.row.dispPrice)" v-if="scope.row.dispStatus == 0">已完成订单</el-button>

            <el-button
                size="mini"
                type="success"
                @click="deleteDispatching(scope.row.id)" v-if="scope.row.dispStatus == 1">删除记录</el-button>

            <el-button
                size="mini"
                type="danger"
                @click="chatWithPutMan(scope.row.dispSenderId)">和金主聊聊</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


    <el-dialog title="我发布的" :visible.sync="IPutDialog" width="1500px">
      <el-table
          :data="iPutDispatchingList"
          style="width: 100%"
          max-height="600">
        <el-table-column
            prop="dispDescribe"
            label="配送内容"
            width="300">

        </el-table-column>
        <el-table-column
            prop="dispLocation"
            label="配送地址"
            width="300">
        </el-table-column>

        <el-table-column
            prop="dispPhone"
            label="联系电话"
            width="120">
        </el-table-column>

        <el-table-column

            label="配送费"
            width="120"
            prop="dispPrice">
        </el-table-column>

        <el-table-column
            prop="dispCreatetime"
            label="发起时间"
            width="200">

        </el-table-column>
        <el-table-column
            label="状态"
            width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.dispStatus == 0 && scope.row.dispTakeOrderId == 0" type="danger">未完成</el-tag>
            <el-tag v-if="scope.row.dispStatus == 0 && scope.row.dispTakeOrderId != 0" type="primary">正在配送</el-tag>
            <el-tag v-if="scope.row.dispStatus == 1 && scope.row.dispTakeOrderId != 0" type="success">已完成</el-tag>
          </template>

        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                @click="updateIHavePut(scope.row)" v-if="scope.row.dispStatus == 0">修改</el-button>

            <el-button
                size="mini"
                type="danger"
                @click="cancelDispatchingRelease(scope.row.id)" v-if="scope.row.dispStatus == 0">撤回</el-button>

            <el-button
                size="mini"
                type="danger"
                @click="deleteDispatching(scope.row.id)" v-if="scope.row.dispStatus == 1">删除</el-button>

            <el-button
                size="mini"
                type="danger"
                @click="chatWithPutMan(scope.row.dispTakeOrderId)" v-if="scope.row.dispTakeOrderId != 0">和跑腿聊聊</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <chatWindow v-if="chatWithPutManVisible" ref="chatWindow"></chatWindow>
  </div>
</template>

<script>
//这里可以导入其他文件(比如:组件,工具js,第三方插件js,json文件,图片文件等等）
//例如:import 《组件名称》 from '《组件路径》';
import chatWindow from "@/views/chatWindow";
export default {
//import引入的组件需要注入到对象中才能使用
  components: {chatWindow},
  data() {
    el: ".app"
    name: 'zousir'
//这里存放数据
    return {
      superDispatchingMan: [],
      IPutDialog: false,
      chatWithPutManVisible: false,
      dispatchinglist: [],
      putType: '',
      presentDispatchingId: 0,
      iPutDispatchingList: [],
      myDispatchingDialog: false,
      releaseDispatchingDialog: false,
      myDispatchingTable: [],
      releaseDispatchingForm: {
        dispDescribe: '',
        dispPrice: '',
        dispLocation: '',
        dispPhone: '',
      },
      rules: {
        dispPhone: [
          { required: true ,message: '请输入联系号码', trigger: 'blur' },
          { pattern: /^[1][3-9][0-9]{9}$/ ,message: '请输入正确号码', trigger: 'blur' },
          { type: 'number', message: '请输入数字号码'}
        ],
        dispDescribe: [
          { required: true ,message: '请输入配送内容', trigger: 'blur' },
        ],
        dispPrice: [
          { required: true ,message: '请输入配送费', trigger: 'blur' },
          { type: 'number', message: '只能输入整数'}
        ],
        dispLocation: [
          { required: true ,message: '请输入配送地址', trigger: 'blur' },
        ],
      }
    };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {

    /**
     * 发布跑腿订单
     * @param data
     */
    putADispatching() {
      this.releaseDispatchingDialog = true;
      this.putType = "add";
    },

    /**
     * 完成订单
     */
    finishThisDispatching(id,dispPrice) {
      this.$confirm('请确认完成订单', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.get("/dispatching/finishThisDispatching", {
          params: {
            //参数
            id: id,
            userId: this.$session.get("presentUserId"),
            dispPrice: dispPrice
          }
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '恭喜完成订单，佣金已到账户中！',
              type: 'success'
            })
            this.getMyDispatchingOrder()

          }else{
            this.$message({
              message: '系统错误',
              type: 'warning'
            })
          }
        })
      }).catch(() => {

      });
    },

    /**
     * 修改配送单
     * @param data
     */
    updateIHavePut(data) {
      this.putType = "update";
      this.releaseDispatchingDialog = true;
      this.presentDispatchingId = data.id;
      this.releaseDispatchingForm.dispLocation = data.dispLocation;
      this.releaseDispatchingForm.dispDescribe = data.dispDescribe;
      this.releaseDispatchingForm.dispPrice = data.dispPrice;
      this.releaseDispatchingForm.dispPhone = data.dispPhone-0;

    },

    /**
     * 我发布的
     */
    showIPut() {
      this.IPutDialog = true;
      this.request.get("/dispatching/showIPut", {
        params: {
          //参数
          id: this.$session.get("presentUserId")
        }

      }).then(res => {
        if (res.code == 0) {
          this.iPutDispatchingList = res.data;
        }
      });


    },

    /**
     * 抢单
     */
    getThisDispatching(id) {
      if (this.checkLogin()){
        this.$confirm('您确定要抢这个单吗？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.request.get("/dispatching/getThisDispatching", {
            params: {
              //参数
              id: id,
              userId: this.$session.get("presentUserId")

            }
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: '抢单成功！',
                type: 'success'
              })
              this.getDispatchingList();
              this.getMyDispatchingOrder();
            }else{
              this.$message({
                message: '抢单失败，以及被被人抢走啦！',
                type: 'warning'
              })
              this.getDispatchingList();
            }
          })
        }).catch(() => {

        });
      }else{
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        })
      }


    },

    /**
     * 获取我接的单
     */
    getMyDispatchingOrder() {
      if (this.checkLogin()){
        this.myDispatchingDialog = true;
        this.request.get("/dispatching/getMyDispatchingOrder", {
          params: {
            //参数
            id: this.$session.get("presentUserId")
          }

        }).then(res => {
          if (res.code == 0) {
            this.myDispatchingTable = res.data;
          }
        })
      }else{
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        })
      }


    },

    /**
     * 删除配送记录
     */
    deleteDispatching(id) {
      this.$confirm('您确定删除该记录吗', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.get("/dispatching/deleteDispatching", {
            //参数
          params: {
            id: id
          }
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '删除记录成功',
              type: 'success'
            })
            if (this.IPutDialog == true){
              this.showIPut();
            }else if (this.myDispatchingDialog == true){
              this.getMyDispatchingOrder();
            }
          }else{
            this.$message({
              message: '操作失败,系统错误',
              type: 'warning'

            })
          }
        })
      }).catch(() => {

      });
    },


    /**
     * 取消我接的单
     * @param index
     * @param row
     */

    deleteMyDispatching(id) {
      if (this.checkLogin()){
        this.$confirm('您确定放弃接送该配送单吗', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.request.get("/dispatching/deleteMyDispatching", {
            params: {
              //参数
              id: id
            }
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: '放弃配送单成功',
                type: 'success'

              })
              this.getDispatchingList()
              this.getMyDispatchingOrder()
            }else{
              this.$message({
                message: '操作失败,系统错误',
                type: 'warning'

              })
            }
          })
        }).catch(() => {

        });
      }else{
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        })
      }



    },

    /**
     * 撤回配送信息
     */
    cancelDispatchingRelease(id) {
      if (this.checkLogin()){
        this.$confirm('您确定撤回该配送单吗', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.request.get("/dispatching/cancelDispatchingRelease", {
            params: {
              //参数
              id: id
            }
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: '撤回配送单成功',
                type: 'success'
              })
              if (this.IPutDialog){
                this.showIPut();
              }
              this.getDispatchingList();
            }else{
              this.$message({
                message: '撤回配送单失败，该配送单已被接下',
                type: 'warning'
              })
              this.getDispatchingList();
            }
          })
        }).catch(() => {

        });
      }else{
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        })
      }


    },

    /**
     * 发布配送信息
     */
    releaseDispatching(formName) {
      if (this.checkLogin()){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.putType == 'add'){
              this.request.post("/dispatching/save", {
                //参数 例 key: this.data
                dispSenderId: this.$session.get("presentUserId"),
                dispLocation: this.releaseDispatchingForm.dispLocation,
                dispDescribe: this.releaseDispatchingForm.dispDescribe,
                dispPhone: this.releaseDispatchingForm.dispPhone,
                dispPrice: this.releaseDispatchingForm.dispPrice,

              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    message: '发布成功！',
                    type: 'success'
                  })
                  this.releaseDispatchingDialog = false;
                  this.getDispatchingList();
                }

              })
            }else if (this.putType == 'update') {
              this.request.post("/dispatching/update", {
                //参数 例 key: this.data
                id: this.presentDispatchingId,
                dispSenderId: this.$session.get("presentUserId"),
                dispLocation: this.releaseDispatchingForm.dispLocation,
                dispDescribe: this.releaseDispatchingForm.dispDescribe,
                dispPhone: this.releaseDispatchingForm.dispPhone,
                dispPrice: this.releaseDispatchingForm.dispPrice,
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    message: '修改成功！',
                    type: 'success'
                  })
                  this.releaseDispatchingDialog = false;
                  this.showIPut();
                }

              })

            }



          } else {
            return false;
          }
        });
      }else{
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        })
      }

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },



    /**
     * 获取配单信息
     */
    getDispatchingList(){
      this.request.get("/dispatching/getAllDispatching", {
        params: {
          //参数
        }
      }).then(res => {
        if (res.code == 0) {
          this.dispatchinglist = res.data
        }
      });


    },

    checkLogin() {
      if (this.$session.get('user' )== null){
        return false;
      }else{
        return true;
      }
    },
    chatWithPutMan(toId) {
      if (this.checkLogin()){
        this.chatWithPutManVisible = true;
        this.request.get(`/user/info/${toId}`, {
          params: {
            //参数
          }
        }).then(res => {
          this.$nextTick(() => {
            this.$refs.chatWindow.changeChatUser(toId, res.user.userName, res.user.userHeadImg);
          })

        })
      }else{
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        })
      }

    },


    showSuperDispatchingMan(){
      this.request.get("/dispatching/getSuperDispatchingMan", {
        params: {
          //参数
        }
      }).then(res => {
        if (res.code == 0) {
          this.superDispatchingMan = res.data;
        }
      });


    }


  },
//生命周期 - 创建完成(可以访问当前this实例)
  created() {
    this.getDispatchingList();
    this.showSuperDispatchingMan();
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

