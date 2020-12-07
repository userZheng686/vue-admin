import service from '@/utils/request'

export function GetUser(data){
    return service.request({
        method: 'post',
        url : '/user/getList/',
        data
    })
}

export function AddUser(data){
    return service.request({
        method: 'post',
        url : '/user/add/',
        data
    })
}

export function EditUser(data){
    return service.request({
        method: 'post',
        url : '/user/edit/',
        data
    })
}

export function DeleteUser(data){
    return service.request({
        method: 'post',
        url : '/user/delete/',
        data
    })
}

export function ActiveUser(data){
    return service.request({
        method: 'post',
        url : '/user/actives/',
        data
    })
}

export function UserRole(data){
    return service.request({
        method: 'post',
        url : '/user/userRole/',
        data
    })
}

export function CityPicker(data){
    return service.request({
        method : 'post',
        url : '/cityPicker/',
        data
    })
}

