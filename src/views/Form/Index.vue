<template>
  <div class="form">
    <div class="toolbar">
      <el-button type="danger" @click="edit({})">新增</el-button>
    </div>

    <el-row :gutter="20">
      <el-col style="margin-bottom: 8px;" :xl="{span: 4}" :lg="{span: 6}" :md="{span: 8}" :sm="{span: 12}" :xs="{span: 24}" :span="4" v-for="(item, index) in data" :key="index">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>{{item.name}}</span>
            <el-button style="float: right; padding: 5px 8px;" type="primary" @click="edit(item)">编辑</el-button>
            <el-button style="float: right; padding: 5px 8px; margin-right: 8px;" type="danger" @click="del(item)">删除</el-button>
          </div>
          <div v-for="(o,i) in item.content" :key="i" class="text item">
            {{(i+1) + '、' + o.name}}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="show" width="800px" title="添加|编辑表单项">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
        <el-form-item label="表单名称">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="表单项">
          <!-- 可伸缩的表单项 -->
          <el-button type="primary" size="mini" circle icon="el-icon-plus" @click="addFormItem"></el-button>
          <!-- 表单项 -->
          <el-table :data="content" border>
            <!-- <el-table-column align="center" prop="id" label="ID"></el-table-column> -->
            <el-table-column align="center" label="名称" width="160px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="请输入项的名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="字段名">
              <template slot-scope="scope">
                <el-input v-model="scope.row.field" placeholder="请输入项的字段标致，英文字母，每项不要重复"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型" width="130px">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type">
                  <el-option v-for="v in types" :key="v.value" :label="v.name" :value="v.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否必填" width="80px">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.required"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="50px">
              <template slot-scope="scope">
                <el-button circle type="danger" size="mini" icon="el-icon-minus" @click="removeFormItem(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <span slot="footer" class="el-dialog-footer">
        <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  name: 'form-index',
  data () {
    return {
      show: false,
      page: 1,
      total: 0,
      content: [],
      data: [],
      ruleForm: {},
      types: [
        {
          name: '文本框',
          value: 'text'
        }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$http.get({ url: '/form' })
        .then(res => {
          if (!res.err_code) {
            this.data = res.data.list
          }
        })
    },

    addFormItem () {
      const item = {
        id: Math.random().toString(16).substring(3),
        name: '',
        field: '',
        type: '',
        required: true
      }
      this.content ? this.content.push(item) : this.content = [item]
    },

    removeFormItem (row) {
      this.content.forEach((item, index) => {
        if (item.id === row.id) {
          this.content.splice(index, 1)
        }
      })
    },

    edit (row) {
      this.content = row.content
      this.ruleForm = row
      this.show = true
      setTimeout(() => {
        this.$refs['ruleForm'].resetFields()
      }, 200)
    },

    submit (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (!this.ruleForm.name) {
            this.$notify.error({
              title: '提示',
              message: '请输入表单名称'
            })
            return false
          } else if (this.ruleForm.status != 0 && this.ruleForm.status != 1) {
            this.$notify.error({
              title: '提示',
              message: '请选择表单状态'
            })
            return false
          }

          // 提交后台
          let url = this.ruleForm.id ? `/form/${this.ruleForm.id}/save` : '/form'
          this.ruleForm.content = this.content
          this.$http.post({ url, data: this.ruleForm })
            .then(res => {
              if (!res.err_code) {
                this.init()
                this.show = false
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
          this.$http.delete({ url: `/form/${row.id}` })
            .then(res => {
              if (!res.err_code) {
                this.$notify.success({
                  title: '提示',
                  message: '删除成功'
                })
                this.init()
              }
            })
        })
    }
  }
}
</script>
