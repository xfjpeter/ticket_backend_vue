<template>
  <div class="activity">
    <div class="toolbar">
      <el-button type="danger" @click="add">发布活动</el-button>
    </div>

    <el-table :data="data" border>
      <el-table-column align="center" prop="name" label="活动名称"></el-table-column>
      <el-table-column align="center" prop="unit" label="主办单位"></el-table-column>
      <el-table-column align="center" prop="logo" label="图标" width="80px">
        <template slot-scope="scope">
          <el-image style="width: 50px; height: 50px;" :src="resourcePath + scope.row.logo" lazy>
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" align="center">
        <template slot-scope="scope">
          <el-badge :value="'￥' + scope.row.price" class="item"></el-badge>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="start_time" label="开始时间"></el-table-column>
      <el-table-column align="center" prop="end_time" label="结束时间"></el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="120px">
        <template slot-scope="scope">
          <el-tag type="primary">{{scope.row.status == 1 ? '启用' : '停用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240px">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="updateSeat(scope.row)">更新座位</el-button>
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="changePage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next" :total="total"></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'activity',
  data () {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      data: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$http.get({ url: `/activity?page=${this.page}&limit=${this.pageSize}` })
        .then(res => {
          if (!res.err_code) {
            this.data = res.data.list
            this.total = res.data.total
          }
        })
    },

    // 更新座位
    updateSeat (row) {
      this.$confirm('确认更新座位么，如果已经有人购票，建议不要更新', '提示', { type: 'warning' })
        .then(() => {
          this.$http.post({ url: `/activity/update-seat`, data: { no: row.no } })
            .then(res => {
              if (!res.err_code) {
                this.$notify.success({
                  title: '提示',
                  message: '更新座位成功'
                })
              }
            })
        })
        .catch(() => { })
    },

    // 添加
    add () {
      this.$router.push('/activity/add')
    },

    // 编辑
    edit (row) {
      this.$router.push({ path: '/activity/edit', query: { no: row.no } })
    },

    // 删除
    del (row) {
      this.$confirm('确认删除么？', '提示', { type: 'warning' })
        .then(() => {
          this.$http.delete({ url: `/activity/${row.no}` })
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
    },

    changePage (page) {
      this.page = page
      this.init()
    }
  },
  computed: {
    resourcePath () {
      return process.env.VUE_APP_RESOURCE_URL
    }
  }
}
</script>
