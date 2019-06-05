<template>
  <div class="order">

    <div class="toolbar">
      <el-button type="danger" @click="exportData">导出数据</el-button>
    </div>

    <el-table :data="data" border>
      <el-table-column prop="order_no" label="订单号" align="center" width="260px"></el-table-column>
      <el-table-column prop="details.activity.name" label="活动名称" align="center"></el-table-column>
      <el-table-column prop="status" label="支付状态" width="100px">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 1" align="center">已支付</el-tag>
          <el-tag v-else-if="scope.row.status == 0">待支付</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status == 3">退款</el-tag>
          <el-tag type="danger" v-else>取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="active" label="是否兑换" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.active == 1">已兑换</el-tag>
          <el-tag type="default" v-else>待兑换</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="下单时间" align="center"></el-table-column>
      <el-table-column prop="finished_time" label="支付时间" align="center"></el-table-column>
      <el-table-column label="操作" width="80px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="changePage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next" :total="total"></el-pagination>

    <el-dialog :visible.sync="show" width="600px" v-if="details" top="5vh">
      <el-collapse v-model="activeNames" class="detail">
        <el-collapse-item title="订单信息" name="0">
          <div>
            <span>订单号：</span>{{details.order_no}}
          </div>
          <div>
            <span>价格：</span><span style="color: #F56C6C;">￥{{details.total_price}}</span>
          </div>
          <div>
            <span>激活码：</span>{{details.code}}
          </div>
        </el-collapse-item>
        <el-collapse-item title="活动信息" name="1">
          <div>
            <span>活动名称：</span>{{details.details.activity.name}}  
          </div>
          <div>
            <span>活动时间：</span>{{details.details.activity.start_time}} ~ {{details.details.activity.end_time}}
          </div>
          <div>
            <span>单价：</span><span style="color: #F56C6C;">￥{{details.details.activity.price}}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="座位信息" name="2">
          <div>
            <span>厅名称：</span>{{details.details.hall.name}}
          </div>
          <div>
            <span>座位：</span>
            <span v-for="(r, ri) in details.details.hall.sites" :key="ri">
              <el-tag size="mini" style="margin: 0 5px 5px 0;" type="primary">{{r}}</el-tag>
            </span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="提交信息" name="3">
          <div v-for="v in details.details.form" :key="v.id">
            <span>{{v.name}}：</span>{{v.value}}
          </div>
        </el-collapse-item>
        <el-collapse-item title="支付情况" name="4">
          <div>
            <span>是否支付：</span>{{getPayStatus(details.status)}}
          </div>
          <div>
            <span>支付时间：</span>{{details.finished_time}}
          </div>
        </el-collapse-item>
      </el-collapse>

      <span slot="footer" class="el-dialog-footer">
        <el-button type="primary" @click="show = !show">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'order-list',
  data () {
    return {
      activeNames: ['0', '1', '2', '3', '4'],
      show: false,
      details: '',
      data: [],
      page: 1,
      total: 0,
      pageSize: 10
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$http.get({ url: `/order?page=${this.page}&limit=${this.pageSize}` })
        .then(res => {
          if (!res.err_code) {
            this.data = res.data.list
            this.total = res.data.total
          }
        })
    },

    changePage (page) {
      this.page = page
      this.init()
    },

    showDetail (row) {
      this.show = true
      this.details = row
    },

    getPayStatus (status) {
      let text
      if (status == 0) {
        text = '待支付'
      } else if (status == 1) {
        text = '已支付'
      } else if (status == 2) {
        text = '放弃支付'
      } else {
        text = '已退款'
      }

      return text
    },

    exportData () {
      const cookie = require('js-cookie')
      const authorization = cookie.get('authorization')
      const prefix = process.env.VUE_APP_BASE_URL
      const url = `${prefix}/orders/export?authorization=${authorization}`
      window.open(url)
    }
  }
}
</script>

<style lang="stylus">
.detail {
  div {
    > span {
      &:nth-child(1) {
        color: #555;
        font-size: 14px;
      }
    }
  }
}
</style>
