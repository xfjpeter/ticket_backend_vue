<template>
  <div class="rule-list">
    <div class="toolbar">
      <el-button type="danger" @click="edit({})">添加</el-button>
    </div>

    <el-table :data="data" border row-key="id">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="module" label="模块"></el-table-column>
      <el-table-column align="center" prop="controller" label="控制器"></el-table-column>
      <el-table-column align="center" prop="action" label="动作"></el-table-column>
      <el-table-column align="center" prop="method" label="请求方法"></el-table-column>
      <el-table-column prop="router" label="路由"></el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="changePage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next" :total="total"></el-pagination>

    <el-dialog :visible.sync="show" width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item prop="pid" label="父级规则">
          <el-cascader :options="options" :props="{value: 'id'}" v-model="selected" change-on-select></el-cascader>
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="ruleForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item prop="module" label="模块">
          <el-input v-model="ruleForm.module" placeholder="如：api"></el-input>
        </el-form-item>
        <el-form-item prop="controller" label="控制器">
          <el-input v-model="ruleForm.controller" placeholder="如：Test,区分大小写"></el-input>
        </el-form-item>
        <el-form-item prop="action" label="操作">
          <el-input v-model="ruleForm.action" placeholder="如：test1,全小写"></el-input>
        </el-form-item>
        <el-form-item prop="method" label="请求方法">
          <el-radio-group v-model="ruleForm.method">
            <el-radio label="get">GET</el-radio>
            <el-radio label="post">POST</el-radio>
            <el-radio label="delete">DELETE</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="ismenu" label="是否菜单">
          <el-radio-group v-model="ruleForm.ismenu">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="router" label="路由">
          <el-input v-model="ruleForm.router" placeholder="如：/test1"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="el-dialog-footer">
        <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'rule-index',
  data () {
    return {
      show: false,
      selected: [],
      page: 1,
      total: 0,
      pageSize: 10,
      data: [],
      ruleForm: {},
      rules: {
        name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入规则描述', trigger: 'blur' }],
        method: [{ required: true, message: '请选择请求方式', trigger: 'blur' }],
        ismenu: [{ required: true, message: '请选择是否菜单', trigger: 'blur' }]
      },
      options: []
    }
  },
  created () {
    this.init()

    this.getTreeRule()
  },
  methods: {
    init () {
      this.$http.get({ url: `/rule?page=${this.page}&limit=${this.limit}` }).then(res => {
        if (!res.err_code) {
          this.data = res.data.list
          this.total = res.data.total
        }
      })
    },

    getTreeRule () {
      this.$http.get({ url: '/tree/rule' }).then(res => {
        if (!res.err_code) {
          this.options = [{ id: 0, label: '顶级规则' }, ...res.data.list]
        }
      })
    },

    edit (row) {
      this.show = true
      this.ruleForm = row
    },

    submit (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let url = this.ruleForm.id ? `/rule/${this.ruleForm.id}/save` : '/rule'
          this.ruleForm.pid = this.selected.pop()
          this.$http.post({ url, data: this.ruleForm }).then(res => {
            if (!res.err_code) {
              this.show = false
              this.init()
              this.getTreeRule()
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
          this.$http.delete({ url: `/rule/${row.id}` })
            .then(res => {
              if (!res.err_code) {
                this.init()
                this.getTreeRule()
                this.$notify.success({
                  title: '提示',
                  message: '删除成功'
                })
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

