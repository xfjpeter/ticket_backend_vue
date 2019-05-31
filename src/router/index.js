import VueRouter from 'vue-router'
import Vue from 'vue'
import ErrorIndex from '@/views/Error/Index'
import Login from '@/views/Login'
import Layout from '@/views/Layout'
import RuleIndex from '@/views/Rule/Index'
import RoleIndex from '@/views/Role/Index'
import UserIndex from '@/views/User/Index'
import ActivityIndex from '@/views/Activity/Index'
import ActivityAdd from '@/views/Activity/Add'
import ActivityEdit from '@/views/Activity/Edit'
import HallIndex from '@/views/Hall/Index'
import HallAdd from '@/views/Hall/Add'
import HallEdit from '@/views/Hall/Edit'
import OrderIndex from '@/views/Order/Index'
import FormIndex from '@/views/Form/Index'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          component: RuleIndex
        }
      ]
    },
    {
      path: '/user',
      component: Layout,
      children: [
        {
          path: '',
          component: UserIndex
        }
      ]
    },
    {
      path: '/role',
      component: Layout,
      children: [
        {
          path: '',
          component: RoleIndex
        }
      ]
    },
    {
      path: '/activity',
      component: Layout,
      children: [
        {
          path: '',
          component: ActivityIndex
        },
        {
          path: 'add',
          component: ActivityAdd
        },
        {
          path: 'edit',
          component: ActivityEdit
        }
      ]
    },
    {
      path: '/hall',
      component: Layout,
      children: [{
        path: '',
        component: HallIndex
      }, {
        path: 'add',
        component: HallAdd
      }, {
        path: 'edit',
        component: HallEdit
      }]
    },
    {
      path: '/order',
      component: Layout,
      children: [
        {
          path: '',
          component: OrderIndex
        }
      ]
    },
    {
      path: '/form',
      component: Layout,
      children: [
        {
          path: '',
          component: FormIndex
        }
      ]
    },
    {
      path: '*',
      component: Layout,
      children: [
        {
          path: '',
          component: ErrorIndex
        }
      ]
    },
  ]
})