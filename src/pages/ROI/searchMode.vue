<template>
    <div class="search-cont">
      <div class="s-left">
        <el-form :inline="true" labelPosition="right" :model="form" labelWidth="70px">
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="form.createTimeStart"
              type="date"
              size="mini"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker
              v-model="form.createTimeEnd"
              type="date"
              size="mini"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="地区">
            <el-select placeholder="请选择" v-model="form.area" size="mini">
              <el-option label="绵阳市" value="mianyang"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!--<div class="s-center">-->
      <div class="s-center">
        <div class="show-mode">
          <span class="show-name">已付款收入</span>
          <countTo :startVal='0' :endVal='total.orderIncome' :duration='1000' class="show-num"
                   :decimals="2"
          ></countTo>
        </div>
        <div class="show-mode">
          <span class="show-name">未付款收入</span>
          <countTo :startVal='0' :endVal='total.noPayment' :duration='1000' class="show-num"
                   :decimals="2"
          ></countTo>
        </div>
        <div class="show-mode">
          <span class="show-name">乘客补贴</span>
          <countTo :startVal='0' :endVal='total.passengerSubsidy' :duration='1000' class="show-num"
                   :decimals="2"
          ></countTo>
        </div>
        <div class="show-mode">
          <span class="show-name">司机补贴</span>
          <countTo :startVal='0' :endVal='total.driverSubsidy' :duration='1000' class="show-num"
                   :decimals="2"
          ></countTo>
        </div>
        <div class="show-mode">
          <span class="show-name">ROI</span>
          <countTo :startVal='0' :endVal='total.roi' :duration='1000' class="show-num"
                   :decimals="3"
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
        return {
            total:{
              orderIncome:0,
              noPayment:0,
              passengerSubsidy:0,
              driverSubsidy:0,
              roi:0,
            },
            form:{
              createTimeStart:'',
              createTimeEnd:'',
              area:'mianyang'
            }
        }
    },
    created(){
      let vm = this
      axios_post.post(urls.getTotalRoi).then(res=>{
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
        vm.$message.error('获取ROI统计数据失败，请联系管理员')
      })
    },
    methods:{
      refresh:function () {
          this.form.createTimeStart=''
          this.form.createTimeEnd=''
          this.form.area='mianyang'
      },
      download(){
        let vm = this
        let date1 = ''
        let date2 = ''
        let date3 = Date.parse(new Date());

        if (vm.form.createTimeStart !== '') {
          date1 = vm.eleTimeExchange(vm.form.createTimeStart)
        }
        if (vm.form.createTimeEnd !== '') {
          date2 = vm.eleTimeExchange(vm.form.createTimeEnd)
        }

        if(date2 < date1 && date1 !== '' && date2 !== ''){
          vm.$message.error('结束日期不能小于开始日期')
          return false
        }

        if (date1 > date3 && date1 !== '') {
          vm.$message.error('开始时间不能大于当前时间')
          return false
        }

        if (date2 > date3 && date2 !== '') {
          vm.$message.error('结束时间不能大于当前时间')
          return false
        }


        let params = {
          createTimeStart: date1,
          createTimeEnd: date2,
        }
        let opt = {}
        for (let k in params) {
            if (params[k] !== '' && params[k] !== 0) {
                opt[k] = params[k]
            }
        }

        this.$emit('download',opt)
      },
      search: function () {
        let vm = this
        let date1 = ''
        let date2 = ''
        let date3 = Date.parse(new Date());

        if (vm.form.createTimeStart !== '') {
          date1 = vm.eleTimeExchange(vm.form.createTimeStart)
        }
        if (vm.form.createTimeEnd !== '') {
          date2 = vm.eleTimeExchange(vm.form.createTimeEnd)
        }

        if(date2 < date1 && date1 !== '' && date2 !== ''){
          vm.$message.error('结束日期不能小于开始日期')
          return false
        }

        if (date1 > date3 && date1 !== '') {
          vm.$message.error('开始时间不能大于当前时间')
          return false
        }

        if (date2 > date3 && date2 !== '') {
          vm.$message.error('结束时间不能大于当前时间')
          return false
        }

        let params = {
            createTimeStart: date1,
            createTimeEnd: date2,
        }

        let opt1 = {}
        for (let k in params) {
          if (params[k] !== '' && params[k] !== 0) {
            opt1[k] = params[k]
          }
        }

        axios_post.post(urls.getTotalRoi,opt1).then(res=>{
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
          vm.$message.error('获取ROI统计数据失败，请联系管理员')
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
  flex: 2;
}
.s-center{
  flex:2;
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
  margin-bottom:0;
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
