<template>
    <div id="login">
        <div class="login-wrap">
            <ul class="menu-tab">
                <li :class="{'current' : item.current}" v-for="item in menuTab" :key="item.id" @click="toggleMenu(item)">{{item.txt}}</li>
            </ul>
            <!--表单 start-->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form" size="medium">

                <el-form-item prop="username" class="item-form">
                    <label for="username">邮箱/手机号</label>
                    <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item  prop="password" class="item-form">
                    <label for="password">密码</label>
                    <el-input  id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                
                <el-form-item  prop="passwords" class="item-form" v-show="model === 'register'">
                    <label>重复密码</label>
                    <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item  prop="code" class="item-form">
                    <label>验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="15"> 
                            <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button>
                        </el-col>
                    </el-row>
                   
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block" :disabled="loginButtonStatus">{{model === 'login' ? "登录" : "注册"}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
// base64,md5,sha1
import sha1 from 'js-sha1'
// import { Message } from 'element-ui'
import { GetSms,Register } from '@/api/login'
import {onMounted, reactive,ref} from '@vue/composition-api'
import {stripscript,validateEmail,regexpPass,validateUsername,validateVcode} from '@/utils/validate'
export default {
    name:'login',
    //组件
    setup(props,{refs,root}){
        //这里面放置data数据，生命周期，自定义的函数

        // 验证密码
        let validatePassword = (rule, value, callback) => {
            //过滤后的数据
            ruleForm.password = stripscript(value);
            value = ruleForm.password;
            if (value === '') {
            callback(new Error('请输入密码'));
            } else if (!regexpPass(value)) {
            callback(new Error('密码为6至20位数字加字母'));
            } else {
            callback();
            }
        };
        // 验证重复密码
        let validatePasswords = (rule, value, callback) => {
            //如果模块值为login 就通过
            if(model.value === 'login'){callback();}
            //过滤后的数据
            ruleForm.passwords = stripscript(value);
            value = ruleForm.passwords;
            if (value === '') {
            callback(new Error('请输入密码'));
            } else if (value != ruleForm.password) {
            callback(new Error('重复密码不正确'));
            } else {
            callback();
            }
        };
        // 验证验证码
        let validateCode = (rule, value, callback) => {
            ruleForm.code = stripscript(value);
            value = ruleForm.code;
            if (model.value === '') {
                return callback(new Error('请输入验证码'));
            }else if (validateVcode(value)) {
                callback(new Error('验证码格式有误'));
            } else {
                callback();
            }
        };

        //声明数据
        const menuTab = reactive([
            {txt:'登录',current:true,type:'login'},
            {txt:'注册',current:false,type:'register'}
        ])


        // 模块值
        const model = ref('login')

        // 登录按钮禁用状态
        const loginButtonStatus = ref(true)

        // 验证码按钮状态
        const codeButtonStatus = reactive({
            status:false,
            text:'获取验证码'
        })

        //倒计时
        const timer = ref(null)

        //表单绑定数据
        const ruleForm = reactive({
            username : '',
            password: '',
            passwords: '',
            code: ''
        })

        //表单的验证
        const rules =  reactive({
            username: [
                { validator: validateUsername, trigger: 'blur' }
            ],
            password: [
                { validator: validatePassword, trigger: 'blur' }
            ],
            passwords: [
                { validator: validatePasswords, trigger: 'blur' }
            ],
            code: [
                { validator: validateCode, trigger: 'blur' }
            ]
        })

        /*
         *  1.不建议在一个方法里面做不同的事情（尽可能只做本身的事情，不做其他人的事情）
         *  2.尽可能把相同的事情封装在一个方法里面，通过调用函数执行 
         */

        //声明函数
        //切换模块
        const toggleMenu = (data => {
            menuTab.forEach(element => {
                element.current = false;
            });
            //高光
            data.current = true;
            // 修改模块值
            model.value = data.type;
            resetFromData();
            clearCountDown();
        })
        //清除表单数据
        const resetFromData = (() => {
            // 重置表单
            // this.$refs[formName].resetFields();     //2.0
            refs.loginForm.resetFields(); //3.0
        })

        //更新按钮的状态
        const updateButtonStatus = ((params) => {
            codeButtonStatus.status = params.status;
            codeButtonStatus.text = params.text;
        })


        //获取验证码
        const getSms = (() => {
            //进行提示

            if(ruleForm.username == ''){
                root.$message.error('邮箱/手机号不能为空');
                return false;
            }

            if(validateEmail(ruleForm.username)){
                root.$message.error('邮箱格式有误 请重新输入');
                return false;
            }

            //获取验证码
            let requestData = {
                username:ruleForm.username,
                module:model.value
            }


            // 修改获取验证码状态
            updateButtonStatus({
                status:true,
                text:'发送中'
            })

            //获取验证码
            GetSms(requestData).then(response => {
                let data = response;
                root.$message({
                    message: data.message,
                    type: 'success'
                })
                // 启用登录或注册按钮
                loginButtonStatus.value = false;
                // 调用定时器
                countDown(60);
            }).catch(error => {
                root.$message({
                    message: error,
                    type: 'error'
                })
            })

           

        })

        //提交表单
        const submitForm = (formName => {

           refs[formName].validate((valid) => {
            if (valid) {
                model.value === 'login' ? login() : register();
            } else {
                return false;
            }
          });
        })

        //登录
        const login = (() => {
            let requestData = {
                username: ruleForm.username,
                password: sha1(ruleForm.password),
                code: ruleForm.code
            }
            root.$store.dispatch('app/login',requestData).then(() => {
                //页面跳转
                root.$router.push({
                    name:'Console',
                    params:{
                        id: '',
                        usrs:''
                    }
                })
                root.$store.dispatch('category/setItem')
            }).catch(error => {
                root.$message({
                    message: error,
                    type: 'error'
                })
            });
        })

        //注册
        const register = (() => {
            let requestData = {
                username: ruleForm.username,
                password: sha1(ruleForm.password),
                code: ruleForm.code,
            }

            Register(requestData).then(response => {
                let data = response;
                root.$message({
                    message: data.message,
                    type:'success'
                })
                // 模拟注册成功
                toggleMenu(menuTab[0]);
                clearCountDown();
            }).catch(error => {
                root.$message({
                    message: error,
                    type: 'error'
                })
            })
        })


        //倒计时
        const countDown = ((number) => {
            if(timer.value){clearInterval(timer.value)}
            // 60 和 0都不见了，故意留bug
            let time = number;

            timer.value = setInterval(() => {
                time--;
                if(time == 0){
                    clearInterval(timer.value);
                    codeButtonStatus.status = false;
                    codeButtonStatus.text = '再次获取';
                }else{
                    codeButtonStatus.text = `倒计时${time}秒`;
                    codeButtonStatus.status = true
                }
                localStorage.setItem('time',time)
            },1000)

        })

        //消除倒计时
        const clearCountDown = (() => {
            //还原验证码按钮状态
            codeButtonStatus.status = false;
            codeButtonStatus.text = '获取验证码';
            //清除倒计时
            clearInterval(timer.value);
        })

        //获取本地的倒计时
        const getTime = () => {
            root.$nextTick(() => {
                let time = localStorage.getItem('time')
                if(time){
                    countDown(time)
                }
            })
        }


        


        onMounted(() => {
            getTime()
        })

        return {
            menuTab,
            model,
            loginButtonStatus,
            codeButtonStatus,
            ruleForm,
            rules,
            toggleMenu,
            submitForm,
            getSms,
            getTime
        }


    },
    //绑定数据
    data(){
       
        return {

        }
    },
    //创建完成
    created() {
        
    },
    //挂载完成
    mounted() {
        
    },
    //函数
    methods: {
        //数据驱动视图渲染
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
}
</script>
<style lang="scss" scoped>
#login {
    height: 100vh;
    background-color: #344a5f;
}
.login-wrap{
    width: 330px;
    margin: auto;
}
.menu-tab{
    text-align: center;
    li {
        display: inline-block;
        width: 88px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 2px;
        cursor:pointer;
    }
    .current {
        background-color: rgba(0,0,0,.1);
    }
}
.login-form{
    margin-top: 29px;
    label{
        display: block;
        margin-bottom: 3px;
        font-size: 14px;
        color: #fff;
    }
    .item-form{margin-bottom: 13px;}
    .block{
        display: block;
        width: 100%;
    }
    .login-btn{
        margin-top: 12px;
    }
}
</style>

<!-- 
密码加密：
1.在前端预先加密一次
登录的密码：123456（普通字符串）
经过加密后：sha1('123456') == '52sdasfg5125'（加密后的字符串）

2.后台加密
接收到字符串:'52sdasfg5125'
后台再次加密:md5('52sdasfg5125') == '82asdasdjsadas'（最终加密后的密码）
最终新的字符串写入数据库:82asdasdjsadas

3.登录
用户名与加密后的密码进行匹配，成功则登录，失败则提示
-->
