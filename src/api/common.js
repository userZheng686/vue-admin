import service from '@/utils/request'

/*
获取七牛云token
*/ 
export function QiniuToken(data){
    return service.request({
        method : 'post',
        url : '/uploadImgToken',
        data
    })
}