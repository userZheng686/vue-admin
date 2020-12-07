import axios from 'axios'



import {getToKen} from '@/utils/app'
import { getUserName } from './app';

//创建axios变量，赋给变量service

//手把手撸码前端api，地址http://www.web-jshtml.cn/productApi

const BASEURL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API : process.env.VUE_APP_API;

const service = axios.create({
    baseURL:BASEURL,
    timeout:15000
})




// 添加接口前，做一些数据处理（拦截器）
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 后台需要前端这边传相关的参数 （在请求头添加参数）
    // Tokey
    // userid
    // sui
    // console.log(config.headers)
    // // 业务需求
    // console.log(config)

    // 最终目的不是在请求头添加参数
    config.headers['Tokey'] = getToKen()
    config.headers['UserName'] = getUserName()


    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 请求接口后，返回数据进行拦截
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let data = response.data
    // 业务需求

    if(data.resCode != 0){
        return Promise.reject(data)
    }else{
        return Promise.resolve(data)
    }

}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});



export default service


/*
使用export default时 不能同时存在多个default
文件import 不需要花括号
*/ 