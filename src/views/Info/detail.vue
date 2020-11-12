<template>
    <div>
        <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="80px">
             <el-form-item label="信息分类:">
                 <el-select v-model="ruleForm.category">
                    <el-option 
                        v-for="item in ruleForm.options"
                        :key="item.id"
                        :label="item.category_name"
                        :value="item.id">
                    </el-option>
                 </el-select>
             </el-form-item>

             <el-form-item label="新闻标题:" >
                <el-col :span="6">
                    <el-input v-model="ruleForm.title" label-width="50px"></el-input>
                </el-col>
             </el-form-item>

             <el-form-item label="缩略图:" >
                <el-col :span="3">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="ruleForm.img" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-col>
             </el-form-item>

             <el-form-item label="发布日期:" >
                <el-col :span="4">
                    <el-form-item >
                        <el-date-picker 
                         v-model="ruleForm.date"
                         type="date"
                         placeholder="选择日期" 
                         format="yyyy 年 MM 月 dd 日"
                         value-format="yyyy-MM-dd HH:MM:ss"
                         style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
             </el-form-item>

            <el-form-item label="详细内容:" >
                <quillEditor ref="myQuillEditor" :options="ruleForm.editorOption" v-model="ruleForm.content">
                
                </quillEditor>
             </el-form-item>

            <el-form-item>
                <el-button type="danger" @click="submit()">保存</el-button>
            </el-form-item>
            
        </el-form>
    </div>
</template>
<script>
import { reactive,onBeforeMount } from '@vue/composition-api'
import { QiniuToken } from "../../api/common"
import { quillEditor } from "vue-quill-editor"; 
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export default {
    name:"infoDetail",
    components:{quillEditor},
    setup(props,{root}){
        const ruleForm = reactive({
            id : '',
            category : '',
            categoryId : '',
            categoryName : '',
            options : [],
            img : '',
            date : '',
            content : '',
            editorOption : {}
        })

        const rules = reactive({
            name: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            region: [
                { required: true, message: '请选择活动区域', trigger: 'change' }
            ],
            date1: [
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            ],
        })

        const handleAvatarSuccess = (res, file) => {
            ruleForm.imageUrl = URL.createObjectURL(file.raw);
        }

        const beforeAvatarUpload = (file) => {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            root.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            root.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }

        const getCategory = () => {
            if(root.$store.state.info.categoryId.length === 0){
                root.$store.dispatch('info/setCategory')             
            }
            let category = root.$store.state.info.categoryId
            ruleForm.options = category
        }

        const setFormValue = () => {
            ruleForm.id = root.$route.query.id
            ruleForm.category = root.$route.query.categoryName
            ruleForm.categoryId = root.$route.query.categoryId
            ruleForm.categoryName = root.$route.query.categoryName
            ruleForm.title = root.$route.query.title
            ruleForm.content = root.$route.query.content
            ruleForm.pageNumber = root.$route.query.pageNumber
            ruleForm.pageSize = root.$route.query.pageSize
        }

        const submit = () => {
            let requestData = {
                id : ruleForm.id,
                title : ruleForm.title,
                updateDate:ruleForm.date,
                content: ruleForm.content,
                imgUrl : ruleForm.img,
                pageNumber : ruleForm.pageNumber,
                pageSize : ruleForm.pageSize
            }
            if(ruleForm.category === ruleForm.categoryName){
                requestData.categoryId = ruleForm.categoryId
            }else{
                requestData.categoryId = ruleForm.category
            }
            root.$store.dispatch('info/editInfo',requestData).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error)
            })
        }

        /*
        获取七牛云token
        */ 
        const getQiniuToken = () => {
            let requestData = {
                ak : "",
                sk : "",
                buckety : ""
            }
            QiniuToken(requestData).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error)
            })
        }

        onBeforeMount(() => {
            getCategory()
            setFormValue()
        })



        return {
            //ref
            //reactive
            rules,ruleForm,
            //methods
            handleAvatarSuccess,beforeAvatarUpload,getCategory,setFormValue,submit,getQiniuToken
        }
    }
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.avatar-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
</style>