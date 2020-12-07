<template>
  <div>
    <!--表格组件-->
    <Tableindex :config="tableData.config" :state="userstate" ref="table">
      <!-- <template slot-scope="scope"> -->
      <template v-slot:operation="slotData">
        <el-button type="danger" @click="confirmDelete(slotData.data.id)"
          >删除</el-button
        >
        <el-button type="success" @click="editInfo(slotData.data)"
          >编辑</el-button
        >
        <el-button type="success" @click="editInfoDetail(slotData.data)"
          >编辑详情</el-button
        >
      </template>
      <!-- </template> -->
    </Tableindex>

    <InfoEditIndex
      :flag.sync="dialog_edit"
      :state="userstate"
      ref="editDialog"
    ></InfoEditIndex>


  </div>
</template>
<script>
import { timestampToTime, getExactTime } from "@u/common";
import Tableindex from "@c/TableItem/index";
import { ref, reactive } from "@vue/composition-api";
import InfoEditIndex from "../dialog/edit";
export default {
  name: "InfoTableIndex",
  components: { Tableindex, InfoEditIndex },
  props: {
    state: {
      type: Object,
      default: () => {},
    },
    option : {
      type : Array,
      default : () => {}
    }
  },
  setup(props,{root,refs}) {
    //信息新增标记
    const dialog_edit = ref(false);

    /**vuex */
    const userstate = props.state

    /*
     * 对表格里面的日期，分类做整理
     */
    const toDate = (row,data) => {
      if(row){
        if (row.createDate.length === 13) {
          return getExactTime(Number(row.createDate));
        } else {
          return timestampToTime(row.createDate);
        }
      }else{
        if(data.length === 13){
          return getExactTime(Number(data));
        } else {
          return timestampToTime(data);
        }
      }
      
    };

    const toCategory = (row) => {
      let categoryid = row.categoryId;
      let categoryData = props.option.filter(
        (item) => item.id === categoryid
      );
      return categoryData[0].category_name;
    };

    /*
     * 表格配置
     * 全选
     * 列名
     * 请求的方法（api）
     * 请求的方法参数
     */
    const tableData = reactive({
      config: {
        column: [
          { field: "title", label: "标题" },
          { field: "categoryId", label: "类型",formatter:toCategory },
          { field: "createDate", label: "日期",formatter:toDate },
          { label: "操作", columnType: "slot", slotName: "operation",width : "300px" },
        ],
        //请求接口参数
        requestData: {
          categoryId: '',
          startTiem: '',
          endTime: '',
          title: '',
          id: '',
          pageNumber: 1,
          pageSize: 10,
        },
      }
    });

    /*
     * 删除信息
     */
    const confirmDelete = (value) => {
        let requestData = {
          pageSize : refs.table.page.pageSize,
          pageNumber : refs.table.page.pageNumber,
          id : [Number(value)]
        }
        root.$store.dispatch(userstate.actions.delete,requestData).then(response=> {
          /*
          * 修改子组件的信息
           */
          refs.table.data.tableData = response.item
          refs.table.page.total = response.total
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
    };

     /*
     * 表格信息编辑
     */
    async function editInfo(value){
      
      /*封装*/
      value.options = props.option
      refs.editDialog.loadingProps(value)
      dialog_edit.value = true
    }

    /**编辑详情 */
    async function editInfoDetail(value){
      /*封装*/
      value.options = props.option
      value.date = toDate(null,value.createDate)
      root.$router.push({
          name : 'infoDetail',
          params : value  
      })
      await root.$store.dispatch(userstate.actions.detail,value)
    }


    return {
      //ref
      dialog_edit,
      //reactive
      userstate,
      tableData,
      //methods
      confirmDelete,editInfo,editInfoDetail,toDate,toCategory
    };
  },
};
</script>
<style lang="scss" scoped>
</style>