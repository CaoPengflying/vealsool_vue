import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/home.vue'),
      children: [
        {
          path: '/attendanceManage',
          name: 'attendanceManage',
          component: () => import('./views/attendanceManage.vue')
          // children: [{
          //   path: '/activityManage/activityDetail',
          //   name: 'activityDetail',
          //   component: () => import('./views/activityDetail.vue')
          // }]
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
        }
      ]
    },
  ]
})
