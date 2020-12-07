<template>
    <div>
        <!--表格数据-->
            <el-table v-loading="loading" :data="data.tableData" border style="width: 100%" @selection-change="handleSelectionChange"> 
                <!--多选框-->
                <el-table-column type="selection" :width="55"></el-table-column>

                <!--表格数据-->
                <template v-for="item in data.tableConfig.column">
                     <!--slot数据-->
                    <el-table-column :key="item.field" :prop="item.field" :label="item.label"  v-if="item.columnType === 'slot'" :width="item.width">
                        <template slot-scope="scope">
                            <slot :name="item.slotName" :data="scope.row"></slot>
                        </template>
                    </el-table-column>
                    <!--文本数据渲染-->
                    <el-table-column :key="item.field" :prop="item.field" :label="item.label" :formatter="item.formatter" v-else></el-table-column>
                </template>

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
                    :total="page.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    @prev-click="handlePrevClick"
                    @next-click="handleNextClick"
                    ></el-pagination>
                </el-col>
            </el-row>

            
    </div>
</template>
<script>
import { onBeforeMount, reactive,ref,watch } from '@vue/composition-api'
import {deleteInfo} from '@u/global'

export default {
    name:'tableIndex',
    props:{
        config : {
            type : Object,
            default : () => {}
        },
        state : {
            type : Object,
            default : () => {}
        }
    },
    setup(props,{root}){
        //reactive
        /**vuex */
        const userstate = props.state

        const loading = ref(true)

        /*页码及获取的数量多少*/
        const page = reactive({
            total : 0,
            pageNumber : 1,
            pageSize : 10
        })

        const data = reactive({
            //表格配置 包括选择 列名 请求url的地址等
            tableConfig : {
                column : [],
                //请求接口参数
                requestData: {},
            },
            //表格数据
            tableData : [],
            //选中的表格
            select : [],
        })

        


        //vue2.0 methods
        const initTableConfig = () => {
            let configData = props.config
            let keys = Object.keys(configData)
            for(let key in configData)
            {
                if(keys.includes(key))
                {
                    data.tableConfig[key] = configData[key]
                }
            }
        }

        /*
        * 请求数据 
        */
        async function loadData(){
            /*
            * 先判断一下vuex中是否有对应的数据
             */
            if(!root.$store.getters[userstate.getters.item].length){
                await root.$store.dispatch(userstate.actions.set,data.tableConfig.requestData)
            }
            data.tableData = root.$store.getters[userstate.getters.item]
            if(root.$store.getters[userstate.getters.total]){
                page.total = root.$store.getters[userstate.getters.total]
            }
            
            loading.value  = false
        }

        /**监听vuex状态 */
        watch(() => root.$store.getters[userstate.getters.item],(newVal) => {
            if(newVal){
                data.tableData = root.$store.getters[userstate.getters.item]
                loading.value = false
            }
        })

        watch(() => root.$store.getters[userstate.getters.total],(newVal) => {
            if(newVal){
                page.total = newVal
            }
                
        })



        /*
        *选中表格数据
         */
        const handleSelectionChange = (val) => {
            data.select = []
            for(let i=0;i<val.length;i++){
                if(!data.select[i]){
                   data.select.push(Number(val[i].id))
                }
            }
        }


        /*
        * 删除信息弹窗
         */
        const deleteAll = () => {
            if(data.select.length === 0){
                root.$message({
                    message : '请选择数据',
                    type : 'error'
                })
            }else{
                deleteInfo(root,{
                    content:'是否删除全部？',
                    tip:'提示',
                    fn:confirmDelete,
                    id:data.select
                })
            }
        }
  
        /*
        * 删除信息
         */
        const confirmDelete = (value) => {
            let requestData = {
                id : value,
                pageSize : page.pageSize,
                pageNumber : page.pageNumber
            }
            root.$store.dispatch(userstate.actions.delete,requestData).then(response => {
                /*
                * 修改表格的信息
                */
                data.tableData = response.item
                root.$message({
                    type : 'success',
                    message : '删除成功'
                })
            }).catch(error => {
                root.$message({
                    type : 'error',
                    message : error
                })
            })
        }



         /*
        * 分页操作 
        */
        /*
        * 请求翻页数据
         */
        const flip = () => {
            data.tableConfig.requestData.pageNumber = page.pageNumber
            data.tableConfig.requestData.pageSize = page.pageSize
            root.$store.dispatch(userstate.actions.filp,data.tableConfig.requestData).then(response => {
                data.tableData = response
            })
        }

        const handleSizeChange = (val) => {
            page.pageSize = val
            
        }
       
        const handleCurrentChange = (val) => {
            page.pageNumber = val
            flip();
        }

        const handlePrevClick = (val) => {
            page.pageNumber = val
            
        }

        const handleNextClick = (val) => {
            page.pageNumber = val
            
        }



        onBeforeMount(() => {
            //加载表格配置
            initTableConfig()
            //请求表格数据
            loadData()
        })

        return {
            //ref
            loading,
            //reactive
            data,page,userstate,
            //表格配置,数据，操作
            initTableConfig,loadData,
            //分页
            handleSizeChange,handleCurrentChange,handlePrevClick,handleNextClick,flip,
            //表格数据的选中,删除，编辑等
            handleSelectionChange,deleteAll,confirmDelete
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
</style>

<!--
v-slot插槽
1.匿名插槽：没有指定某一个插槽，全部都显示
2.具名插槽：指定插槽显示内容
3.作用域插槽：可以进行数据绑定，父子组件通讯
-->