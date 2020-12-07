export function getSession(key){
    let data = sessionStorage.getItem(key)
    return JSON.parse(data)
}

export function setSession(parms){
    parms.data = JSON.stringify(parms.data)
    sessionStorage.setItem(parms.key,parms.data)
}