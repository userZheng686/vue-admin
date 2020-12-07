<template>
  <div>
    <div class="search-wrap">
      <div class="search-wrap left">
        <label>关键字:</label>
      </div>
      <div class="search-wrap middle">
        <div class="search-wrap middle body">
          <div class="middle left">
            <el-select placeholder="请选择" v-model="dataSelect.Select">
              <el-option
                v-for="item in dataSelect.options"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="middle center">
            <el-input
              placeholder="请输入内容"
              v-model="dataSelect.input"
            ></el-input>
          </div>
          <div class="middle right">
            <el-button @click="search()" type="danger" class="pull-left">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="search-wrap right">
        <div class="search-wrap right body">
          <el-button type="danger" class="pull-right" @click="add()"
            >新增</el-button
          >
        </div>
      </div>
    </div>
    

   <div class="black-space-30"></div>

    <!--表格组件-->
    <UserTableIndex :state="userstate"></UserTableIndex>

    <div class="black-space-30"></div>

    <!--新增弹窗组件-->
    <UserAddIndex
      :flag.sync="dialog_add"
      :state="userstate"
      ref="addDialog"
    ></UserAddIndex>
  </div>
</template>
<script>
import { reactive, ref } from "@vue/composition-api";
import UserAddIndex from "./dialog/add";
import UserTableIndex from "./table/index";
export default {
  name: "UserIndex",
  components: { UserAddIndex, UserTableIndex },
  setup(props, { root,refs }) {
    //信息新增标记
    const dialog_add = ref(false);

    const dataSelect = reactive({
      select: "",
      options: [
        { value: "email", name: "邮箱" },
        { value: "phone", name: "手机号" }
      ],
      input: "",
    });

    const userstate = reactive({
      name: "user",
      item : 'item',
      getters : {
        item : "user/getitem",
        total : "user/gettotal"
      },
      actions: {
        get: "user/getItem",
        set: "user/setItem",
        edit: "user/editItem",
        delete: "user/deleteItem",
        add: "user/addItem",
        total: "user/getTotal",
        filp: "user/flipItem",
        change: "user/changeStatus",
      },
    });

    let add = () => {
      dialog_add.value = true;
      refs.addDialog.loadingProvince();
    };

    let search = () => {
      let search_key = dataSelect.Select
      let search_value = dataSelect.input
      let requestData = {
        username : '',
        truename : '',
        phone : '',
        pageNumber : 1,
        pageSize : 10
      }

      if(!search_key){
        root.$message({
          type : 'error',
          message : '请确定关键字'
        })
        return false
      }else if(search_key === 'email'){
        requestData.username = search_value
      }else if(search_key === 'phone'){
        requestData.phone = search_value
      }
      root.$store.dispatch('user/searchItem',requestData).catch(() => {
        root.$message({
          type : 'error',
          message : '搜索失败，请再次查找'
        })
      })
    }

    return {
      //ref
      dialog_add,
      userstate,
      //reactive
      dataSelect,
      //methods
      add,search
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.search-wrap {
  display: flex;
  align-items: center;
  &.left {
    @include px2rem(width, 75);
  }
  &.middle {
    flex: 1;
    &.body {
      display: flex;
      justify-content: flex-start;
    }
  }
  &.right {
    &.body {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
.middle {
  &.left {
    width: 161px;
    // @include px2rem(width, 161);
  }
  &.center {
    width: 179px;
    @include px2rem(margin-left, 14);
    // @include px2rem(width, 179);
  }
  &.right {
    @include px2rem(margin-left, 14);
    // @include px2rem(width, 97);
  }
}
.content{
  min-width: 1200px !important;
}
</style>