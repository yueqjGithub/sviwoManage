<template>
  <div class="search-cont">
    <div class="s-left">
      <el-form :inline="true" labelPosition="right" :model="form" labelWidth="70px" :rules="rules2">
        <el-form-item label="手机号" prop="mobileNumber">
          <el-input placeholder="请输入手机号" v-model.trim="form.mobileNumber" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input placeholder="请输入车牌号" v-model.trim="form.licensePlates" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input placeholder="真实姓名" v-model.trim="form.realName" size="mini"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!--<div class="s-center">-->
    <div class="s-center">
      <div class="show-mode">
        <span class="show-name">订单总额</span>
        <countTo :startVal='0' :endVal='total.totalPrice' :duration='1000' class="show-num"
                 :decimals="2"
        ></countTo>
      </div>
      <div class="show-mode">
        <span class="show-name">拉新乘客数</span>
        <countTo :startVal='0' :endVal='total.newPassenger' :duration='1000' class="show-num"
                 :decimals="0"
        ></countTo>
      </div>
      <div class="show-mode">
        <span class="show-name">接单数</span>
        <countTo :startVal='0' :endVal='total.orderNumber' :duration='1000' class="show-num"
                 :decimals="0"
        ></countTo>
      </div>
      <div class="show-mode">
        <span class="show-name">司机取消订单数</span>
        <countTo :startVal='0' :endVal='total.driverCancel' :duration='1000' class="show-num"
                 :decimals="0"
        ></countTo>
      </div>
      <div class="show-mode">
        <span class="show-name">司机关闭订单数</span>
        <countTo :startVal='0' :endVal='total.driverClose' :duration='1000' class="show-num"
                 :decimals="0"
        ></countTo>
      </div>
    </div>
    <div class="s-right">
      <div>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查看</el-button>
      </div>
      <div class="btn-group">
        <el-button type="primary" size="mini" icon="el-icon-download" @click="download">导出</el-button>
      </div>
      <div>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import countTo from 'vue-count-to'
  import axios_post from '@/api/extendAxios.js'
  import urls from '@/config/api'

  export default {
    name: 'searchMode',
    components: {
      countTo: countTo
    },
    data(){
      var checkPhone = (rule,value,callback) => {
        if (value === '') {
          callback()
        } else {
          if((/^1[34578]\d{9}$/.test(this.form.mobileNumber))){
            callback()
          } else {
            callback(new Error('请输入正确的手机号'))
          }
        }
      }

      return {
        total:{
          totalPrice:0,
          newPassenger:0,
          orderNumber:0,
          driverCancel:0,
          driverClose:0
        },
        form:{
          mobileNumber:'',
          licensePlates:'',
          realName:'',
        },
        rules2:{
            mobileNumber:[
              {validator:checkPhone,trigger:'blur',required:false}
            ]
        }
      }
    },
    created(){
      let vm = this
      axios_post.post(urls.driverOperateTotal).then(res=>{
        let response = res.data
        if (response.code === '10000') {
          for (let k in response.data) {
            if (vm.total.hasOwnProperty(k) && response.data[k] > 0) {
              vm.total[k] = parseFloat(response.data[k])
            }
          }
        }else{
          for (let k in vm.total) {
              vm.total[k] = 0
          }
          vm.$message.error('未查询到相关统计数据')
        }
      },err=>{
        vm.$message.error('获取统计数据失败，请联系管理员')
      })
    },
    methods:{
      refresh:function () {
        for (let k in this.form) {
            this.form[k] = ''
        }
      },
      download(){
        let vm = this

        if(!(/^1[34578]\d{9}$/.test(vm.form.mobileNumber)) && vm.form.mobileNumber !== ''){//手机号验证
          vm.$message.error('请输入正确的手机号')
          return false
        }

        let params = {
          mobileNumber:vm.form.mobileNumber,
          licensePlates:vm.form.licensePlates,
          realName:vm.form.realName,
        }
        let opt = {}
        for (let k in params) {
          if (params[k] !== '') {
            opt[k] = params[k]
          }
        }

        this.$emit('download',opt)
      },
      search: function () {
        let vm = this

        let params = {
          mobileNumber:vm.form.mobileNumber,
          licensePlates:vm.form.licensePlates,
          realName:vm.form.realName,
        }

        if(!(/^1[34578]\d{9}$/.test(vm.form.mobileNumber)) && vm.form.mobileNumber !== ''){//手机号验证
          vm.$message.error('请输入正确的手机号')
          return false
        }

        let opt1 = {}
        for (let k in params) {
          if (params[k] !== '') {
            opt1[k] = params[k]
          }
        }

        axios_post.post(urls.driverOperateTotal,opt1).then(res=>{
          let response = res.data
          if (response.code === '10000') {
            for (let k in response.data) {
              if (vm.total.hasOwnProperty(k)) {
                vm.total[k] = parseFloat(response.data[k])
              }
            }
          }else{
            for (let k in vm.total) {
              vm.total[k] = 0
            }
            vm.$message.error('未查询到相关统计数据')
          }
        },err=>{
          vm.$message.error('获取统计数据失败，请联系管理员')
        })

        let opt = {
          cur: 1,
          opt: opt1
        }

        this.$emit('handleSearch',opt)
      }
    }
  }
</script>

<style scoped>
  .search-cont{
    display: flex;
    align-items: flex-start;
    padding-top: 4px;
    padding-bottom: 4px;
  }
  .s-left{
    flex: 4;
  }
  .s-center{
    flex:3;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .s-right{
    flex:1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }
  .s-left .el-form-item{
    margin-bottom:8px;
  }
  .s-center .show-mode{
    width:40%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 17px;
  }
  .show-num{
    font-size: 19px;
    color: #409EFF;
  }
  .show-name{
    font-size: 14px;
  }
  .btn-group{
    margin-top:4px;
    margin-bottom: 4px;
  }
</style>
