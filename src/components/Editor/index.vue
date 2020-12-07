<template>
    <div class="content">
    <quillEditor ref="myQuillEditor" :options="data.editorOption" v-model="data.content"></quillEditor>
    <UploadImg @upSuccess="upSuccess" id="upload" ref="upload" style="display:none"></UploadImg>
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor';
import Quill from 'quill'
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css'; 
import UploadImg from '@c/UploadImg/index';
import {  reactive,watch } from '@vue/composition-api';
export default {
    name : 'editorIndex',
    props : {
        content : {
            type : String,
            default : ''
        },
        token : {
            type : String,
            default : ''
        }
    },
    components : {quillEditor,UploadImg},
    setup(props,{refs,emit}){
        //reactive
        const data = reactive({ 
            /**
            内容
            编辑器选项
            光标
            上传的文件类型（图片、视频）
             */
            content : '',
            editorOption : {},
            addRange : [],
            uploadType : '',
        })

        const config = reactive({
            token : '',
            input : {
                imgUrl : ''
            },
            display : {
                child : {
                    img : false,
                    button : true
                }
            }
        })


        //watch
        watch(() => props.content,(newVal) => {
            data.content = newVal
        })

        watch(() => props.token,(newVal) => {
            if(newVal){
                config.token = newVal
            }
        })

        watch(() => data.content,(newVal) => {
            if(newVal){
                emit("update:content",newVal)
            }
        })

        const imgHandler = (state) => {
            data.addRange = refs.myQuillEditor.quill.getSelection()
            if (state) {
               let button = document.getElementById('upload').children[0].children[0].children[1]
               button.click()
            }
        }

        const upSuccess = (value) => {
            config.input.imgUrl = value
            refs.myQuillEditor.quill.insertEmbed(data.addRange.index,'image',config.input.imgUrl,Quill.sources.USER)
        }

        const loading = () => {
            refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', imgHandler)
            refs.upload.loading(config)
        }


 

        return {
            //reactive
            data,config,
            //methods
            imgHandler,upSuccess,loading
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
.content {
    line-height: 1 !important;
}
</style>