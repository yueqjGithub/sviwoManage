<template>
    <div class="order">
        <!--!!!!!!!!!搜索盒子！！！！！！！！！！！！！！！！！！！！！-->
        <div class="searchBox col-md-12">
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>创建人</label>
                <input type="text" placeholder="模板创建人" class="giftCount" v-model="s_createRealName">
            </div>
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>修改人</label>
                <input type="text" placeholder="模板修改人"  class="giftCount" v-model="s_updateRealName">
            </div>
            <input class="btn btn-primary searchBtn" type="button" value="搜索" @click="normalSearch(1)">
            <input class="btn btn-primary searchBtn" type="button" value="高级搜索" @click="showSearchMore">
            <input class="btn btn-primary searchBtn" type="button" value="添加优惠券" @click="setCoupons">
        </div>
        <search-more v-if="show_sm" @off_sm="offSearchMore" @submitOption="sub"></search-more>
        <!--!!!!!!!!!搜索盒子！！！！！！！！！！！！！！！！！！！！！-->
        <!------------------------------new---------------------------------------------->
        <div>
          <el-table
            :data="couponsList"
            border
            stripe
          >
            <el-table-column
              prop="couponContent"
              label="内容"
            >
            </el-table-column>
            <el-table-column
              label="状态"
              prop="couponType"
              :filters="[{ text: '满减券', value: 1 }, { text: '折扣券', value:2}, { text: '立减券', value:4}]"
              :filter-method="filterCouponType"
              :formatter="showCouponType"
            >
            </el-table-column>
            <el-table-column
              label="场景"
              prop="scence"
              :filters="[{ text: '全部', value: 1 }, { text: '扫描场景', value:2}, { text: '线上场景', value:3}]"
              :filter-method="filterScence"
              :formatter="showScence"
            >
            </el-table-column>
            <el-table-column
              prop="createRealName"
              label="创建人"
            >
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="170"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="状态"
              prop="couponStatus"
              :filters="[{ text: '停用', value: 0 }, { text: '正常', value:1}]"
              :filter-method="filterStatus"
              :formatter="showStatus"
            >
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="80"
            >
              <template slot-scope="scope">
                <div class="coupon-todo-btn">
                  <router-link :to="{
                                    path:'/sendCoupons',
                                    query:{
                                        couponId:scope.row.couponId,
                                        couponType: scope.row.couponType,
                                        couponContent: scope.row.couponContent,
                                        remark:scope.row.remark
                                    }
                                }">
                    <el-button type="primary" size="mini" v-if="scope.row.couponStatus===1">发送</el-button>
                  </router-link>
                </div>

                <div class="coupon-todo-btn">
                    <el-button type="primary" size="mini" @click="editCoupon(scope.row)">修改</el-button>
                </div>
                <div class="coupon-todo-btn">
                  <el-button type="primary" size="mini" @click="delCoupon(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      <!----------------------------发送页面--------------------------------------->

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

      <div class="popModule" v-if="showAddModule">
        <div class="closePop" @click = 'offAdd'></div>
        <div class="cutLine"></div>
        <set-coupon :isEdit="_isEdit" :infoForm="_infoForm"></set-coupon>
      </div>
    </div>
</template>

<script>
    import api_admin from '@/api/admin'
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'
    import searchMore from '@/pages/coupons/searchMore.vue'
    import setCoupon from '@/pages/coupons/setCoupons.vue'


    export default {
        name: 'Order',
        components: {
            // 高级搜索
            searchMore: searchMore,
            setCoupon: setCoupon
        },
        data: function () {
            return {
                table: null,
                // 高级搜索面板
                show_sm: false,
                // 搜索参数
                s_createRealName: '',
                s_updateRealName: '',
                // 乘客列表
                couponsList:[],
                // 页码相关
                currentPage: 1,
                allPage: 1,
                //详情面板
                infoMore:{},
                searchStatus:false,
                searchOptions:{},
                //显示添加优惠券界面
                showAddModule: false,
                _isEdit: false,
                _infoForm: {}
            }
        },
        created: function () {
            let vm = this
            let params = {
                "pageSize":10,
                "currentPage":this.currentPage
            }
            axios_post.post(urls.getCouponTem,params).then((res)=>{
                let code = res.data.code
                if(code === '10000'){
                  let response = res.data.data
                  vm.couponsList = response.data
                  for(let k of vm.couponsList){
                    k.createTime=vm.timeBasic(k.createTime)
                    k.updateTime=vm.timeBasic(k.updateTime)
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
            //添加优惠券
            setCoupons(){
              this.showAddModule = true
            },
            //修改优惠券
            editCoupon(info){
                this._isEdit = true
                this._infoForm = info
                this.showAddModule = true
            },
            //关闭优惠券添加界面
            offAdd(){
                this.showAddModule = false
            },
            // 过滤优惠券类型
            filterCouponType(value,row){
              return row.couponType === value
            },
            // 过滤场景类型
            filterScence(value,row){
              return row.scence === value
            },
            //过滤状态
            filterStatus(value,row){
              return row.couponStatus === value
            },
            // 优惠券类型显示
            showCouponType(row){
              switch (row.couponType) {
                case 1:
                    return '满减券'
                break
                case 2:
                    return '折扣券'
                break
                case 4:
                    return '立减券'
                break
              }
            },
            // 场景显示
            showScence(row){
              switch (row.scence) {
                case 1:
                  return '全部'
                  break
                case 2:
                  return '扫描场景'
                  break
                case 3:
                  return '线上场景'
                  break
              }
            },
            //优惠券状态显示
            showStatus(row){
              switch (row.couponStatus) {
                case 0:
                    return '停用'
                break
                case 1:
                    return '正常'
                break
              }
            },
            //删除优惠券模板
            delCoupon:function (k) {
                let vm = this
                let params={
                    'couponId':k.couponId
                }

                let index = layer.confirm('确定要删除此优惠券吗',{icon:3,title:'警告'},function(){
                    axios_post.post(urls.deleteCouponTem,params).then((res)=>{
                        layer.msg(res.data.msg)
                        k.couponId=null
                    },(err)=>{
                        layer.msg('出错啦')
                    })
                    layer.close(index)
                },function(){
                    layer.close(index)
                })

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
                axios_post.post(urls.getCouponTem,option).then((res)=>{
                    this.couponsList = res.data.data.data
                    for(let k of vm.couponsList){
                        k.createTime=vm.timeBasic(k.createTime)
                        k.updateTime=vm.timeBasic(k.updateTime)
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
                }
                if(vm.s_createRealName !== ''){
                    option['createRealName']=vm.s_createRealName
                }
                if(vm.s_updateRealName !== ''){
                    option['updateRealName']=vm.s_updateRealName
                }
                axios_post.post(urls.getCouponTem,option).then((res)=>{
                    let response = res.data.data
                    this.couponsList = response.data
                    for(let k of vm.couponsList){
                        k.createTime=vm.timeBasic(k.createTime)
                        k.updateTime=vm.timeBasic(k.updateTime)
                    }
                    this.allPage = response.totalPage
                    this.currentPage = response.currentPage
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
                axios_post.post(urls.getCouponTem,params).then((res)=>{
                    this.couponsList = res.data.data.data
                    for(let k of vm.couponsList){
                        k.createTime=vm.timeBasic(k.createTime)
                        k.updateTime=vm.timeBasic(k.updateTime)
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
                    if (vm.s_createRealName !== '' || vm.s_updateRealName !== '') {
                        vm.normalSearch(vm.currentPage)
                    } else {
                        vm.getCouponInfo()
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
                        if (vm.s_createRealName !== '' || vm.s_updateRealName !== '') {
                            vm.normalSearch(vm.currentPage)
                        } else {
                            vm.getCouponInfo()
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
                        if (vm.s_createRealName !== '' || vm.s_updateRealName !== '') {
                            vm.normalSearch(vm.currentPage)
                        } else {
                            vm.getCouponInfo()
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
  /*-----------------------------20190315---------------------------------*/
  .coupon-todo-btn{
    margin:2px auto;
  }
</style>
