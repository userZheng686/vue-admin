import { GetCategory, GetCategoryAll, DeleteCategory, EditCategory, AddFirstCategory, AddSecondCategory } from '@/api/news';
import { GetInfo } from '@/api/info';

const state = {
    item: [],
    itemAll: []
}

const getters = {
    getItemAll: state => {
        return state.itemAll
    },
    getItem: state => {
        return state.item
    }
}


const mutations = {
    SET_ITEMAll(state, parms) {
        state.itemAll = parms.data
        if (parms.state) {
            localStorage.setItem('categoryItemAll', JSON.stringify(state.itemAll))
        }
    },
    SET_ITEM(state, parms) {
        state.item = parms.data
        if (parms.state) {
            localStorage.setItem('categoryItem', JSON.stringify(state.item))
        }
    }
}

const actions = {
    setItem(content) {
        return new Promise((resolve) => {
            let isStorage = localStorage.getItem('categoryItem')
            if (isStorage) {
                isStorage = JSON.parse(isStorage);
                content.commit('SET_ITEM', { data: isStorage, state: false })
                resolve(isStorage)
            } else {
                GetCategory({}).then(response => {
                    content.commit('SET_ITEM', { data: response.data.data, state: true })
                    resolve(response.data.data)
                })
            }
        })
    },
    setItemAll(content) {
        return new Promise((resolve,reject) => {
            let isStorage = localStorage.getItem('categoryItemAll')
            if (isStorage) {
                isStorage = JSON.parse(isStorage);
                content.commit('SET_ITEMAll', { data: isStorage, state: false })
                resolve(isStorage)
            } else {
                GetCategoryAll({}).then(response => {
                    let data = response.data
                    let arr = []
                    for (let i = 0; i < data.length; i++) {
                        if (!data[i].children) {
                            data[i].children = arr
                        }
                        data[i].icon = 'plus'
                        data[i].childShow = false
                    }
                    content.commit('SET_ITEMAll', { data: data, state: true })
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            }
        })
    },
    getItemAll() {
        // return content.commit('GET_ITEM')
        return state.itemAll
    },
    getItem() {
        // return content.commit('GET_ITEM')
        return state.item
    },
    deleteCategory(content, requestData) {
        return new Promise((resolve, reject) => {
            GetInfo({ categoryId: requestData.id, startTiem: '', endTime: '', title: '', id: '', pageNumber: 1, pageSize: 10 }).then(responses => {
                if (responses.data.data.length != 0) {
                    reject('该分类下有信息，请先删除')
                } else {
                    DeleteCategory({ categoryId: requestData.id }).then(response => {
                        let data = response
                        if (data.resCode === 0) {
                            let item, index, parms;
                            //对有子级分类的操作
                            {
                                item = actions.getItemAll()
                                if (requestData.parentid) {
                                    index = item.findIndex(item => item.id === requestData.parentid)
                                    let childrenIndex = item[index].children.findIndex(item => item.id === requestData.id)
                                    item[index].children.splice(childrenIndex, 1)
                                    item[index].icon = 'plus'
                                    item[index].childShow = false
                                } else {
                                    index = item.findIndex(item => item.id === requestData.id)
                                    item.splice(index, 1)
                                }
                                parms = {
                                    data: item,
                                    state: true
                                }
                                content.commit('SET_ITEMAll', parms)
                            }
                            //对没有子级分类的操作
                            {
                                item = actions.getItem()
                                index = item.findIndex(item => item.id === requestData.id)
                                item.splice(index, 1)
                                parms = {
                                    data: item,
                                    state: true
                                }
                                content.commit('SET_ITEM', parms)
                            }
                            resolve(response)
                        }
                    }).catch(error => {
                        reject(error)
                    })
                }
            })


        })
    },
    editCategory(content, requestData) {
        return new Promise((resolve, reject) => {
            EditCategory({ id: requestData.id, categoryName: requestData.name }).then(response => {
                let data = response
                if (data.resCode === 0) {
                    let item, index, parms;
                    //对有子级分类的操作
                    {
                        item = actions.getItemAll()
                        if (requestData.parentid) {
                            index = item.findIndex(item => item.id == requestData.parentid)
                            let childrenIndex = item[index].children.findIndex(item => item.id == requestData.id)
                            item[index].children[childrenIndex].category_name = requestData.name
                        } else {
                            index = item.findIndex(item => item.id == requestData.id)
                            item[index].category_name = requestData.name;
                        }

                        parms = {
                            data: item,
                            state: true
                        }
                        content.commit('SET_ITEMAll', parms)
                    }
                    //对没有子级分类的操作
                    {
                        item = actions.getItem()
                        index = item.findIndex(item => item.id == requestData.id)
                        item[index].category_name = requestData.name
                        parms = {
                            data: item,
                            state: true
                        }
                        content.commit('SET_ITEM', parms)
                    }
                    resolve(response)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    addCategoryFirst(content, requestData) {
        return new Promise((resolve, reject) => {
            AddFirstCategory({ categoryName: requestData.name }).then(response => {
                let data = response
                data.data.id = data.data.id.toString()
                data.data.icon = requestData.icon
                data.data.childShow = requestData.childShow
                data.data.children = []
                if (data.resCode === 0) {
                    let item, parms
                    //对有子级分类的操作
                    {
                        item = actions.getItemAll()
                        item.push(data.data)
                        parms = {
                            data: item,
                            state: true
                        }
                        content.commit('SET_ITEMAll', parms)
                    }
                    //对没有子级分类的操作
                    {
                        item = actions.getItem()
                        item.push(data.data)
                        parms = {
                            data: item,
                            state: true
                        }
                        content.commit('SET_ITEM', parms)
                    }
                    resolve(response)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    addCategorySecond(content, requestData) {
        return new Promise((resolve, reject) => {
            AddSecondCategory({ categoryName: requestData.name, parentId: requestData.parentid }).then(response => {
                let data = response
                data.data.id = data.data.id.toString()
                data.data.icon = requestData.icon
                data.data.childShow = requestData.childShow
                if (data.resCode === 0) {
                    let item, index, parms;
                    //对有子级分类的操作
                    {
                        item = actions.getItemAll()
                        index = item.findIndex(item => item.id == requestData.parentid)
                        data.data.parent_id = requestData.parentid
                        item[index].children.push(data.data)
                        parms = {
                            data: item,
                            state: true
                        }
                        content.commit('SET_ITEMAll', parms)
                    }
                    //对没有子级分类的操作
                    {
                        item = actions.getItem()
                        item.push(data.data)
                        parms = {
                            data: item,
                            state: true
                        }
                        content.commit('SET_ITEM', parms)
                    }
                    resolve(response)
                }
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