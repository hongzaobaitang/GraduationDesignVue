import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import index from '../views/index.vue'
import secondHands from '../views/secondHands.vue'
import forum from '../views/forum.vue'
import activity from '../views/activity'
import selfCenter from "@/views/selfCenter";
import selfInfo from "@/views/selfInfo";
import accountSet from "@/views/accountSet";
import selfFriend from "@/views/selfFriend";
import systemSetting from "@/views/systemSetting";
import dispatching from "@/views/dispatching";
import loseAndFound from "@/views/loseAndFound";

Vue.use(VueRouter)

const routes = [


  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: '/selfCenter' ,component: selfCenter,
    children: [
      {
        path: 'selfInfo',
        component: selfInfo,

      },{
        path: 'accountSet',
        component: accountSet
      },{
        path: 'selfFriend',
        component: selfFriend
      },
      {
        path: 'systemSetting',
        component: systemSetting
      },

    ]},

    {
      path: '/loseAndFound',
      name: 'loseAndFound',
      component: loseAndFound
    },
    {
      path: '/dispatching',
      name: 'dispatching',
      component: dispatching
    },
    {
      path: '/',
      name: 'index',
      component: index
    },

    {
      path: '/selfCenter',
      name: 'selfCenter',
      component: selfCenter,
    },
    {
      path: '/activity',
      name: 'activity',
      component: activity,
    },

    {
      path: '/forum',
      name: 'forum',
      component: forum
    },
    {
      path: '/secondHands',
      name: 'secondHands',
      component: secondHands
    },

  ]

})





export default router

