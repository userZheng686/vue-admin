export function timestampToTime(timestamp)
{
    var now = new Date(timestamp*1000);
    var year=now.getFullYear();    
    var month=now.getMonth()+1;    
    var date=now.getDate();    
    var hour=now.getHours();    
    var minute=now.getMinutes();    
    var second=now.getSeconds();    
    return   year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;     
}

export function getExactTime(time) {
    var date = new Date(time);
    // var date = new Date(time* 1000);
    var year = date.getFullYear() + '-';
    var month = (date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1) + '-';
    var dates = date.getDate() + ' ';
    var hour = date.getHours() + ':';
    var min = date.getMinutes() + ':';
    var second = date.getSeconds();
    return year + month + dates + hour + min + second ;
}

export function prefixZero(num){
     return num >= 10 ? num : "0" + num;
}


export function formatDate(timeStamp) {

    let date = new Date(timeStamp);
    return date.getFullYear() + "/"
        + prefixZero(date.getMonth() + 1) + "/"
        + prefixZero(date.getDate()) + "-"
        + prefixZero(date.getHours()) + ":"
        + prefixZero(date.getMinutes());
}



/*
*实现一个防抖函数
*/
export function debounce(func,wait = 1000){
    var context,arg;
    var timer

    var later = function(){
        timer = setTimeout(() => {
            timer = null
            func.apply(context,timer)
        }, wait);
    }

    
    return function(...args){
        context = this 
        arg = args;
        if(!timer){
            func.apply(context,arg)
        }else{
            later()
        }
    }
}

