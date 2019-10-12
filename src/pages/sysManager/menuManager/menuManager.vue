<template>
    <div>
        <div class="menu-main">
            <div class="menu-tree">
                <el-tree
                        :data="menuList"
                        node-key="menuId"
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        :highlight-current="true"
                        @node-click="nodeClick"
                >
                </el-tree>
                <div class="addMenu">
                    <input type="button" value="增加菜单" class="btn btn-primary" @click="addMenuItem">
                </div>
            </div>
            <div class="menu-table">
                <table id="order_table" class="table table-striped table-bordered table-hover table-full-width">
                    <tbody>
                        <!--<tr>-->
                            <!--<td>菜单id</td>-->
                            <!--<td>{{menuItem.menuId}}</td>-->
                        <!--</tr>-->
                        <tr>
                            <td>菜单名</td>
                            <td>{{menuItem.name}}</td>
                        </tr>
                        <tr>
                            <td>菜单地址</td>
                            <td>{{menuItem.link}}</td>
                        </tr>
                        <tr>
                            <td>菜单状态</td>
                            <td>
                                <span v-if="menuItem.enable===false">禁用</span>
                                <span v-if="menuItem.enable===true">正常</span>
                            </td>
                        </tr>
                        <tr>
                            <td>创建时间</td>
                            <td>{{menuItem.createTime}}</td>
                        </tr>
                        <tr>
                            <td>创建人</td>
                            <td>{{menuItem.createUser}}</td>
                        </tr>
                        <tr>
                            <td>修改人</td>
                            <td>{{menuItem.updateUser}}</td>
                        </tr>
                        <tr>
                          <td>菜单排序</td>
                          <td>{{menuItem.menuOrder}}</td>
                        </tr>
                        <tr>
                            <td>修改时间</td>
                            <td>{{menuItem.updateTime}}</td>
                        </tr>
                        <tr>
                            <td>备注</td>
                            <td>{{menuItem.remark}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="btn-group delBtn" v-if="menuItem!==''">
                    <input type="button" class="btn btn-warning" value="修改菜单" @click="resetMenuItem">
                    <input type="button" class="btn btn-warning" value="关联权限" @click="associated">
                    <input type="button" class="btn btn-warning" value="删除菜单" @click="removeOneMenu">
                </div>
            </div>
        </div>
        <div class="detail" v-if="showMore">
            <p @click = 'offDetail' class="offBtn">X</p>
            <detail :info="menuInfo" :tree="menuList"></detail>
        </div>
        <div class="detail" v-if="showPerm">
          <p @click = 'offPerm' class="offBtn">X</p>
          <perm-list :permList="permTree" :menuId="menuItem.menuId"></perm-list>
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'
    import detail from '@/pages/sysManager/menuManager/addMenu.vue'
    import permList from '@/pages/sysManager/menuManager/permTable.vue'

    export default {
        name:'menuList',
        components:{
          detail:detail,
          permList:permList
        },
        data:function () {
            return{
                menuList:[],
                menuItem:'',
                menuMore:'',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                showMore:false,
                menuInfo:'',
                showPerm:false,
                permTree:[],
            }
        },
        created:function () {
            let vm = this
            let params = {
                menuId:0
            }
            axios_post.post(urls.getMenu,params).then(res=>{
                let response=res.data
                vm.menuList = response.data
            },err=>{
                layer.open({
                    title:'错误',
                    content:err.message
                })
            })
        },
        methods:{
            //打开权限列表
            associated:async function(){
              let vm = this
              let wait = layer.load(2)
              await axios_post.post(urls.getPermission).then(res=>{
                  vm.permTree = res.data.data
              })
              this.showPerm=true
//              console.log(vm.permTree)
              layer.close(wait)
              //打开面板
            },
            //增加菜单
            addMenuItem:function () {
                let vm = this
                let data = {
                    title:1,
                    data:''
                }
                vm.menuInfo=data
                vm.showMore = true
            },
            //修改菜单
            resetMenuItem:function () {
                let vm = this
                let data = {
                    title:2,
                    data:this.menuMore
                }
                data.data['remark']=vm.menuItem['remark']
                data.data['enable']=vm.menuItem['enable']
                vm.menuInfo = data
                vm.showMore = true
            },
            //关闭增加框
            offDetail:function () {
                this.showMore = false
            },
            offPerm:function () {
              this.showPerm = false
            },
            nodeClick:function (data,node,self) {
                let vm = this
                vm.menuMore=data
                let params = {
                    menuId:data.menuId
                }
                axios_post.post(urls.oneMenuInfo,params).then(res=>{
                    let response = res.data
                    if(response.code === '10000'){
                        vm.menuItem = response.data
                        vm.menuItem.createTime = vm.timeBasic(vm.menuItem.createTime)
                        vm.menuItem.updateTime = vm.timeBasic(vm.menuItem.updateTime)
                    }else{
                        layer.open({
                            title:response.code,
                            content:response.msg
                        })
                    }
                },err=>{
                    layer.open({
                        title:'出错啦',
                        content:err.message
                    })
                })
            },
            removeOneMenu:function () {
                let vm = this
                let params={
                    menuId:vm.menuItem.menuId
                }
                let index = layer.confirm('是否删除此菜单',{icon:7,title:'警告'},function () {
                    axios_post.post(urls.removeMenu,params).then(res=>{
                        let response = res.data
                        layer.open({
                            title:response.code,
                            content:response.msg,
                            end:function () {
                                vm.$router.go(0)
                            }
                        })
                    },err=>{
                        layer.open({
                            title:'出错啦',
                            content:err.message
                        })
                    })
                    layer.close(index)
                },function () {
                    layer.close(index)
                })

            }
        }
    }
</script>

<style scoped>
    td{
       height:40px;
    }
.menu-main{
    width:100%;
    display: flex;
}
    .menu-tree{
        flex:1;
    }
    .menu-table{
        flex:4;
        margin-left: 15px;
    }
    .addMenu{
        margin:12px 0 0 0;
    }
    .delBtn{
        display: flex;
        justify-content: center;
    }
    .delBtn input{
        margin:0 8px;
    }
</style>
