<template>
  <div class="layout">
    <el-container>
      <el-header>
        <span>权限管理系统</span>
        <div class="info" style="float: right;">
          欢迎您，<span style="color: #606266;">{{info.nickname}}</span>
          <el-button style="margin-left: 8px;" size="mini" type="danger" @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-container style="margin-top: 60px;">
        <el-aside width="200px" class="aside-bar">
          <el-menu :default-active="defaultActive" :router="true">
            <el-menu-item v-if="authMenu.includes(v.name)" v-for="v in menus" :key="v.index" :index="v.index">
              <i :class="v.icon"></i>
              <span slot="title">{{v.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main style="margin-left: 200px;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
const cookie = require('js-cookie')
export default {
  name: 'layout',
  data () {
    return {
      authMenu: [],
      menus: [
        {
          name: '规则管理',
          icon: 'el-icon-s-operation',
          index: '/'
        },
        {
          name: '用户管理',
          icon: 'el-icon-user-solid',
          index: '/user'
        },
        {
          name: '角色管理',
          icon: 'el-icon-s-custom',
          index: '/role'
        },
        {
          name: '活动管理',
          icon: 'el-icon-user',
          index: '/activity'
        },
        {
          name: '影院厅管理',
          icon: 'el-icon-film',
          index: '/hall'
        },
        {
          name: '订单管理',
          icon: 'el-icon-s-order',
          index: '/order'
        },
        {
          name: '表单管理',
          icon: 'el-icon-monitor',
          index: '/form'
        }
      ]
    }
  },
  created () {
    this.getMenu()
  },
  methods: {
    logout () {
      this.$confirm('确认退出么？', '提示', { type: 'warning' })
        .then(() => {
          cookie.remove('authorization')
          cookie.remove('info')
          cookie.remove('menu')
          this.$router.push('/login')
          this.$notify.success({
            title: '提示',
            message: '退出成功'
          })
        })
        .catch(() => { })
    },

    loadMenu () {
      // 获取菜单列表
      this.$http.get({ url: '/menu' }).then(res => {
        if (!res.err_code) {
          const cookie = require('js-cookie')
          cookie.set('menu', res.data)
        }
      })
    },

    getMenu () {
      this.$http.get({ url: '/menu' }).then(res => {
        if (!res.err_code) {
          let menu = []
          const menus = res.data
          menus.map(item => {
            menu.push(item.label)
          })

          this.authMenu = menu
        }
      })
    }
  },
  computed: {
    info () {
      return JSON.parse(cookie.get('info'))
    },

    defaultActive () {
      return this.$route.matched[0].path || '/'
    }
  }
}
</script>
