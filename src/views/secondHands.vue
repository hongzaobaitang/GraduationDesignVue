<template>
<div class="app">
  <el-row>
    <el-col :span="2"><el-button class="share-button" style="width: 110px;position: relative;top: -15px" type="primary" @click="getMySaleList()">我卖出的<i class="el-icon-s-order el-icon&#45;&#45;right"></i></el-button></el-col>
    <el-col :span="2"><el-button style="width: 110px;position: relative;top: -15px;" type="primary" @click="getMyBuyList()">我买到的<i class="el-icon-s-order el-icon&#45;&#45;right"></i></el-button></el-col>
    <el-col :span="2"><el-button style="width: 110px;position: relative;top: -15px;" type="primary" @click="showSaleForm()">闲置出售<i class="el-icon-upload2 el-icon&#45;&#45;right"></i></el-button></el-col>
    <el-col :span="2" :offset="12">
      <el-input placeholder="试试搜索:手机" @keypress.native.enter="getAllGoods" clearable @clear="checkIsNull" @input="checkIsNull" v-model="key" class="input-with-select" style="width: 300px;position: relative;top: -15px;">
        <el-button type="primary" slot="append" icon="el-icon-search" @click="getAllGoods" ></el-button>
      </el-input>
    </el-col>
  </el-row>
<!--  <el-button class="share-button" style="width: 110px;position: relative;top: -15px;right: -15px" type="primary" @click="getMySaleList()">我卖出的<i class="el-icon-s-order el-icon&#45;&#45;right"></i></el-button>-->
<!--  <el-button style="width: 110px;position: relative;top: -15px;right: -15px" type="primary" @click="getMyBuyList()">我买到的<i class="el-icon-s-order el-icon&#45;&#45;right"></i></el-button>-->
<!--  <el-button style="width: 110px;position: relative;top: -15px;right: -15px" type="primary" @click="showSaleForm()">闲置出售<i class="el-icon-upload2 el-icon&#45;&#45;right"></i></el-button>-->

  <div style="height: 690px;position: relative;top: 0px;right: 0px; display: flex ;background-color: #F2F6FC" class="cab" >
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
          <el-col style="position: relative;margin-top: 10px" :span=6 v-for="(item,index) in goods"  >
            <el-card :body-style="{ padding: '0px' }" style="width: 270px">
              <img :src=" item.gooImg " class="image" style="width: 270px;height: 250px">
              <div  style="padding: 14px;">
                <span>{{ item.gooName }}</span>
                <div class="bottom clearfix">
                  <label style="font-family: 'Adobe 黑体 Std R';color: red">￥:{{ item.gooPrice }}</label>

                  <el-button v-if="item.gooSenderId != presentUserId" type="text" class="btn" @click="checkMyOrder(item.id)">购买</el-button>
                  <el-button type="text" class="btn" @click="showGoodsDetailInfo(item.id)" >查看详情</el-button>

                  <el-button v-if="item.gooSenderId != presentUserId  " type="text" class="btn" @click="chatWithSaleMan(item.id)">与卖家交流</el-button>
                  <el-tag v-if="item.gooSenderId == presentUserId" type="success">我上架的</el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-scrollbar>
  </div>


      <el-dialog title="闲置出售" :visible.sync="saleFormVisible" style="width: 1000px;left: 350px;top: 20px"  :close-on-click-modal="false" >
        <el-form :rules="saleRules" :model="saleForm" class="demo-ruleForm" ref="saleForm">
          <el-form-item  label="商品名" :label-width="formLabelWidth" prop="goodsName">
            <el-input prefix-icon="el-icon-goods" placeholder="如：华为手机" v-model="saleForm.goodsName"  autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="商品图片" :label-width="formLabelWidth" prop="goodsImg">
            <single-upload v-model="saleForm.goodsImg"></single-upload>
          </el-form-item>
          <el-form-item  label="商品描述" :label-width="formLabelWidth" prop="describe" >
            <el-input   maxlength="30" show-word-limit type="textarea"
                      :rows="3" resize="none" prefix-icon="el-icon-user" v-model="saleForm.describe"  autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>

          <el-form-item  label="价格" :label-width="formLabelWidth" prop="price">
            <el-input prefix-icon="el-icon-star-off" v-model.number="saleForm.price"  autocomplete="off" style="width: 270px"></el-input>
          </el-form-item>
        </el-form>

        <div>
          <el-button @click="saleFormVisible = false" style="position: relative;left: 100px">取消</el-button>
          <el-button type="primary"  @click="addGoods('saleForm')" style="position: relative;left: 230px">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="我卖出的" :visible.sync="saleListVisible">
        <el-table stripe
                  style="width: 100%"
                  max-height="450"
                  :data="saleList">
          <el-table-column property="gooName" label="商品名" width="150"></el-table-column>
          <el-table-column property="gooImg" label="商品图片" width="150">
            <template slot-scope="scope">
              <el-image
                  style="width: 70px; height: 70px"
                  :src="scope.row.gooImg"
                  fit="contain"></el-image>
            </template>
          </el-table-column>
          <el-table-column property="gooDescribe" label="描述"></el-table-column>
          <el-table-column property="gooCreatetime" label="上架时间" width="150"></el-table-column>
          <el-table-column property="gooStatus" label="售出时间">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.gooStatus == 0" type="danger">
                {{ scope.row.gooBuyTime}}
              </el-tag>
              <el-tag v-if="scope.row.gooStatus == 1" type="success">
                未售
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
            <template slot-scope="scope">
<!--              <el-button type="text" size="small" @click="updateMySaleGoods(scope.row.id)">修改</el-button>-->
              <el-button v-if="scope.row.gooStatus == 1" type="text" size="small" @click="deleteMySaleGoods(scope.row.id)">下架</el-button>
              <el-button v-if="scope.row.gooStatus == 0" type="text" size="small" @click="deleteMySaleGoods(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

  <el-dialog title="我买到的" :visible.sync="buyListVisible">
    <el-table :data="buyList" max-height="450">
      <el-table-column property="gooName" label="商品名" width="150"></el-table-column>
      <el-table-column property="gooImg" label="商品图片" width="150">
        <template slot-scope="scope">
          <el-image
              style="width: 70px; height: 70px"
              :src="scope.row.gooImg"
              fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column property="gooDescribe" label="描述" ></el-table-column>
      <el-table-column property="gooBuyTime" label="购买时间" width="200"></el-table-column>
      <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showOrderMsg(scope.row.id)">订单信息</el-button>
          <el-button type="text" size="small" @click="deleteMyBuyGoods(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog title="订单信息" :visible.sync="orderMsgVisible">
    <el-descriptions direction="vertical" :column="4" border>
      <el-descriptions-item label="姓名">{{ this.userInfo.userName }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ this.userInfo.userPhone }}</el-descriptions-item>
      <el-descriptions-item label="收货地址" :span="2">{{ this.orderMsg.orderLocation }}</el-descriptions-item>
      <el-descriptions-item label="备注" v-if="this.orderMsg.orderUserRemarks == null">
        空
      </el-descriptions-item>
      <el-descriptions-item label="备注" v-if="this.orderMsg.orderUserRemarks != null">
        {{ this.orderMsg.orderUserRemarks  }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>


  <el-dialog title="商品详情" :visible.sync="goodsDetailInfoVisible">
    <el-descriptions direction="vertical" :column="2" border>
      <el-descriptions-item label="商品名"> {{ this.goodsDetailInfo.gooName}} </el-descriptions-item>
      <el-descriptions-item label="商品图片">
        <el-image
            style="width: 100px; height: 100px"
            :src="this.goodsDetailInfo.gooImg"
            ></el-image>
      </el-descriptions-item>

      <el-descriptions-item label="商品描述" :span="2">{{ this.goodsDetailInfo.gooDescribe }}</el-descriptions-item>
      <el-descriptions-item label="商品价格" > {{ this.goodsDetailInfo.gooPrice }}</el-descriptions-item>
      <el-descriptions-item label="上架时间"> {{ this.goodsDetailInfo.gooCreatetime }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <el-dialog title="填写信息" :visible.sync="orderVisible" style="width: 1000px;left: 350px;top: -20px">
    <el-form :rules="orderRules" :model="orderInfo" class="demo-ruleForm" ref="orderInfo">
      <el-form-item  label="姓名" :label-width="formLabelWidth" prop="userName">
        <el-input prefix-icon="el-icon-user" placeholder="请填写购买人姓名" v-model="orderInfo.userName"  autocomplete="off" style="width: 270px"></el-input>
      </el-form-item>

      <el-form-item  label="电话" :label-width="formLabelWidth" prop="userPhone">
        <el-input prefix-icon="el-icon-phone" placeholder="请填写联系手机号" v-model.number="orderInfo.userPhone"  autocomplete="off" style="width: 270px"></el-input>
      </el-form-item>

      <el-form-item  label="收货地点" :label-width="formLabelWidth" prop="location" >
        <el-input   maxlength="50" show-word-limit type="textarea"
                    :rows="3" resize="none"  v-model="orderInfo.location"  autocomplete="off" style="width: 270px"></el-input>
      </el-form-item>

      <el-form-item  label="备注" :label-width="formLabelWidth" >
        <el-input   maxlength="30" show-word-limit type="textarea"
                    :rows="3" resize="none" v-model="orderInfo.userRemarks"  autocomplete="off" style="width: 270px"></el-input>
      </el-form-item>

      <el-form-item  label="商品名" :label-width="formLabelWidth">
        <el-input :disabled="true" prefix-icon="el-icon-goods" placeholder="如：华为手机" v-model="orderInfo.goods.gooName"  autocomplete="off" style="width: 270px"></el-input>
      </el-form-item>
      <el-form-item  label="价格" :label-width="formLabelWidth">
        <el-input :disabled="true" prefix-icon="el-icon-star-off" v-model.number="orderInfo.goods.gooPrice"  autocomplete="off" style="width: 270px"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="" style="position: relative;left: 100px">取消</el-button>
      <el-button type="primary"  @click="buyIt" style="position: relative;left: 230px">确 定</el-button>
    </div>
  </el-dialog>


  <chatWindow v-if="chatWithSaleManVisible" ref="chatWindow"></chatWindow>
</div>


</template>

<script>
import SingleUpload from "../components/upload/singleUpload";
import chatWindow from "@/views/chatWindow";
export default {
  components: { SingleUpload,chatWindow },
  data () {
    return {
      presentUserId: this.$session.get("presentUserId") == null ? 0 : this.$session.get("presentUserId"),
      senderHeadImg: this.$session.get('headImg'),
      chatMsg: {
        userId: '',
        toUserId: '',
        content: ''
      },

      goodsDetailInfoVisible: false,
      isBot: false,
      chatList: [],
      chatContent: '',
      chatWithSaleManVisible: false,
      orderInfo: {
        userName: '',
        userPhone: '',
        userRemarks: '', //用户备注
        location: '',
        goods: {
          //商品信息
        }
      },
      buyListVisible: false,
      orderVisible: false,
      gutterNum: 60,
      userRole: '',
      orderMsgVisible: false,
      show: false,
      saleFormVisible: false,
      saleListVisible: false,
      userInfo: {},
      orderMsg: {},
      key: '',
      ws: '',
      goodsDetailInfo: {}, //商品详情信息
      currentDate: new Date(),
      saleList: [{}],
      buyList: [{}],
      formLabelWidth: '120px',
      chatWithUserList: false,
      saleForm: {
        username: '',
        goodsImg: '',
        describe: '',
        price: '',
      },
      goods: [{
      }],
      orderRules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        location: [
          { required: true, message: '请输入收货地址', trigger: 'blur' },
        ],
        userPhone:[
          {required:true,message: "请输入手机号码", trigger: "blur"},
          {pattern:/(^((\+86)|(86))?(1[3-9])\d{9}$)|(^(0\d{2,3})-?(\d{7,8})$)/, message: '输入的手机号码格式不正确，请重新输入',trigger:'blur'}],
      },
      saleRules: {
        goodsName: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
        ],
        goodsImg:[
          { required: true, message: '请添加商品图片' },
        ],
        describe:[
          { required: true, message: '请添加商品描述', trigger: 'blur' },
        ],
        price:[
          {  required: true, message: '请输入商品价格', trigger: 'blur' },
          {  type: 'number', message: '价格必须为正数'}
        ]
      },
    }
  },
  methods: {


    MyMsgList() {
      this.isBot = false;
    },


    chatWithSaleMan(goodsId){
      if(this.checkLogin()){
        this.chatWithSaleManVisible = true;
        this.$nextTick(() => {
          this.$refs.chatWindow.init(this.chatMsg.userId,goodsId)
        })
      }else{
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        });
      }
    },

    /**
     * 购买成功后给卖家发消息
     */
    sendMessageToSaleMan(saleManId , buyManId) {
      this.request.post("/chat/save", {
        //参数 例 key: this.data
        chatSenderId: buyManId,
        chatReceiverId: saleManId,
        chatContent: "我购买了您的商品，请尽快发货。订单信息:收货人:" + this.userInfo.userName + ",联系电话:" + this.userInfo.userPhone + ",地址" + this.orderInfo.location +
            ",备注:" + this.orderInfo.userRemarks,
        chatAlign: 'right'
      }).then(res => {

      });


    },

    /**
     * 查看订单信息
     */
    showOrderMsg(id) {
      this.orderMsgVisible = true;
      this.request.get('/order/getOrderByGoodsId', {
        params: {
          //参数
          id: id
        }

      }).then(res => {
        if (res.code == 0) {
          this.orderMsg = res.order;
        }
      });


    },

    /**
     * 购买
     */
    buyIt() {
      if (this.checkLogin()) {
        this.request.post("/order/buyGoods", {
          //参数
          orderGoodsId: this.orderInfo.goods.id,
          orderUserId: this.userInfo.id,
          orderUserPhone: this.orderInfo.userPhone,
          orderUserRemarks: this.orderInfo.userRemarks,
          orderLocation: this.orderInfo.location

        }).then(res => {
          if (res.code == 0){
            this.orderVisible = false;
            this.$message({
              message: '购买成功',
              type: 'success'
            });
            //购买成功后需要给卖家发个消息
            this.sendMessageToSaleMan(this.orderInfo.goods.gooSenderId,this.userInfo.id)
            setTimeout(function()  {
              location.reload();
            }, 1000);
            // this.sendMessageToSaleMan(this.orderInfo.goods.id, this.userInfo.id);
          }else{
            this.$message({
              message: '购买失败,请刷新页面后重试',
              type: 'warning'
            });
          }
        });
      }

    },



    /**
     * 填写购买资料
     */
    checkMyOrder(goodsId) {
      if (this.checkLogin()){
        this.orderVisible = true;
        this.request.get(`/goods/info/${goodsId}`, {
          params: {
          }
        }).then(res => {
          if (res.code == 0) {
            this.orderInfo.goods = res.goods;

          }
        });
        this.orderInfo.userName = this.userInfo.userName;
      }else {
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        });
      }
    },

    showGoodsDetailInfo(id) {
      this.goodsDetailInfoVisible = true;
      this.request.get(`/goods/info/${id}`, {
        params: {
          //参数
        }

      }).then(res => {
        if (res.code == 0) {
          this.goodsDetailInfo = res.goods;
        }
      });


    },

    /**
     * 获取我买到的商品列表
     *
     */
    getMyBuyList() {
      if (this.checkLogin()) {
        this.buyListVisible = true;
        this.request.get("/goods/getMyBuyList", {
          params: {
            //参数
            userId: this.userInfo.id
          }
        }).then(res => {
          if (res.code == 0) {
            this.buyList = res.data;
          }else if (res.code == 1){
            this.$message({
              message: '系统错误',
              type: 'error'
            });
          }
        });
      } else {
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        });
      }
    },

    updateMySaleGoods() {

    },

    /**
     * 删除购买记录
     */
    deleteMyBuyGoods() {


    },
    /**
     * 下架操作
     * @param id 商品id，
     */
    deleteMySaleGoods(id) {
      this.$confirm(`确定下架该商品?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.get("/goods/deleteMySaleGoods", {
          params: {
            //参数
            id: id
          }
        }).then(res => {
          if (res.code == 0){
            this.$message({
              message: '下架成功',
              type: 'success'
            });
          }else{
            this.$message({
              message: '系统错误',
              type: 'warning'
            });
          }
          this.getMySaleList();
          this.getAllGoods()
        });

      })
    },

    getMySaleList() {
      if (this.checkLogin()){
        this.saleListVisible = true;
        this.request.get("/goods/getMySaleList", {
          params: {
            //参数
            gooSenderId: this.userInfo.id,
          }
        }).then(res => {
          if (res.code == 0){
            this.saleList = res.data
          }
        });
      }else {
        this.$message({
              message: '您还未登录，请先登录',
              type: 'warning'
        });
      }

    },


    checkLogin() {
      if (this.$session.get('user' )== null){
        return false;
      }else{
        this.userInfo = this.$session.get('user') ;
        this.chatMsg.userId = this.userInfo.id;
        return true;
      }
    },

    showSaleForm(){
      if(this.checkLogin()){
        this.saleFormVisible = true;
      }else{
        this.$message({
          message: '您还未登录，请先登录',
          type: 'warning'
        });
      }

    },
    /**
     * 上架
     * @param formName
     */
    addGoods(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.request.post("/goods/save", {
            gooName: this.saleForm.goodsName,
            gooImg: this.saleForm.goodsImg,
            gooSenderId: this.userInfo.id,
            gooPrice: this.saleForm.price,
            gooDescribe: this.saleForm.describe
            //参数 例 key: this.data
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: '商品上架成功',
                type: 'success'
              });
              this.saleForm.goodsName = '';
              this.saleForm.goodsImg = '';
              this.saleForm.price = '';
              this.saleForm.describe = '';
              this.getAllGoods()
              this.saleFormVisible = false;
            }
          });
        }
      })
    },

    getAllGoods() {
      this.request.get("/goods/getAllGoods", {
        params: {
          //参数
          key: this.key
        }
      }).then(res => {
        if (res.code == 0){
          this.goods = res.data
          if (this.goods.length < 4){
            this.gutterNum = 380
          }else{
            this.gutterNum = 60
          }
        }
      });
    },
    checkIsNull(){
      if (this.key == ''){
        this.getAllGoods();
      }
    },

  },

  updated() {

  },

  created() {
    this.getAllGoods();
  }

}
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 300px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.cab .is-horizontal{
  display: none;
}

.cab .el-scrollbar__wrap {
  overflow-x: hidden;
}

 </style>