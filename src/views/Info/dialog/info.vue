<template>
        <div>
            <el-dialog title="新增" :visible.sync="dialog_info_flag" @close="close" width="580px" @opened="openDialog"> 
                <el-form :model="form" ref="addInfoForm">
                    <el-form-item label="类别：" :label-width="formLabelWidth">
                        <el-select v-model="form.category" placeholder="请选择分类">
                            <el-option v-for="item in form.options" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题：" :label-width="formLabelWidth">
                        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                    </el-form-item>
                    <el-form-item label="概况：" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="form.content" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="close">取消</el-button>
                    <el-button type="danger" :loading="submitLoading" @click="submit()">确定</el-button>
                </div>
            </el-dialog> 
        </div>       
</template>
<script>
import { reactive, ref, watch } from '@vue/composition-api';
export default {
    name:'dialogInfo',
    //单向数据流，父级->子级，不能反向修改
    props:{
        flag:{
            type:Boolean,
            default:false
        },
        category:{
            type:Array,
            default:() => []
        },
        page:{
            type:Object
        }
        //this.$emit()
    },
    setup(props,{root,emit}){
        const submitLoading = ref(false)

        const dialog_info_flag = ref(false);
        const formLabelWidth = ref('70px');
        const form = reactive({
            category : '',
            options : [],
            item : [],
            title : '',
            content : ''
        })
        watch(() => {
            dialog_info_flag.value = props.flag;
        })
        const submit = () => {
            let requestData = {
                categoryId: form.category,
                title : form.title,
                content: form.content,
                page : props.page.pageNumber,
                size : props.page.pageSize
            }
            if(!form.category){
                root.$message({
                    message : '分类不能为空',
                    type : 'danger'
                })
                return false
            }
            submitLoading.value = true
            root.$store.dispatch('info/addInfo',requestData).then(response => {
                console.log(response)
                console.log(props.page)
                emit('update:item', response.item)
                emit('update:total',response.total)
                root.$message({
                    message : '添加成功',
                    type : 'success'
                })
                submitLoading.value = false
                
                // refs.addInfoForm.resetFieids();
            }).catch(error => {
                console.log(error)
                submitLoading.value = false
            })
            // refs.addInfoForm.resetFields(); //3.0
            resetForm()
        }


        // vue 2.0 methods
        const close = () =>{
            dialog_info_flag.value = false;
            // 子组件调用父组件的方法 close指的是@close
            // this.$emit('close',false);
            //修饰器
            emit("update:flag",false);
            //回调时需要做逻辑处理的时候，就不能用修饰器
        }

        const openDialog = () => {
             console.log(props.category)
             form.options = props.category

        }

        const resetForm = () => {
            form.category = ''
            form.title = ''
            form.content = ''
        }


        return {
            // ref
            submitLoading,
            dialog_info_flag,formLabelWidth,
            // reactive
            form,
            // methods
            submit,
            resetForm,
            close,
            openDialog
        }
    },


}
</script>
<style lang="scss" scoped>

</style>