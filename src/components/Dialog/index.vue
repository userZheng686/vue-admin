<template>
    <div>
        <el-dialog :visible.sync="dialog_add_flag" @close="close" :title="pageConfig.title" ref="">
            <el-form :model="pageData.input" :label-width="formLabelWidth" :rules="pageConfig.rules" ref="ruleForm">
                <template v-for="item in pageConfig.label" >
                    <el-form-item :key="item.field" :label="item.name" :prop="item.field" >
                        <!--slot数据-->
                        <slot :name="item.slotName" ></slot>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button  type="danger"  @click="submit()">确定</el-button>
            </div>
        </el-dialog>
    
    </div>
</template>
<script>
import { onBeforeMount, ref,reactive,watchEffect } from '@vue/composition-api'
export default {
    name : 'dialogIndex',
    props : {
        flag : {
            type : Boolean,
            default : false
        },
        config : {
            type : Object,
            default : () => {}
        },
        data : {
            type : Object,
            default : () => {}
        }
    },
    setup(props,{root,emit,refs}){
        //页面数据
        //弹窗显示编辑
        const dialog_add_flag = ref(false)

        //label宽度
        const formLabelWidth = ref('85px')

        //按钮
        const submitLoading = ref(false)

        /*
        * 页面配置
        * 页面数据
         */
        const pageConfig = reactive({})

        const pageData = reactive({})




        //监听页面是否打开
        watchEffect(() => {
            dialog_add_flag.value = props.flag;
        })

        //页面初始化
        const initDialogConfig = () => {
            let parentConfig = props.config
            let parentData = props.data
            let keys = Object.keys(parentConfig)
            for(let key in parentConfig){
                if(keys.includes(key)){
                    pageConfig[key] = parentConfig[key]
                }
            }
            for(let key in parentData){
                pageData[key] = parentData[key]
            }
        }

        // /*
        // * 递归
        //  */
        const resetForm = (data) => {
            for(let key in data){
                /*
                * 先判断是否有值
                 */
                if(data[key]){
                    /*
                    * 遍历对象中的key值，判断是基本数据类型还是复杂数据类型
                     */
                    if(data[key] instanceof Array){
                        //如果是复杂数据类型，那么先遍历对象中的key值
                        data[key] = new Array()
                    }else if(data[key] instanceof Object){
                        resetForm(data[key])
                    }else{
                        // 基本类型数据，获取一下类型，new就行了
                        let type = Object.prototype.toString.call(data[key]).split(' ')[1].split(']')[0]
                        if(type === 'String'){
                            data[key] = ''
                        }
                    }
                }
            }
        }

        //取消按钮
        const close = () => {
            //清空表单内的数据
            dialog_add_flag.value = false;
            emit("update:flag",false);
            resetForm(pageData);
            // 子组件调用父组件的方法 close指的是@close
            // this.$emit('close',false);
            //修饰器
            
            //回调时需要做逻辑处理的时候，就不能用修饰器
        }

        //提交按钮
        const submit = () => {
            refs.ruleForm.validate(function(valid){
                if (valid) {
                    root.$store.dispatch(pageConfig.actions,pageData).then(response => {
                        root.$message({
                            type : 'success',
                            message : response.message
                        })
                        close()
                    }).catch(error => {
                        root.$message({
                            type : 'error',
                            message : error.message
                        })
                    })
                } else {
                    root.$message({
                        type : 'error',
                        message : '请重新填写'
                    })
                    return false;
                }
            });
        }



        onBeforeMount(() => {
            initDialogConfig()
        })

        return {
            //ref
            submitLoading,dialog_add_flag,formLabelWidth,
            //reactive 
            resetForm,pageConfig,pageData,
            //methods
            initDialogConfig,
            //取消按钮
            close,submit
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
