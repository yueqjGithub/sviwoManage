<template>
  <div class="search-cont">
    <div class="s-left">
      <el-form labelPosition="right" :inline="true" :model="form" labelWidth="70px" class="s-left-form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="开始日期">
                <el-date-picker
                  v-model="form.createTimeStart"
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

              <el-form-item label="名称">
                <el-select placeholder="请选择" v-model="form.subsidyName" size="mini">
                  <!--<el-option label="绵阳市" value="mianyang"></el-option>-->
                  <el-option v-for="k in nameList" :label="k.name" :value="k.value" :key="k.index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="结束日期">
                <el-date-picker
                  v-model="form.createTimeEnd"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item label="对象">
                <el-select placeholder="请选择" v-model="form.subsidyObject" size="mini" @change="setOther">
                  <el-option v-for="k in objectList" :label="k.name" :value="k.value" :key="k.index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
    </div>
    <!--<div class="s-center">-->
    <div class="s-center">
      <div class="show-mode">
        <span class="show-name">补贴总额</span>
        <countTo :startVal='0' :endVal='total.sumSubsidyAmount' :duration='1000' class="show-num"
                 :decimals="2"
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
          sumSubsidyAmount: 0
        },
        form:{
          createTimeStart:'',
          createTimeEnd:'',
          area:'mianyang',
          subsidyName:'',//名称
          subsidyObject:''//对象
        },
        nameList:[
          {name:'优惠券补贴',value:3011},
          {name:'拉新10人',value:3012},
          {name:'订单满15元',value:3013},
          {name:'订单补贴2元',value:3014},
        ],
        objectList:[
          {name:'乘客',value:3011},
          {name:'司机',value:3012}
        ]
      }
    },
    created(){
      let vm = this
      axios_post.post(urls.getTotalSubsidy).then(res=>{
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
        }
      },err=>{
        vm.$message.error('获取补贴总额失败，请联系管理员')
      })
    },
    methods:{
      //
      setOther(){
        let vm = this
        if (vm.form.subsidyObject === 3011) {
            vm.form.subsidyName = 3011
            vm.nameList = [
              {name:'优惠券补贴',value:3011}
            ]
        } else if (vm.form.subsidyObject !== 3011) {
            vm.form.subsidyName = ''
            vm.nameList = [
              {name:'拉新10人',value:3012},
              {name:'订单满15元',value:3013},
              {name:'订单补贴2元',value:3014},
            ]
        }
      },
//      setOther1(){
//        let vm = this
//        if (vm.form.subsidyName === 3011) {
//          vm.form.subsidyName = 3011
//        } else if () {
//
//        }
//      },
      refresh:function () {
        this.form.createTimeStart=''
        this.form.createTimeEnd=''
        this.form.area='mianyang'
        this.form.subsidyName = ''
        this.form.subsidyObject = ''
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
          subsidyName:vm.form.subsidyName,//名称
          subsidyObject:vm.form.subsidyObject//对象
        }
        if (params.subsidyObject === 3011) {
          params.subsidyName = 3011
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
          subsidyName:vm.form.subsidyName,//名称
          subsidyObject:vm.form.subsidyObject//对象
        }

        if (params.subsidyObject === 3011) {
          params.subsidyName = 3011
        }

        let opt1 = {}
        for (let k in params) {
          if (params[k] !== '' && params[k] !== 0) {
            opt1[k] = params[k]
          }
        }

        axios_post.post(urls.getTotalSubsidy,opt1).then(res=>{
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
          vm.$message.error('获取补贴统计数据失败，请联系管理员')
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
    flex: 3;
  }
  .s-center{
    flex:1;
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
    width:100%;
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
