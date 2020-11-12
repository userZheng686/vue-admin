<template>
    <div id="main-wrap">
        <div class="main-content"> 
            <div class="content">
                <router-view />
            </div>
        </div>
    </div>
</template>
<script>
import { ref} from "@vue/composition-api";

export default {
    name:'layoutMain',
    setup(){
        const str = ref("{name:'手把手撸码',title:'aaa'}");
        return {
            str
        }
    }
    
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap{
    height: 100vh;
    background-color: #f7f7f7;
    // position: fixed;
    // left: $navMenu;
    // top: 75px;
    // right: 0;
    // bottom: 0;
    // border: 30px solid #f7f7f7;
    // border-bottom: none;
    // -webkit-box-sizing: border;

}
.main-content {
    width: 100%;
    height: 100%;
    padding-top: $layoutHeader + 30;
    padding-left: $navMenu + 30;
    padding-right: 30px;
    @include webkit(box-sizing,border-box);
    @include webkit(transition,all .2s ease 0s);
}

.open {
    .main-content{padding-left: $navMenu + 30;}
}

.close{
    .main-content{padding-left: $navMenuMin + 30;}
}


.content {
    width: 100%;
    height: 100%;
    padding: 30px 30px 0;
    @include webkit(box-sizing,border-box);
    background-color: #fff;
}
</style>