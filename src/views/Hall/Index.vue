<template>
  <div class="hall">
    <div class="toolbar">
      <el-button type="danger" @click="add">添加厅</el-button>
    </div>

    <el-table :data="data" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="primary">{{scope.row.status == 1 ? '启用' : '禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
          <el-button type="warning" size="mini" @click="lookMap(scope.row)">座位图</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="座位图" :visible.sync="show" fullscreen>
      <el-alert type="info" :closable="false">
        <template slot="title">
          <h5>座位说明：</h5>
          <p>1、请选择好行和列，一定要先选择好，后面变更会导致之前的重置</p>
          <p>2、# 代表过道或不可买，@ 代表已经被购买, 数字代表座位号</p>
        </template>
      </el-alert>
      <table class="table-hall" cellspacing="0" cellpadding="0" border="0">
        <tbody>
          <tr>
            <td style="border: 0;"> </td>
            <td v-for="(v, i) in sites[0]" :key="i" style="border: 0;">{{i+1}}</td>
          </tr>
          <tr v-for="(r, ri) in sites" :key="ri">
            <td style="border: 0; text-align: right; padding-right: 15px; padding-top:10px; display: block; width: 20px;">{{ri+1}}</td>
            <td v-for="(l, li) in r" :key="li">
              <input readonly v-model="l.no" style="border: 0;">
            </td>
          </tr>
        </tbody>
      </table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'hall',
  data () {
    return {
      show: false,
      sites: [],
      data: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$http.get({ url: '/hall' }).then(res => {
        if (!res.err_code) {
          this.data = res.data.list
        }
      })
    },
    add () {
      this.$router.push('/hall/add')
    },

    edit (row) {
      this.$router.push({ path: '/hall/edit', query: { id: row.id } })
    },

    lookMap (row) {
      this.sites = row.map
      this.show = true
    },

    del (row) {
      this.$confirm('确认删除么？', '提示', { type: 'warning' })
        .then(() => {
          this.$http.delete({ url: `/hall/${row.id}` })
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
        .catch(() => { })
    }
  }
}
</script>
