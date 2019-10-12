<template>
    <div class="main detail2">
        <h3 class="page-header">角色选择</h3>
        <div>
            <table class="table table-striped table-bordered table-hover table-full-width">
                <thead>
                <tr>
                    <td></td>
                    <td>角色名</td>
                    <td>创建人</td>
                    <td>修改人</td>
                    <td>备注</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="k in roleList">
                    <td>
                        <input type="checkbox" class="form-control checkRole" @change="addRoleList($event,k.roleId)">
                    </td>
                    <td>
                        {{k.roleName}}
                    </td>
                    <td>
                        {{k.createRealName}}
                    </td>
                    <td>
                        {{k.updateRealName}}
                    </td>
                    <td>
                        {{k.remark}}
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="save-btn">
                <input type="button" class="btn btn-primary" value="保存" @click = 'save'>
            </div>
        </div>
        <div class="turn-page">
            <nav aria-label="Page navigation" class="pgBtn">
                <span>当前第</span>
                <ul class="pagination">
                    <li>
                        <a href="#" aria-label="Previous" @click.prevent = 'prev'>
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li v-for="k in pageBean" :class="{'active':currentPage===k}">
                        <a href="#" @click.prevent = 'jumpTo($event)'>{{k}}</a>
                    </li>
                    <li>
                        <a href="#" aria-label="Next" @click.prevent = 'next'>
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
                <span>页</span>
            </nav>
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'

    export default {
        name:'permTree',
        props:['userList'],
        data:function () {
            return {
                roleList:[],
                currentPage:1,
                allPage:1,
                list:[], //要添加的权限数组
                permList:[],//存放用户已有权限
            }
        },
        created:function () {
          let vm = this
        },
        mounted:function () {
            let vm = this
          let params = {
              sysUserId:vm.userList
          }
          let params1 = {
            currentPage:1,
            pageSize:10
          }

          axios_post.post(urls.getRole,params1).then(res=>{
            let response = res.data.data
            vm.roleList = response.data
            //then
            axios_post.post(urls.findRoleIdBySysUserId,params).then(res=>{
              let response = res.data
              vm.permList = response.data
              for(let k of vm.roleList){
                for (let j of vm.permList) {
                  if(k.roleId === j.roleId){
                    let num = vm.roleList.indexOf(k)
                    $('.checkRole').eq(num).prop('checked',true)
                    vm.list.push(k.roleId)
                  }
                }
              }
            },err=>{
                layer.open({
                  title:'出错啦',
                  content:err.message
                })
            })
          },err=>{
            layer.open({
              title:'出错啦',
              content:err.message
            })
          })

        },
        methods:{
            save:function () {
                let vm = this
//                let uList = vm.userList.join(',')
                let rList = vm.list.join(',')
                let params = {
                    sysUserId:vm.userList,
                    roleId:rList
                }
                let index = layer.confirm('确定要保存吗',{icon:0,title:'提示'},function () {
                    axios_post.post(urls.giveUserRole,params).then(res=>{
                        let response = res.data
                        layer.open({
                            title:response.code,
                            content:response.msg
                        })
                    })
                },function () {
                    layer.close(index)
                })

            },
            addRoleList:function (e,id) {
                let vm = this
                let status = e.target.checked
                if (status){
                    vm.list.push(id)
                } else {
                    let num = vm.list.indexOf(id)
                    vm.list.splice(num,1)
                }
            },
            getDriverInfo: function () {
                let params = {
                    currentPage: this.currentPage,
                    pageSize: 10,
                }
                axios_post.post(urls.getRole,params).then((res)=>{
                    let response = res.data.data
                    vm.roleList = response.data
                    vm.allPage = response.totalPage
//                    vm.currentPage = response.currentPage
                },(err)=>{
                    layer.msg(err.message)
                })
            },
            jumpTo: function (e) {
                let num = e.target.innerText
                let vm = this
                num = parseInt(num)
                this.currentPage = num
                vm.getDriverInfo()
            },
            prev: function () {
                let vm = this
                if(this.currentPage > 1){
                    this.currentPage --
                    vm.getDriverInfo()
                } else {
                    layer.msg('前面没有了')
                }
            },
            next: function () {
                let vm = this
                if(this.currentPage < this.allPage) {
                    this.currentPage ++
                    vm.getDriverInfo()
                } else {
                    layer.msg('已经是最后一页啦')
                }
            },
        }
    }
</script>

<style scoped>
    td{
        vertical-align: middle !important;
    }
    .checkUser,.checkUser1,.checkRole{
        box-shadow: none;
        width: 17px;
        margin: 0 auto;
    }
    .pgBtn{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .save-btn{
        text-align: center;
        padding-top: 3px;
    }
</style>
