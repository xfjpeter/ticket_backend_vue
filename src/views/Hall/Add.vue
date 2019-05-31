<template>
  <div class="hall-add container-inner">
    <div class="toolbar">
      <el-alert type="info" :closable="false">
        <template slot="title">
          <h5>座位添加说明：</h5>
          <p>1、请选择好行和列，一定要先选择好，后面变更会导致之前的重置</p>
          <p>2、# 代表过道或不可买，@ 代表已经被购买, 数字代表座位号</p>
        </template>
      </el-alert>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item prop="name" label="厅名字">
        <el-col :span="6">
          <el-input v-model="ruleForm.name" placeholder="请输入厅名字"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="行*列">
        <el-col :span="3">
          行：<el-input type="number" :min="1" v-model="rows" style="display: inline-block; width: 80px;"></el-input>
        </el-col>
        <el-col :span="3">
          列：<el-input type="number" :min="1" v-model="cols" style="display: inline-block; width: 80px;"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="座位">
        <table class="table-hall" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="border: 0;"> </td>
              <td v-for="(v, i) in sites[0]" :key="i" style="border: 0;">{{i+1}}</td>
            </tr>
            <tr v-for="(r, ri) in sites" :key="ri">
              <td style="border: 0; text-align: right; padding-right: 15px;">{{ri+1}}</td>
              <td v-for="(l, li) in r" :key="li">
                <input v-model="sites[ri][li]" style="border: 0;" :placeholder="(ri+1) + '排' + (li+1) + '座'">
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>

      <el-col :offset="3">
        <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
      </el-col>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'hall-add',
  data () {
    return {
      rows: 0,
      cols: 0,
      ruleForm: {},
      sites: [],
      rules: {
        name: [{ required: true, message: '请输入厅名字', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          // 判断有没有添加座位
          this.ruleForm.map = this.sites
          if (!this.ruleForm.map || this.ruleForm.map.length <= 0) {
            this.$notify.error({
              title: '提示',
              message: '请添加座位'
            })
            return false
          }

          this.$http.post({ url: '/hall', data: this.ruleForm })
            .then(res => {
              if (!res.err_code) {
                this.$notify.success({
                  title: '提示',
                  message: '添加成功'
                })
                this.$router.back()
              }
            })
        }
      })

      return false
    },

    generateTable () {
      if (this.rows > 0 && this.cols > 0) {
        let sites = []
        for (let i = 0; i < this.rows; i++) {
          sites[i] = []
          for (let j = 0; j < this.cols; j++) {
            sites[i][j] = this.getRowsColsVal(i, j)
          }
        }
        this.sites = sites
      }
    },

    getRowsColsVal (i, j) {
      if (this.sites[i] && this.sites[i][j]) {
        return this.sites[i][j]
      }

      return ''
    }
  },
  watch: {
    rows () {
      this.generateTable()
    },

    cols () {
      this.generateTable()
    }
  }
}
</script>
<style lang="stylus">
.table-hall td {
  width: 80px;
  // height: 80px;
  border: 1px solid #ddd;
  text-align: center;
  outline: none;

  .el-input__inner {
    border: none;
  }

  input {
    outline: none;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    width: 50px;
    text-align: center;
  }
}
</style>
