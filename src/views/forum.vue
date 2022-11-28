<!--  -->
<template>
  <div class="app">
    <div style="height: 800px">
      <el-row>
        <el-col :span="4">
          <div style="border: white solid 1px ;border-radius: 4px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
<!--            <div v-if="this.$session.get('user') == null">-->
<!--              <span style="font-size: 22px;color: chocolate"> 还未登录，登录后可以发帖</span>-->
<!--            </div>-->
            <div >
              <el-input v-model="search" @keypress.native.enter="searchForum" placeholder="试试搜索：英语四级" ><el-button slot="append" icon="el-icon-search" @click="searchForum"></el-button></el-input>
            </div>
            <div style="margin-top: 15px">
<!--              <el-avatar :size="50" :src="myHeadImg"></el-avatar>-->
                <el-button type="primary" style="width: 100%"  @click="showPutForumDialog = true">我要发帖</el-button>
            </div>
            <div style="margin-top: 15px">
              <el-button type="primary" style="width: 100%" @click="myLikeOrCollection('collection')" >我的收藏</el-button>
            </div>

            <div style="margin-top: 15px">
              <el-button type="primary" style="width: 100%" @click="myLikeOrCollection('like')">我点赞过</el-button>
            </div>
          </div>
          <div style="height: 480px;position: relative;top: 10px;right: 0px; display: flex ;background-color: #DEDFF2;overflow-x: hidden"  >
              <div>
                <h3 style="padding-left: 70px;color: chocolate;font-family: 幼圆">高赞帖子</h3>
                <div  v-for="item in hightLikeList">
                  <el-link type="danger" style="font-family: 幼圆;font-size: 20px">{{ item.forTitle}}</el-link>
                </div>
              </div>
          </div>
        </el-col>


        <el-col :span="19" :offset="1" v-if="mainVisible">
          <el-button icon="el-icon-back" type="primary" size="small" round v-show="backButton" @click="showAll">返回</el-button>
          <el-scrollbar style="height: 100%">
            <div style="height: 700px;" >
              <div v-for="item in forumList">
                <el-card class="box-card" >
                  <div slot="header" class="clearfix">
                    <el-link @click="showSpecific(item.id,item.forSendId)" style="font-size: 20px;color: crimson">{{ item.forTitle }}</el-link>
                    <span style="font-size: 10px;padding: 3px 0;color: gray;align-items: right">
                      {{ (item.forCreatetime || '').split('.')[0] }}
                    </span>
                    <el-tag style="float: right; padding: 3px 20" type="primary" >
                      {{ item.forCollection }}收藏
                    </el-tag>
                    <el-tag  style="float: right; padding: 3px 20 " type="success">
                      {{ item.forLike }}点赞
                    </el-tag>
                  </div>
                  <div  class="text item">
                    {{ item.forContent }}
                  </div>
                </el-card>
                <br/>
              </div>
            </div>
          </el-scrollbar>
        </el-col>

        <el-col :span="19" :offset="1" v-if="specificVisible">
          <el-button icon="el-icon-back" type="primary" size="small" round v-show="backButton" @click="showAll">返回</el-button>
          <div>
<!--             主体部分-->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 30px;color: chocolate">{{ specificInfo.forTitle }}</span>
                <span style="padding-left: 15px;font-size: 15px;color: gray"> <i class="el-icon-user"></i>{{ specificInfo.userName }}</span>
                <span style="padding-left: 15px;font-size: 15px;color: gray"> <i class="el-icon-time"></i>{{ (specificInfo.forCreatetime|| '').split('.')[0] }}</span>
                <el-button v-if="specificInfo.collectionStatus == 0" style="float: right" icon="el-icon-star-off"  circle @click="iCollectionIt(specificInfo.id)"></el-button>
                <el-button v-if="specificInfo.collectionStatus == 1" icon="el-icon-star-on" style="float: right;" circle @click="iCollectionIt(specificInfo.id)"></el-button>

                <el-button v-if="specificInfo.likeStatus == 0" icon="iconfont icon-dianzan" style="float: right;" @click="iLikeIt(specificInfo.id)" circle></el-button>
                <el-button v-if="specificInfo.likeStatus == 1" icon="iconfont icon-dianzan1" style="float: right;" @click="iLikeIt(specificInfo.id)" circle></el-button>

              </div>
              <div class="text item" style="height: 50px;font-size: 18px">
                {{ specificInfo.forContent }}
              </div>
            </el-card>
          </div>
<!--          评论部分-->
            <div style="height: 700px;" >
              <el-card class="box-card">
                <div slot="header" class="clearfix" >
                  <span style="font-size: 15px;color: gray">评论区</span>
                </div>
                  <el-scrollbar style="height: 100%">
                    <div style="height: 300px">
                      <div class="text item" v-if="commentList.length != 0" v-for="item in commentList" :key="item.id">
                        <el-avatar :size="60" :src="item.comUserHeadImg"></el-avatar>
                        <span style="font-size: 18px;color: indianred;position: relative;top: -39px"> {{ item.comUserName }}  </span>
                        <span style="font-size: 5px;color: gray;position: relative;top: -42px"> {{ (item.comCreatetime || '').split('.')[0] }}  </span>
                        <span style="font-size: 20px;color: black;position: relative;left: -193px;top: -9px"> {{ item.comContent }}  </span>
                      </div>
                      <div  v-if="commentList.length == 0">
                        <el-empty description="还没人评论"></el-empty>
                      </div>
                    </div>
                  </el-scrollbar>
              </el-card>
              <br/>
              <div style="height: 80px">
                <el-input type="textarea" placeholder="发布一条友好的评论吧~" @keypress.native.enter="putComment" style="width: 90%" maxlength="526" show-word-limit v-model="mycomment"></el-input>
                <el-button type="primary" round style="width: 8%;margin: 10px" @click="putComment" >发布</el-button>
              </div>
            </div>

        </el-col>
      </el-row>
    </div>

    <el-dialog title="发布帖子" :visible.sync="showPutForumDialog" :close-on-click-modal="false">
      <el-form :model="putForumForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="forTitle">
          <el-input type="text" v-model="putForumForm.forTitle" placeholder="请输入标题" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="forContent">
          <el-input :rows="5" type="textarea" v-model="putForumForm.forContent" placeholder="请输入内容" maxlength="526" show-word-limit></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="putForum">立即发布</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

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
      hightLikeList: [],
      presentForumId: 0,
      mycomment: '',
      count: 0,
      presentSenderId: 0,
      mainVisible: true,
      specificVisible: false,
      showPutForumDialog: false,
      backButton: '',
      myHeadImg: this.$session.get("headImg"),
      forumList: [],
      putForumForm: {
        forTitle: '',
        forContent: '',
      },
      rules: {
        forTitle: [
          { required: true ,message: '请输入标题', trigger: 'blur' },
        ],
        forContent: [
          { required: true ,message: '请输入内容', trigger: 'blur' },
        ],

      },
      search: '',
      specificInfo: {},
      commentList: [],
    };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {

    gethightLikeList() {
      this.request.get("/forum/hightLikeList", {
        params: {
          //参数
        }
      }).then(res => {
        if (res.code == 0) {
          this.hightLikeList = res.data;
        }
      })



    },

    /**
     * 我点赞过的
     */
    myLikeOrCollection(type) {
      if (this.checkLogin()){
        this.backButton = true;
          this.request.get("/userforumrelation/myLike", {
            params: {
              //参数
              id: this.$session.get("presentUserId"),
              type: type
            }

          }).then(res => {
            if (res.code == 0) {
              if (res.code == 0) {
                this.forumList = res.data;
              }
              this.mainVisible = true;
            }
          })
      }else{
        this.$message({
          type: 'warning',
          message: '您还未登录，请先登录'

        })
      }




    },

    /**
     * 收藏操作
     */
    iCollectionIt(id) {
      if (this.checkLogin()) {
        this.request.post("/userforumrelation/iCollectionIt", {
          //参数 例 key: this.data
          forumId: id,
          userId: this.$session.get("presentUserId")
        }).then(res => {
          if (res.code == 0) {
            this.showSpecific(this.presentForumId,this.presentSenderId)
          }
        })
      }else{
        this.$message({
          type: 'warning',
          message: '您还未登录，请先登录'

        })
      }
    },

    /**
     * 点赞操作
     */
    iLikeIt(id) {
      if (this.checkLogin()) {
        this.request.post("/userforumrelation/iLikeIt", {
          //参数 例 key: this.data
          forumId: id,
          userId: this.$session.get("presentUserId")
        }).then(res => {
          if (res.code == 0) {
            this.showSpecific(this.presentForumId,this.presentSenderId)
          }
        })
      }else{
        this.$message({
          type: 'warning',
          message: '您还未登录，请先登录'

        })
      }
    },

    load () {
      this.count += 2
    },

    putComment() {
      if (this.checkLogin()) {
        this.request.post("/comment/save", {
          //参数 例 key: this.data
          comContent: this.mycomment,
          comUserId: this.$session.get("presentUserId"),
          comForId: this.presentForumId,
          comUserHeadImg: this.$session.get("user").userHeadImg,
          comUserName: this.$session.get("user").userName

        }).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '发布评论成功!'
            })
          }
          this.showSpecific(this.presentForumId,this.presentSenderId)
          this.mycomment = '';
        });


      }else {
        this.$message({
          type: 'warning',
          message: '您还未登录，请先登录'

        })
      }
    },

    /**
     * 显示具体内容
     *
     */
    showSpecific(forumId, userId) {
      this.mainVisible = false;
      this.specificVisible = true;
      this.backButton = true;
      this.presentForumId = forumId;
      this.presentSenderId = userId;
      this.request.post("/userforumrelation/showCommon", {
        //参数
        userId: this.$session.get("presentUserId"),
        forumId: forumId
      }).then(res => {
        if (res.code == 0) {
          this.specificInfo = res.data
          this.commentList = res.data.comments
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },



    /**
     * 发帖
     */
    putForum() {
      if (this.checkLogin()) {
        this.request.post("/forum/save", {
          //参数 例 key: this.data
          forTitle: this.putForumForm.forTitle,
          forContent: this.putForumForm.forContent,
          forSendId: this.$session.get("presentUserId")

        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '发帖成功！',
              type: 'success'
            })
          }
          this.showPutForumDialog = false;
          this.getAllForums();
        })


      }else {
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        })
      }
    },

    /**
     * 返回按钮按键
     */
    showAll() {
      this.backButton = false;
      this.mainVisible = true;
      this.getAllForums();
    },

    /**
     * 搜索
     */
    searchForum() {
      this.backButton = true;
      this.request.get('/forum/search', {
        params: {
          //参数
          search: this.search
        }
      }).then(res => {
        if (res.code == 0) {
          this.forumList = res.data;
        }
        this.mainVisible = true;
      })
    },


    /**
     * 检查是否登录
     */
    checkLogin(){
      if (this.$session.get("user") == null) {
        return false;
      }else {
        return true;
      }
    },

    getAllForums() {
      this.request.get("/forum/getAllForums", {
        params: {
          //参数
        }

      }).then(res => {
        if (res.code == 0) {
          this.forumList = res.data
        }
      });


    }
  },
//生命周期 - 创建完成(可以访问当前this实例)
  created() {
    this.getAllForums();
    this.gethightLikeList();
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
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 99%;
}
</style>

