/**
 * 过滤特殊字符
 * @param {*} s 
 */

export function stripscript(str) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < str.length; i++) {
            rs = rs + str.substr(i, 1).replace(pattern, '');
        }
    return rs;
}


/**
 * 验证邮箱
 * @param {*} s 
 */
export function validateEmail(value){
    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    return !reg.test(value) ? true : false
}

/*
* 验证用户名
* @param {*} s 
 */
export function validateUsername(rule,value,callback){
    if(value == ""){
        callback(new Error('请输入用户名'));
    }else if(validateEmail(value)){
        callback(new Error('用户名格式有误'));
    }else {
       if(callback){callback()}else{return true}
    }
}
/**
 * 验证密码 是否符合规范
 * @param {*} s 
 */
export function regexpPass(value){
    let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
    return reg.test(value) ? true : false
}


/**
 * 验证密码 6至20位的字母+数字
 * @param {*} s 
 */
 export function validatePass(rule,value,callback){
    if(regexpPass(value)){
        callback()
    }else {
        callback(new Error('请输入正确的密码'));
    }
}

/**
 * 验证验证码
 * @param {*} s 
 */
export function validateVcode(value){
    let reg = /^[a-z0-9]{6}$/

    return !reg.test(value) ? true : false
}

/**
 * 验证真实姓名
 * @param {*} s 
 */
export function validateTrueName(rule, value, callback){
    let reg = /^[\u4e00-\u9fa5]*$/;

    if (value.length > 4 || value.length < 2 ||!reg.test(value)) {
        callback(new Error('请输入正确的姓名'));
    } else {
        callback();
    }
}


/*
* 验证手机号
 * @param {*} 手机号
 */
export function validatePhone(rule, value, callback){
    let regExp = /^1[0-9]{10}$/;
    if (!Number.isInteger(Number(value))) {
        callback(new Error('请输入正确的数字'));
    } else {
        if (value.length != 11) {
            callback(new Error('请输入正确的手机号'));
        } else if(!regExp.test(value)){
            callback(new Error('请输入正确的手机号'));
        }else{
            callback();
        }
    }
}

/*
* 验证地区
 */
export function validateRegion(rule, value, callback){
    if(!value[0] ){
        return callback(new Error('省级不能为空'));
    }
    if(!value[1] ){
        return callback(new Error('地级不能为空'));
    }
    if(!value[2] ){
        return callback(new Error('县级不能为空'));
    }
    callback()
}

/**验证时间 */
export function validateDate(rule,value,callback){
    if(value == ""){callback(new Error('请选择时间'));}else{callback()}
}

/*
没有使用export default时 可以同时声明多个export
文件import 需要花括号
*/ 