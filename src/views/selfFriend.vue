<!--  -->
<template>
  <div class="app">
    <div style="height: 800px">
      <el-table
          :data="userList.filter(userList => !search || userList.userName.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%"
          max-height="700">

        <el-table-column
            label="用户头像"
            prop="userHeadImg">
          <template slot-scope="scope">
            <el-image
                style="width: 70px; height: 70px"
                :src="scope.row.userHeadImg"
                fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column
            label="用户名"
            prop="userName">
        </el-table-column>
        <el-table-column
            label="状态"
            prop="userOnlineStatus">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.userOnlineStatus == 0" type="info">离线</el-tag>
            <el-tag v-if="scope.row.userOnlineStatus == 1" type="success">在线</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            width="300"
            align="right">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="chatWithFriend(scope.row.id,scope.row.userName,scope.row.userHeadImg)" type="primary">聊天</el-button>
            <el-button
                size="mini"
                @click="showUserInfo(scope.row.id)" type="success">查看资料</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="deleteMyFriend(scope.row.id,scope.row.userName)">删除好友</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog
        title="好友信息"
        :visible.sync="showUserInfoDialog"
        width="30%">
      <div class="block">
        <el-descriptions class="margin-top" :column="1">
          <el-descriptions-item label="头  像" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">

            <div class="block"><el-avatar shape="square" :size="50" :src="friendInfo.userHeadImg"></el-avatar></div>
          </el-descriptions-item>
          <el-descriptions-item label="账  号" :contentStyle="{'font-size': '25px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">{{ friendInfo.userId == null ? '无' : friendInfo.userId}}</el-descriptions-item>
          <el-descriptions-item label="姓  名" :contentStyle="{'font-size': '25px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">{{ friendInfo.userName == null ? '无' : friendInfo.userName}}</el-descriptions-item>
          <el-descriptions-item label="性  别" :contentStyle="{'font-size': '25px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">{{ friendInfo.userGeneder == null ? '无' : friendInfo.userGeneder}}</el-descriptions-item>
          <el-descriptions-item label="生  日" :contentStyle="{'font-size': '25px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">{{ friendInfo.userBirthday== null ? '无' : friendInfo.userBirthday }}</el-descriptions-item>
          <el-descriptions-item label="学  院" :contentStyle="{'font-size': '25px'}" :labelStyle="{'font-size': '30px','color' : '#78B7F8'}">{{ friendInfo.userMajor == null ? '无' : friendInfo.userMajor}}</el-descriptions-item>

        </el-descriptions>
      </div>
      <span slot="footer" class="dialog-footer">
       <el-button type="primary" @click="showUserInfoDialog = false">返  回</el-button>
      </span>
    </el-dialog>

    <chatWindow v-if="chatWithSaleManVisible" ref="chatWindow"></chatWindow>
  </div>
</template>

<script>
//这里可以导入其他文件(比如:组件,工具js,第三方插件js,json文件,图片文件等等）
//例如:import 《组件名称》 from '《组件路径》';

import ChatWindow from "@/views/chatWindow";
export default {
//import引入的组件需要注入到对象中才能使用
  inject:['reload'],
  components: {ChatWindow},
  data() {
    el: ".app"
    name: 'zousir'
//这里存放数据
    return {
      chatWithSaleManVisible: false,
      showUserInfoDialog: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      search: '',
      userList: [],
      friendInfo: {},
    };
  },
//监听属性 类似于data概念
  computed: {},
//监控data中的数据变化
  watch: {},
//方法集合
  methods: {

    deleteMyFriend(friendId,userName) {
      this.$confirm('您确定删除【'+userName +'】,并清空聊天记录吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.post("/friend/deleteFriend", {
          //参数 例 key: this.data
          userId: this.$session.get("presentUserId"),
          friendId: friendId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.getChatUserList();
            this.reload();
          }else{
            this.$message({
              message: '删除失败，服务器出错!',
              type: 'warning'
            })
          }
        });
      }).catch(()=>{

      });
    },

    chatWithFriend(toId,userName,headImg) {
      this.chatWithSaleManVisible = true;
      this.$nextTick(() => {
        this.$refs.chatWindow.changeChatUser(toId,userName,headImg);
      })
    },
    showUserInfo(id) {
      this.showUserInfoDialog = true;
      this.request.get(`/user/info/${id}`, {
        params: {
          //参数
        }
      }).then(res => {
        if (res.code == 0) {
          this.friendInfo = res.user;
        }
      });


    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getChatUserList()
    },
    getChatUserList(){
      this.request.get("/friend/getMyFriend", {
        params: {
          //参数
          id: this.$session.get("presentUserId")
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
    this.getChatUserList();
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

