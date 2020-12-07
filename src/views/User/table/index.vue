<template>
  <div>
    <!--表格组件-->
    <Tableindex :config="tableData.config" :state="userstate" ref="table">
      <!-- <template slot-scope="scope"> -->
      <template v-slot:status="slotData">
        <el-switch
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value = "2"
          inactive-value = "1"
          v-model="slotData.data.status"
          @change="handleSwitch(slotData.data)"
        ></el-switch>
      </template>
      <template v-slot:operation="slotData">
            <el-button type="danger" @click="confirmDelete(slotData.data.id)"
              >删除</el-button
            >
            <el-button type="success" @click="editInfo(slotData.data)"
              >编辑</el-button
            >
      </template> 
      <!-- </template> -->
    </Tableindex>

    <UserEditIndex :flag.sync="dialog_edit" :state="userstate" ref="editDialog"></UserEditIndex>
  </div>
</template>
<script>
import Tableindex from "@c/TableItem/index";
import { ref,reactive } from "@vue/composition-api";
import UserEditIndex from "../dialog/edit";
export default {
  name: "UserTableIndex",
  components: { Tableindex, UserEditIndex },
  props : {
    state : {
      type : Object,
      default : () => {}
    }
  },
  setup(props,{root,refs}) {
    //信息新增标记
    const dialog_edit = ref(false);

    /**vuex */
    const userstate = props.state


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
          { field: "username", label: "邮箱/用户名" },
          { field: "truename", label: "真实姓名" },
          { field: "phone", label: "手机号" },
          { field: "region", label: "地区" },
          { field: "role", label: "角色" },
          {
            field: "status",
            label: "紧启用状态",
            columnType: "slot",
            slotName: "status",
          },
          { label: "操作", columnType: "slot", slotName: "operation",width : "189px" },
        ],
        //请求接口参数
        requestData: {
          username: "",
          truename: "",
          phone: "",
          pageNumber : 1,
          pageSize : 10
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
              message: error,
              type: 'error'
          })
        })
    };

    /*
    * 动态路由权限设置
     */
    const handleSwitch = (val) => {
      let requestData = {
        id : val.id,
        status : val.status
      }
      root.$store.dispatch(userstate.actions.change,requestData).then(() => {
          root.$message({
            type : 'success',
            message : '修改成功'
          })
      })
    }

    /*
     * 表格信息编辑
     */
    async function editInfo(value){
      dialog_edit.value = true
      refs.editDialog.loadingProps(value)
    }


    return {
      //ref
      dialog_edit,
      //reactive
      userstate,
      tableData,
      //methods
      confirmDelete,editInfo,handleSwitch
    };
  },
};
</script>
<style lang="scss" scoped>
</style>