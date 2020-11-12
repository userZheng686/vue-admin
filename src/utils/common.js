export function timestampToTime(timestamp)
{
    var now = new Date(timestamp*1000);
    var year=now.getFullYear();    
    var month=now.getMonth()+1;    
    var date=now.getDate();    
    var hour=now.getHours();    
    var minute=now.getMinutes();    
    var second=now.getSeconds();    
    return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;     
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

export function getSession(key){
    let data = sessionStorage.getItem(key)
    return JSON.parse(data)
}

export function setSession(parms){
    parms.data = JSON.stringify(parms.data)
    sessionStorage.setItem(parms.key,parms.data)
}