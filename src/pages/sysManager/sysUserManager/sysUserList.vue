<template>
    <div>
        <div class="searchBox col-md-12">
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>用户状态</label>
                <!--<input type="text" placeholder="用户名" class="giftCount" v-model="s_userName">-->
                <select name="" class="giftCount" v-model="s_enabled">
                    <option value='' disabled selected style='display:none;'>请选择</option>
                    <option value="false">禁用</option>
                    <option value="true">启用</option>
                </select>
            </div>
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>真实姓名</label>
                <input type="text" placeholder="真实姓名" class="giftCount" v-model="s_realName">
            </div>
            <input class="btn btn-default searchBtn" type="button" value="搜索" @click="normalSearch(1)">
            <input class="btn btn-default searchBtn" type="button" value="高级搜索" @click="showSearchMore">
            <input type="button" class="btn btn-default searchBtn" value="添加用户" @click = 'addUser'>
            <input type="button" class="btn btn-default searchBtn" value="配置角色" @click = 'openRoleChose'>
        </div>
        <search-more v-if="show_sm" @off_sm="offSearchMore" @submitOption="sub"></search-more>
        <div class="table-main">
            <div class="main-content">
                <div class="table-swiper">
                    <table class="table table-striped table-bordered table-hover table-full-width">
                        <thead>
                            <tr>
                                <td>
                                    <!--<input type="checkbox" class="form-control checkUser1" id="checkAll" @click="allCheck($event)">-->
                                </td>
                                <!--<td>系统用户id</td>-->
                                <td>用户名</td>
                                <!--<td>密码</td>-->
                                <td>手机号</td>
                                <td>真实名称</td>
                                <td>用户状态</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="k in userList">
                                <td>
                                    <input type="radio" name="chooseUser" :value="k.sysUserId" class="form-control checkUser" @click="addUserPermList($event,k.sysUserId)">
                                </td>
                                <!--<td>{{k.sysUserId}}</td>-->
                                <td>{{k.sysUserName}}</td>
                                <!--<td>{{k.sysUserPassword}}</td>-->
                                <td>{{k.mobile}}</td>
                                <td>{{k.realName}}</td>
                                <td>
                                    <span v-if="!k.enabled">禁用</span>
                                    <span v-if="k.enabled">启用</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="work">
                <table class="table table-striped table-bordered table-hover table-full-width">
                    <thead>
                    <tr>
                        <td>操作</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="i in workNum" class="info">
                        <td>
                            <input type="button" class="btn btn-primary btn-xs" value="用户详情" @click="seeDetail(i)">
                            <input type="button" class="btn btn-warning btn-xs" value="修改用户" @click="resetUser(i)">
                            <input type="button" class="btn btn-warning btn-xs" value="删除用户" @click = 'removeUser(i)'>
                        </td>
                    </tr>
                    </tbody>
                </table>
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
        <!--详情-->
        <div class="detail"  v-if="show_detail">
            <p @click = 'offDetail' class="offBtn">X</p>
            <detail :info="userMore" v-if="show_witch === 1"></detail>
            <role-tree v-if="show_witch === 2" :userList="permUserList"></role-tree>
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'
    import searchMore from '@/pages/sysManager/sysUserManager/searchMore.vue'
    import detail from '@/pages/sysManager/sysUserManager/userDetail.vue'
    import roleTree from '@/pages/sysManager/sysUserManager/permTree.vue'
    export default {
        name:'sysUser',
        components:{
            searchMore:searchMore,
            detail:detail,
            roleTree:roleTree
        },
        data:function () {
            return {
                currentPage:1,
                allPage:1,
                userList:[],
                //搜索相关
                searchOptions:{},
                searchStatus:false,
                show_sm:false,
                s_enabled:null,
                s_realName:'',
                //详情面板传递信息
                userMore:{},
                show_detail:false,
                show_witch:0, //@-0不显示 @-1详情 @2-角色树
                //需要设置权限的账号组
                permUserList:''
            }
        },
        created:function () {
          let vm = this
          let params={
              pageSize:10,
              currentPage:1
          }
          axios_post.post(urls.getUser,params).then(res=>{
              let response = res.data.data
              vm.allPage = response.totalPage
              vm.userList = response.data
              for (let k of vm.userList) {
                  k.createTime = vm.timeBasic(k.createTime)
                  k.updateTime = vm.timeBasic(k.updateTime)
              }
          }).catch(err=>{
              layer.msg(err.message)
          })
        },
        methods:{
            //需设置权限的用户ID组
//            allCheck:function (e) {
//                let vm = this
//                let status = $('#checkAll').prop('checked')
//                if(status) {
//                    $('.checkUser').prop('checked',true)
//                    vm.permUserList=[]
//                    for(let k of vm.userList) {
//                        vm.permUserList.push(k.sysUserId)
//                    }
//                } else {
//                    $('.checkUser').prop('checked',false)
//                    vm.permUserList=[]
//                }
//            },
            addUserPermList:function (e,id) {
                let vm = this
                let status = e.target.value
//                if (status) {
//                    vm.permUserList.push(id)
//                }else{
//                    let num = vm.permUserList.indexOf(id)
//                    vm.permUserList.splice(num,1)
//                }
                vm.permUserList = status
//                console.log(vm.permUserList)
            },
            //打开角色树
            openRoleChose:function () {
                let vm = this
                if(vm.permUserList===''){
                    layer.open({
                        title:'提示',
                        content:'请先选择用户',
                    })
                    return false
                }
                this.show_detail = true
                this.show_witch = 2
            },
            //查看详情
            seeDetail:function (i) {
                let user = this.userList[i-1]
                let data = {
                    type:0, //@-0-详情，@-1-修改，@-2-添加
                    data:user
                }
                this.userMore = data
                this.show_detail = true
                this.show_witch = 1
            },
            //修改用户
            resetUser:function (i) {
                let user = this.userList[i-1]
                let data = {
                    type:1, //@-0-详情，@-1-修改，@-2-添加
                    data:user
                }
                this.userMore = data
                this.show_detail = true
                this.show_witch = 1
            },
            //添加用户
            addUser:function () {
                let data = {
                    type:2, //@-0-详情，@-1-修改，@-2-添加
                    data:{}
                }
                this.userMore = data
                this.show_detail = true
                this.show_witch = 1
            },
            //删除用户
            removeUser:function (i) {
                let vm = this
                let user = this.userList[i-1]
                let params = {
                    'sysUserId':user.sysUserId
                }
                let index = layer.confirm('确定要删除该用户吗',{icon:0,title:'提示'},function () {
                    axios_post.post(urls.deleteUser,params).then(res=>{
                        let response = res.data
                        layer.open({
                            title:response.code,
                            content:response.msg,
                            end:function () {
                                let num = vm.userList.indexOf(user)
                                vm.userList.splice(num,1)
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
            },
            //关闭详情
            offDetail:function () {
              this.show_detail = false
                this.show_witch = 0
            },
            //打开高级搜索
            showSearchMore: function () {
                this.show_sm = true
            },
            //关闭高级搜索
            offSearchMore: function () {
                this.show_sm = false
                this.searchStatus = false
            },
            sub: function (opt) {
//                console.log(opt)
//                @param
//                    opt.opt 搜索参数
//                @param
//                    opt.cur 当前页数
                let vm = this
                this.searchOptions = opt.opt
                this.searchStatus = true
                let opt2 = opt.opt
                let option = {
                    pageSize: 10,
                    currentPage: opt.cur,
                    ...opt2
                }
                axios_post.post(urls.getUser,option).then((res)=>{
                    let response = res.data.data
                    vm.userList = response.data
                    for (let k of vm.userList) {
                        k.createTime = vm.timeBasic(k.createTime)
                        k.updateTime = vm.timeBasic(k.updateTime)
                    }
                    vm.allPage = response.totalPage
                    vm.currentPage = response.currentPage
                },(err)=>{
                    console.log(err)
                }).finally(()=>{
                    layer.close()
                })
            },
            //普通搜索
            normalSearch: function (cur) {
                let vm = this
                let option = {
                    pageSize: 10,
                    currentPage: cur,
                }
                if(vm.s_enabled !== null){
                    option['enabled']=vm.s_enabled
                }
                if(vm.s_realName !== ''){
                    option['realName']=vm.s_realName
                }
                axios_post.post(urls.getUser,option).then((res)=>{
                    let response = res.data.data
                    vm.userList = response.data
                    for (let k of vm.userList) {
                        k.createTime = vm.timeBasic(k.createTime)
                        k.updateTime = vm.timeBasic(k.updateTime)
                    }
                    vm.allPage = response.totalPage
                    vm.currentPage = response.currentPage
                },(err)=>{
                    console.log(err)
                }).finally(()=>{
                    layer.close()
                })
            },
            getDriverInfo: function () {
                let params = {
                    currentPage: this.currentPage,
                    pageSize: 10,
                }
                axios_post.post(urls.getUser,params).then((res)=>{
                    let response = res.data.data
                    vm.userList = response.data
                    for (let k of vm.userList) {
                        k.createTime = vm.timeBasic(k.createTime)
                        k.updateTime = vm.timeBasic(k.updateTime)
                    }
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
                if (vm.searchStatus) {
                    let data = {
                        opt:vm.searchOptions,
                        cur:vm.currentPage
                    }
                    vm.sub(data)
                } else {
                    if (vm.s_enabled !== '' || vm.s_realName !== '') {
                        vm.normalSearch(vm.currentPage)
                    } else {
                        vm.getDriverInfo()
                    }
                }
            },
            prev: function () {
                let vm = this
                if(this.currentPage > 1){
                    this.currentPage --
                    if (vm.searchStatus) {
                        let data = {
                            opt:vm.searchOptions,
                            cur:vm.currentPage
                        }
                        vm.sub(data)
                    } else {
                        if (vm.s_enabled !== '' || vm.s_realName !== '') {
                            vm.normalSearch(vm.currentPage)
                        } else {
                            vm.getDriverInfo()
                        }
                    }
                } else {
                    layer.msg('前面没有了')
                }
            },
            next: function () {
                let vm = this
                if(this.currentPage < this.allPage) {
                    this.currentPage ++
                    if (vm.searchStatus) {
                        let data = {
                            opt:vm.searchOptions,
                            cur:vm.currentPage
                        }
                        vm.sub(data)
                    } else {
                        if (vm.s_enabled !== '' || vm.s_realName !== '') {
                            vm.normalSearch(vm.currentPage)
                        } else {
                            vm.getDriverInfo()
                        }
                    }
                } else {
                    layer.msg('已经是最后一页啦')
                }
            },
        },
        computed:{
            workNum:function () {
                return this.userList.length
            }
        }
    }
</script>

<style scoped>
    td{
        height: 56px;
        vertical-align: middle !important;
    }
    .table-main{
        width:100%;
        margin:0 auto;
        position: relative;
    }
    .main-content{
        width: 78%;
        overflow-x: scroll;
        overflow-y: hidden;
    }
    .table-swiper{
        min-width:120%;
    }
    .work{
        width:22%;
        position: absolute;
        top:0;
        right:0;
        z-index:1000;
        /*background: green;*/
    }
    .searchBox{
        display: flex;
        border-bottom: 1px dotted;
        padding-bottom: 20px;
        margin-bottom: 20px;
        float: none;
    }
    .giftCount {
        display: block;
        width: 80%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .pgBtn{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .searchBtn{
        height:50%;
        align-self: flex-end;
        margin:0 4px 0 4px;
    }

    .checkUser,.checkUser1{
        box-shadow: none;
        width: 50%;
        margin: 0 auto;
    }
</style>
