import {Login} from '@/api/login';
import { setToKen,setUserName, getUserName, removeToken, removeUserName } from '../../utils/app';
// import { remove } from 'cookie_js';

const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) ||  false,
    to_ken:'',
    username:getUserName() || ''
}

const getters = {
    isCollapse : state => state.isCollapse
}

const mutations = {
    SET_COLLAPSE(state){
       state.isCollapse = !state.isCollapse
       //html5本地存储
       sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse))
    }  ,
    SET_TOKEN(state,value){
        state.to_ken = value;
    },
    SET_USERNAME(state,value){
        state.username = value;
    }
}

const actions = {
    login(content,requestData){
       return new Promise((resolve,reject) => {
          //接口
          Login(requestData).then((response) => {
              console.log(response);
              let data = response.data;
              console.log(data)
              // 普通的
              // content.commit('SET_TOKEN',data.toKen);
              // content.commit('SET_USERNAME',data.username);
              // 解构的
              content.commit('SET_TOKEN',data.token);
              content.commit('SET_USERNAME',data.username);
              setToKen(data.token);
              setUserName(data.username)
              // token username
              resolve(response)
          }).catch(error => {
              reject(error)
          })
       })
    },
    exit(content){
        return new Promise((resolve) => {
            removeToken();
            removeUserName();
            content.commit('SET_TOKEN','');
            content.commit('SET_USERNAME','');
            resolve();
        })
        
    }
}



export default {
   namespaced:true,
   state,
   getters,
   mutations,
   actions
}