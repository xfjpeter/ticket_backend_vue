<template>
  <div class="user-list">
    <div class="toolbar">
      <el-button type="danger" @click="edit({})">添加</el-button>
    </div>

    <el-table :data="data" border>
      <el-table-column align="center" prop="nickname" label="昵称"></el-table-column>
      <el-table-column align="center" prop="username" label="账号"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
          <el-tag v-else type="warning">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="system" label="是否超管">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.system == 1" type="success">是</el-tag>
          <el-tag v-else type="warning">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" v-if="!scope.row.system" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="changePage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next" :total="total"></el-pagination>

    <el-dialog title="用户管理" :visible.sync="show" width="600px">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item prop="username" label="账号">
          <el-input v-model="ruleForm.username" :disabled="Boolean(ruleForm.system)" placeholder="请输入登录账号"></el-input>
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="ruleForm.password" placeholder="密码不修改请留空"></el-input>
        </el-form-item>

        <el-form-item prop="nickname" label="昵称">
          <el-input v-model="ruleForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>

        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="role_id" label="角色">
          <el-select v-model="ruleForm.role_id">
            <el-option v-for="v in roles" :key="v.id" :label="v.name" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="el-dialog-footer">
        <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Http from '../../until/Http'

const http = new Http

export default {
  name: 'user-index',
  data () {
    return {
      show: false,
      page: 1,
      total: 0,
      pageSize: 10,
      data: [],
      ruleForm: {},
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      roles: []
    }
  },
  created () {
    this.init()
    this.getRoles()
  },
  methods: {
    init () {
      http.get({ url: `/user?page=${this.page}&limit=${this.limit}` })
        .then(res => {
          if (!res.err_code) {
            this.data = res.data.list
            this.total = res.data.total
          }
        })
    },

    edit (row) {
      this.show = true
      this.ruleForm = row
    },

    del (row) {
      this.$confirm('确认删除么？', '提示', { type: 'warning' })
        .then(() => {
          http.delete({ url: `/user/${row.uid}` }).then(res => {
            if (!res.err_code) {
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
              this.init()
            }
          })
        })
    },

    submit (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let url = this.ruleForm.uid ? `/user/${this.ruleForm.uid}/save` : '/user'
          http.post({ url, data: this.ruleForm })
            .then(res => {
              if (!res.err_code) {
                this.$notify.success({
                  title: '提示',
                  message: '操作成功'
                })
                this.show = false
                this.init()
              }
            })
        }
      })

      return false
    },

    getRoles () {
      http.get({ url: '/role?limit=1000' }).then(res => {
        if (!res.err_code) {
          this.roles = res.data.list
        }
      })
    },

    changePage (page) {
      this.page = page
      this.init()
    }
  }
}
</script>
