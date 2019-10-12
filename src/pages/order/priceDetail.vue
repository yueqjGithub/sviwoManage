<template>
  <div class="drawerCustom">
    <!------------------>
    <div class="cont mod">
      <div class="cont-left">
        <span>起步费</span>
        <div class="cont-description"></div>
      </div>
      <div class="cont-right">￥{{price.startingFare}}</div>
    </div>
    <!------------------>
    <div class="cont mod">
      <div class="cont-left">
        <span>里程费</span>
        <div class="cont-description">
          {{price.milesDistance}}公里
        </div>
      </div>
      <div class="cont-right">￥{{price.milesPrice}}</div>
    </div>
    <!------------------>
    <div class="cont mod">
      <div class="cont-left">
        <span>远途费</span>
        <div class="cont-description">
          {{price.milesDistance}}公里
        </div>
      </div>
      <div class="cont-right">￥{{price.fastDistancePrice}}</div>
    </div>
    <!------------------>
    <div class="cont mod">
      <div class="cont-left">
        <span>时长费</span>
        <div class="cont-description">
          {{price.timeMinute}}分钟
        </div>
      </div>
      <div class="cont-right">￥{{price.timePrice}}</div>
    </div>
    <!------------------>
    <div class="tit mod">
      <div class="line"></div>
      <span>合计</span>
      <div class="line"></div>
    </div>
    <!------------------>
    <div class="cont mod">
      <div class="cont-left">
      </div>
      <div class="cont-right">￥{{price.total}}</div>
    </div>
    <!------------------>
    <div class="cont mod" v-if="type === 0">
      <div class="cont-left">
        <span>优惠券抵扣</span>
        <div class="cont-description">
        </div>
      </div>
      <div class="cont-right">￥-{{price.discount}}</div>
    </div>
    <!------------------>
    <div class="tit mod" v-if="type === 0">
      <div class="line"></div>
      <span>实付</span>
      <div class="line"></div>
    </div>
    <!------------------>
    <div class="cont mod" v-if="type === 0">
      <div class="cont-left">
      </div>
      <div class="cont-right">￥{{price.actualPayment}}</div>
    </div>
  </div>
</template>

<script>
import axios_post from '@/api/extendAxios.js'
import urls from '@/config/api'
export default {
  name: 'priceDetail',
  props: ['orderId', 'type'],
  data () {
    return {
      order: '',
      price: {
        actualPayment: undefined,
        startingFare: undefined, //	number	起步价
        milesPrice: undefined, //	number	里程费
        milesDistance: undefined, //	number	历程距离（公里）
        fastDistancePrice: undefined, //	number	远途价
        timePrice: undefined, //	number	时长费
        timeMinute: undefined, //	number	时长（分钟）
        discount: undefined, //	number	优惠金额
        total: undefined, //	number	合计总额
      }
    }
  },
  created () {
    this.order = this.orderId
  },
  mounted () {
    let vm = this
    let param = {
      orderId: vm.order
    }
    let url = ''
    switch (vm.type) {
      case 0:
        url = urls.dctualAmountDetail
            break;
      case 1:
        url = urls.driverIncomeDetail
            break;
    }
    axios_post.post(url, param).then(res => {
      let code = res.data.code
      if (code === '10000') {
        // vm.price = res.data.data
        for (let k in res.data.data) {
          if (vm.price.hasOwnProperty(k)) {
            vm.price[k] = res.data.data[k]
          }
        }
      } else {
        vm.$message.error(res.data.msg)
        vm.$emit('close')
      }
    }).catch(err => {
      vm.$message.error('获取明细失败，请联系管理员')
      vm.$emit('close')
    })
  }
}
</script>

<style scoped>
.mod {
  width: 100%;
  height: 48px;
  display: flex;
  /*justify-content: space-around;*/
  /*align-items: center;*/
}
.cont{
  /*flex-direction: column;*/
  justify-content: space-between;
  align-items: flex-start;
  font-size: 16px;
  margin: 4px auto;
}
.cont-left{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.cont-description{
  font-size: 14px;
  color: darkgrey;
}
.tit{
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.line{
  width: 30%;
  height: 2px;
  border: 1px solid #000000;
}
</style>
