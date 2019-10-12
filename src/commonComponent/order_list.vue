<template>
    <div style="width: 100%;">
      <el-table
        :data="orderArr"
        border
        stripe
        height="60vmin"
      >
        <el-table-column
          type="expand"
          fixed="left"
        >
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row  v-if="props.row.orderStatus === 7 || props.row.orderStatus === 8">
                <el-form-item label="订单取消原因">
                  <span style="color: #F56C6C;">{{ props.row.cancelReason }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="乘客手机号">
                    <span>{{ props.row.pmobile }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="乘客真实姓名">
                    <span>{{ props.row.prealName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="司机手机号">
                    <span>{{ props.row.dmobile }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="司机真实姓名">
                    <span>{{ props.row.drealName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="起始地址">
                    <span>{{ props.row.startAddress }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="结束地址">
                    <span>{{ props.row.endAddress }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="起始定位">
                    <span>{{ props.row.startPos }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="结束定位">
                    <span>{{ props.row.endPos }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="税费">
                    <span>{{ props.row.taxPrice }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="手续费">
                    <span>{{ props.row.feePrice }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="违约金">
                  <span>{{ props.row.penalSum }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="订单状态">
                    <!--<span>{{ props.row.desc }}</span>-->
                    <span v-if="props.row.orderStatus === 1">已接单</span>
                    <span v-if="props.row.orderStatus === 2">到达乘客地点</span>
                    <span v-if="props.row.orderStatus === 3">乘客上车</span>
                    <span v-if="props.row.orderStatus === 4">到达目的地</span>
                    <span v-if="props.row.orderStatus === 5">乘客已支付</span>
                    <span v-if="props.row.orderStatus === 6">乘客已评价</span>
                    <span v-if="props.row.orderStatus === 7">乘客取消</span>
                    <span v-if="props.row.orderStatus === 8">司机取消</span>
                    <span v-if="props.row.orderStatus === 9">司机关闭</span>
                    <span v-if="props.row.orderStatus === 10">客服关闭</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="订单类型">
                    <!--<span>{{ props.row.desc }}</span>-->
                    <span v-if="props.row.orderType===1">线上订单</span>
                    <span v-if="props.row.orderType===2">线下订单</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="订单总金额">
                    <span>{{ props.row.orderPrice }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="支付时间">
                    <span>{{ props.row.payTime }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="创建时间">
                    <span>{{ props.row.createTime }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="取消时间">
                    <span>{{ props.row.cancleTime }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="到账金额">
                    <span>{{ props.row.actualPrice }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="平台补贴">
                    <span>{{ props.row.subsidy }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="距离(米)">
                  <span>{{ props.row.distance }}</span>
                </el-form-item>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="startAddress"
          label="起始地址"
        >
        </el-table-column>
        <el-table-column
          prop="endAddress"
          label="结束地址"
        >
        </el-table-column>
        <el-table-column
          label="订单状态"
          prop="orderStatus"
          :filters="[{ text: '已接单', value: 1 }, { text: '到达乘客地点', value:2}, { text: '乘客上车', value:3}
            , { text: '到达目的地', value:4}, { text: '乘客已支付', value:5}, { text: '乘客已评价', value:6}
            , { text: '乘客取消', value:7}, { text: '司机取消', value:8}, { text: '司机关闭', value:9}
            , { text: '客服关闭', value:10}]"
          :filter-method="filterOrderStatus"
          :formatter="showOrderStatus"
        >
        </el-table-column>
        <el-table-column
          label="订单类型"
          prop="orderType"
          :filters="[{ text: '线上订单', value: 1 }, { text: '线下订单', value:2}]"
          :filter-method="filterOrderType"
          :formatter="showOrderType"
        >
        </el-table-column>
        <el-table-column
          prop="orderPrice"
          label="订单总金额"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="payTime"
          label="支付时间"
          width="170"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="actualPrice"
          label="到账金额"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="subsidy"
          label="平台补贴"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="distance"
          label="距离(米)"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="pRealName"
          label="乘客真实姓名"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="dRealName"
          label="司机真实姓名"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="170"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="cancleTime"
          label="取消时间"
          width="170"
          sortable
        >
        </el-table-column>
      </el-table>
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
        <div class="detail"  v-if="sm">
            <p @click = 'offDetail' class="offBtn">X</p>
            <detail :info="orderMore"></detail>
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'
    import detail from '@/pages/order/order_detail.vue'

    export default {
        name:'oList',
        components:{
            detail:detail
        },
        data:function () {
            return {
                //显示详情面板
                sm:false,
                orderArr:[],
                orderMore:{},
                //翻页
                currentPage:1,
                allPage:1,
            }
        },
        props:['searchOption'], //@param orderArr-信息集合 @param searchOption-查询条件
        mounted:function () {
            let vm = this
            let params = {
                currentPage:1,
                pageSize:10
            }
            if(vm.searchOption['passengerId'] !== undefined){
                params['passengerId'] = vm.searchOption['passengerId']
            } else if (vm.searchOption['driverId']!== undefined) {
                params['driverId'] = vm.searchOption['driverId']
            }
//            console.log(params)
            axios_post.post(urls.getOrder,params).then(res=>{
                let response = res.data.data
                vm.orderArr = response.data
                for(let k of vm.orderArr){
                    k.cancleTime=vm.timeBasic(k.cancleTime)
                    k.createTime=vm.timeBasic(k.createTime)
                    k.payTime=vm.timeBasic(k.payTime)
                }
                vm.allPage = response.totalPage
            })
        },
        methods:{
          filterOrderStatus(value,row){
              return row.orderStatus === value
          },
          filterOrderType(value,row){
              return row.orderType === value
          },
          showOrderType(row){
            switch (row.orderType) {
              case 1:
                  return '线上订单'
              break
              case 2:
                  return '线下订单'
              break
            }
          },
          showOrderStatus(row){
              let str = ''
              switch (row.orderStatus) {
                case 1:
                    return '已接单'
                break
                case 2:
                  return '到达乘客地点'
                  break
                case 3:
                  return '乘客上车'
                  break
                case 4:
                  return '到达目的地'
                  break
                case 5:
                  return '乘客已支付'
                  break
                case 6:
                  return '乘客已评价'
                  break
                case 7:
                  return '乘客取消'
                  break
                case 8:
                  return '司机取消'
                  break
                case 9:
                  return '司机关闭'
                  break
                case 10:
                  return '客服关闭'
                  break
              }
          },
            offDetail:function () {
                this.sm = false
            },
            showDetail:function (i) {
                this.orderMore = this.orderArr[i-1]
                this.sm = true
            },
            getDriverInfo: function () {
                let vm = this
                let params = {
                    currentPage: this.currentPage,
                    pageSize: 10,
                }
                if(vm.searchOption['passengerId'] !== undefined){
                    params['passengerId'] = vm.searchOption['passengerId']
                } else if (vm.searchOption['driverId']!== undefined) {
                    params['driverId'] = vm.searchOption['driverId']
                }
                axios_post.post(urls.getOrder,params).then((res)=>{
                    let response = res.data.data
                    vm.orderArr = response.data
                    for(let k of vm.orderArr){
                        k.cancleTime=vm.timeBasic(k.cancleTime)
                        k.createTime=vm.timeBasic(k.createTime)
                        k.payTime=vm.timeBasic(k.payTime)
                    }
                    vm.allPage = response.totalPage
                    vm.currentPage = response.currentPage
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
        },
        computed:{
            workNum:function () {
                //返回信息条数决定操作按钮显示行数
                return this.orderArr.length
            }
        }
    }
</script>

<style scoped>
    td{
        height: 40px;
    }
    .table-main{
        width:100%;
        margin:0 auto;
        position: relative;
    }
    .main-content{
        width: 90%;
        overflow-x: scroll;
        overflow-y: hidden;
    }
    .table-swiper{
        min-width:180%;
    }
    .work{
        width:10%;
        position: absolute;
        top:0;
        right:0;
        z-index:1000;
        /*background: green;*/
    }
    .pgBtn{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>
