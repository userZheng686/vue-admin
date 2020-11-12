import service from '@/utils/request'

/*
列表
*/ 

/*
新增
*/ 


/*
编辑
*/ 


/*
删除
*/ 

/*
一级分类添加
*/ 
export function AddFirstCategory(data){
    return service.request({
        method:'post',
        url :'/news/addFirstCategory/',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })

}

/*
二级分类添加
*/ 
export function AddSecondCategory(data){
    return service.request({
        method:'post',
        url :'/news/addChildrenCategory/',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })
}

/*
获取分类
没有子级
*/ 
export function GetCategory(data){
    return service.request({
        method:'post',
        url :'/news/getCategory/ ',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })

}
/*
获取分类
有字级
*/
export function GetCategoryAll(data){
    return service.request({
        method:'post',
        url :'/news/getCategoryAll/ ',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })
}

/*
删除分类
*/ 
export function DeleteCategory(data){
    return service.request({
        method:'post',
        url :'/news/deleteCategory/ ',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })

}

/*
修改分类
*/ 
export function EditCategory(data){
    return service.request({
        method:'post',
        url :'/news/editCategory/ ',
        data 
        //左边的data是变量名(key)后台接收的，右边的data是接收的参数。如果两者同名，写成一个即可(es6)
    })

}