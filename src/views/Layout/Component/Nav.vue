<template>
  <div id="nav-wrap">
    <img class="logo" src="../../../assets/logo.png" alt="">
    <el-menu
      default-active="1-1-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item,index) in routers">
        <el-submenu v-if="!item.hidden"  :key="item.id" :index="index + ''">
          <!-- 一级菜单 -->
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"/>
            <span slot="title">{{item.meta.name}}</span>
          </template>
          <!-- 子级菜单 -->
          <template v-for="subItem in item.children">
            <el-menu-item
            v-if="!subItem.hidden"
            :key="subItem.id"
            :index="subItem.path"
            >{{subItem.meta.name}}</el-menu-item>
          </template>
          
        </el-submenu>
      </template>
    </el-menu>

  </div>
</template>
<script>
import {  reactive,  computed } from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, { root }) {
    /*
     *   data数据
     */
    const routers = reactive(root.$router.options.routes);

    /*
    *  computed 监听 
    */
    const isCollapse = computed(() => {
        return root.$store.getters["app/isCollapse"]
    })




    return {
      isCollapse,
      routers
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
.logo {
  text-align: center;
    margin:28px auto 25px;
    width: 92px;
  
}
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  z-index: 999;
  background-color: #344a5f;
  @include webkit(transition,all .3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }

}
.open{
  #nav-wrap{width:$navMenu;}
}
.close{
  #nav-wrap{width: $navMenuMin;}
  .logo {
     width: 80%;
     @include webkit(transition,all .3s ease 0s);
  }
}
</style>