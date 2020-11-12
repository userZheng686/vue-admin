import {GetCategoryAll,DeleteCategory,EditCategory,AddFirstCategory,AddSecondCategory} from '@/api/news';

const state = {
    item : ''
}

const getters = {
    getitem : state => state.item
}


const mutations = {
    SET_ITEM(state,parms){
       state.item = parms.data
       if(parms.state){
         localStorage.setItem('categoryItem',JSON.stringify(state.item))
       }
    },

}

const actions = {
    setItem(content){
        return new Promise((resolve,reject) => {
            let isStorage = localStorage.getItem('categoryItem')
            if(isStorage){
                isStorage = JSON.parse(isStorage);
                content.commit('SET_ITEM',{data:isStorage,state:false})
                resolve(isStorage)
            }else{
                GetCategoryAll({}).then(response => {
                    let data = response.data
                    let arr = []
                    for(let i=0;i<data.length;i++){
                        if(!data[i].children){
                           data[i].children = arr
                        }
                    }
                    content.commit('SET_ITEM',{data:data,state:true})
                    resolve(data)
                }).catch(error => {
                    reject(error)
                }) 
            }
        })
    },
    getItem(){
        // return content.commit('GET_ITEM')
        return state.item
    },
    deleteCategory(content,requestData){
        return new Promise((resolve,reject) => {
            DeleteCategory({categoryId:requestData.id}).then(response => {
                let data = response
                if(data.resCode === 0){
                    let item = actions.getItem()
                    if(requestData.parentid){
                        let index = item.findIndex(item => item.id == requestData.parentid)
                        let childrenIndex = item[index].children.findIndex(item => item.id == requestData.id)
                        item[index].children.splice(childrenIndex,1)
                    }else{
                        let index = item.findIndex(item => item.id == requestData.id)
                        item.splice(index,1)
                    }
                    let parms = {
                        data : item,
                        state : true
                    }
                    content.commit('SET_ITEM',parms)
                    resolve(response)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    editCategory(content,requestData){
        return new Promise((resolve,reject) => {
            EditCategory({id:requestData.id,categoryName:requestData.name}).then(response => {
                let data = response
                if(data.resCode === 0){
                    let item = actions.getItem()
                    if(requestData.parentid){
                        let index = item.findIndex(item => item.id == requestData.parentid)
                        let childrenIndex = item[index].children.findIndex(item => item.id == requestData.id)
                        item[index].children[childrenIndex].category_name = requestData.name
                    }else{
                        let index1 = item.findIndex(item => item.id == requestData.id)
                        item[index1].category_name = requestData.name;
                    }
                    let parms = {
                        data : item,
                        state : true
                    }
                    content.commit('SET_ITEM',parms)
                    resolve(response)
                    // {
                    //     'success':data.message
                    // }
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    addCategoryFirst(content,requestData){
        return new Promise((resolve,reject) => {
            AddFirstCategory({categoryName:requestData.name}).then(response => {
                let data = response
                if(data.resCode === 0){
                    let item = actions.getItem()
                    item.push(data.data)
                    let parms = {
                        data : item,
                        state : true
                    }
                    content.commit('SET_ITEM',parms)
                    resolve(response)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    addCategorySecond(content,requestData){
        return new Promise((resolve,reject) => {
            AddSecondCategory({categoryName:requestData.name,parentId:requestData.parentid}).then(response => {
                let data = response
                if(data.resCode === 0){
                    let item = actions.getItem()
                    let index = item.findIndex(item => item.id == requestData.parentid)
                    data.data.parent_id = requestData.parentid
                    item[index].children.push(data.data)
                    let parms = {
                        data : item,
                        state : true
                    }
                    content.commit('SET_ITEM',parms)
                    resolve(response)
                }
            }).catch(error => {
                reject(error)
            })
        })
    }

}

export default {
   namespaced:true,
   state,
   getters,
   mutations,
   actions
}