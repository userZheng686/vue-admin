<template >
  <div>
    <DialogIndex
      class="dialog-wrap"
      :flag.sync="dialog_add_flag"
      :config="config"
      :data="data"
    >
      <template v-slot:username>
        <el-input
          class="dialog-wrap input"
          placeholder="请输入用户名"
          type="text"
          v-model="data.input.username"
        ></el-input>
      </template>
      <template v-slot:password>
        <el-input
          class="dialog-wrap input"
          placeholder="请输入6~20位的数字加字母"
          type="password"
          v-model="data.input.password"
        ></el-input>
      </template>
      <template v-slot:truename>
        <el-input
          class="dialog-wrap input"
          placeholder="请输入姓名"
          type="text"
          v-model="data.input.truename"
        ></el-input>
      </template>
      <template v-slot:phone>
        <el-input
          class="dialog-wrap input"
          placeholder="请输入手机号"
          type="text"
          v-model="data.input.phone"
        ></el-input>
      </template>
      <template v-slot:regionTranslate>
        <el-select
          v-model="data.input.regionTranslate[0]"
          class="dialog-wrap select"
        >
          <el-option
            v-for="item in config.region_option.province"
            :key="item.PROVINCE_ID"
            :value="item.PROVINCE_CODE"
            :label="item.PROVINCE_NAME"
          ></el-option>
        </el-select>
        <el-select
          v-model="data.input.regionTranslate[1]"
          v-show="config.region_show.city"
          class="dialog-wrap select left"
        >
          <el-option
            v-for="item in config.region_option.city"
            :key="item.CITY_ID"
            :value="item.CITY_CODE"
            :label="item.CITY_NAME"
          ></el-option>
        </el-select>
        <el-select
          v-model="data.input.regionTranslate[2]"
          v-show="config.region_show.area"
          class="dialog-wrap select left"
        >
          <el-option
            v-for="item in config.region_option.area"
            :key="item.AREA_ID"
            :value="item.AREA_CODE"
            :label="item.AREA_NAME"
          ></el-option>
        </el-select>
      </template>
      <template v-slot:status>
        <el-radio v-model="data.input.status" label="1">禁用</el-radio>
        <el-radio v-model="data.input.status" label="2">启用</el-radio>
      </template>
      <template v-slot:role>
        <el-checkbox-group v-model="data.input.roleTranslate">
          <el-checkbox
            v-for="item in config.role_option"
            :key="item.id"
            :label="item.label"
          ></el-checkbox>
        </el-checkbox-group>
      </template>
    </DialogIndex>
  </div>
</template>
<script>
import { ref, reactive, watch } from "@vue/composition-api";
import DialogIndex from "@c/Dialog/index";
import { CityPicker } from "@/api/user";
import {
  validateUsername,
  validatePhone,
  validateRegion,
  validatePass,
  validateTrueName,
} from "@u/validate";
import { debounce } from "@u/common";
export default {
  name: "UserAddIndex",
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Object,
      default: () => {},
    },
  },
  components: { DialogIndex },
  setup(props, { emit }) {
    //弹窗显示编辑
    const dialog_add_flag = ref(false);

    /*
     * 弹窗新增配置
     * 标题
     * label
     * 请求的方法（api）
     * 请求的方法参数
     */
    const config = reactive({
      title: "新增",
      label: [
        { field: "username", name: "用户名:", slotName: "username" },
        { field: "password", name: "密码:", slotName: "password" },
        { field: "truename", name: "真实姓名:", slotName: "truename" },
        { field: "phone", name: "手机号:", slotName: "phone" },
        {
          field: "regionTranslate",
          name: "地区:",
          slotName: "regionTranslate",
        },
        { field: "status", name: "是否启用:", slotName: "status" },
        { field: "role", name: "角色:", slotName: "role" },
      ],
      region_show: {
        city: false,
        area: false,
      },
      region_option: {
        province: [],
        city: [],
        area: [],
      },
      role_option: [
        { id: 1, label: "信息管理员" },
        { id: 2, label: "用户管理员" },
      ],
      //校验规则
      rules: {
        username: [{ validator: debounce(validateUsername), trigger: "blur" }],
        password: [{ validator: debounce(validatePass), trigger: "blur" }],
        truename: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          { validator: debounce(validateTrueName), trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: debounce(validatePhone), trigger: "blur" },
        ],
        regionTranslate: [{ validator: validateRegion, trigger: "blur" }],
        status: [
          { required: true, message: "请确定是否启用", trigger: "blur" },
        ],
        role: [{ required: true, message: "请选择角色", trigger: "blur" }],
      },
      //请求接口数据
      actions: props.state.actions.add,
    });

    const data = reactive({
      input : {
        username: "",
        truename: "",
        password: "",
        phone: "",
        region: "",
        regionTranslate: ["", "", ""],
        status: "",
        role: [],
        roleTranslate: [],
      }
    })



    /*
     * 加载所有的省级行政区
     */
    async function loadingProvince() {
      const province = await CityPicker({ type: "province" });
      config.region_option.province = province.data.data;
    }

    /*
     * 按照省级行政区加载地级行政区
     */
    async function loadingCity() {
      const city = await CityPicker({
        type: "city",
        province_code: data.input.regionTranslate[0],
      });
      config.region_option.city = city.data.data;
    }

    /*
     * 按照地级行政区加载县级行政区
     */
    async function loadingArea() {
      const area = await CityPicker({
        type: "area",
        city_code: data.input.regionTranslate[1],
      });
      config.region_option.area = area.data.data;
    }

    async function settingRegion() {
      let regionTranslate = data.input.regionTranslate;
      data.input.region = JSON.stringify(regionTranslate.join());
    }

    //监听页面是否打开
    watch(
      () => props.flag,
      (newVal) => {
        dialog_add_flag.value = newVal;
      }
    );

    watch(
      () => dialog_add_flag.value,
      (newVal) => {
        if (newVal === false) {
          emit("update:flag", false);
        }
      }
    );

    /*
     * watch监听 选项变化
     */
    watch(
      () => data.input.regionTranslate[0],
      () => {
        // 做点什么
        /*
         * 第一步 先显示地级行政区
         * 第二步 加载对应的地级行政区数据
         * 第三步 region传参
         */
        if (!config.region_show.city) {
          config.region_show.city = true;
        }
        data.input.regionTranslate[1] = "";
        data.input.regionTranslate[2] = "";
        if (data.input.regionTranslate[0]) {
          loadingCity();
          settingRegion();
        }
      }
    );

    watch(
      () => data.input.regionTranslate[1],
      () => {
        // 做点什么
        /*
         * 第一步 先显示县级行政区
         * 第二步 加载对应的县级行政区数据
         * 第三步 region传参
         */
        if (!config.region_show.area) {
          config.region_show.area = true;
        }
        data.input.regionTranslate[2] = "";
        if (data.input.regionTranslate[1]) {
          loadingArea();
          settingRegion();
        }
      }
    );

    watch(
      () => data.input.regionTranslate[2],
      () => {
        // 做点什么
        // region传参
        settingRegion();
      }
    );

    watch(
      () => data.input.roleTranslate,
      /*
       * 监听角色对象
       */
      (newVal) => {
        //做点什么
        /*
         * 第一步 清空数组内容
         * 第二部 转换
         */
        let str = newVal.join();
        str = str.replace("信息管理员", "infoSystem");
        str = str.replace("用户管理员", "userSystem");
        data.input.role = str;
      }
    );

    return {
      //ref
      dialog_add_flag,
      //reactive
      config,data,
      //methods
      loadingProvince,
      loadingCity,
      loadingArea,
      settingRegion,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
.el-dialog {
  @include px2rem(width, 576);
}
div.dialog-wrap {
  // @include px2rem(width,576);
  &.input {
    @include px2rem(width, 403);
    @include px2rem(height, 38);
  }
  &.select {
    @include px2rem(width, 113);
    &.left {
      @include px2rem(margin-left, 21);
    }
  }
}
</style>