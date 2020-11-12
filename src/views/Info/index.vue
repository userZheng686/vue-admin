<template>
    <div>
            <el-row :gutter="14">
                <el-col :span="4">
                    <div class="label-wrap category">
                        <label for="">分类</label>
                        <div class="wrap-content">
                            <el-select v-model="select.id" placeholder="请选择" style="width:100%;">
                                <el-option
                                    v-for="item in select.category"
                                    :key="item.id"
                                    :label="item.category_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="label-wrap date">
                        <label for="">日期：&nbsp;&nbsp;</label>
                        <div class="wrap-content">
                            <el-date-picker
                            style="width:100%"
                            v-model="select.date"
                            type="datetimerange"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd HH:MM:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['12:00:00']">
                            </el-date-picker>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="label-wrap key-word">
                        <label for="">关键字：&nbsp;&nbsp;</label>
                        <div class="wrap-content">
                            <el-select v-model="select.key" style="width:100%">
                                <el-option v-for="item in search_option" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </div>
                    </div>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="select.value" placeholder="请输入内容" style="width:100%"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="danger" @click="search">搜索</el-button>
                </el-col>
                 <el-col :span="2" >
                    <el-button type="danger" class="pull-right" @click="dialog_info = true">新增</el-button>
                </el-col>
            </el-row>

            <div class="black-space-30"></div>

            <!--表格数据-->
            <el-table v-loading="table_data.loading" :data="table_data.item" border style="width: 100%" @header-dragend="toMove" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :width="table_data.width.selection"></el-table-column>
                <el-table-column  prop="title" label="标题" :width="table_data.width.title" ></el-table-column>
                <el-table-column  prop="categoryId" label="类型" :width="table_data.width.categoryId" :formatter="toCategory" ></el-table-column>
                <el-table-column  resizable prop="createDate" label="日期" :width="table_data.width.createDate" :formatter="toDate"></el-table-column>
                <el-table-column  prop="user" label="管理员" :width="table_data.width.user"  ></el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="deleteItem(Number(scope.row.id))">删除</el-button>
                        <el-button type="success" size="mini" @click="editInfo(scope.row.id,scope.row.categoryId,scope.row.title,scope.row.content)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="black-space-30"></div>

            <!--底部分页-->
            <el-row>
                <el-col :span="12">
                    <el-button size="medium" @click="deleteAll">批量删除</el-button>
                </el-col>
                <el-col :span="12">
                    <el-pagination class="pull-right" 
                    background 
                    layout="total, sizes, prev, pager, next,jumper" 
                    :total="table_data.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    @prev-click="handlePrevClick"
                    @next-click="handleNextClick"
                    ></el-pagination>
                </el-col>
            </el-row>

            <!--新增弹窗-->
            <DialogInfo :total.sync="table_data.total" :item.sync="table_data.item" :flag.sync="dialog_info" @close="closeDialog" :category="select.category" :page="page" ref="dialog"/>

            <!--编辑弹窗-->
            <DialogEditInfo :item.sync="table_data.item" :flag.sync="dialog_info_edit" :id="info_edit.id" :categoryId="info_edit.categoryId" :name="info_edit.name" :title="info_edit.title" :content="info_edit.content" @close="closeDialogInfo" :category="select.category" :page="page" ref="dialog"/>

    </div>
</template>
<script>
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit"
import {timestampToTime,getExactTime,getSession,setSession} from '../../utils/common'
import {onBeforeMount, onMounted, reactive,ref} from '@vue/composition-api'
import {deleteInfo} from '../../utils/global'
import {getCategory} from '@/api/common';
export default {
    name:'infoIndex',
    components:{DialogInfo,DialogEditInfo},
    setup(props,{root}){
        /*
        * 数据
        */ 
        

        // 信息弹窗标记
        const dialog_info = ref(false);
        // 信息编辑标记
        const dialog_info_edit = ref(false);

        //reactive
        const select = reactive({
            id:'',
            category:[],
            date:'',
            key:'',
            value:''
        })

        
        const search_option = reactive([
            {
                value:'id',
                label:'ID'
            },
            {
                value:'title',
                label:'标题'
            },
        ]);
       
        const table_data = reactive({
            item : [],
            loading : false,
            total : 0,
            width : {
                selection : 45,
                title : 830,
                categoryId : 130,
                createDate : 137,
                user : 45
            },
            select : []
        })


        const page = reactive({
            pageNumber : 1,
            pageSize : 10
        })

        const info_edit = reactive({
            id : '',
            categoryId : '',
            name : '',
            title : '',
            content : '',
        })

        const handleSizeChange = (val) => {
            page.pageSize = val
            getList('info/setSecondItem')
        }
       
        const handleCurrentChange = (val) => {
            page.pageNumber = val
            table_data.loading = true
            getList('info/setSecondItem')
            table_data.loading = false
        }

        const handlePrevClick = (val) => {
            page.pageNumber = val
            getList('info/setSecondItem')
        }

        const handleNextClick = (val) => {
            page.pageNumber = val
            getList('info/setSecondItem')
        }

        const search = () => {

            let requestData;
            requestData = {
                categoryId : select.id ? select.id : '',
                startTiem : select.date ? select.date[0] : '',
                endTime : select.date ? select.date[1] : '',
                pageNumber: 1,
                pageSize: 10,
            }
            if(select.key === ''){
                requestData.id = '',
                requestData.title = ''
            }else if(select.key === 'id'){
                requestData.id = select.value
            }else if(select.key === 'title'){
                requestData.title = select.value
            }
            getList('info/setThreeItem',requestData)

        }

        const getList = (url,requestData) => {
            table_data.loading = true
            if(!requestData){
                requestData = {
                    categoryId: '',
                    startTiem: '',
                    endTime: '',
                    title: '',
                    id: '',
                    pageNumber: page.pageNumber,
                    pageSize: page.pageSize
                }
            }
            
            root.$store.dispatch(url,requestData).then(response => {
                table_data.item = response
                if(url === 'info/setFirstItem' || url === 'info/setThreeItem'){
                    table_data.total = Number(root.$store.state.info.total)
                }
                console.log(response)
                table_data.loading = false
            }).catch(error => {
                console.log(error)
            })
            
            // let n = page.pageNumber
            // table_data.item = root.$store.state.info.item[n][0]
        }

        onBeforeMount(() => {
            let categoryid = root.$store.state.info.categoryId
            let item = root.$store.state.info.item
            if(categoryid.length === 0){
                root.$store.dispatch('info/setCategory')             
            }
            select.category = root.$store.state.info.categoryId
            if(item.length === 0){
                getList('info/setFirstItem')
            }else{
                table_data.loading = true
                let length = item.length > 10 ? 10 : item.length
                for(let i=0;i<length;i++){
                    table_data.item.push(item[i])
                }
                table_data.total = Number(root.$store.state.info.total)
                table_data.loading = false
            }
            let tableWidth = getSession('tableWidth')
            if(!tableWidth){
                setSession({
                    key : 'tableWidth',
                    data : table_data.width
                })
            }else{
                table_data.width = tableWidth
            }
        })

        onMounted(() => {
            // let parms = {
            //     item : select.category,
            //     ALL:false
            // }
            // getCategory(parms)
            // console.log(select.category)
        })



        const closeDialog = () => {
             dialog_info.value = false
        }
        
        const closeDialogInfo = () => {
            dialog_info_edit.value = false
        }

        // column, cellValue, index
        const toDate = (row) => {
            if(row.createDate.length === 13){
                return getExactTime(Number(row.createDate))
            }else{
                return timestampToTime(row.createDate)
            }
        }

        const toCategory = (row) => {  
            let categoryid = row.categoryId
            let categoryData = select.category.filter(item => item.id === categoryid)
            return categoryData[0].category_name
            // for(let i=0;i<select.category.length;i++){
            //     if(Number(select.category[i].id) === row.categoryId){
            //         return select.category[i].name
            //     }
            // }
        }


        const toMove = (newWidth, oldWidth, column) => {
            switch(column.label){
                case '标题' : table_data.width.title = newWidth;break;
                case '类型' : table_data.width.categoryId = newWidth;break;
                case '日期' : table_data.width.createDate = newWidth;break;
                case '管理员' : table_data.width.user = newWidth;break;
            }
            setSession({
                key : 'tableWidth',
                data : table_data.width
            })
        }

        const deleteItem = (value) => {
            deleteInfo(root,{
                content:'是否删除？',
                tip:'提示',
                fn:confirmDelete,
                id:value
            })           
        }
        const confirmDelete = (value) => {
            let requestData;
        
            if(Object.prototype.toString.call(value) === '[object Number]'){
                requestData = {
                    id : [value],
                    page : page.pageNumber,
                    size : page.pageSize
                }
            }else if(Object.prototype.toString.call(value) === '[object Array]'){
                requestData = {
                    id : value,
                    page : page.pageNumber,
                    size : page.pageSize
                }
            }
            root.$store.dispatch('info/deleteInfo',requestData).then(response => {
                table_data.item = response.item
                table_data.total = response.total
            }).catch(error => {
                console.log(error)
            })
        }

        const deleteAll = () => {
            if(table_data.select.length === 0){
                root.$message({
                    message : '请选择数据',
                    type : 'error'
                })
            }else{
                deleteInfo(root,{
                    content:'是否删除全部？',
                    tip:'提示',
                    fn:confirmDelete,
                    id:table_data.select
                })
            }
        }

        const handleSelectionChange = (val) => {
            console.log(val)
            table_data.select = []
            for(let i=0;i<val.length;i++){
                if(!table_data.select[i]){
                   table_data.select.push(Number(val[i].id))
                }
            }
        }
        
        const editInfo = (id,cateogoryId,title,content) => {
            info_edit.id = id;
            info_edit.categoryId = cateogoryId;
            let info = select.category.filter(item => item.id === cateogoryId)
            info_edit.name = info[0].category_name
            info_edit.title = title;
            info_edit.content = content;
            dialog_info_edit.value = true
        }

        return {
            // ref
            dialog_info,dialog_info_edit,
            // reactive
            page, select, info_edit,table_data, search_option,
            // vue 2.0 methods
            closeDialog,closeDialogInfo,deleteItem,deleteAll,toDate,
            toCategory,toMove,getCategory,getList,
            onMounted,search,
            handleSizeChange,handleCurrentChange,handlePrevClick,
            handleNextClick,handleSelectionChange,editInfo
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
div.label-wrap{
    &.category { @include labelDom(left,60,40); }
    &.date {@include labelDom(right,93,40);}
    &.key-word { @include labelDom(right,100,40);}
}
</style>