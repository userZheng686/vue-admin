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
      <template v-slot:truename>
        <el-input
          class="dialog-wrap input"
          placeholder="请输入姓名"
          type="text"
          v-model="data.input.truename"
          :disabled="true"
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
import { validateUsername, validatePhone, validateRegion } from "@u/validate";
import { debounce } from "@u/common";
export default {
  name: "UserEditIndex",
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
        title: "编辑",
        label: [
          { field: "username", name: "用户名:", slotName: "username" },
          { field: "truename", name: "真实姓名:", slotName: "truename" },
          { field: "phone", name: "手机号:", slotName: "phone" },
          {
            field: "regionTranslate",
            name: "地区:",
            slotName: "regionTranslate",
          },
          { field: "role", name: "角色:", slotName: "role" },
        ],
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
          username: [
            { validator: debounce(validateUsername), trigger: "blur" },
          ],
          phone: [{ validator: debounce(validatePhone), trigger: "blur" }],
          regionTranslate: [{ validator: validateRegion, trigger: "blur" }],
          role: [{ required: true, message: "请选择角色", trigger: "blur" }],
        },
        actions: props.state.actions.edit,
    });

    const data = reactive({
      input: {
        id: "",
        username: "",
        truename: "",
        phone: "",
        region: "",
        regionTranslate: ["", "", ""],
        role: [],
        roleTranslate: [],
      },
    });

    
    /*
     * 加载传进来的props值
     */
    async function loadingProps(value) {
      let obj = data.input;
      for (let key in value) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj[key] = value[key];
        }
      }
      //将对应的值转化（translate）

      /*
       * 地区
       */
      let region = JSON.parse(value["region"]).split(",");
      obj["regionTranslate"] = region;

      /*
       * 角色
       */
      let role = value["role"].split(",");
      for (let i = 0; i < role.length; i++) {
        if (role[i] === "infoSystem") {
          obj["roleTranslate"].push("信息管理员");
        } else {
          obj["roleTranslate"].push("用户管理员");
        }
      }
      await loadingProvince();
    }

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
      (newVal, oldVal) => {
        // 做点什么
        /*
         * 第一步 先显示地级行政区
         * 第二步 加载对应的地级行政区数据
         * 第三步 region传参
         */
        if (newVal && oldVal) {
          if (data.input.regionTranslate[1]) {
            data.input.regionTranslate[1] = "";
          }
          if (data.input.regionTranslate[2]) {
            data.input.regionTranslate[2] = "";
          }
        }
        if (data.input.regionTranslate[0]) {
          loadingCity();
          settingRegion();
        }
      }
    );

    watch(
      () => data.input.regionTranslate[1],
      (newVal, oldVal) => {
        // 做点什么
        /*
         * 第一步 先显示县级行政区
         * 第二步 加载对应的县级行政区数据
         * 第三步 region传参
         */
        if (newVal && oldVal) {
          if (newVal != oldVal) {
            data.input.regionTranslate[2] = "";
          }
        }
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
      loadingProps,
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
div.label-wrap {
  &.key-word {
    @include labelDom(left, 80, 40);
  }
  &.input {
    @include labelDom(left, 20, 40);
  }
}
div.dialog-wrap {
  &.input {
    @include px2rem(width, 401);
  }
  &.select {
    @include px2rem(width, 113);
    &.left {
      @include px2rem(margin-left, 21);
    }
  }
}
</style>