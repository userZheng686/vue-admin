<template>
    <div > 
        <el-upload
            class="avatar-uploader"
            action="https://up-z2.qiniup.com"
            :data="data.uploadKey"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            >
            <div v-if="data.display.child.img">
                <img v-if="data.imgUrl" :src="data.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <div v-if="data.display.child.button">
                <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
            </div>
        </el-upload>
    </div>
</template>
<script>
import {  reactive } from '@vue/composition-api';
export default {
    /*
    * 1.组件过程做什么？(七牛云token，显示默认图片，选择图片渲染自身图片)
    * 2.最终结果要做什么？（返回选择后的图片路径）
    */ 
    name : "uploadImg",
    setup(props,{root,emit}){
        const data = reactive({
            imgUrl : '',
            uploadKey : {
                token : '',
                key : ''
            },
            display : {
                child : {
                    img : '',
                    button : ''
                }
            }
        })

        const handleAvatarSuccess = (res, file) => {
            data.imgUrl = `http://7mx.kerosd.space/${file.name}`
            if(data.display.child.img){
                emit('update:imgUrl',data.imgUrl)
            }else{
                emit('upSuccess',data.imgUrl)
            }
            
            
            // props.imgUrl = URL.createObjectURL(file.raw);
        }

        const beforeAvatarUpload = (file) => {
            const isJPG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            root.$message.error('只能是 png 格式!');
            }
            if (!isLt2M) {
            root.$message.error('图片大小不能超过 2MB!');
            }

            //文件名转码
            let suffix = file.name
            let key = encodeURI(`${suffix}`)
            data.uploadKey.key = key
            return isJPG && isLt2M;
        }


        /**加载prop图片 */
        const loading = (value) => {
            /**按需加载 */
            data.uploadKey.token = value.token                   
            data.imgUrl = value.input.imgUrl
            data.display = value.display
        }




        return {
            //reactive
            data,
            //methods
            handleAvatarSuccess,loading,beforeAvatarUpload
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
    // width: 178px;
    // height: 178px;
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