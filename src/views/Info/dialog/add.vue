<template>
  <div>
    <DialogIndex
      class="dialog-wrap"
      :flag.sync="dialog_info_flag"
      :config="config"
      :data="data"
    >
        <template v-slot:categoryId>
            <el-select v-model="data.input.categoryId" placeholder="请选择分类">
                <el-option v-for="item in data.input.options" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
            </el-select>
        </template>
        <template v-slot:title>
            <el-input v-model="data.input.title" placeholder="请输入标题"></el-input>
        </template>
        <template v-slot:content>
            <el-input type="textarea" v-model="data.input.content" placeholder="请输入标题"></el-input>
        </template>
    </DialogIndex>
  </div>
</template>
<script>
import { reactive, ref, watch } from "@vue/composition-api";
import DialogIndex from "@c/Dialog/index";
export default {
  name: "dialogInfo",
  //单向数据流，父级->子级，不能反向修改
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Object,
      default: () => {},
    }
  },
  components: { DialogIndex },
  setup(props,{emit}) {
    const dialog_info_flag = ref(false);

    /*
     * 弹窗编辑配置
     * 标题
     * label
     * 请求的方法（api）
     * 请求的方法参数
     */
    const config = reactive({
      /*
       * 新增弹窗配置
       */
      title: "新增",
      label: [
        { field: "categoryId", name: "类型:", slotName: "categoryId" },
        { field: "title", name: "标题:", slotName: "title" },
        { field: "content", name: "概况:", slotName: "content" },
      ],
      //校验规则
      rules: {
        categoryId: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入概况", trigger: "blur" }],
      },
      actions: props.state.actions.add,
    });

    const data = reactive({
      input: {
        id: "",
        categoryId: "",
        options : [],
        title: "",
        content: "",
        imgUrl : ""
      },
    });

    /*
     * 加载传进来的props值
     */
    async function loadingProps(value) {
      data.input.options = value
    }

    

    watch(
      () => props.flag,
      (newVal) => {
        dialog_info_flag.value = newVal;
      }
    );

    watch(
      () => dialog_info_flag.value,
      (newVal) => {
        if (newVal === false) {
          emit("update:flag", false);
        }
      }
    );

    return {
      //ref
      dialog_info_flag,
      //reactive
      config,
      data,
      //methods
      loadingProps,
    };
  },
};
</script>
<style lang="scss" scoped>
</style>