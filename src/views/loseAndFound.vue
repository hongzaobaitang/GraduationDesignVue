<!--  -->
<template>
  <div class="app" >
    <el-row>
      <el-col :span="3"><el-button style="width: px;position: relative;top: -15px;" type="warning" @click="showPick" v-if="viewType" icon="el-icon-refresh">切换到失物招领</el-button></el-col>
      <el-col :span="3"><el-button class="share-button" style="position: relative;top: -15px" type="warning" icon="el-icon-refresh" @click="showLose" v-if="viewType == false">切换到寻物启事</el-button></el-col>
      <el-col :span="2"><el-button style="width: 110px;position: relative;top: -15px;" type="primary" @click="showPutLoseAndFountDialog">我要发布</el-button></el-col>
      <el-col :span="2"><el-button style="width: 110px;position: relative;top: -15px;" type="primary" @click="showMyPut">我发布的</el-button></el-col>
      <el-col :span="2" :offset="13">
        <el-input placeholder="试试搜索:手机" @keypress.native.enter="searchThings" v-model="search" @clear="checkIsNull" clearable @input="checkIsNull"  class="input-with-select" style="width: 300px;position: relative;top: -15px;">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="searchThings" ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <div style="height: 680px;position: relative;top: 0px;right: 0px; display: flex ;background-color: #F2F6FC" class="cab" >
      <el-scrollbar style="height:100%">
        <!-- 内部div -->
        <div style="">
          <el-row :gutter="gutterNum" style="-moz-user-select: -moz-none;
                  -moz-user-select: none;
                  -o-user-select: none;
                  -khtml-user-select: none;
                  -webkit-user-select: none;
                  -ms-user-select: none;
                  user-select: none;
                  caret-color: transparent;">
            <el-col style="position: relative;margin-top: 10px" :span=6 v-for="(item,index) in infoList"  >
              <el-card :body-style="{ padding: '0px' }" style="width: 270px">
                <img :src=" item.lafStuffImg " class="image" style="width: 270px;height: 250px">
                <div  style="padding: 14px;">
                  <span style="font-family: 幼圆;font-size: 20px;color: chocolate"> {{ item.lafStuffName}}</span>
                  <span style="font-size: 10px;color: gray;float: right"> {{ item.lafCreatetime }}</span>
                  <div>
                    <div style="height: 40px">
                      <span style="font-size: 15px"> {{ item.lafDescribe }}</span>
                    </div>
                    <span style="font-size: 15px;color: gray">{{ item.lafSenderName }}</span>
                    <span>
                      <el-link type="primary" style="float: right" v-if="presentUserId != item.lafSenderId" @click="chatWithPutMan(item.lafSenderId)">点此联系</el-link>
                      <el-link type="danger" style="float: right" v-if="presentUserId == item.lafSenderId" @click="cancel(item.id)">撤回</el-link>
                    </span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog title="发布" :visible.sync="putLoseAndFoundDialog" style="width: 1000px;left: 350px;top: -60px"  :close-on-click-modal="false" >
      <el-form :rules="putRules" :model="putForm" class="demo-ruleForm" ref="putForm">
        <el-form-item  label="失物名" :label-width="formLabelWidth" prop="lafStuffName">
          <el-input placeholder="如：手机/钱包" v-model="putForm.lafStuffName"  autocomplete="off" style="width: 270px"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth" prop="lafStuffImg">
          <single-upload v-model="putForm.lafStuffImg"></single-upload>
        </el-form-item>
        <el-form-item  label="描述" :label-width="formLabelWidth" prop="lafDescribe" >
          <el-input   maxlength="30" show-word-limit type="textarea"
                      :rows="3" resize="none" prefix-icon="el-icon-user" v-model="putForm.lafDescribe"  autocomplete="off" style="width: 270px"></el-input>
        </el-form-item>

        <el-form-item  label="地点" :label-width="formLabelWidth" prop="lafLocation">
          <el-input v-model.number="putForm.lafLocation"  autocomplete="off" style="width: 270px"></el-input>
        </el-form-item>
        <el-form-item  label="类型" :label-width="formLabelWidth" prop="lafType">
          <el-select v-model="putForm.lafType" placeholder="请选择您要发布的类型">
            <el-option
                v-for="item in lafType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="putLoseAndFoundDialog = false" style="position: relative;left: 100px">取消</el-button>
        <el-button type="primary"  @click="putLoseAndFound('putForm')" style="position: relative;left: 230px">确 定</el-button>
      </div>
    </el-dialog>
    <chatWindow v-if="chatWithPutManVisible" ref="chatWindow"></chatWindow>

  </div>
</template>

<script>
//这里可以导入其他文件(比如:组件,工具js,第三方插件js,json文件,图片文件等等）
//例如:import 《组件名称》 from '《组件路径》';

import SingleUpload from "../components/upload/singleUpload";
import chatWindow from "@/views/chatWindow";
export default {
  components: { SingleUpload,chatWindow },
  data() {
    el: ".app"
    name: 'zousir'
//这里存放数据
    return {
      gutterNum: 60,
      lafType: [
        {
          label: '失物招领',
          value: 1
        },{
          label: '寻物启事',
          value: 0
        }
      ],
      chatWithPutManVisible: false,
      putRules: {
        lafStuffName: [
          { required: true, message: '请输入失物名', trigger: 'blur' },
        ],
        lafStuffImg:[
          { required: true, message: '请添加图片',trigger: 'blur' },
        ],
        lafDescribe:[
          { required: true, message: '请添加描述', trigger: 'blur' },
        ],
        lafType:[
          { required: true, message: '请选择发布类型', trigger: 'blur' },
        ],
        lafLocation:[
          {  required: true, message: '请输入拾到/丢失地点', trigger: 'blur' },
        ]
      },
      putForm: {
        lafStuffName: '',
        lafStuffImg: '',
        lafDescribe: '',
        lafType: '',
        lafLocation: '',

      },
      search: '',
      formLabelWidth: '120px',
      putLoseAndFoundDialog: false,
      viewType: true,
      infoList: [],
      presentUserId: this.$session.get("presentUserId") == null ? 0 : this.$session.get("presentUserId")
    };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {

    /**
     * 显示我发布的
     */
    showMyPut() {
      if (this.checkLogin()) {
        this.request.get("/loseandfound/showMyPut", {
          params: {
            //参数
            id: this.$session.get("presentUserId")

          }

        }).then(res => {
          if (res.code == 0) {
            this.myPutList = res.data
           }
        })



      }
    },

    /**
     撤回
     */
    cancel(id) {
      this.$confirm('您确定要撤回吗？', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.get("/loseandfound/cancel", {
          params: {
            //参数
            id: id
          }
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '撤回成功',
              type: 'success'
            })
            if (this.viewType){
              this.showLose();
            }else{
              this.showPick();
            }
          }

        })
      }).catch(() => {

      });
    },

    /**
     * 搜索
     */
    searchThings() {
      var type = 0;
      if (this.viewType == false) {
        type = 1;
      }
      if (this.search != ''){
        this.request.get("/loseandfound/search", {
          params: {
            //参数
            key: this.search,
            type: type
          }

        }).then(res => {
          if (res.code == 0) {
            this.infoList = res.data;
          }
          if (this.infoList.length < 4){
            this.gutterNum = 380
          }else{
            this.gutterNum = 60
          }
        })

      }



    },

    /**
     * 联系窗口
     */
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
      }
    },

    /**
     * 发布
     */
    putLoseAndFound(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.request.post("/loseandfound/save", {
            //参数 例 key: this.data
            lafStuffName: this.putForm.lafStuffName,
            lafStuffImg: this.putForm.lafStuffImg,
            lafLocation: this.putForm.lafLocation,
            lafDescribe: this.putForm.lafDescribe,
            lafType: this.putForm.lafType,
            lafSenderId: this.$session.get("presentUserId"),
            lafSenderName: this.$session.get("user").userName
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '发布成功！'
              })
              if (this.putForm.lafType == 1) {
                this.showPick();

              }else{
                this.showLose();
              }
              this.putLoseAndFoundDialog = false;
            }else{
              this.$message({
                type: 'warning',
                message: '发布失败，服务器出错'
              })
            }
          })
        }
      });
    },

    showPutLoseAndFountDialog() {
      if (this.checkLogin()) {
        this.putLoseAndFoundDialog = true;
      }
    },

    showLose() {
      this.viewType = true;
      this.getLoseList('lose')
    },

    showPick() {
      this.getLoseList('pick')
      this.viewType = false;
    },


    /**
     * 获取信息
     */
    getLoseList(type) {
      this.request.get("/loseandfound/getLoseList", {
        params: {
          //参数
          type: type
        }
      }).then(res => {
        if (res.code == 0) {
          this.infoList = res.data;
          if (this.infoList.length < 4){
            this.gutterNum = 380
          }else{
            this.gutterNum = 60
          }
        }
      })
    },
    checkIsNull(){
      if (this.search == ''){
        if (this.viewType){
          this.showLose();
        }else{
          this.showPick();
        }
      }
    },

    checkLogin() {
      if (this.$session.get("user") != null) {
        return true;
      }else{
        this.$message({
          type: 'warning',
          message: '您还未登录，请先登录'

        })
        return false;
      }
    }


  },
//生命周期 - 创建完成(可以访问当前this实例)
  created() {
    this.getLoseList('lose');
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
</style>

