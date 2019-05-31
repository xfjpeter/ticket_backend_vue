<template>
  <div class="activity-add container-inner">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item prop="name" label="活动名称">
        <el-col :span="6">
          <el-input v-model="ruleForm.name"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item prop="address" label="活动地址">
        <el-col :span="12">
          <el-input v-model="ruleForm.address"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item prop="description" label="活动描述">
        <el-col :span="12">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item prop="unit" label="主办单位">
        <el-col :span="12">
          <el-input v-model="ruleForm.unit"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item prop="time" label="活动时间">
        <el-date-picker v-model="ruleForm.time" start-placeholder="开始日期" end-placeholder="结束日期" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>

      <el-form-item prop="logo" label="活动logo">
        <el-upload
          class="avatar-uploader"
          :action="uploadAction"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="headers">
          <img v-if="logo" :src="resourcePath + logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
     </el-form-item>

     <el-form-item prop="content" label="内容">
       <el-col :span="18">
         <vue-ueditor-wrap v-model="ruleForm.content" :config="config"></vue-ueditor-wrap>
       </el-col>
     </el-form-item>

     <el-form-item prop="price" label="价格">
       <el-col :span="4">
         <el-input type="number" v-model="ruleForm.price"></el-input>
       </el-col>
     </el-form-item>

     <el-form-item prop="status" label="状态">
       <el-radio-group v-model="ruleForm.status">
         <el-radio :label="1">开启</el-radio>
         <el-radio :label="0">关闭</el-radio>
       </el-radio-group>
     </el-form-item>

     <el-form-item prop="hall_id" label="厅(座位)">
       <el-select v-model="ruleForm.hall_id">
         <el-option v-for="v in halls" :key="v.id" :label="v.name" :value="v.id"></el-option>
       </el-select>
     </el-form-item>

     <el-form-item prop="form_id" label="表单项">
       <el-select v-model="ruleForm.form_id">
         <el-option v-for="v in forms" :key="v.id" :label="v.name" :value="v.id"></el-option>
       </el-select>
     </el-form-item>

     <el-col :offset="1">
       <el-button type="primary" @click="submit('ruleForm')">发布</el-button>
     </el-col>
    </el-form>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import cookie from 'js-cookie'
export default {
  name: 'activity-add',
  data () {
    return {
      logo: '',
      halls: [],
      forms: [],
      ruleForm: {},
      rules: {
        name: [{ required: true, message: '请输入活动的名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入活动的地址', trigger: 'blur' }],
        description: [{ required: true, message: '请输入活动的介绍文字', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入活动的主办单位', trigger: 'blur' }],
        time: [{ required: true, message: '请选择活动有效时间', trigger: 'blur' }],
        logo: [{ required: true, message: '请上传活动logo图片', trigger: 'blur' }],
        content: [{ required: true, message: '请输入活动内容介绍', trigger: 'blur' }],
        price: [{ required: true, message: '请输入活动票价', trigger: 'blur' }],
        status: [{ required: true, message: '请选择活动状态', trigger: 'blur' }],
        hall_id: [{ required: true, message: '请选择活动播放厅', trigger: 'blur' }],
        form_id: [{ required: true, message: '请选择表单项', trigger: 'blur' }]
      },
      config: {
        UEDITOR_HOME_URL: '/UEditor/',
        serverUrl: process.env.VUE_APP_RESOURCE_URL + "/UEditor/php/controller.php",
        initialFrameHeight: 400
      }
    }
  },
  created () {
    this.getHall()
    this.getForm()
  },
  methods: {
    getHall () {
      this.$http.get({ url: '/hall?type=1' })
        .then(res => {
          if (!res.err_code) {
            this.halls = res.data.list
          }
        })
    },

    getForm () {
      this.$http.get({ url: '/form?type=1' })
        .then(res => {
          if (!res.err_code) {
            this.forms = res.data.list
          }
        })
    },

    handleAvatarSuccess (res) {
      if (!res.err_code) {
        this.ruleForm.logo = res.data.path
        this.logo = res.data.path
      }
    },

    beforeAvatarUpload (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        this.$notify.warning({
          title: '提示',
          message: '只能上传jpg或png的图片'
        })
      }
    },

    submit (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.$http.post({ url: `/activity`, data: this.ruleForm })
            .then(res => {
              if (!res.err_code) {
                this.$notify.success({
                  title: '提示',
                  message: '发布成功'
                })
                this.$refs[ruleForm].resetFields()
                this.logo = ''
                this.$router.back()
              }
            })
        }
      })

      return false
    }
  },
  components: {
    VueUeditorWrap
  },
  computed: {
    uploadAction () {
      return process.env.VUE_APP_BASE_URL + '/upload/image'
    },
    resourcePath () {
      return process.env.VUE_APP_RESOURCE_URL
    },
    headers () {
      return {
        Authorization: cookie.get('authorization')
      }
    }
  }
}
</script>
<style lang="stylus">
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
