<template>
  <div>
    <div class="search-wrap">
      <div class="search-wrap first">
        <label>分类:</label>
        <div class="first right">
          <el-select placeholder="请选择" v-model="select.categoryid">
            <el-option
                v-for="item in select.options"
                :key="item.id"
                :label="item.category_name"
                :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="search-wrap second">
        <label>日期:</label>
        <div class="second right">
          <el-date-picker
            style="width: 100%"
            v-model="select.date"
            type="datetimerange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd HH:MM:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="search-wrap third">
        <label>关键字:</label>
        <div class="third right">
          <el-select
            placeholder="请选择"
            v-model="select.key"
            class="right select"
          >
            <el-option v-for="item in search_option" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
          <el-input
            v-model="select.value"
            placeholder="请输入内容"
            class="right input"
          ></el-input>
        </div>
      </div>
      <div class="search-wrap four">
         <el-button type="danger" @click="search()">搜索</el-button>
      </div>
      <div class="search-wrap five">
         <el-button type="danger" @click="add()">新增</el-button>
      </div>
    </div>

    <div class="black-space-30"></div>


    <!--表格数据-->
    <InfoTableIndex :state="userstate" :option="select.options"></InfoTableIndex>

    <!--新增弹窗-->
    <InfoDialogAdd :flag.sync="dialog_add" :state="userstate"  ref="addDialog"></InfoDialogAdd>


    <div class="black-space-30"></div>

  </div>
</template>
<script>

import { onBeforeMount, reactive,ref } from "@vue/composition-api";
import InfoTableIndex from "./table/index";
import InfoDialogAdd from "./dialog/add";
export default {
  name: "infoIndex",
  components: { InfoTableIndex,InfoDialogAdd },
  setup(props,{root,refs}) {
    /*
     * 数据
     */

    //信息新增标记
    const dialog_add = ref(false);

    //reactive

    /*表单选择*/
    const select = reactive({
      categoryid: "",
      options: [],
      date: "",
      key: "",
      value: "",
    });


    /*关键字选项*/
    const search_option = reactive([
      {
        value: "id",
        label: "ID",
      },
      {
        value: "title",
        label: "标题",
      },
    ]);

    const userstate = reactive({
      name: "info",
      item : 'item',
      getters : {
        item : "info/getitem",
        total : "info/gettotal",
        detail : "info/getdetail",
        option : "category/getItem"
      },
      actions: {
        get: "info/getItem",
        set: "info/setItem",
        search : "info/searchItem",
        edit: "info/editItem",
        delete: "info/deleteItem",
        add: "info/addItem",
        total: "info/getTotal",
        filp: "info/flipItem",
        detail : 'info/setDetail'
      },
    });

    let search = () => {
      let requestData = {
        categoryId: select.categoryid,
        startTiem: select.date ? select.date[0] ? select.date[0] : '' : '',
        endTime: select.date ? select.date[1] ? select.date[1] : '' : '',
        pageNumber: 1,
        pageSize: 10
      }
      if(select.key === 'id'){requestData.id = select.value}else{requestData.title = select.value}

      root.$store.dispatch(userstate.actions.search,requestData)
    }
    
    let add = () => {
      dialog_add.value = true;
      refs.addDialog.loadingProps(select.options);
    };

    async function loadingOption(){
        if(root.$store.getters[userstate.getters.option].length === 0){
            await root.$store.dispatch('category/setItem')
        }
        select.options = root.$store.getters[userstate.getters.option]
    }

    onBeforeMount(() => {
        loadingOption()
    })




    return {
      //ref
      dialog_add,
      //reactive
      select,search_option,userstate,
      //methods
      search,add,loadingOption
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.search-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.first {
    @include px2rem(width, 200);
  }
}
.first {
  &.right {
    @include px2rem(width, 141);
    @include px2rem(margin-left, 23);
  }
}
.second {
  &.right {
    @include px2rem(margin-left, 24);
    @include px2rem(width, 299) // @include px2rem(width, 97);
;
  }
}
.third {
  &.right {
    @include px2rem(margin-left, 24);
    @include px2rem(width, 298);
  }
}
.right {
  &.select {
    @include px2rem(width, 103);
  }
  &.input {
    @include px2rem(width, 179);
    @include px2rem(margin-left,15)
  }
}
</style>