<template>
    <div class="order">
        <!--!!!!!!!!!搜索盒子！！！！！！！！！！！！！！！！！！！！！-->
        <div class="searchBox col-md-12">
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>乘客昵称</label>
                <input type="text" id="s_carID" placeholder="乘客昵称" class="giftCount" v-model="s_passengerName">
            </div>
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>用户名</label>
                <input type="text" id="s_license" placeholder="用户名"  class="giftCount" v-model="s_userName">
            </div>
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>姓名</label>
                <input type="text" id="s_name" placeholder="姓名"  class="giftCount" v-model="s_realName">
            </div>
            <input class="btn btn-default searchBtn" type="button" value="搜索" @click="normalSearch(1)">
            <input class="btn btn-default searchBtn" type="button" value="高级搜索" @click="showSearchMore">
        </div>
        <search-more v-if="show_sm" @off_sm="offSearchMore" @submitOption="sub"></search-more>
        <!--!!!!!!!!!搜索盒子！！！！！！！！！！！！！！！！！！！！！-->
        <div class="row">
            <div class="col-md-12">
                <div class="table-responsive">
                    <table id="order_table" class="table table-striped table-bordered table-hover table-full-width">
                        <thead>
                        <tr>
                            <th>用户昵称</th>
                            <th>真实姓名</th>
                            <th>创建时间</th>
                            <th>证件号码</th>
                            <th>账号状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="k in passenger" :key="k.index">
                            <th>{{k.passengerName}}</th>
                            <th>{{k.realName}}</th>
                            <th>{{k.createTime}}</th>
                            <th>{{k.certificateNo}}</th>
                            <th>
                                <span v-if="k.passengerStatus === 0">冻结</span>
                                <span v-if="k.passengerStatus === 1">正常</span>
                            </th>
                            <th>
                                <input type="button" value="乘客详情" @click="passengerDetail(k)"class="btn btn-primary btn-xs">
                                <input type="button" class="btn btn-primary btn-xs" value="订单列表" @click="passengerOrder(k)">
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
        <div class="detail" v-if="showDetail">
            <p @click = 'offDetail' class="offBtn">X</p>
            <passenger-detail :info="infoMore" @changeStatus="changeStatus"></passenger-detail>
        </div>
        <!--司机详情面板-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
        <div class="detail"  v-if="show_order">
            <p @click = 'offOrder' class="offBtn">X</p>
            <order-list :searchOption="order_searchOption"></order-list>
        </div>
    </div>
</template>

<script>
    import api_admin from '@/api/admin'
    import urls from '@/config/api'
    import passengerDetail from '@/pages/passenger/passengerDetail.vue'
    import searchMore from '@/pages/passenger/searchMore.vue'
    import axios_post from '@/api/extendAxios.js'
    import order_list from '@/commonComponent/order_list.vue'

    export default {
        name: 'Order',
        components: {
            //  乘客详情
            passengerDetail: passengerDetail,
            // 高级搜索
            searchMore: searchMore,
            //订单列表
            orderList:order_list
        },
        data: function () {
            return {
                table: null,
                // 高级搜索面板
                show_sm: false,
                // 搜索参数
                s_passengerName: '',
                s_userName: '',
                s_realName: '',
                // 乘客列表
                passenger:[],
                // 页码相关
                currentPage: 1,
                allPage: 1,
                //司机详情
                showDetail: false,
                //详情面板
                infoMore:{},
                //搜索分页
                searchStatus:false,
                searchOptions:{},
                //订单列表相关
                order_searchOption:'',
                show_order:false
            }
        },
        created: function () {
            //请求数据
            let vm = this
            let params = {
                currentPage: 1,
                pageSize: 10
            }
            let pmobile = vm.$route.params.phone
            if (pmobile) {
              params['userName'] = pmobile
            }
            api_admin.passengerInfo(params).then((res)=>{
              if(res.data.code === '10000'){
                this.passenger = res.data.data.data
                for (let k of this.passenger) {
                  k.createTime = vm.timeBasic(k.createTime)
                  k.freezingTime = vm.timeBasic(k.freezingTime)
                  k.freezingExpireTime = vm.timeBasic(k.freezingExpireTime)
                }
                this.allPage = res.data.data.totalPage
              } else {
                  layer.open({
                    title:res.data.code,
                    content:res.data.msg
                  })
              }

            },(err)=>{
                layer.open({
                  title:'出错啦',
                  content:err.message
                })
            })
        },
        methods:{
            //冻结后改变乘客状态
            changeStatus:function () {
              this.infoMore.passengerStatus = 0
            },
            //打开司机订单列表
            passengerOrder:function (k) {
                let vm = this
                vm.order_searchOption = {
                    passengerId:k.passengerId
                }
                vm.show_order = true
            },
            offOrder:function () {
                this.show_order = false
            },
            //高级搜索
            sub: function (opt) {
                this.searchOptions = opt.opt
                this.searchStatus = true

                let opt2 = opt.opt
                let option = {
                    pageSize: 10,
                    currentPage: opt.cur,
                    ...opt2
                }
                let vm = this
                axios_post.post(urls.passengerInfo,option).then((res)=>{
                    this.passenger = res.data.data.data
                    for (let k of this.passenger) {
                        k.createTime = vm.timeBasic(k.createTime)
                        k.freezingTime = vm.timeBasic(k.freezingTime)
                        k.freezingExpireTime = vm.timeBasic(k.freezingExpireTime)
                    }
                    this.allPage = res.data.data.totalPage
                    this.currentPage = res.data.data.currentPage
                },(err)=>{
                    layer.msg(err.message)
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
              if (vm.s_passengerName !== ''){
                    option['passengerName'] = this.s_passengerName
              }
                if (vm.s_userName !== ''){
                    option['userName'] = this.s_userName
                }
                if (vm.s_realName !== ''){
                    option['realName'] = this.s_realName
                }
                axios_post.post(urls.passengerInfo,option).then((res)=>{
                    this.passenger = res.data.data.data
                    for (let k of this.passenger) {
                        k.createTime = vm.timeBasic(k.createTime)
                        k.freezingTime = vm.timeBasic(k.freezingTime)
                        k.freezingExpireTime = vm.timeBasic(k.freezingExpireTime)
                    }
                    this.allPage = res.data.data.totalPage
                    this.currentPage = res.data.data.currentPage
              },(err)=>{
                  console.log(err)
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
            //关闭详情面板
            offDetail: function () {
                this.showDetail = false
            },
            // 获取一页乘客信息
            getPassengerInfo: function () {
                let params = {
                    currentPage: this.currentPage,
                    pageSize: 10
                }
                api_admin.passengerInfo(params).then((res)=>{
                    this.passenger = res.data.data.data
                    for (let k of this.passenger) {
                        k.createTime = vm.timeBasic(k.createTime)
                        k.freezingTime = vm.timeBasic(k.freezingTime)
                        k.freezingExpireTime = vm.timeBasic(k.freezingExpireTime)
                    }
                    this.allPage = res.data.data.totalPage
                },(err)=>{
                    console.log(err)
                })
            },
            jumpTo: function (e) {
                let vm = this
                let num = e.target.innerText
                console.log(num)
                num = parseInt(num)
                this.currentPage = num
                if (vm.searchStatus) {
                    let data = {
                        opt:vm.searchOptions,
                        cur:vm.currentPage
                    }
                    vm.sub(data)
                } else {
                    if (vm.s_passengerName !== '' || vm.s_userName !== '' || vm.s_realName !== '') {
                        vm.normalSearch(vm.currentPage)
                    } else {
                        vm.getPassengerInfo()
                    }
                }
            },
            prev: function () {
                let vm = this
                if(this.currentPage > 1){
                    let vm = this
                    this.currentPage --
                    if (vm.searchStatus) {
                        let data = {
                            opt:vm.searchOptions,
                            cur:vm.currentPage
                        }
                        vm.sub(data)
                    } else {
                        if (vm.s_passengerName !== '' || vm.s_userName !== '' || vm.s_realName !== '') {
                            vm.normalSearch(vm.currentPage)
                        } else {
                            vm.getPassengerInfo()
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
                        if (vm.s_passengerName !== '' || vm.s_userName !== '' || vm.s_realName !== '') {
                            vm.normalSearch(vm.currentPage)
                        } else {
                            vm.getPassengerInfo()
                        }
                    }
                } else {
                    layer.msg('已经是最后一页啦')
                }
            },
            // 乘客详情
            passengerDetail: function (info) {
                let arr
                let type = typeof info.certificateImage
                if(type === 'string'){
                    arr = info.certificateImage.split(';')
                } else if (type === 'object') {
                    arr = info.certificateImage
                }
                info.certificateImage = arr
                this.infoMore = info
//                console.log(this.infoMore)
                this.showDetail = true
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
