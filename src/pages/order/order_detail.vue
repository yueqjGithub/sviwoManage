<template>
  <div class="drawerCustom">
    <h5 class="cutDiv" v-if="order.orderStatus < 5">操作</h5>
    <el-row  v-if="order.orderStatus < 5">
      <!--<a-popconfirm title="确定关闭该订单吗?" @confirm="offOrder" okText="确定" cancelText="取消">-->
        <!---->
      <!--</a-popconfirm>-->
      <el-button size="mini" type="primary" :disabled="btnLoading" :loading="btnLoading" @click="offOrder">关闭订单</el-button>
<!--      <el-button size="mini" type="primary" @click="offOrder">关闭订单</el-button>-->
    </el-row>
    <h5 class="cutDiv">订单详情</h5>
    <el-form :size="'mini'" :label-width="'120px'">
      <el-row>
        <el-col :span="7">
          <el-form-item
            label="订单id"
          >
            <span>{{order.orderId}}</span>
          </el-form-item>
          <el-form-item
            label="下单手机号"
          >
<!--            <span>{{order.dmobile}}</span>-->
            <a href="javascript:void(0);" @click="toPage('passenger', order.pmobile)">{{order.pmobile}}</a>
          </el-form-item>
          <el-form-item
            label="起点位置"
          >
            <span>{{order.startAddress}}</span>
          </el-form-item>
          <el-form-item
            label="应付金额"
          >
            <span>{{order.orderPrice}}</span>
          </el-form-item>
          <el-form-item
            label="司机收入"
          >
            <span>{{order.driverIncomePrice}}</span>
            <a href="javascript:void(0);" @click="openDetail(1)">明细</a>
          </el-form-item>
          <el-form-item
            label="评价星级"
          >
            <el-rate v-model="order.starLevel"  disabled show-score disabled-void-color="#e7e7e7"></el-rate>
          </el-form-item>
          <el-form-item
            label="接单时间"
          >
            <span>{{order.createTime}}</span>
          </el-form-item>
          <el-form-item
            label="结束订单时间"
          >
            {{order.arriveTime}}
          </el-form-item>
          <el-form-item
            label="评价时间"
          >
            {{order.commentDate}}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item
            label="订单类型"
          >
            <span v-for="k in selectArr.typeArr" v-if="k.value === order.orderType">{{k.label}}</span>
          </el-form-item>
          <el-form-item
            label="司机手机号"
          >
            <a href="javascript:void(0);" @click="toPage('driverInfo', order.dmobile)">{{order.dmobile}}</a>
          </el-form-item>
          <el-form-item
            label="终点位置"
          >
            <span>{{order.finalAddress}}</span>
          </el-form-item>
          <el-form-item
            label="实付金额"
          >
            <span>{{order.actualPrice}}</span>
            <a href="javascript:void(0);" @click="openDetail(0)">明细</a>
          </el-form-item>
          <el-form-item
            label="平台补贴"
          >
            <span>{{order.subsidy}}</span>
          </el-form-item>
          <el-form-item
            label="第三方支付单号"
          >
            <span>{{order.tradeNumber}}</span>
          </el-form-item>
          <el-form-item
            label="到达起点时间"
          >
            <span>{{order.arrivePsgTime}}</span>
          </el-form-item>
          <el-form-item
            label="支付时间"
          >
            <span>{{order.payTime}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item
            label="订单状态"
          >
            <span v-for="k in selectArr.statusArr" v-if="k.value === order.orderStatus">{{k.label}}</span>
          </el-form-item>
          <el-form-item
            label="所属区域"
          >
            <span>{{order.areaName}}</span>
          </el-form-item>
          <el-form-item
            label="结束位置"
          >
            <span>{{order.endAddress}}</span>
          </el-form-item>
          <el-form-item
            label="优惠抵扣"
          >
            <span>{{order.discount}}</span>
          </el-form-item>
          <el-form-item
            label="平台抽成"
          >
            <span>{{order.feePrice}}</span>
          </el-form-item>
          <el-form-item
            label="确认上车时间"
          >
            <span>{{order.boardingTime}}</span>
          </el-form-item>
          <el-form-item
            label="取消订单时间"
          >
            <span>{{order.cancleTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="取消原因"
        >
          <span>{{order.cancelReason}}</span>
        </el-form-item>
      </el-row>
    </el-form>
    <!----------------弹出层区域-------------------->
    <a-drawer
      placement="right"
      :closable="true"
      :maskClosable="false"
      title=''
      :z-index="2000"
      @close="drawerClose"
      :visible="drawerShow"
      :width="'30vw'"
      :destroyOnClose="true"
    >
      <!--      <driver-detail :driver="initObject" :type="type" @refresh="refresh" :areaList="areaSelect"></driver-detail>-->
      <price-detail :orderId="order.orderId" :type="detailType" @close="drawerClose"></price-detail>
    </a-drawer>
  </div>
</template>

<script>
import axios_post from '@/api/extendAxios.js'
import urls from '@/config/api'
import priceDetail from '@/pages/order/priceDetail'
export default {
  name:'audit_detail',
  props:['order', 'areaArr'],
  components: {
    priceDetail,
  },
  data () {
    return {
      drawerShow: false,
      btnLoading: false,
      selectArr: {
        statusArr: [{label: '已接单', value: 1},{label: '到达乘客地点', value: 2},{label: '乘客上车', value: 3},
          {label: '到达目的地', value: 4},{label: '乘客已支付', value: 5},{label: '乘客已评价', value: 6},
          {label: '乘客取消', value: 7},{label: '司机取消', value: 8},{label: '司机关闭', value: 9},{label: '客服关闭', value: 10},],
        typeArr: [{label: '有终点', value: 1}, {label: '线下订单', value: 2}, {label: '无终点', value: 3}],
        payArr: [{label: '支付宝', value: 1}, {label: '微信APP', value: 2}, {label: '微信小程序', value: 3}],
        areaArr: []
      },
      detailType: 0, // 金额明细0；司机明细1
    }
  },
  mounted() {
    this.selectArr.areaArr = this.areaArr
    let obj = {
      range: this.order
    }
  },
  methods: {
    reasonValidator (value) {
      let str = ''
      if (value.length > 20) {
        str = '关闭原因不能大于20个字符'
        return str
      }
    },
    offOrder () {
      let vm = this
      vm.btnLoading = true
      vm.$prompt('请输入关闭原因', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: vm.reasonValidator
      }).then(({value}) => {
        let param = {
          orderId: vm.order.orderId,
          cancelReason: value
        }
        axios_post.post(urls.updateOrder, param).then(res => {
          let code = res.data.code
          if (code === '10000') {
            vm.$message.success('已关闭该订单')
            vm.$emit('refresh')
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
    toPage (url, phone) {
      this.$emit('close')
      this.$router.push({name: url, params: {phone: phone}})
    },
    drawerClose () {
      this.drawerShow = false
    },
    openDetail (type) {
      this.drawerShow = true
      this.detailType = type
    }
  }
}
</script>

<style scoped>
  .cutDiv{
    width: 100%;
    padding: 3px 5px;
    background: #e4e4e4;
  }
</style>
