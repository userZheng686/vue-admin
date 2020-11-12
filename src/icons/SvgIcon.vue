<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>
<script>
import {computed} from "@vue/composition-api";
export default {
    name:'svgIcon',
    //props:['iconClass','className'],
    props:{
        iconClass:{type:String,default:''},
        className:{type:String,default:''}
    },
    setup(props){
        const iconName = computed(() => `#icon-${props.iconClass}`)
        const svgClass = computed(() => {
            if(props.className){
                return `svg-icon ${props.className}`
            }else{
                return `svg-icon`
            }
        })
        return {
            iconName,svgClass
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
    &.font12{
        font-size: 12px;
    }
}
</style>