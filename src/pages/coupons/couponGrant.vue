<template>
    <div class="order">
        <!--!!!!!!!!!搜索盒子！！！！！！！！！！！！！！！！！！！！！-->
        <div class="searchBox col-md-12">
            <input class="btn btn-default searchBtn" type="button" value="打开搜索" @click="showSearchMore">
        </div>
        <search-more v-if="show_sm" @off_sm="offSearchMore" @submitOption="sub"></search-more>
        <!--!!!!!!!!!搜索盒子！！！！！！！！！！！！！！！！！！！！！-->
        <div class="row">
            <div class="col-md-12">
                <div class="table-responsive">
                    <table id="order_table" class="table table-striped table-bordered table-hover table-full-width">
                        <thead>
                        <tr>
                            <!--<th>ID</th>-->
                            <th>发放时间</th>
                            <th>有效时间</th>
                            <th>使用时间</th>
                            <th>使用状态</th>
                            <th>备注</th>
                            <th>发放人</th>
                            <th>内容</th>
                            <th>类型</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="k in grantList" v-if="k.grantId!==null">
                                <!--<th>-->
                                    <!--{{k.couponId}}-->
                                <!--</th>-->
                                <th>
                                    {{k.grantTime}}
                                </th>
                                <th>
                                    {{k.effectiveTime}}
                                </th>
                                <th>
                                    {{k.applyTime}}
                                </th>
                                <th>
                                    <span v-if="k.applyStatus === 0">未使用</span>
                                    <span v-if="k.applyStatus === 1">已使用</span>
                                    <span v-if="k.applyStatus === 2">撤销</span>
                                </th>
                                <th>
                                    {{k.remark}}
                                </th>
                                <th>
                                    {{k.grantUserRealName}}
                                </th>
                                <th>
                                    {{k.couponContent}}
                                </th>
                                <th>
                                    <span v-if="k.couponType===1">满减券</span>
                                    <span v-if="k.couponType===2">折扣券</span>
                                </th>
                                <th>
                                    <input type="button" class="btn btn-primary btn-xs" value="接收人" @click="reciver(k.mobileNumber)">
                                    <input type="button" class="btn btn-primary btn-xs" value="撤回" @click="recycling(k)"
                                           v-if="new Date(k.effectiveTime).getTime() > baseTime && k.applyStatus === 0">
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
        <!--!!!!!!!!!!!!!!!!!接收人！！！！！！！！！！！！！！！！！！！-->
        <div class="detail"  v-if="showDetail">
            <p @click = 'offDetail' class="offBtn">X</p>
            <pas :passengerId="rec_coupon"></pas>
        </div>
        <!--!!!!!!!!!!!!!!!!!接收人！！！！！！！！！！！！！！！！！！！-->
    </div>
</template>

<script>
    import api_admin from '@/api/admin'
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'
    import search from '@/pages/coupons/grantSearch.vue'
    import pas from '@/pages/coupons/pasList.vue'


    export default {
        name: 'Order',
        components: {
            // 高级搜索
            searchMore: search,
            //接收人列表
            pas: pas
        },
        data: function () {
            return {
                table: null,
                // 高级搜索面板
                show_sm: false,
                // 搜索参数
                // 乘客列表
                grantList:[],
                // 页码相关
                currentPage: 1,
                allPage: 1,
                //详情面板
                infoMore:{},
                searchStatus:false,
                searchOptions:{},
                //接收人Id传递
                rec_coupon:'',
                showDetail:false,
                baseTime:new Date().getTime(),
            }
        },
        created: function () {
            let vm = this
            let params = {
                "pageSize":10,
                "currentPage":this.currentPage
            }
            axios_post.post(urls.getCouponGrant,params).then((res)=>{
                let code = res.data.code
                if(code === '10000'){
                  let response = res.data.data
                  vm.grantList = response.data
                  for (let k of vm.grantList) {
                    k.grantTime = vm.timeBasic(k.grantTime)
                    k.effectiveTime = vm.timeBasic(k.effectiveTime)
                    k.applyTime = vm.timeBasic(k.applyTime)
                  }
                  vm.currentPage = response.currentPage
                  vm.allPage = response.totalPage
                }else{
                    layer.open({
                      title:code,
                      content:res.data.msg
                    })
                }
            },(err)=>{
                layer.msg(err)
            })
        },
        methods:{
            //撤回优惠券
            recycling: function (k) {
                let param = {
                    "grantId": k.grantId,
                }
                let index=layer.confirm('确认要撤回吗',{icon:3,title:'警告'},function(){
                    axios_post.post(urls.withdrawCoupon,param).then((res)=>{
                        layer.msg(res.data.msg)
                        if(res.data.code='30012'){
                            k.applyStatus = 2
                        }
                        layer.close(index)
                    },(err)=>{
                        layer.msg(err.message)
                        layer.close(index)
                    })
                },function () {
                    layer.close(index)
                })

            },
            //打开接收人列表
            reciver: function (mobile) {
              this.$router.push({name: 'passenger', params: {phone: mobile}})
            },
            //关闭接收人列表
            offDetail: function () {
                this.showDetail = false
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
                axios_post.post(urls.getCouponGrant,option).then((res)=>{
                    this.grantList = res.data.data.data
                    for (let k of vm.grantList) {
                        k.grantTime = vm.timeBasic(k.grantTime)
                        k.effectiveTime = vm.timeBasic(k.effectiveTime)
                        k.applyTime = vm.timeBasic(k.applyTime)
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
            // 获取一页
            getCouponInfo: function () {
                let vm = this
                let params = {
                    currentPage: this.currentPage,
                    pageSize: 10
                }
                axios_post.post(urls.getCouponGrant,params).then((res)=>{
                    vm.grantList = res.data.data.data
                    for (let k of vm.grantList) {
                        k.grantTime = vm.timeBasic(k.grantTime)
                        k.effectiveTime = vm.timeBasic(k.effectiveTime)
                        k.applyTime = vm.timeBasic(k.applyTime)
                    }
                    this.allPage = res.data.data.totalPage
                },(err)=>{
                    layer.msg(err)
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
                    vm.getCouponInfo()
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
                        vm.getCouponInfo()
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
                        vm.getCouponInfo()
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
