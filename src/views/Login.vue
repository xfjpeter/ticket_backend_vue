<template>
  <div class="login">
    <el-dialog width="480px" title="登录" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item prop="username" label="账号">
          <el-input v-model="ruleForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-col :offset="3">
            <el-button type="primary" :loading="loading" @click="submit('ruleForm')">登录</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const cookie = require('js-cookie')
export default {
  name: 'login',
  data () {
    return {
      loading: false,
      dialogVisible: true,
      ruleForm: {},
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post({ url: '/login', data: this.ruleForm })
            .then(res => {
              this.loading = false
              if (!res.err_code) {
                this.$notify.success({
                  title: '提示',
                  message: '登录成功'
                })
                cookie.set('authorization', res.data.authorization)
                cookie.set('info', res.data)
                this.$router.push('/')
              } else {
                this.$notify.error({
                  title: '提示',
                  message: res.message
                })
              }
            })
            .catch(() => {
              this.loading = false
            })
        }
      })

      return false
    }
  }
}
</script>
