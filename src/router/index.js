import Vue from 'vue';
import VueRouter from 'vue-router';
// 注意点：通过 import xxx from xxx的方式加载组件，无论组件有没有被用到，都会被加载进来
// import Recommend from '../views/Recommend';
// import Singer from '../views/Singer';
// import Rank from '../views/Rank';
// import Search from '../views/Search';

// 实现Vue的按需加载
const Recommend = (resolve) => {
  import('../views/Recommend').then((module) => {
    resolve(module);
  });
};

const Detail = (resolve) => {
  import('../views/Detail').then((module) => {
    resolve(module);
  });
};

const Singer = (resolve) => {
  import('../views/Singer').then((module) => {
    resolve(module);
  });
};

const Rank = (resolve) => {
  import('../views/Rank').then((module) => {
    resolve(module);
  });
};

const Search = (resolve) => {
  import('../views/Search').then((module) => {
    resolve(module);
  });
};

const Account = (resolve) => {
  import('../views/Account').then((module) => {
    resolve(module);
  });
};

const User = (resolve) => {
  import('../views/User').then((module) => {
    resolve(module);
  });
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: 'detail/:id/:type',
        component: Detail
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: 'detail/:id/:type',
        component: Detail
      }
    ]
  },
  {
    path: '/rank',
    component: Rank,
    children: [
      {
        path: 'detail/:id/:type',
        component: Detail
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/account',
    component: Account,
    children: [
      {
        path: 'user',
        component: User,
        children: [
          {
            path: 'detail/:id/:type',
            component: Detail
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  // 如果使用的是history模式，打包之后上线到服务器中运行时是不能刷新的，刷新就会报404
  // 注意点：如果需要使用预渲染的插件，那么Router的模式必须是history模式
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

export default router;
