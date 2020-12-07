import router from './index';
import {getToKen} from '@/utils/app';
import { removeUserName,removeToken } from '../utils/app';
import store from '../store/index';

const whiteRouter = ['/login']

// 路由守卫
router.beforeEach((to,from,next) => {
  if(getToKen()){
    if(to.path === '/login'){
      removeToken();
      removeUserName();
      store.commit('app/SET_TOKEN','');
      store.commit('app/SET_USERNAME','');
      next();
    }else{
      // 获取用户角色
      // 动态分配路由权限
      next()
    }
    // 路由动态添加，分配菜单，每个角色分配不同的菜单
    /*
    * 1. to = /console
    * 2. to = /index
    */
  }else{
    console.log('不存在')
    if(whiteRouter.indexOf(to.path) !== -1){    //indexOf方法，判断数组中是否存在指定的某个对象，如果不存在，就返回-1
        next()  //to
    }else{
        next('/login')  //路由指向
    }
    /*
    * 1.直接进入index的时候，参数to背改变成了"/index",触发路由指向，就会跑beforeEach
    * 2.再一次next指向了login，再次发送路由指向，再跑beforeEach，参数的to被改变成了"/login"
    * 3.白名单判断存在，则直接执行next()，因为没有参数，所以不会再次beforeEach·
    */ 
  }
//   console.log(to) //进入的页面(下一个页面)
//   console.log(from) //离开之前的页面（上一个）
//   console.log(next) //下一个页面
//   next()
})