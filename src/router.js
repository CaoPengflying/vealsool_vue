import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('./views/home.vue'),
      children: [
        {
          path: '/attendanceManage',
          name: 'attendanceManage',
          component: () => import('./views/attendanceManage.vue')
        },
        {
          path: '/studentManage',
          name: 'studentManage',
          component: () => import('./views/studentManage.vue')
        },
        {
          path: '/gradeManage',
          name: 'gradeManage',
          component: () => import('./views/gradeManage.vue')
        },
        {
          path: '/ruleManage',
          name: 'ruleManage',
          component: () => import('./views/ruleManage.vue')
        },
        {
          path: '/studentCreditsFlowManage',
          name: 'studentCreditsFlowManage',
          component: () => import('./views/studentCreditsFlowManage.vue')
        },
        {
          path: '/studentFileManage',
          name: 'studentFileManage',
          component: () => import('./views/studentFileManage.vue')
        },
        {
          path: '/userManage',
          name: 'userManage',
          component: () => import('./views/userManage.vue')
        },
        {
          path: '/calcRuleManage',
          name: 'calcRuleManage',
          component: () => import('./views/calcRuleManage.vue')
        },
        {
          path: '/studentScoreManage',
          name: 'studentScoreManage',
          component: () => import('./views/studentScoreManage.vue')
        }
      ]
    },{
      path: '/',
      name: 'login',
      component: () => import('./views/login.vue'),
    },{
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue'),
    }
  ]
})
