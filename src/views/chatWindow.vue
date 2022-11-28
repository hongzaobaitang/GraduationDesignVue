<!--  -->
<template>
  <div class="app">

    <el-dialog :title="chatUserName"  :close-on-press-escape="true" :before-close="chatDialogClose" :modal="false"  :close-on-click-modal="false" :visible.sync="chatWithSaleManVisible"
               style="width: 100%;left: -70px;top: -100px;height: 900px">


      <el-row>
        <el-col :span="7">
          <div style="background-color: coral;width: 200px;height: 548px;
              position: relative;background-color: #eee">
          <div style="height: 580px;width: 200px; overflow-y: auto">
            <div v-for="item in userList" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 0px; " v-if="isReloadData">
              <el-badge  v-if="item.msgCount != 0" :value="item.msgCount" class="item"></el-badge>
              <el-button type="text" style="font-size: 18px;background-color: #EBEEF5;width: 200px" @click="changeChatUser(item.id,item.userName,item.userHeadImg)" v-if="chatMsg.toUserId == item.id">

                <img
                    style="
                  width: 50px;
                  height: 50px;
                  vertical-align: middle;
                  border-radius: 50%;
                  padding-right: 10px;"
                    :src="item.userHeadImg"
                />{{ item.userName }}
              </el-button>

              <el-button type="text" style="width: 200px;font-size: 18px" @click="changeChatUser(item.id,item.userName,item.userHeadImg)" v-if="chatMsg.toUserId != item.id">

                <img
                    style="
                    width: 50px;
                    height: 50px;
                    vertical-align: middle;
                    border-radius: 50%;
                    padding-right: 10px;"
                    :src="item.userHeadImg"
                />
                {{ item.userName }}
              </el-button>
            </div>
          </div>
        </div>
        </el-col>
        <el-col :span="17">
          <div style="height: 500px;width: 585px; overflow-y: auto"  id="bigBox">
            <div
                v-for="(item, index) in chatList"
                class="msgCss"
                :style="{textAlign: (item.chatReceiverId == chatMsg.userId && item.chatSenderId == chatMsg.toUserId) ? 'left' : 'right'}">
              <!--        当接收人是我 ，发送人是对方的时候 （以当前聊天框的角度）-->
              <span v-if="item &&   item.chatReceiverId == chatMsg.userId && item.chatSenderId == chatMsg.toUserId">
              <img
                  style="
                  width: 50px;
                  height: 50px;
                  vertical-align: middle;
                  border-radius: 50%;
                  padding-right: 10px;"
                  :src="receiverHeadImg"
                  alt=""/>
              <span  v-if="item">{{item.chatContent}}</span>
            </span>
              <span v-if="item && item.chatReceiverId == chatMsg.toUserId && item.chatSenderId == chatMsg.userId">
              {{item.chatContent}}<img
                  style="
                  width: 50px;
                  height: 50px;
                  vertical-align: middle;
                  border-radius: 50%;
                  padding-right: 10px;
                  padding-left: 10px;
                "
                  :src="senderHeadImg"
                  alt=""
              />
            </span>
            </div>
          </div>
          <div style="margin-top: 15px">
            <el-input
                placeholder="请输入内容"
                v-model="chatMsg.content"
                class="input-with-select"
                :autofocus="true"
                @keydown.enter.native="handleMsg"
                @keydown.esc.native="closeChatWindow"
                ref="serachBox">
              <el-button
                  slot="append"
                  type="primary"
                  @click="handleMsg">发送</el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>


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
      chatUserName: '用户列表',
      receiver: {},
      isReloadData: true,
      receiverHeadImg: '',
      userListVisible: false,
      userList: [],
      presentUserId:  this.$session.get('user') == null ? 0 :this.$session.get('user').id,
      chatWithSaleManVisible: true,
      senderHeadImg: this.$session.get('headImg'),
      chatMsg: {
        userId: '',
        toUserId: '',
        content: ''
      },
      chatList: []
    };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {

    reload() {
      this.isReloadData = false
      this.$nextTick(() => {
        this.isReloadData = true
      })
    },

    closeChatWindow() {
      this.chatWithSaleManVisible = false;
      this.checkHaveMsg()

    },
    /**
     * 获取聊天记录
     * @param userId
     * @param toUserId
     */
    getChatCacheMsg(userId, toUserId) {
      this.chatList = [];
      this.request.post("/chat/getChatCache", {
        //参数 例 key: this.data
        chatSenderId: userId,
        chatReceiverId: toUserId
      }).then(res => {
        if (res.code == 0 && res.chatEntities != null) {
          this.chatList = res.chatEntities;
          if (res.chatEntities == null || res.chatEntities.length == 0){
            /**
             * 如果当前要聊天的用户没有聊天记录 或 第一次聊天。需要重新查询该用户然后放入userlist中
             */
            this.request.get(`/user/info/${toUserId}`, {
              params: {
                //参数
              }
            }).then(res => {
              if (res.code == 0) {
                this.userList.push(res.user)
                //需要刷新一下用户聊天列表
                this.reload();
              }
            });
          }
        }
      })
    },



    init(presentUserId,goodsId) {
      this.chatWithSaleManVisible = true
      this.presentUserId = presentUserId;
      /**
       * 根据商品id获取卖家id
       */
      this.request.get(`/goods/info/${goodsId}`, {
        params: {
          //参数
        }
      }).then(res => {
        if (res.code == 0){
          if (this.chatMsg.toUserId != '' && this.chatMsg.toUserId != res.goods.gooSenderId){
            this.chatList =[]
          }
          this.chatMsg.toUserId = res.goods.gooSenderId;
          console.log("现在是" + presentUserId + "和" + this.chatMsg.toUserId + "在聊天");
          this.request.get(`/user/info/${this.chatMsg.toUserId}`, {
            params: {
              //参数
            }

          }).then(res => {
            if (res.code == 0){
              this.receiver = res.user
              this.receiverHeadImg = res.user.userHeadImg;
            }
          });


          this.getChatCacheMsg(presentUserId,this.chatMsg.toUserId);
          this.getChatUserList();

        }
      });
    },

    systemMsg(goodsId) {
      //根据goodsId 获取到senderId之后，给对应的sender发送系统消息。
    },

    handleMsg() {
      console.log(this.chatMsg.content, "发送信息");
      if (this.chatMsg.content != "") {
        // this.list.push({ align: "right", text: this.chatContent });
        this.request.post("/chat/save", {
          //参数
          chatSenderId: this.chatMsg.userId,
          chatReceiverId: this.chatMsg.toUserId,
          chatContent: this.chatMsg.content,
          chatAlign: this.chatMsg.userId == this.presentUserId ? 'right' : 'left'
        }).then(res => {
          if (res.code == 0){
            let req = {
              userId: this.chatMsg.userId,
              content: this.chatMsg.content,
              toUser: this.chatMsg.toUserId,
            }
            if (this.ws) {
              this.ws.send(JSON.stringify(req));
            }
            this.chatMsg.content = "";
            // this.getMsg();

          }
        });
      }
    },

    scrollTop11() {
      this.$nextTick(() => {
        // 获取父盒子（肯定有滚动条）
        let div = document.getElementById("bigBox");
        div.scrollTop = div.scrollHeight // 这个时候设置scrollTop的值绝对生效
      })
    },

    joinFun(){
      let user = this.$session.get('user');
      if (user== null ||  user.id == ''){
        return;
      }
      let url = 'ws://192.168.0.14:10000/ws/' + user.id;
      this.ws = new WebSocket(url);
      this.ws.onopen = function () {
        console.log("建立 websocket 链接...."+user.id)
      };
      this.chatMsg.userId = user.id;
      var _this = this;
      this.ws.onmessage = function (event) {

        // alert("接收到消息"+event.data)
        //当有用户发送消息后，这里就会接收到消息
        // this.list.push({ align: "right", text: this.chatContent });

        if (event.data.split(':')[0] == user.id) {
          _this.chatList.push({
            align: "right",
            chatSenderId: user.id,
            chatReceiverId: _this.chatMsg.toUserId,
            chatContent: event.data.split(':')[1]
          });

        } else if (event.data.split(':')[2] == user.id) {
          _this.chatList.push({
            align: "left",
            chatSenderId: _this.chatMsg.toUserId,
            chatReceiverId: user.id,
            chatContent: event.data.split(':')[1]
          });

          _this.$emit('func')
        }

      }
      this.scrollTop11()
    },

    chatDialogClose(done) {
      this.chatWithUserList = false;
      done();
      this.chatList = [];
      this.reload();
    },


    changeChatUser(id,userName,headImg){
      this.receiverHeadImg = headImg;
      this.chatMsg.toUserId =id ;
      this.chatUserName = userName;
      this.getChatCacheMsg(this.presentUserId, id);
      this.getChatUserList();
    },

    getChatUserList(){
      this.chatWithSaleManVisible = true
      this.request.get("/chat/getChatUserList", {
        params: {
          //参数
          id: this.presentUserId
        }
      }).then(res => {
        if (res.code == 0) {
          this.userList = res.data;
        }
      });
    }
  },
//生命周期 - 创建完成(可以访问当前this实例)
  created() {
    this.joinFun();
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
    this.$nextTick(() => {
      var div = document.getElementById('bigBox');
      div.scrollTop = div.scrollHeight;
    })


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

