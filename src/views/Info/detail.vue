<template>
    <div>
        <el-form ref="ruleForm" v-loading="loading" :rules="rules" :model="ruleForm.input" label-width="85px">
             <el-form-item label="信息分类:" >
                 <el-select v-model="ruleForm.input.categoryId">
                    <el-option 
                        v-for="item in ruleForm.input.options"
                        :key="item.id"
                        :label="item.category_name"
                        :value="item.id">
                    </el-option>
                 </el-select>
             </el-form-item>

             <el-form-item label="新闻标题:" prop="title">
                <el-col :span="7">
                    <el-input v-model="ruleForm.input.title" label-width="50px"></el-input>
                </el-col>
             </el-form-item>

             <el-form-item label="缩略图:" prop="imgUrl">
                <div class="img">
                    <UploadImg :imgUrl.sync="ruleForm.input.imgUrl" ref="picture"></UploadImg>
                </div>
             </el-form-item>

             <el-form-item label="发布日期:"  >
                <el-col :span="5">
                    <el-form-item prop="date">
                        <el-date-picker 
                         v-model="ruleForm.input.date"
                         type="datetime"
                         placeholder="选择日期" 
                         value-format="yyyy-MM-dd HH:mm:ss"
                         style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
             </el-form-item>

            <el-form-item label="详细内容:" prop="content"  >
                <EditorIndex ref="edit" :token="ruleForm.token" :content.sync="ruleForm.input.content"></EditorIndex>
             </el-form-item>

            <el-form-item>
                <el-button type="danger" @click="submit()">保存</el-button>
            </el-form-item>
            
        </el-form>

        <div class="black-space-30"></div>
    </div>
</template>
<script>
import { onMounted, reactive, ref } from '@vue/composition-api';
import EditorIndex from '@c/Editor/index';
import {validateDate} from '@u/validate';
import { QiniuToken } from "@/api/common";
import UploadImg from '@c/UploadImg/index';


export default {
    name:"infoDetail",
    components:{EditorIndex,UploadImg},
    setup(props,{root,refs}){
        //ref
        //切分vuex的actions行为
        const actions = ref('')

        //加载
        const loading = ref(true)
        
        //reactive
        const ruleForm = reactive({
            //信息分类
            //内容
            //日期
            //信息id
            //缩略图
            //选项
            //标题
            //富文本编辑器选项
            input : {
                categoryId : '',
                content : '',
                createDate : '',
                id : '',
                imgUrl : '',
                date : '',
                updateDate : '',
                options : [],
                title : "",
            },
            token : '',
            display : {
                child : {
                    img : true,
                    button : false
                }
            }
        })



        const rules = reactive({
            name: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' }
            ],
            imgUrl : [
                { required: true, message: '请选择图片', trigger: 'blur' }
            ],
            date: [
                 { validator: validateDate, trigger: 'blur' }
            ],
            content : [
                { required: true, message: '请输入内容', trigger: 'blur' }
            ]
        })




        

        /*
        * 提交要修改的信息
         */
        const submit = () => {
            refs.ruleForm.validate(function(valid){
                if(valid){
                    ruleForm.input.createDate = new Date(ruleForm.input.date).getTime() + '';
                    ruleForm.input.updateDate = ruleForm.input.createDate
                    root.$store.dispatch(actions.value,ruleForm).then(response => {
                    root.$message({
                        type : 'success',
                        message : response.message
                    })
                    }).catch(error => {
                        root.$message({
                            message: error,
                            type: 'error'
                        })
                    })
                }else{
                    root.$message({
                        type : 'error',
                        message : '请重新填写'
                    })
                    return false;
                }
            })
            
        }

        const loadingDetail = () => {
            let data = root.$route.params
            let keys = Object.keys(data)
            if(keys.length){
                for(let key in data){
                    if(keys.includes(key)){
                        ruleForm.input[key] = data[key]
                    }
                }
                actions.value = 'info/editItem'
                loading.value = false
                loadingImg()
                loadingEdit()
            }else{
                root.$store.dispatch('info/setDetail').then(response => {
                    keys = Object.keys(response)
                    for(let key in response){
                        if(keys.includes(key)){
                            ruleForm.input[key] = response[key]
                        }
                    }
                    actions.value = 'info/editDetail'
                    loading.value = false
                    loadingImg()
                    loadingEdit()
                })
            }
        }

        const loadingToken = () => {
            let requestData = {
                ak : "aw11CEBlE_mM0Qjn_yi-cppW1LStSOoI0GMQM8bs",
                sk : "zBn4naoJwQmtwenLIwoBizWBhJ5u7iL2r5PNZTNb",
                buckety : "vue-admin-kerosd"
            }
            QiniuToken(requestData).then(response => {
                ruleForm.token = response.data.token
                loadingDetail()
            }).catch(error => {
                root.$message({
                    message: error,
                    type: 'error'
                })
            })
        }

        const loadingImg = () => {
             refs.picture.loading(ruleForm)
        }

        const loadingEdit = () => {
             refs.edit.loading()
        }

        onMounted(() => {
            root.$nextTick(() => {
                loadingToken()
            })
            
        })




        return {
            //ref
            actions,loading,
            //reactive
            rules,ruleForm,
            //methods
            submit,loadingDetail,loadingImg,loadingToken,loadingEdit
        }
    }
}
</script>
<style lang="scss" scoped>
.img {
    float : left;
    box-sizing: border-box;
    line-height: 1 !important;
}

</style>