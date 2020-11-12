import service from '@/utils/request'

/*
获取信息
*/ 
export function GetInfo(data){
    return service.request({
        method:'post',
        url :'/news/getList/',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })

}

/*
添加信息
*/ 
export function AddInfo(data){
    return service.request({
        method:'post',
        url :'/news/add/',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })

}

/*
修改
*/ 
export function EditInfo(data){
    return service.request({
        method:'post',
        url :'/news/editInfo/',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })

}

/*
删除信息
*/ 
export function DeleteInfo(data){
    return service.request({
        method:'post',
        url :'/news/deleteInfo/',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })

}