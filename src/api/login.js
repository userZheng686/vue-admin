import service from '@/utils/request'
/*
获取验证码
*/ 
export function GetSms(data){
    return service.request({
        method:'post',
        url :'/getSms/',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })

}


/*
获取用户角色
*/ 

/*
登录
*/ 
export function Login(data){
    return service.request({
        method:'post',
        url:'/login/',
        data
    })
}
/*
注册
*/ 
export function Register(data){
    return service.request({
        method:'post',
        url:'/register/',
        data 
    })

}