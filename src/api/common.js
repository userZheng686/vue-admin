import axios from 'axios'
/*
获取七牛云token
* @ param{
* AK:七牛云的密钥Ak : type : string
* SK:七牛云的密钥AK : type : string
* buckety : 七牛云存储空间名称 : type : string
*}
*/ 
export function QiniuToken(data){
    /**创建axios */
    return axios({
        method: 'post',
        url: '/uploadImgToken',
        data
    });
}