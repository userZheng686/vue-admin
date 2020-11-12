<template>
    <div id="category">
        <el-button type="danger" @click="addFirst">添加一级分类</el-button>
        <hr class="hr-e9e9e9" />
        <div>
            <el-row :gutter="30">
                <el-col :span="8">
                    <div class="category-wrap">
                        <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
                            <h4>
                                <svg-icon icon-class="minus"></svg-icon>
                                {{firstItem.category_name}}
                                <div class="button-group">
                                    <el-button size="mini" type="danger" round @click="editCategoryName({name:firstItem.category_name,level:1,id:firstItem.id,parentid:''})">编辑</el-button>
                                    <el-button size="mini" type="success" round @click="addChildrenbtn({parentId:firstItem.id})">添加子级</el-button>
                                    <el-button size="mini" round @click="deleteCategoryConfirm(firstItem.id)">删除</el-button>
                                </div>
                            </h4>
                            <ul v-if="firstItem.children">
                                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                                {{childrenItem.category_name}}
                                <div class="button-group">
                                    <el-button size="mini" type="danger" round @click="editCategoryName({name:childrenItem.category_name,level:2,id:childrenItem.id})">编辑</el-button>
                                    <el-button size="mini" round @click="deleteCategoryConfirm(childrenItem.id)">删除</el-button>
                                </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <h4 class="menu-title">一级分类</h4>
                    <el-form label-width="142px" :model="formLabelAlign" class="form-wrap" ref="categoryForm">
                        <el-form-item label="一级分类名称" v-if="inputShow.first">
                            <el-input v-model="formLabelAlign.name" :disabled="inputDisabled.first"></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类名称" v-if="inputShow.second" >
                            <el-input v-model="formLabelAlign.name" :disabled="inputDisabled.second"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="submit" :loading="submit_button_loading" :disabled="inputDisabled.button">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
//computed
import { onBeforeMount,onMounted, reactive, ref } from '@vue/composition-api';
//deleteInfo
export default {
    name:'Category',
    setup(props,{root}){
       

        //ref
        const submit_button_loading = ref(false)
        let edit = ref();
        //reactive
        //分类数组
        const category = reactive({
            item:''
        })

         //reactive
        const formLabelAlign = reactive({
            parentid:'',
            id:'',
            name: '',
            type: ''
        })

        //input显示是否可编辑
        const inputDisabled = reactive({
            first:true,
            second:true,
            button:true
        })

        //是否可显示
        const inputShow = reactive({
            first:true,
            second:true
        })

        const submitName = () => {}


        onBeforeMount(() => {
            let item = root.$store.state.category.item
            if(item.length === 0){
                root.$store.dispatch('category/setItem').then(response => {
                    category.item = response
                }).catch(error => {
                    console.log(error)
                })
            }else{
                category.item = root.$store.state.category.item
            }
            

        })
        
        onMounted(() => {
           
            console.log(category.item)

        })


        //methods
        //提交
        const submit = () => {
            const requestData = {
                id : formLabelAlign.id,
                name : formLabelAlign.name,
                parentid : formLabelAlign.parentid
            }
            if(edit.value === 1){
                root.$store.dispatch('category/addCategoryFirst',requestData).then(response => {
                    let data = response
                    if(data.resCode === 0){
                        root.$message({
                            message: data.message,
                            type: 'success'
                        })
                    }
                }).catch(error => {
                    console.log(error)
                })
            }else if(edit.value === 2){
                root.$store.dispatch('category/addCategorySecond',requestData).then(response => {
                    let data = response
                    if(data.resCode === 0){
                        root.$message({
                            message: data.message,
                            type: 'success'
                        })
                    }
                }).catch(error => {
                    console.log(error)
                })
            }else{
                root.$store.dispatch('category/editCategory',requestData).then(response => {
                    let data = response
                    if(data.resCode === 0){
                        root.$message({
                            message: data.message,
                            type: 'success'
                        })
                    }
                }).catch(error => {
                    console.log(error)
                })
            }
            resetForm()
        }

        //删除
        const deleteCategoryConfirm = (categoryID) => {
            let parms = {
                id : categoryID,
                parentid : searchParent(categoryID)
            }
            root.$store.dispatch('category/deleteCategory',parms).then(response => {
                let data = response
                if(data.resCode === 0){
                    root.$message({
                        message: data.message,
                        type: 'success'
                    })
                }
            }).catch(error => {
                console.log(error)
            })
        }


        //创建新的一级菜单
        const addFirst = () => {
            edit.value = 1;
            formLabelAlign.id = '';
            formLabelAlign.name = '';
            firstCategory();
            
        }

        //添加子级
        const addChildrenbtn = (parms) => {
            edit.value = 2;
            formLabelAlign.name = ''
            secondCategory()
            formLabelAlign.parentid = parms.parentId
        }

        const searchParent = (childrenid) => {
            for(let g=0;g<category.item.length;g++){
                if(category.item[g].children){
                    for(var j=0;j<category.item[g].children.length;j++){
                        if(category.item[g].children[j].id === childrenid){
                            return category.item[g].children[j].parent_id 
                        }
                    }
                }
            } 
            return ''
        }
        
        //修改
        const editCategoryName = (parms) => {
            edit.value = 3;
            /*找一下父亲id*/
            if(parms.level === 1){
                firstCategory();
                formLabelAlign.parentid = ''
            }else{
                secondCategory();
                formLabelAlign.parentid = searchParent(parms.id)
            }
            /*
            显示要修改的一级分类名称
            显示可编辑的状态
            */ 
            formLabelAlign.id = parms.id;
            formLabelAlign.name = parms.name;
            
        }

        //清除表单
        const resetForm = () => {
            formLabelAlign.id = '';
            formLabelAlign.name = '';
            submit_button_loading.value = false
            inputDisabled.first = true
            inputDisabled.button = true
        }

        //一级菜单显示步骤
        const firstCategory = () => {
            inputShow.first = true;
            inputShow.second = false;
            inputDisabled.first = false;
            inputDisabled.button = false;
        }

        //二级菜单显示步骤
        const secondCategory = () => {
            inputShow.first = false;
            inputShow.second = true;
            inputDisabled.first = true;
            inputDisabled.second = false;
            inputDisabled.button = false;
        }


        

        
        return {
            //ref
            submit_button_loading,
            edit,
            //reactive
            formLabelAlign,
            category,
            inputShow,
            inputDisabled,
            //methods
            submitName,
            addFirst,
            addChildrenbtn,
            submit,
            searchParent,
            firstCategory,
            secondCategory,
            resetForm,
            editCategoryName,
            deleteCategoryConfirm,
            onMounted
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap{
    div:first-child {
        &:before{top: 20px;} 
    }
    div:last-child {
        &:before{bottom: 20px;} 
    }
}
.menu-title{
    line-height: 44px;
    padding-left: 22px;
    background-color: #f3f3f3;
}
.category {
    position: relative;
    line-height: 44px;
    cursor:pointer;
    &:before {
        content:'';
        position:absolute;
        left: 22px;
        top:0;
        bottom: 0;
        width:32px;
        border-left: 1px dotted #000;
    }
    h4 {
        padding-left: 40px;
    }
    svg {
        position: absolute;
        left: 14px;
        top: 15px;
        font-size: 17px;
        background-color: #fff;
    }
    li {
        position: relative;
        margin-left: 23px;
        padding-left: 36px;
        &:before {
            content:'';
            position:absolute;
            left: 0;
            top:23px;
            width:32px;
            border-bottom: 1px dotted #000;
        }
    }
    li, h4{
        @include webkit(transition, all .5s ease 0s);
        &:hover{background-color: #f3f3f3;.button-group{display: block;}}
    }
    .svg-icon{
        color:black !important;
    }
}
.button-group{
    display:none;
    position:absolute;
    z-index: 2;
    right: 11px;
    top:-1px;
    button {
        font-size: 12px;
    }
}
.form-wrap{
    width: 410px;
    padding-top: 26px;
}
.hr-e9e9e9{
    width: calc(100%+60px);
    margin-left: -30px;
    border: none;
    margin-top: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e9e9e9;
}
</style>