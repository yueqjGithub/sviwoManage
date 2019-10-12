<template>
    <div>
        <div class="searchBox col-md-12">
            <input type="button" class="btn btn-default" :class="{'btn-primary':roleSearch}" @click = 'openRoleSearch' value="角色搜索">
            <input type="button" class="btn btn-default" :class="{'btn-primary':permissionSearch}" @click = 'openPermissionSearch' value="权限搜索">
            <input type="button" class="btn btn-default" value="添加角色" @click = 'addRoles'>
            <input type="button" class="btn btn-default" value="添加权限" @click = 'addPerms'>
        </div>
        <role-search @off_sm="off_role_s" @submitOption="searchRole" v-if="roleSearch"></role-search>
        <perm-search @off_sm="off_role_p" @submitOption="searchPerm" v-if="permissionSearch"></perm-search>
        <div class="cont-main">
            <div class="role-main">
                <!--角色列表-->
                <!--<p class="bg-primary">角色管理</p>-->
                <div class="role-border">
                    <div class="role-table">
                        <table class="table table-striped table-bordered table-hover table-full-width">
                            <thead>
                                <tr>
                                    <!--<td>角色id</td>-->
                                    <td>角色名</td>
                                    <!--<td>创建时间</td>-->
                                    <!--<td>修改时间</td>-->
                                    <!--<td>创建人真实姓名</td>-->
                                    <!--<td>修改人真实姓名</td>-->
                                    <td>备注</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="k in roleArr">
                                    <!--<td>{{k.roleId}}</td>-->
                                    <td>
                                        <a @click.prevent="getRolePerm(k)">{{k.roleName}}</a>
                                    </td>
                                    <!--<td>{{k.createTime}}</td>-->
                                    <!--<td>{{k.updateTime}}</td>-->
                                    <!--<td>{{k.createRealName}}</td>-->
                                    <!--<td>{{k.updateRealName}}</td>-->
                                    <td>{{k.remark}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="role-btn">
                    <table class="table table-striped table-bordered table-hover table-full-width">
                        <thead>
                        <tr>
                            <td>操作</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="i in roleNum" class="info">
                            <td>
                                <input type="button" class="btn btn-warning btn-xs" value="修改" @click="resetRole(i)">
                                <input type="button" class="btn btn-danger btn-xs" value="删除" @click="removeRole(i)">
                                <input type="button" class="btn btn-primary btn-xs" value="详情" @click="seeRole(i)">
                                <input type="button" class="btn btn-primary btn-xs" value="设置权限" @click="appendPerm(i)">
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <page-turn :currentPage="currentPage_r" :allPage="allPage_r" :searchType="'role'" @jump="JumpTo" @toPrev="prev" @toNext="next"></page-turn>
            </div>
            <div class="perm-main">
                <!--权限列表-->
                <div class="perm-border">
                    <div class="perm-table">
                        <table class="table table-striped table-bordered table-hover table-full-width">
                            <thead>
                                <tr>
                                    <td></td>
                                    <!--<td>权限Id</td>-->
                                    <td>权限名称</td>
                                    <td>权限路径</td>
                                    <td>权限状态</td>
                                    <!--<td>权限编码</td>-->
                                    <!--<td>创建人</td>-->
                                    <!--<td>创建时间</td>-->
                                    <!--<td>修改人</td>-->
                                    <!--<td>修改时间</td>-->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in permArr">
                                    <td style="text-align: center">
                                        <input type="checkbox" class="permCheckBox" name="permCheck" :value="index" style="width: 17px;height: 17px;" @change="addPermList($event)">
                                    </td>
                                    <!--<td>{{item.permId}}{{index}}</td>-->
                                    <td>{{item.permName}}</td>
                                    <td>{{item.permUrl}}</td>
                                    <td>
                                        <span v-if="item.permStatus === 0">禁用</span>
                                        <span v-if="item.permStatus === 1">正常</span>
                                    </td>
                                    <!--<td>{{item.code}}</td>-->
                                    <!--<td>{{item.createUser}}</td>-->
                                    <!--<td>{{item.createTime}}</td>-->
                                    <!--<td>{{item.updateUser}}</td>-->
                                    <!--<td>{{item.updateTime}}</td>-->
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="perm-btn">
                    <table class="table table-striped table-bordered table-hover table-full-width">
                        <thead>
                        <tr>
                            <td>操作</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="i in permNum" class="info">
                            <td>
                                <input type="button" class="btn btn-warning btn-xs" value="修改" @click="resetPerm(i)">
                                <input type="button" class="btn btn-danger btn-xs" value="删除" @click="removePerm(i)">
                                <input type="button" class="btn btn-primary btn-xs" value="详情" @click="seePerm(i)">
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="detail"  v-if="show_detail">
            <p @click = 'offDetail' class="offBtn">X</p>
            <role-detail :info="infoMore" v-if="showWitch==='role'"></role-detail>
            <perm-detail :info="infoMore" v-if="showWitch==='perm'"></perm-detail>
        </div>
    </div>
</template>

<script>
    //角色搜索
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'
    import roleSearch from '@/pages/sysManager/role/roleSearch.vue'
    import permSearch from '@/pages/sysManager/role/permissionSearch.vue'
    import pageTurn from '@/commonComponent/pageBean.vue'
    import roleDetail from '@/pages/sysManager/role/roleDetail.vue'
    import permDetail from '@/pages/sysManager/role/permDetail.vue'

    export default {
        name:'sysRole',
        components:{
            roleSearch:roleSearch,
            permSearch:permSearch,
            pageTurn:pageTurn,
            roleDetail:roleDetail,
            permDetail:permDetail
        },
        data:function () {
            return {
//                ------------
                sbRole:'',
//                ------------
                roleArr:[], //角色列表存放
                permArr:[], //权限存放列表
                allPermArr:[],//所有权限列表
                addArrList:[], //要添加的权限存放列表
                rolePermArr:[],//存放角色对应权限Id
                roleSearch:false, //角色搜索是否打开
                permissionSearch:false, //权限搜索是否打开
                currentPage_r:1, //角色当前页
                allPage_r:1,//角色总页数
                currentPage_p:1, //权限当前页
                allPage_p:1, //权限总页数
                searchOptions_r:{}, //存放角色搜索参数--搜索翻页使用
                searchOptions_p:{}, //存放权限搜索参数--@
                searchStatus:'', // 搜索状态 @-role @-perm
                //--------修改添加等相关
                show_detail:false,//详情面板是否显示
                infoMore:{}, //存放传递值,
                showWitch:'',//决定详情面板显示哪一个
            }
        },
        created:function(){
            let vm = this
          let params = {
              currentPage:1,
              pageSize: 10
          }
          axios_post.post(urls.getRole,params).then(res=>{
              let response = res.data.data
              vm.roleArr = response.data
              for(let k of vm.roleArr){
                  k.createTime = vm.timeBasic(k.createTime)
                  k.updateTime = vm.timeBasic(k.updateTime)
              }
              vm.allPage_r = response.totalPage
          },err=>{
              layer.msg(err.message)
          })

            axios_post.post(urls.getPermission,params).then(res=>{
                let response = res.data
                vm.permArr = response.data
                vm.allPermArr = response.data
                for(let k of vm.permArr){
                    k.createTime = vm.timeBasic(k.createTime)
                }
                vm.allPage_p = response.totalPage
            },err=>{
                layer.msg(err.message)
            })
        },
        mounted:function(){
            layer.open({
                title: '提示',
                content: '点击角色名可查看对应权限'
            })
        },
        methods:{
            //seePerm权限详情
            seePerm:function (i) {
                let data={
                    title:'detail',
                    data:this.permArr[i-1]
                }
                this.infoMore = data
                this.show_detail = true
                this.showWitch='perm'
            },
            //resetPerm修改权限
            resetPerm:function (i) {
                let data={
                    title:'reset',
                    data:this.permArr[i-1]
                }
                this.infoMore = data
                this.show_detail = true
                this.showWitch='perm'
            },
            //添加权限
            addPerms:function () {
                let data={
                    title:'add',
                    data:''
                }
                this.infoMore = data
                this.show_detail = true
                this.showWitch='perm'
            },
            //删除权限
            removePerm:function (i) {
                let vm = this
                let index=layer.confirm('确定要删除此权限吗',{icon:7,title:'警告'},function () {
                    let params={
                        permissionId:vm.permArr[i-1].permId
                    }
                    axios_post.post(urls.deletePermission,params).then(res=>{
                        layer.msg(res.data.msg)
                        if(res.data.code === '30027'){
                            layer.open({
                                title:res.data.code,
                                content:res.data.msg,
                                end:function () {
//                                    vm.$router.go(0)
                                }
                            })
                        }else{
                            layer.open({
                                title:res.data.code,
                                content:res.data.msg,
                            })
                        }
                    },err=>{
                        layer.open({
                            title:'失败',
                            content:err.message
                        })
                    })
                    layer.close(index)
                },function () {
                    layer.close(index)
                })
            },
            //修改角色并打开详情面板
            resetRole:function (i) {
                let data = {
                    title:'reset',
                    data:this.roleArr[i-1]
                }
                this.infoMore = data
                this.show_detail = true
                this.showWitch='role'
            },
            //查看角色详情
            seeRole:function (i) {
              let data = {
                  title:'detail',
                  data:this.roleArr[i-1]
              }
              this.infoMore = data
                this.show_detail = true
                this.showWitch='role'
            },
            //添加角色
            addRoles:function () {
              let data={
                  title:'add',
                  data:''
              }
              this.infoMore = data
                this.show_detail=true
                this.showWitch='role'
            },
            //removeRole删除角色
            removeRole:function (i) {
                let vm = this
              let index=layer.confirm('确定要删除此角色吗',{icon:7,title:'警告'},function () {
                  let params={
                      roleId:vm.roleArr[i-1].roleId
                  }
                  axios_post.post(urls.deleteRole,params).then(res=>{
                      layer.msg(res.data.msg)
                      vm.$router.go(0)
                  },err=>{
                      layer.open({
                          title:'失败',
                          content:err.message
                      })
                  })
                  layer.close(index)
              },function () {
                  layer.close(index)
              })
            },
            offDetail:function () {
              this.show_detail = false
                this.infoMore={}
                this.showWitch=''
            },
            //获得角色拥有的权限并回显
            getRolePerm:function (role) {
                let vm = this
                vm.rolePermArr = []
                vm.addArrList = []
                let params = {
                    roleId:role.roleId
                }
                vm.sbRole = role.roleId
                axios_post.post(urls.findPermisIdByRoleId,params).then(res=>{
                    let response = res.data.data
                    vm.rolePermArr = response //将权限ID列存入rolePermArr,显示控制放在permControl
//                    for(let k of response){
//                        for(let j of vm.allPermArr){
//                            if(j.permId === k.permissionId){
//                              vm.addArrList.push(j)
//                            }
//                        }
//                    }
                    vm.permControl()
                },err=>{
                    layer.msg(err.message)
                })
            },
            //角色具有的权限控制checkbox状态
            permControl:function () {
                let vm = this
                    $('.permCheckBox').prop('checked',false)

                for (let k of vm.allPermArr) {
                  for (let j of vm.rolePermArr) {
                    if (k.permId === j.permissionId) {
                      let num = vm.permArr.indexOf(k)
                      if(num !== -1){
                        $('.permCheckBox').eq(num).prop("checked",true)
                      }
                      vm.addArrList.push(k)
                    }
                  }
                }
            },
            //增加权限列表
            addPermList:function (e) {
                let vm = this
                let val = e.target.value
                let check = e.target.checked
                if(check){
                    val = parseInt(val)
                    vm.addArrList.push(vm.permArr[val])
                }else {
                    let num = vm.addArrList.indexOf(vm.permArr[val])
                    vm.addArrList.splice(num,1)
                }
            },
            //给角色添加权限
            appendPerm:function (i) {
                let vm = this
                let arr = ''
                let str = '您为该角色设置的权限为:'

              let obj = {};
//                console.log(vm.sbRole)
                if(vm.sbRole===''){
                    layer.open({
                      title:'提示',
                      content:'请先点击角色确认已有权限！',
                    })
                  return false
                }

              vm.addArrList = vm.addArrList.reduce((cur,next) => {
                obj[next.permId] ? "" : obj[next.permId] = true && cur.push(next);
                return cur;
              },[]) //设置cur默认类型为数组，并且初始值为空的数组
//              console.log(vm.addArrList);

                for (let k of vm.addArrList) {
                    arr+=''+k.permId+','
                    str += `<p class="showPermList">${k.permName}</p>`
                }
                let index = layer.confirm(str,{icon:3,title:'提示'},function () {
                    let params={
                        roleId:vm.roleArr[i-1].roleId,
                        permissionId:arr
                    }
                    if (arr === ''){
                        layer.open({
                            title:'错误',
                            content:'要设置的权限为空'
                        })
                        return false
                    }
                    axios_post.post(urls.saveRolePermission,params).then(res=>{
                        layer.msg(res.data.msg)
                    },err=>{
                        layer.msg(err.message)
                    })
                    layer.close(index)
                },function () {
                    layer.close(index)
                })
            },
            openRoleSearch:function () { //打开角色搜索
                let vm = this
                vm.roleSearch = true
                vm.permissionSearch = false
            },
            openPermissionSearch:function () { //打开权限搜索
                let vm = this
                vm.roleSearch=false
                vm.permissionSearch = true
            },
            off_role_s:function () {//关闭角色搜索
                let vm = this
                vm.roleSearch = false
                vm.searchStatus = ''
            },
            off_role_p:function () { //关闭权限搜索
                let vm = this
                vm.permissionSearch = false
                vm.searchStatus = ''
            },
            searchRole:function (opt) { //搜索角色
                let vm = this
                this.searchOptions_r = opt.opt
                this.searchStatus = 'role' //搜索状态设置为正在角色搜索中
                let opt2 = opt.opt
                let option = {
                    pageSize: 10,
                    currentPage: opt.cur,
                    ...opt2
                }
                axios_post.post(urls.getRole,option).then((res)=>{
                    let response = res.data.data
                    vm.roleArr = response.data
                    for (let k of vm.roleArr) {
                        k.createTime = vm.timeBasic(k.createTime)
                        k.updateTime = vm.timeBasic(k.updateTime)
                    }
                    vm.allPage_r = response.totalPage
                    vm.currentPage_r = response.currentPage
                },(err)=>{
                    layer.msg(err.message)
                }).finally(()=>{
                    layer.close()
                })
            },
            searchPerm:function (opt) { //搜索权限
                let vm = this
                this.searchOptions_p = opt.opt
                this.searchStatus = 'perm' //搜索状态设置为正在角色搜索中
                let opt2 = opt.opt
                let option = {
                    pageSize: 10,
                    currentPage: opt.cur,
                    ...opt2
                }

                axios_post.post(urls.getPermission,option).then((res)=>{
                    let response = res.data
//                    vm.permArr = response.data
                    for (let k of vm.permArr) {
                        k.createTime = vm.timeBasic(k.createTime)
                    }
                    vm.allPage_p = response.totalPage
                    vm.currentPage_p = response.currentPage
//                    async function s_perm_role(){
//                      await function(){
//                        vm.permArr = response.data
//                      }
//                      vm.permControl()
//                    }
                      vm.permArr = response.data
                      vm.permControl()
                },(err)=>{
                    layer.msg(err.message)
                }).finally(()=>{
                    layer.close()
                })
            },
            //获取一页信息-角色
            getPageInfo_R: function () {
              let vm = this
              let params = {
                currentPage: vm.currentPage_r,
                pageSize: 10,
              }
              axios_post.post(urls.getRole,params).then((res)=>{
                let response = res.data.data
                vm.roleArr = response.data
                vm.allPage_r = response.totalPage
                vm.currentPage_r = response.currentPage
              },(err)=>{
                layer.msg(err.message)
              })
            },
            //获取一页信息-权限
            getPageInfo_P: function () {
                let vm = this
                let params = {
                    currentPage: vm.currentPage_p,
                    pageSize: 10,
                }

                axios_post.post(urls.getPermission,params).then((res)=>{
                    let response = res.data
                    vm.permArr = response.data
                    vm.allPage_p = response.totalPage
                    vm.currentPage_p = response.currentPage
                    vm.permControl()
                },(err)=>{
                    layer.msg(err.message)
                })
            },
            //点击页码跳转-role
            JumpTo:function (data) {
                let vm = this
                if(data.type==='role'){
                    vm.currentPage_r = data.cur
                    vm.turnPageRole()
                } else if (data.type === 'perm') {
                    this.currentPage_p = data.cur
                    vm.turnPagePerm()
//                    vm.permControl()
                }

            },

            prev:function (type) {
                let vm = this
                if (type === 'role') {
                    if (vm.currentPage_r>1) {
                        vm.currentPage_r --
                        vm.turnPageRole()
                    }else {
                        layer.msg('前面没有啦')
                        return false
                    }
                }else if (type === 'perm') {
                    if (vm.currentPage_p>1) {
                        vm.currentPage_p --
                        vm.turnPagePerm()
//                        vm.permControl()
                    }else {
                        layer.msg('前面没有啦')
                        return false
                    }
                }
            },
            next:function (type) {
                let vm = this
                if (type === 'role') {
                    if (vm.currentPage_r < vm.allPage_r) {
                        vm.currentPage_r ++
                        vm.turnPageRole()
                    }else {
                        layer.msg('已经是最后一页啦')
                        return false
                    }
                }else if (type === 'perm') {
                    if (vm.currentPage_p < vm.allPage_p) {
                        vm.currentPage_p ++
                        vm.turnPagePerm()
//                        vm.permControl()
                    }else {
                        layer.msg('前面没有啦')
                        return false
                    }
                }
            },
            turnPageRole:function () {
                let vm = this
                if (vm.searchStatus === 'role') {
                    let data = {
                        opt:vm.searchOptions_r,
                        cur:vm.currentPage_r
                    }
                    vm.searchRole(data)
                } else  {
                    vm.getPageInfo_R()
                }
            },
            turnPagePerm:function () {
                let vm = this

                if (vm.searchStatus === 'perm'){
                    let data = {
                        opt:vm.searchOptions_p,
                        cur:vm.currentPage_p
                    }
                    vm.searchPerm(data)
                } else  {
                    vm.getPageInfo_P()
                }
            }
        },
        computed:{
            roleNum:function () {
                return this.roleArr.length
            },
            permNum:function () {
                return this.permArr.length
            }
        }
    }
</script>

<style scoped>
    a{
        cursor:pointer;
    }
    td{
        height: 48px;
        font-size: 12px;
        font-weight: normal;
        white-space: nowrap;
    }
    .cont-main{
        width:100%;
        display: flex;
    }
    .role-main{
        flex:1;
        position: relative;
    }
    .perm-main{
        flex:1;
        position: relative;
        overflow-y: scroll;
        height: 70vh;
    }
    .role-border{
        width:62%;
        overflow-x: scroll;
    }
    .perm-border{
        width:75%;
        overflow-x: scroll;
    }
    .role-table{
        min-width:100%;
    }
    .perm-table{
        min-width:100%;
    }
    .role-btn{
        width:38%;
        position: absolute;
        top:0;
        right:0;
        z-index:1000;
        /*background: green;*/
    }
    .perm-btn{
        width:25%;
        position: absolute;
        top:0;
        right:0;
        z-index:1000;
        /*background: green;*/
    }
    /*------------------------搜索---------------------*/
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
    /*------------------------搜索---------------------*/

</style>
