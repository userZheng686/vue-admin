export function deleteInfo(root,parms){
    root.$confirm(parms.content, parms.tip, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
    }).then(() => {
        parms.fn && parms.fn(parms.id || '');
    }).catch(() => {
        parms.catchfn && parms.catchfn(parms.id || '');
        // root.$message({
        //     type: 'info',
        //     message: '已取消删除'
        // });
    });
}
