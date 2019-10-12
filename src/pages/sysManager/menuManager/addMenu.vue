<template>
    <div class="detail2">
        <h3>{{title}}</h3>
        <table class="table table-striped table-bordered table-hover table-full-width">
            <tbody>
            <tr v-if="workType!==1">
                <td>菜单Id</td>
                <td>
                    <input type="text" class="form-control" v-model="menuId" disabled>
                </td>
            </tr>
            <tr>
                <td>菜单名</td>
                <td>
                    <input type="text" class="form-control" v-model="name">
                </td>
            </tr>
            <tr>
                <td>菜单url</td>
                <td>
                    <input type="text" class="form-control" v-model="link">
                </td>
            </tr>
            <tr>
              <td>菜单排序</td>
              <td>
                <input type="number" step="1" min="0" class="form-control" v-model="menuOrder">
              </td>
            </tr>
            <tr>
                <td>菜单图标</td>
                <td>
                    <input type="text" class="form-control" v-model="menuIcon" placeholder="请输入图标网络地址">
                </td>
            </tr>
            <tr v-if="info.title ===2">
                <td>菜单状态</td>
                <td>
                    <input type="radio" name="status" value="false" v-model="enable">禁用
                    <input type="radio" name="status" value="true" v-model="enable">正常
                </td>
            </tr>
            <tr v-if="workType===1">
                <td>父菜单</td>
                <td>
                    <input type="button" class="btn btn-primary" @click="showTree = !showTree" value="选择添加到的父级菜单">
                    <el-collapse-transition>
                        <div v-show="showTree" class="treeMode">
                            <el-tree
                                    :data="menuTree"
                                    node-key="menuId"
                                    :props="defaultProps"
                                    :expand-on-click-node="false"
                                    :highlight-current="true"
                                    @node-click="nodeClick"
                            >
                            </el-tree>
                        </div>
                    </el-collapse-transition>
                </td>
            </tr>
            <tr>
                <td>备注</td>
                <td>
                    <input type="text" class="form-control" v-model="remark">
                </td>
            </tr>
            </tbody>
        </table>
        <div>
            <input type="button" @click="save" class="btn btn-primary save" value="保存">
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'

    export default {
        name:'addMenu',
        props:['info','tree'],
        data:function () {
            return {
                workType:1,
                title:'',
                //参数
                menuId:'',
                name:'',
                link:'',
                menuIcon:'',
                enable:'',
                parentId:'',
                remark:'',
                menuOrder:0,
                //参数
                menuTree:[],
                defaultProps:{
                    children: 'children',
                    label: 'name'
                },
                showTree:false,
            }
        },
        mounted:function () {
            let vm = this
            if (this.info.title===1){
                vm.title = '添加菜单'
                vm.workType = 1
                vm.menuTree = this.tree
            } else if (this.info.title ===2){
                vm.title='修改菜单'
                vm.workType = 2
                vm.menuTree = this.tree
                let res = this.info.data
                vm.menuId = res.menuId
                vm.name = res.name
                vm.link = res.link
                vm.menuOrder = res.menuOrder
                vm.menuIcon = res.menuIcon
                vm.enable = res.enable
                vm.remark = res.remark
            }
        },
        methods:{
            nodeClick:function (data) {
                let vm = this
                vm.parentId = data.menuId
            },
            save:function () {
//                saveOrUpdateMenu
                let vm = this
                let params = {
                    name:vm.name,
                    link:vm.link,
                    menuIcon:vm.menuIcon,
                    menuOrder:vm.menuOrder,
                    parentId:vm.parentId,
                    remark:vm.remark
                }
                let session = sessionStorage.getItem('admin/user')
                session = JSON.parse(session)
                let user = session.sysUserId
                if(vm.workType === 1) { //创建
                    params['createUser']=user
                }else if (vm.workType === 2) {
                    params['menuId'] = vm.info.data.menuId
                    params['enable']=vm.enable
                    params['updateUser'] = user
                }
                let index = layer.confirm('确定要保存吗',{icon:7,title:'提示'},()=>{
                    axios_post.post(urls.saveOrUpdateMenu,params).then(res=>{
                        let response = res.data
                        layer.open({
                            title:response.code,
                            content:response.msg,
                            end:function () {
                              if (response.code==='30006'){
                                  vm.$router.go(0)
                              }
                            }
                        })
                    },err=>{
                        layer.open({
                            title:'出错啦',
                            content:err.msg
                        })
                    })
                    layer.close(index)
                },()=>{
                    layer.close(index)
                })

            }
        }
    }
</script>

<style scoped>
.treeMode{}
input{
    max-width:70%;
}
    .save{
        margin:0 auto;
    }
</style>
