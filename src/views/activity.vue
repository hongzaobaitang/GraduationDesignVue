<!--  -->
<template>
  <div class="app">
    <div style="height: 30px;position: relative;top: -15px">
      <el-button type="primary" @click="putActivity">发起活动</el-button>
      <el-button type="primary" @click="showMyPutActivity">我发起的</el-button>

      <el-button type="primary" @click="myJoinActivity">我参加的</el-button>

      <span style="float: right;font-family: 宋体-方正超大字符集;" v-if=" $session.get('user') != null">
        当前已获取得分: <strong style="color: crimson">{{ $session.get("user").userScore }}</strong>
        <el-button type="text" icon="el-icon-refresh" @click="scoreReload">刷新</el-button>
      </span>
    </div>
    <div style="height: 700px;">
      <el-table
          :data="activityList.filter(activityList => !search || activityList.actName.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%"
          max-height="700">
        <el-table-column
            label="名称"
            prop="actName">
        </el-table-column>
        <el-table-column
            label="内容"
            prop="actDescribe">
        </el-table-column>
        <el-table-column
            label="发起人"
            prop="actUserName">
        </el-table-column>
        <el-table-column
            label="地点"
            prop="actLocation">
        </el-table-column>
        <el-table-column
            label="人数"
            >
          <template slot-scope="scope">
            {{ scope.row.actPresentPerson }}/{{ scope.row.actMaxPerson}}
          </template>
        </el-table-column>
        <el-table-column
            label="分数"
            prop="actScore">
        </el-table-column>
        <el-table-column
            label="活动时间"
            prop="actTime">
          <template slot-scope="scope">
            <span>{{ (scope.row.actTime || '' ).split('.')[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="right">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="search"
                size="mini"
                placeholder="请输入活动名称查询"/>
          </template>
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.actStatus == 2">已结束</el-tag>
            <el-button
                size="mini"
                type="warning"
                v-if="$session.get('presentUserId')!= null && scope.row.actSenderId == $session.get('presentUserId') && scope.row.actStatus == 1"
                @click="endThisActivity(scope.row)">结束</el-button>
            <el-button
                size="mini"
                type="success"
                v-if="scope.row.actSenderId != $session.get('presentUserId') && scope.row.actStatus == 1 && scope.row.joinStatus == 0"
                @click="join(scope.row)">参加</el-button>
            <el-button
                size="mini"
                type="danger"
                v-if="scope.row.actStatus == 1 && scope.row.joinStatus == 1"
                @click="quit(scope.row)">退出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog title="发起活动" :visible.sync="showActivityDialog" :close-on-click-modal="false">
      <el-form :model="putActivityForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="actName">
          <el-input type="text" v-model="putActivityForm.actName" placeholder="请输入活动名称" ></el-input>
        </el-form-item>
        <el-form-item label="活动描述" prop="actDescribe">
          <el-input :rows="5" type="textarea" v-model="putActivityForm.actDescribe" placeholder="请输入活动描述" maxlength="526" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="活动地点" prop="actLocation">
          <el-input type="text" v-model="putActivityForm.actLocation" placeholder="请输入活动地点"></el-input>
        </el-form-item>
        <el-form-item label="活动人数" prop="actMaxPerson">
          <el-input type="text" v-model.number="putActivityForm.actMaxPerson" placeholder="请输入活动人数"></el-input>
        </el-form-item>
        <el-form-item label="可得分数" prop="actMaxPerson">
          <el-select v-model="putActivityForm.actScore" placeholder="请选择分数">
          <el-option
              v-for="item in 5"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="活动时间" prop="actTime">
          <div class="block">
            <el-date-picker
                v-model="putActivityForm.actTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择活动时间"
                default-time="12:00:00">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="putActivity">提交申请</el-button>
          <el-button @click="('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-dialog title="我发起的" :visible.sync="showMyPutActivityDialog" :close-on-click-modal="false" width="1200px" >
      <el-table
          :data="myPutActivityList.filter(myPutActivityList => !search || myPutActivityList.actName.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%"
          max-height="700">
        <el-table-column
            label="名称"
            prop="actName">
        </el-table-column>
        <el-table-column
            label="内容"
            width="200px"
            prop="actDescribe">
        </el-table-column>
        <el-table-column
            label="地点"
            prop="actLocation">
        </el-table-column>
        <el-table-column
            label="人数">
          <template slot-scope="scope">
            {{ scope.row.actPresentPerson }}/{{ scope.row.actMaxPerson}}
          </template>
        </el-table-column>
        <el-table-column
            label="分数"
            prop="actScore">
        </el-table-column>
        <el-table-column
            label="状态"
            prop="actTime">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.actStatus == 0" type="warning">待审核</el-tag>
              <el-tag v-if="scope.row.actStatus == 1" type="success" >进行中</el-tag>
              <el-tag v-if="scope.row.actStatus == 2" type="danger">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="活动时间"
            prop="actTime">
          <template slot-scope="scope">
            <span>{{ (scope.row.actTime || '' ).split('.')[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="right">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="search"
                size="mini"
                placeholder="请输入活动名称查询"/>
          </template>
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="warning"
                v-if="$session.get('presentUserId')!= null && scope.row.actSenderId == $session.get('presentUserId') && scope.row.actStatus == 1"
                @click="endThisActivity(scope.row)">结束</el-button>
            <el-button
                size="mini"
                type="success"
                v-if="scope.row.actStatus == 0"
                @click="cancel(scope.row)">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

    <el-dialog title="我参加的" :visible.sync="showMyJoinActivityDialog" :close-on-click-modal="false" width="1200px">
      <el-table
          :data="myJoinActivityList.filter(myPutActivityList => !search || myJoinActivityList.actName.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%"
          max-height="700">
        <el-table-column
            label="名称"
            prop="actName">
        </el-table-column>
        <el-table-column
            label="内容"
            width="200px"
            prop="actDescribe">
        </el-table-column>
        <el-table-column
            label="发起人"
            prop="actName">
        </el-table-column>
        <el-table-column
            label="地点"
            prop="actLocation">
        </el-table-column>
        <el-table-column
            label="人数">
          <template slot-scope="scope">
            {{ scope.row.actPresentPerson }}/{{ scope.row.actMaxPerson}}
          </template>
        </el-table-column>
        <el-table-column
            label="分数"
            prop="actScore">
        </el-table-column>
        <el-table-column
            label="状态"
            prop="actTime">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.actStatus == 0" type="warning">待审核</el-tag>
            <el-tag v-if="scope.row.actStatus == 1" type="success" >进行中</el-tag>
            <el-tag v-if="scope.row.actStatus == 2" type="danger">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="活动时间"
            prop="actTime">
          <template slot-scope="scope">
            <span>{{ (scope.row.actTime || '' ).split('.')[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="right">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="search"
                size="mini"
                placeholder="请输入活动名称查询"/>
          </template>
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="warning"
                v-if="scope.row.actStatus == 1"
                @click="quit(scope.row)">退出</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

  </div>
</template>

<script>
//这里可以导入其他文件(比如:组件,工具js,第三方插件js,json文件,图片文件等等）
//例如:import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
  components: {},
  inject:['reloadView'],
  data() {
    el: ".app"
    name: 'zousir'
//这里存放数据
    return {
      showMyJoinActivityDialog: false,
      myJoinActivityList: [],
      rules: {
        actName: [
          { required: true ,message: '请输入活动名称', trigger: 'blur' },
        ],
        actDescribe: [
          { required: true ,message: '请输入活动描述', trigger: 'blur' },
        ],
        actLocation: [
          { required: true ,message: '请输入活动地点', trigger: 'blur' },
        ],
        actTime: [
          { required: true ,message: '请选择活动时间', trigger: 'blur' },
        ],
        actScore: [
          { required: true ,message: '请选择活动得分', trigger: 'blur' },
        ],
        actMaxPerson: [
          { required: true ,message: '请选择活动人数', trigger: 'blur' },
          { type: 'number' ,message: '请输入正确的人数', trigger: 'blur' },
        ],

      },
      showMyPutActivityDialog: false,
      putActivityForm: {
        actName: '',
        actDescribe: '',
        actLocation: '',
        actScore: '',
        actMaxPerson: '',
        actTime: '',
      },
      myPutActivityList: [],
      showActivityDialog: false,
      activityList: [],
      search: ''
    };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {

    /**
     * 刷新分数
     */
    scoreReload() {
      //重新查询一次用户，更新一下session中的user
      this.request.get(`/user/info/${ this.$session.get("presentUserId")}`, {
        params: {
          //参数
        }
      }).then(res => {
        if (res.code == 0) {
          this.$session.set("user",res.user)
          this.reloadView();
        }
      })
    },

    /**
     * 显示我参加的活动
     */
    myJoinActivity() {
      if (this.checkLogin()) {
        this.showMyJoinActivityDialog = true;
        this.request.get("/personactivityrelation/myJoinActivity", {
          params: {
            //参数
            id: this.$session.get("presentUserId")
          }
        }).then(res => {
          if (res.code == 0) {
            this.myJoinActivityList = res.data;
          }
        })



      }

    },


    /**
     * 撤回
     */
    cancel(data) {
      this.$confirm('您确定要撤回该活动申请吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.get("/activity/cancelActivityRequest", {
          params: {
            //参数
            id: data.id
          }
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.showMyPutActivity();
          }else{
            this.$message({
              type: 'warning',
              message: '操作失败，请刷新页面后重试!'
            })
          }

        })
      }).catch(() => {

      });

    },

    /**
     * 显示我发起的活动
     */
    showMyPutActivity() {
      if (this.checkLogin()) {
        this.showMyPutActivityDialog = true;
        this.request.get("/activity/getMyPutActivity", {
          params: {
            //参数
            actSenderId: this.$session.get("presentUserId")
          }
        }).then(res => {
          if (res.code == 0) {
            this.myPutActivityList = res.data;
          }
        })



      }
    },

    /**
     * 结束
     */
    endThisActivity(data) {
      this.$confirm('您确定要结束该活动吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.get("/activity/endThisActivity", {
          params: {
            //参数
            id: data.id
          }
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            if (this.showMyPutActivityDialog == true) {
              this.showMyPutActivity();
            }
          }
        })
      }).catch(() => {

      });
    },

    /**
     * 退出活动
     * @param data
     */
    quit(data) {
      if (this.checkLogin()) {
          this.$confirm('您确定要退出该活动吗？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.request.post("/personactivityrelation/quit", {
              //参数 例 key: this.data
              actId: data.id,
              personId: this.$session.get("presentUserId")
            }).then(res => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '退出成功'
                })
                this.getAllActivity();
              }else{
                this.$message({
                  type: 'warning',
                  message: '抱歉，已经结束'
                });
                this.getAllActivity();
              }

            })
          }).catch(()=>{

          });
      }
    },

    /**
     * 参加活动
     * @param data
     */
    join(data) {
      if (this.checkLogin()) {
        if (data.actMaxPerson > data.actPresentPerson) {
          this.$confirm('您确定要参加该活动吗？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
              this.request.post("/personactivityrelation/join", {
                //参数 例 key: this.data
                actId: data.id,
                personId: this.$session.get("presentUserId")
              }).then(res => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '恭喜您成功参加'
                  })
                  this.getAllActivity();
                }else{
                  this.$message({
                    type: 'warning',
                    message: '抱歉，该活动参与人数已满'
                  });
                  this.getAllActivity();
                }

              })
          }).catch(()=>{

          });
        }else{
          this.$message({
            type: 'warning',
            message: '抱歉，该活动参与人数已满'
          });
        }
      }
    },


    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },

    getAllActivity() {
      this.backToAll = false;
      this.request.get("/activity/getAllActivity", {
        params: {
          //参数
          id: this.$session.get("presentUserId") == null? 0 : this.$session.get("presentUserId")
        }
      }).then(res => {
        if (res.code == 0) {
          this.activityList = res.data;
        }
      });

    },
    putActivity() {
      if (this.checkLogin()) {
        this.showActivityDialog = true;
        this.request.post("/activity/save", {
          //参数 例 key: this.data
          actName: this.putActivityForm.actName,
          actLocation: this.putActivityForm.actLocation,
          actDescribe: this.putActivityForm.actDescribe,
          actTime: this.putActivityForm.actTime,
          actScore: this.putActivityForm.actScore,
          actMaxPerson: this.putActivityForm.actMaxPerson,
          actSenderId: this.$session.get("presentUserId"),
          actUserName: this.$session.get("user").userName,

        }).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '提交申请成功，等待管理员通过'
            })
            this.showActivityDialog = false;
            this.getAllActivity();
          }else{
            this.$message({
              type: 'warning',
              message: '操作失败，系统出错，请刷新后重试'
            })
          }
        })


      }

    },
    checkRole() {
      this.request.get(`/user/info/${this.$session.get("presentUserId")}`, {
        params: {
          //参数
        }
      }).then(res => {
        if (res.code == 0) {
          return res.user.userType;
        }
      });



    },
    checkLogin() {
      if (this.$session.get("user") == null) {
        this.$message({
          type: 'warning',
          message: '您还未登录，请先登录'
        });
        return false;
      }
      return true;
    }
  },
//生命周期 - 创建完成(可以访问当前this实例)
  created() {
    this.getAllActivity();
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

