<template>
    <div class="order">
        <!--!!!!!!!!!搜索盒子！！！！！！！！！！！！！！！！！！！！！-->
        <div class="searchBox col-md-12">
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>认证状态</label>
                <!--<input type="text" placeholder="认证状态" class="search_input" v-model="s_driverStatus">-->
                <select name="" class="giftCount" v-model="s_driverStatus" placeholder="请选择">
                    <option value='' disabled selected style='display:none;'>请选择</option>
                    <option value="0">未认证</option>
                    <option value="1">审核中</option>
                    <option value="2">认证失败</option>
                </select>
            </div>
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>证件号</label>
                <input type="text" placeholder="证件号" class="giftCount" v-model="s_certificateNo">
            </div>
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>真实姓名</label>
                <input type="text" placeholder="真实姓名" class="giftCount" v-model="s_realName">
            </div>
            <input class="btn btn-default searchBtn" type="button" value="搜索" @click="normalSearch(1)">
            <input class="btn btn-default searchBtn" type="button" value="高级搜索" @click="showSearchMore">
        </div>
        <search-more v-if="show_sm" @off_sm="offSearchMore" @submitOption="sub" :isAudit="true"></search-more>
        <!--!!!!!!!!!搜索盒子！！！！！！！！！！！！！！！！！！！！！-->
        <div class="row">
            <div class="col-md-12">
                <div class="table-responsive">
                    <table id="order_table" class="table table-striped table-bordered table-hover table-full-width">
                        <thead>
                        <tr>
                            <th>司机姓名</th>
                            <th>手机号</th>
                            <th>行驶证号</th>
                            <th>认证状态</th>
                            <!--<th>失败步骤</th>-->
                            <th>司机类型</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="k in driver" :key="k.index">
                            <th>{{k.realName}}</th>
                            <th>{{k.mobileNumber}}</th>
                            <th>{{k.licenseNumber}}</th>
                            <th>
                                <span v-if="k.driverStatus === 0">未认证</span>
                                <span v-if="k.driverStatus === 1">审核中</span>
                                <span v-if="k.driverStatus === 2">认证失败</span>
                                <!--<span v-if="k.driverStatus === 3">已认证</span>-->
                            </th>
                            <!--<th>-->
                                <!--<span v-if="k.idetificatonStep === 1">车辆信息</span>-->
                                <!--<span v-if="k.idetificatonStep === 2">个人信息</span>-->
                                <!--<span v-if="k.idetificatonStep === 3">认证成功</span>-->
                            <!--</th>-->
                            <th>
                                <span v-if="k.driverType === 1">签约司机</span>
                                <span v-if="k.driverType === 2">加盟司机</span>
                            </th>
                            <th>
                                <!--<input type="button" class="btn btn-default btn-xs" value="审核" v-if="k.driverStatus ===0" @click="show_audit(k,0)">-->
                                <span v-if="k.driverStatus === 0">资料未完善</span>
                                <input type="button" class="btn btn-default btn-xs" value="审核" @click="show_audit(k,1)">
                            </th>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!--翻页组件----------------------->
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
                <!--翻页组件--------------------->
            </div>
        </div>
        <!--司机详情面板-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
        <div class="detail"  v-if="showDetail">
            <p @click = 'offDetail' class="offBtn">X</p>
            <Detail :driver="driverMore"></Detail>
        </div>
        <!--司机详情面板-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->

    </div>
</template>

<script>
    import api_admin from '@/api/admin'
    import urls from '@/config/api'
    import axios_post from '@/api/extendAxios.js'
//    import sessionstorage from 'sessionstorage'
    import searchMore from '@/pages/driver/searchMore.vue'
    //审核详情面板
    import Detail from '@/pages/audit/audit_detail.vue'

    export default {
        name: 'Order',
        components: {
            // 高级搜索
            searchMore: searchMore,
            // 审核详情
            Detail: Detail
        },
        data: function () {
            return {
                table: null,
                // 高级搜索面板
                show_sm: false,
                // 搜索参数
                s_driverStatus: '',
                s_certificateNo: '',
                s_realName: '',
                // 司机列表
                driver:[],
                // 页码相关
                currentPage: 1,
                allPage: 1,
                //司机详情
                showDetail: false,
                driverMore:{},
                //搜索分页
                searchStatus:false,
                searchOptions:{}
            }
        },
        created: function () {
            //请求数据
            let vm = this
            let params = {
                currentPage: 1,
                pageSize: 10,
                listType: 'auditingDriver'
            }
            axios_post.post(urls.auditingDriverList,params).then((res)=>{
                this.driver = res.data.data.data
                for (let k of vm.driver) {
                    k.createTime = vm.timeBasic(k.createTime)
                }
                this.allPage = res.data.data.totalPage
            },(err)=>{
                console.log(err)
            })
        },
        methods:{
            //高级搜索
            sub: function (opt) {
                let vm = this
                this.searchOptions = opt.opt
                this.searchStatus = true
                let opt2 = opt.opt
                let option = {
                    pageSize: 10,
                    currentPage: opt.cur,
                    listType: 'auditingDriver',
                    ...opt2
                }
                axios_post.post(urls.auditingDriverList,option).then((res)=>{
                    this.driver = res.data.data.data
                    for (let k of vm.driver) {
                        k.createTime = vm.timeBasic(k.createTime)
                    }
                    this.allPage = res.data.data.totalPage
                    this.currentPage = res.data.data.currentPage
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
                    listType: 'auditingDriver',
                }
                if(vm.s_driverStatus !== ''){
                    option['driverStatus']=parseInt(vm.s_driverStatus)
                }
                if(vm.s_certificateNo !== ''){
                    option['certificateNo']=vm.s_certificateNo
                }
                if(vm.s_realName !== ''){
                    option['realName']=vm.s_realName
                }
                axios_post.post(urls.auditingDriverList,option).then((res)=>{
                    this.driver = res.data.data.data
                    for (let k of vm.driver) {
                        k.createTime = vm.timeBasic(k.createTime)
                    }
                    this.allPage = res.data.data.totalPage
                    this.currentPage = res.data.data.currentPage
                },(err)=>{
//                    console.log(err)
                }).finally(()=>{
                    layer.close()
                })
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
            // 打开审核面板
            show_audit: function (obj,status) {
                let vm = this
                this.showDetail = true
                let arr
                let type = typeof obj.certificateImage
                if(type === 'string'){
                    arr = obj.certificateImage.split(';')
                } else if (obj.certificateImage===null) {
                    arr = []
                }
                obj.certificateImage = arr
                this.driverMore = obj
                // 面板上司机状态修改为审核中
                obj.driverStatus = 1
                // doSomething 通知服务器该司机状态更改为审核中
                let updataUser = sessionStorage.getItem('admin/user')
//                updataUser = JSON.parse(updataUser)
//                let params = {
//                    "driverId": obj.driverId,     // 司机id
//                    "driverStatus": 1,     //审核状态  1:审核中
//                    "updateUser": updataUser.sysUserId,
//                }
//                axios_post.post(urls.auditingDriver,params).then((res)=>{
//                    if(status === 0){
//                        layer.open({
//                            title:'提示',
//                            content:'司机状态已变更'
//                        })
//                    }
//                })
            },
            //关闭详情面板
            offDetail: function () {
                this.showDetail = false
            },
            // 获取一页司机信息
            getDriverInfo: function () {
                let params = {
                    currentPage: this.currentPage,
                    pageSize: 10,
                    listType: 'auditingDriver'
                }
                let vm = this
                axios_post.post(urls.auditingDriverList,params).then((res)=>{
                    this.driver = res.data.data.data
                    for (let k of vm.driver) {
                        k.createTime = vm.timeBasic(k.createTime)
                    }
                    this.allPage = res.data.data.totalPage
                },(err)=>{
                    console.log(err)
                })
            },
            jumpTo: function (e) {
                let vm = this
                let num = e.target.innerText
//                console.log(num)
                num = parseInt(num)
                this.currentPage = num
                if (vm.searchStatus) {
                    let data = {
                        opt:vm.searchOptions,
                        cur:vm.currentPage
                    }
                    vm.sub(data)
                } else {
                    if (vm.s_driverStatus !== '' || vm.s_certificateNo !== '' || vm.s_realName !== '') {
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
                        if (vm.s_driverStatus !== '' || vm.s_certificateNo !== '' || vm.s_realName !== '') {
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
                        if (vm.s_driverStatus !== '' || vm.s_certificateNo !== '' || vm.s_realName !== '') {
                            vm.normalSearch(vm.currentPage)
                        } else {
                            vm.getDriverInfo()
                        }
                    }
                } else {
                    layer.msg('已经是最后一页啦')
                }
            }
        }
    }
</script>

<style scoped>
    .searchBox{
        display: flex;
        border-bottom: 1px dotted;
        padding-bottom: 20px;
        margin-bottom: 20px;
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
</style>
