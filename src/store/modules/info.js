import { GetInfo, AddInfo, EditInfo, DeleteInfo } from '@/api/info';
// import { reject } from 'core-js/fn/promise';


const state = {
    item: [],
    total: 0,
    detail: {}
}

const getters = {
    getitem: state => {
        return state.item
    },
    gettotal: state => {
        return state.total
    },
    getdetail : state => {
        return state.detail
    }
}

const mutations = {
    SET_ITEM(state, parms) {
        state.item = parms
    },
    SET_TOTAL(state, parms) {
        state.total = parms
    },
    SET_DETAIL(state, parms) {
        state.detail = parms.data
        if(parms.state){
            sessionStorage.setItem('infoDetail',JSON.stringify(parms.data))
        }
    }
}

const actions = {
    getItem() {
        return state.item
    },
    getTotal() {
        return Number(state.total)
    },
    setItem(content, requestData) {
        return new Promise((resolve, reject) => {
            GetInfo(requestData).then(response => {
                content.commit('SET_ITEM', response.data.data)
                content.commit('SET_TOTAL', response.data.total)
                resolve(response.data.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    searchItem(content, requestData) {
        return new Promise(() => {
            GetInfo(requestData).then(response => {
                content.commit('SET_ITEM', response.data.data)
                content.commit('SET_TOTAL', response.data.data.length)
            })
        })
    },
    addItem(content, requestData) {
        return new Promise((resolve, reject) => {
            AddInfo(requestData.input).then(response => {
                let total = actions.getTotal()
                let item = actions.getItem()
                let time = +new Date()
                let data = {
                    categoryId: requestData.input.categoryId,
                    categoryName: null,
                    content: requestData.input.content,
                    createDate: time.toString(),
                    imgUrl: null,
                    status: null,
                    title: requestData.input.title
                }
                if(item.length === 0){
                    GetInfo({categoryId:requestData.input.categoryId,startTiem:'',endTime:"",title:requestData.input.title,id:"",pageNumber:"1",pageSize:"10"}).then(responses => {
                        data.id = responses.data.data[0].id
                        item.unshift(data)
                        total = total + 1
                        content.commit('SET_ITEM', item)
                        content.commit('SET_TOTAL', total)
                    })
                }else{
                    data.id = (Number(item[0].id) + 1).toString()
                    item.unshift(data)
                    total = total + 1
                    content.commit('SET_ITEM', item)
                    content.commit('SET_TOTAL', total)
                } 
                resolve(response)          
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteItem(content, requestData) {
        return new Promise((resolve, reject) => {
            DeleteInfo(requestData).then(() => {
                let item = actions.getItem()
                let total = actions.getTotal()
                let number = requestData.pageNumber * requestData.pageSize - requestData.pageSize;
                for (let i = 0; i < requestData.id.length; i++) {
                    let index = item.findIndex(item => item.id == requestData.id[i])
                    item.splice(index, 1)
                    total = total - 1
                }
                content.commit('SET_ITEM', item)
                content.commit('SET_TOTAL', total)
                let arr = []
                for (let j = number; j < number + requestData.pageSize; j++) {
                    if (item[j]) {
                        arr.push(item[j])
                    }
                }
                let obj = {
                    item: arr,
                    total: total
                }
                resolve(obj)
            }).catch(error => {
                reject(error)
            })
        })
    },
    editItem(content, requestData) {
        return new Promise((resolve, reject) => {
            EditInfo(requestData.input).then(response => {
                let item = actions.getItem()
                let index = item.findIndex(item => item.id === requestData.input.id)
                for (let key in item[index]) {
                    if (Object.prototype.hasOwnProperty.call(requestData.input, key)) {
                        if (item[index][key] != requestData.input[key]) {
                            item[index][key] = requestData.input[key]
                        }
                    }
                }
                content.commit('SET_ITEM', item)
                content.commit('SET_DETAIL',{data:requestData.input,state:true})
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    editDetail(content,requestData){
        return new Promise((resolve, reject) => {
            EditInfo(requestData.input).then(response => {
                content.commit('SET_DETAIL',{data:requestData.input,state:true})
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    flipItem(content, requestData) {
        return new Promise((resolve, reject) => {
            let item = actions.getItem()
            let number = requestData.pageNumber * requestData.pageSize - requestData.pageSize
            let arr = new Array()
            if (!item[number]) {
                GetInfo(requestData).then(response => {
                    // content.commit('SET_ITEM', response.data.data)
                    // content.commit('SET_TOTAL', response.data.total)
                    for (let i = 0; i < response.data.data.length; i++) {
                        item.push(response.data.data[i])
                        arr.push(response.data.data[i])
                    }
                    content.commit('SET_ITEM', item)
                    resolve(arr)
                }).catch(error => {
                    reject(error)
                })
            } else {
                for (let i = number; i < number + requestData.pageSize; i++) {
                    if (item[i]) {
                        arr.push(item[i])
                    }
                }
                resolve(arr)
            }
        })
    },
    setDetail(content,requestData){
        return new Promise((resolve) => {
            let isStorage = sessionStorage.getItem('infoDetail')
            if(requestData){
                content.commit('SET_DETAIL',{data:requestData,state:true})
            }else{
                content.commit('SET_DETAIL',{data:JSON.parse(isStorage),state:false})
            }
            resolve(JSON.parse(isStorage))
        })
    }

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}