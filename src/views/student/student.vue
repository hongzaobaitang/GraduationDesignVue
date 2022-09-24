<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="可通过学号/姓名进行查询" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button  type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="主键id">
      </el-table-column>
      <el-table-column
        prop="stuId"
        header-align="center"
        align="center"
        label="学号">
      </el-table-column>
      <el-table-column
        prop="stuName"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="stuGeneder"
        header-align="center"
        align="center"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="stuBirthday"
        header-align="center"
        align="center"
        label="出生日期">
      </el-table-column>
      <el-table-column
        prop="stuGrade"
        header-align="center"
        align="center"
        label="年级">
      </el-table-column>
      <el-table-column
        prop="stuMajor"
        header-align="center"
        align="center"
        label="专业">
      </el-table-column>
      <el-table-column
        prop="stuPhone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="stuHeadImg"
        header-align="center"
        align="center"
        label="头像">
        <template slot-scope="scope">
          <el-image
              style="width: 70px; height: 70px"
              :src="scope.row.stuHeadImg"
              fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="stuScore"
        header-align="center"
        align="center"
        label="得分">
      </el-table-column>
      <el-table-column
        prop="stuCreatetime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="stuUpdatetime"
        header-align="center"
        align="center"
        label="最后修改时间">
      </el-table-column>
      <el-table-column
        prop="stuDelete"
        header-align="center"
        align="center"
        label="删除状态 1代表没有删除 0代表已经被删除">
      </el-table-column>
      <el-table-column
        prop="stuPassword"
        header-align="center"
        align="center"
        label="密码">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './student-add-or-update'
  import axios from "axios";


  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    created() {
      this.getDataList()
    },
    activated () {
      this.getDataList()
    },
    methods: {


      search(){
        this.request.post("student/student/list", {
          key: this.dataForm.key
        }).then(res => {
          console.log(res.data)
          this.dataListLoading = false
        })

      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.request.get("student/student/list", {
          params: {//请求参数（条件查询）
            key: this.dataForm.key
          }
        }).then(res => {
          if (res && res.code === 0) {
            this.dataList = res.page.list
            this.totalPage = res.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })

      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/student/student/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
