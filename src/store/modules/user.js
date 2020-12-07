
import { GetUser, AddUser, DeleteUser, EditUser, ActiveUser } from '@/api/user';

const state = {
    item: [],
    total: 0
}


const getters = {
    getitem: state => {
        return state.item
    },
    gettotal: state => {
        return state.total
    }
}

const mutations = {  //必须的同步 没有回调处理事情
    SET_ITEM(state, parms) {
        state.item = parms
    },
    SET_TOTAL(state, parms) {
        state.total = parms
    },
}

const actions = {  // 可以回调处理事情
    getItem() {
        return state.item
    },
    getTotal() {
        return state.total
    },
    setItem(content, requestData) {
        return new Promise((resolve, reject) => {
            GetUser(requestData).then(response => {
                content.commit('SET_ITEM', response.data.data)
                content.commit('SET_TOTAL', response.data.total)
                resolve(response.data.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    searchItem(content,requestData){
        return new Promise((resolve) => {
            GetUser(requestData).then(response => {
                content.commit('SET_ITEM', response.data.data)
                content.commit('SET_TOTAL', response.data.data.length)
                resolve(response.data.data)
            })
        })
    },
    addItem(content, requestData) {
        return new Promise((resolve, reject) => {
            AddUser(requestData.input).then(response => {
                let item = actions.getItem()
                let total = actions.getTotal()
                let obj = {
                    btnPerm: '1',
                    id: '',
                    phone: requestData.input.phone,
                    region: requestData.input.region,
                    role: requestData.input.role,
                    truename: requestData.input.truename,
                    username: requestData.input.username,
                    status : requestData.input.status
                }

                /**添加id */
                if(item.length === 0){
                    GetUser({username:"",truename:"",phone:"",pageNumber:1,pageSize:10}).then(responses => {
                        obj.id = responses.data.data[0].id
                        item.unshift(obj)
                        total = total + 1
                        content.commit('SET_ITEM', item)
                        content.commit('SET_TOTAL', total)
                    })
                }else{
                    obj.id = Number(item[0].id) + 1 + ''
                    item.unshift(obj)
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
            DeleteUser(requestData).then(() => {
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
            EditUser(requestData.input).then(response => {
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
                GetUser(requestData).then(response => {
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
    changeStatus(content, requestData) {
       return new Promise((resolve, reject) => {
          ActiveUser(requestData).then(response => {
            let item = actions.getItem() 
            let index = item.findIndex(item => item.id === requestData.id)
            item[index]['status'] = requestData.status
            content.commit('SET_ITEM',item)
            resolve(response)
          }).catch(error => {
            reject(error)
          })
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