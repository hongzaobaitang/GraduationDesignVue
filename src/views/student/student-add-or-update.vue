<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="学号" prop="stuId">
      <el-input v-model="dataForm.stuId" placeholder="学号"></el-input>
    </el-form-item>
      <el-form-item label="密码" prop="stuPassword">
        <el-input v-model="dataForm.stuPassword" placeholder="密码"></el-input>
      </el-form-item>
    <el-form-item label="姓名" prop="stuName">
      <el-input v-model="dataForm.stuName" placeholder="姓名"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="stuGeneder">
      <div>
        <el-radio v-model="dataForm.stuGeneder" label="1" border>男</el-radio>
        <el-radio v-model="dataForm.stuGeneder" label="2" border>女</el-radio>
      </div>
    </el-form-item>
    <el-form-item label="出生日期" prop="stuBirthday">
      <div class="block">
        <el-date-picker
            v-model="dataForm.stuBirthday"
            type="date"
            placeholder="选择日期">
        </el-date-picker>
      </div>
    </el-form-item>
    <el-form-item label="年级" prop="stuGrade">
      <el-input v-model="dataForm.stuGrade" placeholder="年级"></el-input>
    </el-form-item>
    <el-form-item label="专业" prop="stuMajor">
      <el-input v-model="dataForm.stuMajor" placeholder="专业"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="stuPhone">
      <el-input v-model="dataForm.stuPhone" placeholder="手机号"></el-input>
    </el-form-item>
    <el-form-item label="头像" prop="stuHeadImg">
      <single-upload v-model="dataForm.stuHeadImg"></single-upload>
    </el-form-item>
    <el-form-item label="得分" prop="stuScore">
      <el-input v-model="dataForm.stuScore" placeholder="得分"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="stuCreatetime">
      <el-input v-model="dataForm.stuCreatetime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="最后修改时间" prop="stuUpdatetime">
      <el-input v-model="dataForm.stuUpdatetime" placeholder="最后修改时间"></el-input>
    </el-form-item>
    <el-form-item label="删除状态 1代表没有删除 0代表已经被删除" prop="stuDelete">
      <el-input v-model="dataForm.stuDelete" placeholder="删除状态 1代表没有删除 0代表已经被删除"></el-input>
    </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<script>
import SingleUpload from "../../components/upload/singleUpload";
  export default {
    components: { SingleUpload },
    data () {
      return {
        imageUrl: '',
        geneder: '',
        visible: false,
        birthday: '',
        dataForm: {
          id: 0,
          stuId: '',
          stuName: '',
          stuGeneder: '',
          stuBirthday: '',
          stuGrade: '',
          stuMajor: '',
          stuPhone: '',
          stuHeadImg: '',
          stuScore: '',
          stuCreatetime: '',
          stuUpdatetime: '',
          stuDelete: '',
          stuPassword: ''
        },
        dataRule: {
          stuId: [
            { required: true, message: '学号不能为空', trigger: 'blur' }
          ],
          stuName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          stuGeneder: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          stuBirthday: [
            { required: true, message: '出生日期不能为空', trigger: 'blur' }
          ],
          stuGrade: [
            { required: true, message: '年级不能为空', trigger: 'blur' }
          ],
          stuMajor: [
            { required: true, message: '专业不能为空', trigger: 'blur' }
          ],
          stuPhone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          stuHeadImg: [
            { required: true, message: '头像不能为空', trigger: 'blur' }
          ],
          stuScore: [
            { required: true, message: '得分不能为空', trigger: 'blur' }
          ],
          stuCreatetime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          stuUpdatetime: [
            { required: true, message: '最后修改时间不能为空', trigger: 'blur' }
          ],
          stuDelete: [
            { required: true, message: '删除状态 1代表没有删除 0代表已经被删除不能为空', trigger: 'blur' }
          ],
          stuPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.request.get(`/student/student/info/${this.dataForm.id}`, {
                       param: {
                        //参数
                       }

                    }).then(data => {
                        if (data && data.code === 0) {
                          this.dataForm.stuId = data.student.stuId
                          this.dataForm.stuName = data.student.stuName
                          this.dataForm.stuGeneder = data.student.stuGeneder
                          this.dataForm.stuBirthday = data.student.stuBirthday
                          this.dataForm.stuGrade = data.student.stuGrade
                          this.dataForm.stuMajor = data.student.stuMajor
                          this.dataForm.stuPhone = data.student.stuPhone
                          this.dataForm.stuHeadImg = data.student.stuHeadImg
                          this.dataForm.stuScore = data.student.stuScore
                          this.dataForm.stuCreatetime = data.student.stuCreatetime
                          this.dataForm.stuUpdatetime = data.student.stuUpdatetime
                          this.dataForm.stuDelete = data.student.stuDelete
                          this.dataForm.stuPassword = data.student.stuPassword
                        }
                    })


          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/student/student/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'stuId': this.dataForm.stuId,
                'stuName': this.dataForm.stuName,
                'stuGeneder': this.dataForm.stuGeneder,
                'stuBirthday': this.dataForm.stuBirthday,
                'stuGrade': this.dataForm.stuGrade,
                'stuMajor': this.dataForm.stuMajor,
                'stuPhone': this.dataForm.stuPhone,
                'stuHeadImg': this.dataForm.stuHeadImg,
                'stuScore': this.dataForm.stuScore,
                'stuCreatetime': this.dataForm.stuCreatetime,
                'stuUpdatetime': this.dataForm.stuUpdatetime,
                'stuDelete': this.dataForm.stuDelete,
                'stuPassword': this.dataForm.stuPassword
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
