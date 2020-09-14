<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
     </svg>
</template>
<script>
import { ref, reactive, isRef, toRefs, onMounted, computed } from "@vue/composition-api";
export default {
    name:'svgIcon',
    // props:['iconClass','className'],
    props:{
        iconClass:{
            type:String,    //定义接收的值
            default:'',
        },
        className:{
            type:String,    //定义接收的值
            default:'',
        }
    },
    setup(props,{root}){

        const iconName = computed(() => `#icon-${props.iconClass}`);

        const svgClass = computed(() => {
            if(props.className){
                return `svg-icon ${props.className}`
            }else{
                return `svg-icon`
            }
        })

        return {
            iconName,
            svgClass
        }
    }
}
</script>
<style lang="scss" scoped>
.svg-icon {
    width:1em;
    height:1em;
    fill: currentColor;
    color: white;
    &.font12 {
        font-size: 12px;
    }
}
</style>