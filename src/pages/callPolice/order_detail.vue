<template>
  <div class="pop_detail">
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="起始地址">
        <span>{{ order.startAddress }}</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="结束地址">
        <span>{{ order.endAddress }}</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="起始定位">
        <span>{{ order.startPos }}</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="结束定位">
        <span>{{ order.endPos }}</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="订单状态">
        <span v-if="order.orderStatus === 1">已接单</span>
        <span v-if="order.orderStatus === 2">到达乘客地点</span>
        <span v-if="order.orderStatus === 3">乘客上车</span>
        <span v-if="order.orderStatus === 4">到达目的地</span>
        <span v-if="order.orderStatus === 5">乘客已支付</span>
        <span v-if="order.orderStatus === 6">乘客已评价</span>
        <span v-if="order.orderStatus === 7">乘客取消</span>
        <span v-if="order.orderStatus === 8">司机取消</span>
        <span v-if="order.orderStatus === 9">司机关闭</span>
        <span v-if="order.orderStatus === 10">客服关闭</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="订单类型">
        <span v-if="order.orderType===1">线上订单</span>
        <span v-if="order.orderType===2">线下订单</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="订单总金额">
        <span>{{ order.orderPrice }}</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="订单支付时间">
        <span>{{ order.payTime }}</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="订单创建时间">
        <span>{{ order.createTime }}</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" inline class="feedCont" :model="info">
      <el-form-item label="订单取消时间">
        <span>{{ order.cancleTime }}</span>
      </el-form-item>
    </el-form>
    <el-form label-position="left" class="feedCont" :model="info">
      <el-form-item label="税费">
        <span>{{ order.taxPrice }}</span>
      </el-form-item>
      <el-form-item label="手续费">
        <span>{{ order.feePrice }}</span>
      </el-form-item>
      <el-form-item label="实际支付">
        <span>{{ order.actualPrice }}</span>
      </el-form-item>
      <el-form-item label="违约金">
        <span>{{ order.penalSum }}</span>
      </el-form-item>
      <el-form-item label="距离(米）">
        <span>{{ order.distance }}</span>
      </el-form-item>
      <el-form-item label="取消订单原因">
        <span>{{ order.cancelReason }}</span>
      </el-form-item>
      <el-form-item label="乘客真实姓名">
        <span>{{ order.pRealName }}</span>
      </el-form-item>
      <el-form-item label="	司机真实姓名">
        <span>{{ order.dRealName }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name:'audit_detail',
    props:['info'],
    data () {
      return {
        order: {}
      }
    },
    mounted () {
      if (this.info.data.length>0) {
        this.order = this.info.data[0]
      }
    }
  }
</script>

<style scoped>

</style>
