import {GetCategory} from '@/api/news';
import {GetInfo,AddInfo,EditInfo,DeleteInfo} from '@/api/info';
// import { reject } from 'core-js/fn/promise';


const state = {
    item : [],
    total : 0,
    categoryId : ''
}

const getters = {
    getitem : state => state.item,
    gettotal : state => state.total,
    getcategory : state => state.categoryId
}

const mutations = {
    SET_ITEM(state,parms){
       state.item = parms.data
       if(parms.state){
         localStorage.setItem('infoItem',JSON.stringify(state.item))
       }
    },
    SET_TOTAL(state,parms){
        state.total = parms.data
        if(parms.state){
          localStorage.setItem('infoTotal',JSON.stringify(state.total))
        }
    },
    SET_CATEGORYID(state,parms){
        state.categoryId = parms.data
        if(parms.state){
             localStorage.setItem('infoCategory',JSON.stringify(state.categoryId))
        }
    }
}   

const actions = {
    getItem(){
        return state.item
    },
    getTotal(){
        return Number(state.total)
    },
    setFirstItem(content,requestData){
        return new Promise((resolve,reject) => {
            let isStorage = localStorage.getItem('infoItem')
            let isTotal = localStorage.getItem('infoTotal')
            if(isStorage&&isTotal){
                isStorage = JSON.parse(isStorage);
                content.commit('SET_ITEM',{data:isStorage,state:false})
                content.commit('SET_TOTAL',{data:isTotal,state:false})
                let arr = []
                let length = isStorage.length > 10 ?  10 : isStorage.length
                for(let i=0;i<length;i++){
                    arr.push(isStorage[i])
                }
                resolve(arr)
            }else{
                GetInfo(requestData).then(response => {
                    let data = response.data
                    let item = actions.getItem()
                    for(let i=0;i<data.data.length;i++){
                        item.push(data.data[i])
                    }
                    content.commit('SET_TOTAL',{data:Number(data.total),state:true})
                    content.commit('SET_ITEM',{data:item,state:true})
                    resolve(item)
                }).catch(error => {
                    reject(error)
                }) 
            }
        })
    },
    setSecondItem(content,requestData){
        return new Promise((resolve,reject) => {
            let item = actions.getItem()
            let number = requestData.pageNumber * requestData.pageSize - requestData.pageSize;
            if(!item[number]){
                GetInfo(requestData).then(response => {
                    let data = response.data
                    let item = actions.getItem()
                    for(let i=0;i<data.data.length;i++){
                        item.push(data.data[i])
                    }
                    let arr = []
                    for(let j=0;j<data.data.length;j++){
                        arr.push(data.data[j])
                    }
                    content.commit ('SET_ITEM',{data:item,state:true})
                    resolve(arr)
                }).catch(error => {
                    reject(error)
                })  
            }else{
                let arr = []
                for(let j=number;j<number+requestData.pageSize;j++){
                    if(item[j]){
                        arr.push(item[j])
                    }
                }
                resolve(arr)
                
            }
            
        })
    },
    setThreeItem(content,requestData){
        return new Promise((resolve,reject) => {
            console.log(requestData)
            if(!requestData.categoryId && !requestData.endTime && !requestData.id && !requestData.startTiem && !requestData.title){
                const item = actions.getItem()
                let arr = [];
                for(let i=0;i<requestData.pageSize;i++){
                    arr.push(item[i])
                }
                content.commit('SET_TOTAL',{data:item.length,state:false})
                resolve(arr)
            }else{
                GetInfo(requestData).then(response => {
                    content.commit('SET_TOTAL',{data:response.data.data.length,state:false})
                    resolve(response.data.data)
                }).catch(error => {
                    reject(error)
                })
            }
            
        })
    },
    addInfo(content,requestData){
        return new Promise((resolve,reject) => {
            AddInfo(requestData).then(response => {
                if(response.resCode === 0){
                    let total = actions.getTotal()
                    let item = actions.getItem()
                    let time = +new Date()
                    let number = requestData.page * requestData.size - requestData.size;
                    let data = {
                        categoryId : requestData.categoryId,
                        categoryName: null,
                        content: requestData.content,
                        createDate: time.toString(),
                        id: (Number(item[0].id) + 1).toString(),
                        imgUrl: null,
                        status: null,
                        title: requestData.title
                    }
                    item.unshift(data)
                    content.commit ('SET_ITEM',{data:item,state:true})
                    content.commit('SET_TOTAL',{data:total + 1,state:true})
                    let arr = []
                    for(let j=number;j<number+requestData.size;j++){
                        if(item[j]){
                            arr.push(item[j])
                        }
                    }
                    let obj = {
                        item : arr,
                        total : total + 1
                    }
                    resolve(obj)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    editInfo(content,requestData){
        return new Promise((resolve,reject) => {
            EditInfo(requestData).then(response => {
                let item = actions.getItem()
                let number = requestData.pageNumber * requestData.pageSize - requestData.pageSize;
                let arr = [];
                for(let i=number;i<number+requestData.pageSize;i++){
                    if(item[i].id === requestData.id){
                        item[i].categoryId = requestData.categoryId;
                        item[i].categoryName = requestData.categoryName;
                        item[i].title = requestData.title;
                        item[i].content = requestData.content;
                        item[i].imgUrl = requestData.imgUrl;
                    }
                    arr.push(item[i])
                }
                content.commit('SET_ITEM',{data:item,state:true})
                console.log(response)
                resolve(arr)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    
    },
    deleteInfo(content,requestData){
        return new Promise((resolve,reject) => {
            DeleteInfo({id:requestData.id}).then(response => {
                if(response.resCode === 0){
                    let item = actions.getItem()
                    let total = actions.getTotal()
                    let number = requestData.page * requestData.size - requestData.size;
                    // let data = item.findIndex(item => item.id)
                    for(let i=0;i<requestData.id.length;i++){
                        let index = item.findIndex(item => item.id == requestData.id[i])
                        item.splice(index,1)
                        total = total - 1
                    }
                    content.commit ('SET_ITEM',{data:item,state:true})
                    content.commit ('SET_TOTAL',{data:total,state:true})
                    let arr = []
                    for(let j=number;j<number+requestData.size;j++){
                        if(item[j]){
                            arr.push(item[j])
                        }
                    }
                    let obj = {
                        item : arr,
                        total : total 
                    }
                    resolve(obj)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    setCategory(content){
        return new Promise((resolve,reject) => {
            let isStorage = localStorage.getItem('infoCategory')
            if(isStorage){
                isStorage = JSON.parse(isStorage);
                content.commit('SET_CATEGORYID',{data:isStorage,state:false})
            }else{
                GetCategory({}).then(response => {
                    let data = response.data.data
                    content.commit('SET_CATEGORYID',{data:data,state:true})
                }).catch(error => {
                    reject(error)
                }) 
            }
        })
    },

}

export default {
   namespaced:true,
   state,
   getters,
   mutations,
   actions
}