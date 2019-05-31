<template>
  <div class="role-list">
    <div class="toolbar">
      <el-button type="danger" @click="edit({})">添加</el-button>
    </div>

    <el-table :data="data" border>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="description" label="描述"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
          <el-tag v-else type="warning">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-button size="mini" :disabled="Boolean(scope.row.id == 1)" type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="changePage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next" :total="total"></el-pagination>

    <el-dialog title="角色管理" :visible.sync="show" width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item prop="name" label="名称">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item prop="description" label="描述">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>

        <el-form-item prop="rule_id" label="权限">
          <el-tree ref="tree" :data="authRules" node-key="id" :show-checkbox="true"></el-tree>
        </el-form-item>
      </el-form>

      <span slot="footer" class="el-dialog-footer">
        <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setTimeout } from 'timers'

export default {
  name: 'role-index',
  data () {
    return {
      show: false,
      page: 1,
      total: 0,
      pageSize: 10,
      data: [],
      ruleForm: {},
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      authRules: []
    }
  },
  created () {
    this.init()
    this.getRules()
  },
  methods: {
    init () {
      this.$http.get({ url: `/role?page=${this.page}&limit=${this.limit}` }).then(res => {
        if (!res.err_code) {
          this.data = res.data.list
          this.total = res.data.total
        }
      })
    },

    getRules () {
      this.$http.get({ url: '/tree/rule' }).then(res => {
        if (!res.err_code) {
          this.authRules = res.data.list
        }
      })
    },

    edit (row) {
      this.show = true
      this.ruleForm = row
      if (row.id) {
        setTimeout(() => {
          this.$refs.tree.setCheckedKeys(row.rule_id.split(','))
        }, 100)
      }
    },

    submit (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.ruleForm.rule_id = this.$refs.tree.getCheckedKeys().join(',')
          let url = this.ruleForm.id ? `/role/${this.ruleForm.id}/save` : '/role'
          this.$http.post({ url, data: this.ruleForm })
            .then(res => {
              if (!res.err_code) {
                this.show = false
                this.init()
                this.$parent.$parent.$parent.$parent.getMenu()
                this.$notify.success({
                  title: '提示',
                  message: '操作成功'
                })
              }
            })
        }
      })

      return false
    },

    del (row) {
      this.$confirm('确认删除么？', '提示', { type: 'warning' })
        .then(() => {
          this.$http.delete({ url: `/role/${row.id}` }).then(res => {
            if (!res.err_code) {
              this.$notify.success({
                title: '提示',
                message: '删除成功',
                duration: 1000
              })
              this.init()
            }
          })
        })
        .catch(() => { })
    },

    changePage (page) {
      this.page = page
      this.init()
    }
  }
}
</script>
