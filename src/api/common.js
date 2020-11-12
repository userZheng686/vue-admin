import {GetCategory,GetCategoryAll,AddFirstCategory,AddSecondCategory,DeleteCategory,EditCategory} from '@/api/news';
/*获取信息分类*/
export function getCategory(parms){
    if(parms.ALL){
        GetCategoryAll({}).then(response => {
            let data = response.data
            if(parms.class){
                for(let i=0;i<data.length;i++){
                    let category = new parms.class(data[i].id,data[i].category_name,null)
                    if(data[i].children){
                        for(let o = 0;o<data[i].children.length;o++){
                            let categoryChild = new parms.class(data[i].children[o].id,data[i].children[o].category_name,data[i].id)
                            category.addChildren(categoryChild)
                        }
                    }
                    parms.item.push(category)
                }
            }else{
                for(let j=0;j<data.length;j++){
                    parms.item.push(data[j])
                }
            }
        }).catch(error => {
            console.log(error)
        })
    }else{
        GetCategory({}).then(response => {
        let data = response.data.data
        if(parms.class){
            for(let i=0;i<data.length;i++){
                let category = new parms.class(data[i].id,data[i].category_name)
                parms.item.push(category)
            }
        }else{
            for(let j=0;j<data.length;j++){
                parms.item.push(data[j])
            }
        }
        }).catch(error => {
            console.log(error)
        })
    }
}
/*
提交一级分类
parms
root
name
item
class
fn
*/
export function submitCategory(parms){
    AddFirstCategory({categoryName:parms.name}).then(response => {
        let data = response
        if(data.resCode === 0){
            parms.root.$message({
                message:data.message,
                type:'success'
            });
        }
        if(parms.class){
            let NewCategory = new parms.class(data.data.id,data.data.category_name);
            parms.item.push(NewCategory)
        }
        parms.fn ? parms.fn() : ''
    }).catch(error => {
        console.log(error)
        parms.fn ? parms.fn() : ''
    })
} 

/*
二级分类添加
*/
export function addSecondCategory(parms){
    AddSecondCategory({categoryName:parms.name,parentId:parms.parentid}).then(response => {
        let data = response
        console.log(data)
        if(data.resCode === 0){
            parms.root.$message({
                message:data.message,
                type:'success'
            });
        }
        if(parms.class){
            let NewCategory = new parms.class(data.data.id,data.data.category_name,parms.parentid);
            let index = parms.item.findIndex(item => item.id == parms.parentid)
            parms.item[index].addChildren(NewCategory)
        }
        parms.fn ? parms.fn() : ''
    }).catch(error => {
        console.log(error)
         parms.fn ? parms.fn() : ''
    })
}


/*
删除分类
parms
parms.id
parms.root
parms.item
*/ 
export function deleteCategory(parms){
    DeleteCategory({categoryId:parms.id}).then(response => {
        let data = response
        if(data.resCode === 0){
            parms.root.$message({
                message:data.message,
                type:'success'
            });
        }
        if(parms.parentid){
            let index = parms.item.findIndex(item => item.id == parms.parentid)
            let indexchild = parms.item[index].children.findIndex(item => item.id == parms.id)
            parms.item[index].children.splice(indexchild,1)
        }else{
            let index = parms.item.findIndex(item => item.id == parms.id)
            parms.item.splice(index,1)
        }
        
    }).catch(error => {
        console.log(error)           
    })
}

/*修改信息分类*/
export function editCategory(parms){
    EditCategory({id:parms.id,categoryName:parms.name}).then(response => {
        let data = response
        if(data.resCode === 0){
            parms.root.$message({
                message:data.message,
                type:'success'
            });
        }
        
        if(parms.parentid){
            let index = parms.item.findIndex(item => item.id == parms.parentid)
            let indexchild = parms.item[index].children.findIndex(item => item.id == parms.id)
            parms.item[index].children[indexchild].name = parms.name
        }else{
            let index = parms.item.findIndex(item => item.id == parms.id)
            parms.item[index].name = parms.name;
        }
        
        parms.fn ? parms.fn() : ''
    }).catch(error => {
        console.log(error)
        parms.fn ? parms.fn() : ''
    })
} 