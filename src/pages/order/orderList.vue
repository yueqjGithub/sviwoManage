<template>
  <div>
    <!----------------搜索区域------------------->
    <div class="searchDiv">
      <el-form :size="'mini'" :label-position="'left'"  :inline="true" :rules="rule">
        <el-form-item
          label="订单ID"
        >
          <el-input v-model.trim="search.orderId"></el-input>
        </el-form-item>
        <el-form-item
          label="乘客手机"
        >
          <el-input v-model.trim="search.pmobile"></el-input>
        </el-form-item>
        <el-form-item
          label="司机手机"
        >
          <el-input v-model.trim="search.dmobile"></el-input>
        </el-form-item>
        <el-form-item
          label="第三方支付号"
        >
          <el-input v-model.trim="search.tradeNumber"></el-input>
        </el-form-item>
        <el-form-item
          label="所属区域"
        >
          <el-select v-model="search.areaName"  clearable placeholder="全部">
            <el-option
              v-for="item in selectArr.areaArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="订单状态"
        >
          <el-select v-model="search.orderStatus"  clearable placeholder="全部">
            <el-option
              v-for="item in selectArr.statusArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="支付方式"
        >
          <el-select v-model="search.payType"  clearable placeholder="全部">
            <el-option
              v-for="item in selectArr.payArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="订单类型"
        >
          <el-select v-model="search.orderType"  clearable placeholder="全部">
            <el-option
              v-for="item in selectArr.typeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <a href="javascript:void(0);" @click="changeSearch">{{showSearchMore ? '收起' : '更多'}}</a>
        </el-form-item>
        <el-row v-show="showSearchMore">
          <el-row>
            <el-form-item
              label="下单时间"
            >
              <el-date-picker
                v-model="search.createTimeStart"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
              <span>至</span>
              <el-date-picker
                v-model="search.createTimeEnd"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="支付时间"
            >
              <el-date-picker
                v-model="search.payTimeStart"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
              <span>至</span>
              <el-date-picker
                v-model="search.payTimeEnd"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-row>
      </el-form>
    </div>
    <!----------------按钮区域------------------->
    <div class="buttonDiv">
      <div class="buttonList">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchOrder">查询</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button type="primary" size="mini" icon="el-icon-download" @click="exportOrder">导出</el-button>
      </div>
    </div>
    <!--------------------------统计区域------------------->
    <div class="cuntOrder">
      <div class="cuntDiv">
        <span class="cuntTit">订单金额：</span>
        <countTo :startVal='0' :endVal='sum.sumOrderMoney' :duration='1500' class="cuntCount"
                 :decimals="2"
        ></countTo>
      </div>
      <div class="cuntDiv">
        <span class="cuntTit">实收入金额：</span>
        <countTo :startVal='0' :endVal='sum.sumReceiptsPrice' :duration='1500' class="cuntCount"
                 :decimals="2"
        ></countTo>
      </div>
      <div class="cuntDiv">
        <span class="cuntTit">订单数：</span>
        <countTo :startVal='0' :endVal='sum.countOrderNumber' :duration='1500' class="cuntCount"
                 :decimals="0"
        ></countTo>
      </div>
    </div>
    <!--------------------------表格区域------------------------------------->
    <el-table
      :data="data"
      stripe
      border
      v-loading="loading"
      height="calc(100vh - 160px)"
    >
      <el-table-column
        label="订单ID"
        prop="orderId"
      ></el-table-column>
      <el-table-column
        label="乘客手机号"
        prop="pmobile"
      ></el-table-column>
      <el-table-column
        label="司机手机号"
        prop="dmobile"
      ></el-table-column>
      <el-table-column
        label="所属区域"
        prop="areaName"
      ></el-table-column>
      <el-table-column
        label="起点位置"
        prop="startAddress"
      ></el-table-column>
      <el-table-column
        label="结束位置"
        prop="endAddress"
      ></el-table-column>
      <el-table-column
        label="订单状态"
      >
        <template slot-scope="scope">
          <span v-for="k in selectArr.statusArr" v-if="k.value === scope.row.orderStatus">{{k.label}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单类型"
      >
        <template slot-scope="scope">
          <span v-for="k in selectArr.typeArr" v-if="k.value === scope.row.orderType">{{k.label}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="接单时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="220"
      >
        <template slot-scope="scope">
          <a-popconfirm title="确定关闭该订单吗?" @confirm="offOrder(scope.row)" okText="确定" cancelText="取消">
            <el-button size="mini" type="primary" v-if="scope.row.orderStatus < 5" :disabled="btnLoading" :loading="btnLoading">关闭订单</el-button>
          </a-popconfirm>
          <el-button size="mini" type="primary" @click="openDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--------翻页区域--------->
    <div class="pageDiv">
      <el-pagination
        :page-size="pageSize"
        :pager-count="9"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <!----------------弹出层区域-------------------->
    <a-drawer
      placement="right"
      :closable="true"
      :maskClosable="false"
      title=''
      :z-index="2000"
      @close="drawerClose"
      :visible="drawerShow"
      :width="'78vw'"
      :destroyOnClose="true"
    >
<!--      <driver-detail :driver="initObject" :type="type" @refresh="refresh" :areaList="areaSelect"></driver-detail>-->
      <order-detail :order="initObject" @refresh="refresh" :areaArr="selectArr.areaArr" @close="drawerClose"></order-detail>
    </a-drawer>
  </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'
    import countTo from 'vue-count-to'
    import orderDetail from '@/pages/order/order_detail'
    // import searchMore from '@/pages/order/searchMore.vue'
    // import detail from '@/pages/order/order_detail.vue'
    // import priceSum from '@/pages/order/orderPriceSum.vue'
    // import numSum from '@/pages/order/countOrderNumber.vue'

    export default {
      name: 'orderList',
      components: {
        countTo,
        orderDetail,
      },
      data () {
        return {
          data: [],
          cur: 1,
          pageSize: 20,
          total: 0,
          drawerShow: false,
          loading: false,
          btnLoading: false,
          showSearchMore: false,
          initObject: {},
          selectArr: {
            statusArr: [{label: '已接单', value: 1},{label: '到达乘客地点', value: 2},{label: '乘客上车', value: 3},
              {label: '到达目的地', value: 4},{label: '乘客已支付', value: 5},{label: '乘客已评价', value: 6},
              {label: '乘客取消', value: 7},{label: '司机取消', value: 8},{label: '司机关闭', value: 9},{label: '客服关闭', value: 10},],
            typeArr: [{label: '有终点', value: 1}, {label: '线下订单', value: 2}, {label: '无终点', value: 3}],
            payArr: [{label: '支付宝', value: 1}, {label: '微信APP', value: 2}, {label: '微信小程序', value: 3}],
            areaArr: []
          },
          rule: {},
          search: {
            orderId: '',
            pmobile: '',
            dmobile: '', //	string	司机手机号
            orderStatus: undefined, //	number	订单状态: 1.已接单;2.到达乘客地点;3.乘客上车;4.到达目的地;5.乘客已支付;6.乘客已评价;7.乘客取消;8.司机取消;9.司机关闭;10.客服关闭
            orderType: undefined, //	number	订单类型 1.线上订单 2线下订单
            tradeNumber: '', //	string	第三方支付号
            areaName: '', //	number	所属区域，传地区id
            payType: undefined, //	number	支付方式：1.支付宝,2.微信APP,3.微信小程序
            createTimeStart: '', //	string	接单开始时间,传时间戳字符串
            createTimeEnd: '', //	string	接单结束时间,传时间戳字符串
            payTimeStart: '', //	string	订单支付开始时间,传时间戳字符串
            payTimeEnd: '', //	string	订单支付结束时间,传时间戳字符串
          },
          sum: {
            countOrderNumber:4009,
            sumOrderMoney:22469.40,
            sumReceiptsPrice:8858.36
          }
        }
      },
      created() {
        let param = {
          currentPage: this.cur,
          pageSize: this.pageSize
        }
        this.getOnePage(param)
      },
      mounted () {
        let vm = this
        let param = {
          currentPage: 1,
          pageSize: 500
        }
        axios_post.post(urls.getArea, param).then(res => {
          let code = res.data.code
          if (code === '10000') {
            let areaList = res.data.data.data
            for (let k in areaList) {
              vm.selectArr.areaArr.push({'label': areaList[k].areaName, 'value': areaList[k].areaId})
            }
          } else {
            vm.$message.error(res.data.msg)
          }
        }, err => {
          vm.$message.error('获取地区列表出错，请联系管理员')
        })
      },
      methods: {
        changeSearch (statu) { // 展开搜索
          this.showSearchMore = !this.showSearchMore
        },
        getOnePage (param) {
          let vm = this
          vm.loading = true
          let searchOptions = {}
          for (let k in this.search) {
            if (this.search[k] !== '' && this.search[k]) {
              searchOptions[k] = this.search[k]
            }
          }
          let params = {
            ...param,
            ...searchOptions
          }
          axios_post.post(urls.getOrder, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.data = res.data.data.data
              vm.cur = res.data.data.currentPage
              vm.total = res.data.data.totalNumber
              vm.getSum(params)
            } else {
              vm.$message.error(res.data.data)
            }
            vm.loading = false
          }).catch(err => {
            vm.$message.error('获取列表数据失败，请联系管理员')
            vm.loading = false
          })
        },
        getSum (opt) { // 获取统计
          axios_post.post(urls.statisticalTitleData,opt).then(res => {
            let vm = this
            let code = res.data.code
            if (code === '10000') {
              let data = res.data.data
              for (let k in data) {
                if (vm.sum.hasOwnProperty(k)) {
                  vm.sum[k] = data[k]
                }
              }
            } else {
              vm.$message.error('获取订单统计失败')
            }
          },err => {
            vm.$message.error('获取订单统计失败，请联系管理员')
          })
        },
        searchOrder () { // 搜索
          let param = {
            currentPage: 1,
            pageSize: this.pageSize,
          }
          this.getOnePage(param)
        },
        refresh () { // 重置
          let vm = this
          vm.drawerShow = false,
          vm.loading = false,
          vm.showSearchMore = false,
          vm.search = {
            orderId: '',
            pmobile: '',
            dmobile: '', //	string	司机手机号
            orderStatus: undefined, //	number	订单状态: 1.已接单;2.到达乘客地点;3.乘客上车;4.到达目的地;5.乘客已支付;6.乘客已评价;7.乘客取消;8.司机取消;9.司机关闭;10.客服关闭
            orderType: undefined, //	number	订单类型 1.线上订单 2线下订单
            tradeNumber: '', //	string	第三方支付号
            areaName: '', //	number	所属区域，传地区id
            payType: undefined, //	number	支付方式：1.支付宝,2.微信APP,3.微信小程序
            createTimeStart: '', //	string	接单开始时间,传时间戳字符串
            createTimeEnd: '', //	string	接单结束时间,传时间戳字符串
            payTimeStart: '', //	string	订单支付开始时间,传时间戳字符串
            payTimeEnd: '', //	string	订单支付结束时间,传时间戳字符串
          }
          vm.cur = 1
          let param = {
            currentPage: vm.cur,
            pageSize: vm.pageSize
          }
          vm.getOnePage(param)
        },
        handleCurrentChange (val) {
          this.cur = val
          let param = {
            currentPage: this.cur,
            pageSize: this.pageSize,
          }
          this.getOnePage(param)
        },
        exportOrder () { // 导出 exportOrder
          let vm = this
          let token = sessionStorage.getItem('token')
          let fm = new FormData()
          let searchOptions = {}
          for (let k in this.search) {
            if (this.search[k] !== '' && this.search[k]) {
              searchOptions[k] = this.search[k]
            }
          }
          let param = {
            currentPage: vm.cur,
            pageSize: vm.pageSize,
            ...searchOptions
          }
          for (let it in param) {
            fm.append(it,param[it])
          }
          this.$axios.post(urls.exportOrder,fm, {
            headers:{
//            'Accept': 'application/ms-excel',
              'Access-Control-Allow-Origin': '*',
              'Content-Type':'application/octet-stream;charset=UTF-8',
              token: token
            },
            responseType: 'blob'
          }).then(res => {
            let str = res.headers['content-disposition']
            let str1 = str.split('_')
            let str2 = str1[0].split('=')
            let fileName = decodeURIComponent(str2[1])
            let url = window.URL.createObjectURL(new Blob([res.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName+str1[1])
//
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            vm.$message.success('导出成功')
          }).catch(err=>{
            vm.$message.error('导出失败')
          })
        },
        reasonValidator (value) {
          let str = ''
          if (value.length > 20) {
            str = '关闭原因不能大于20个字符'
            return str
          } else if (value === '' || !value) {
            str = '关闭原因不能为空'
            return str
          }
        },
        offOrder (order) {
          let vm = this
          vm.btnLoading = true
          vm.$prompt('请输入关闭原因', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: vm.reasonValidator
          }).then(({value}) => {
            let param = {
              orderId: order.orderId,
              cancelReason: value
            }
            axios_post.post(urls.updateOrder, param).then(res => {
              let code = res.data.code
              if (code === '10000') {
                vm.$message.success('已关闭该订单')
                order.orderStatus = 10
              } else {
                vm.$message.error(res.data.msg)
              }
              vm.btnLoading = false
            })
          }).catch(() => {
            vm.$message({
              type: 'info',
              message: '取消关闭'
            })
            vm.btnLoading = false
          })
        },
        drawerClose () {
          this.drawerShow = false
        },
        openDetail (obj) {
          this.initObject = obj
          this.drawerShow = true
        }
      }
    }
</script>

<style scoped>
    /*------------------------搜索---------------------*/
  .cuntOrder{
    padding: 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cuntDiv{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    height: 48px;
    border: 1px solid #e4e4e4;
  }
  .cuntTit{
    color: #000000;
    font-size: 14px;
  }
  .cuntCount{
    color: #409EFF;
    font-size: 22px;
    margin-left: 2px;
  }
</style>
