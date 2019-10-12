<template>
  <div>
    <el-form ref="form" :model="searchOptions" label-width="120px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="交易状态">
            <el-select v-model="searchOptions.flowStatus" placeholder="请选择交易状态">
              <el-option label="直接生效" value="-1"></el-option>
              <el-option label="审核中" value="3"></el-option>
              <el-option label="转出中" value="4"></el-option>
              <el-option label="转出失败" value="5"></el-option>
              <el-option label="转出成功" value="6"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="业务类型">
            <el-select v-model="searchOptions.businessTypeId" placeholder="请选择业务类型">
              <el-option label="乘客付款" value="1000"></el-option>
              <el-option label="司机提现流水" value="2000"></el-option>
              <el-option label="订单奖励" value="2001"></el-option>
              <el-option label="司机收到乘客付款" value="2002"></el-option>
              <el-option label="账户余额减少" value="2003"></el-option>
              <el-option label="账户余额减少到可提现余额" value="2004"></el-option>
              <el-option label="冻结可用余额" value="2005"></el-option>
              <el-option label="可用余额转入冻结余额" value="2006"></el-option>
              <el-option label="解冻锁定余额" value="2007"></el-option>
              <el-option label="冻结余额转入可用余额" value="2008"></el-option>
              <el-option label="冻结余额转入司机账户" value="2009"></el-option>
              <el-option label="转出失败" value="2010"></el-option>
              <el-option label="转出成功" value="2011"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="司机手机号">
            <el-input v-model="searchOptions.mobileNumber" placeholder="司机手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="司机真实姓名">
            <el-input v-model="searchOptions.drealName" placeholder="司机真实姓名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7">
          <el-form-item label="创建开始时间">
            <el-date-picker
              v-model="searchOptions.createTimeStart"
              type="datetime"
              placeholder="创建开始时间"
              @change="createTimeStart"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="创建结束时间">
            <el-date-picker
              v-model="searchOptions.createTimeEnd"
              type="datetime"
              placeholder="创建结束时间"
              @change="createTimeEnd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="primary" icon="el-icon-search" @click="search_More">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="clearOption">重置</el-button>
        <el-button type="primary" icon="el-icon-download" @click="output">导出</el-button>
      </el-row>
    </el-form>
    <!--<div class="btnGroup col-lg-12 col-md-12 col-sm-12 col-xs-12">-->
      <!--<input class="btn btn-default searchBtn" type="button" value="搜索" @click="search_More">-->
      <!--<input class="btn btn-default searchBtn" type="button" value="重置" @click="clearOption">-->
      <!--<input class="btn btn-default searchBtn" type="button" value="关闭" @click = 'offSelf'>-->
    <!--</div>-->
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name:'searchMore',
    data:function () {
      return {
        searchOptions:{
          mobileNumber:'',
          drealName:'',
          driverId:'',
          flowStatus:'',
          businessTypeId:'',
          createTimeStart:'',
          createTimeEnd:'',
        }
      }
    },
    methods:{
      createTimeStart:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.createTimeStart = data
      },
      createTimeEnd:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.createTimeEnd = data
      },

      //清除搜索选项
      clearOption:function () {
          this.searchOptions.mobileNumber=''
          this.searchOptions.drealName=''
          this.searchOptions.driverId=''
          this.searchOptions.flowStatus=''
          this.searchOptions.businessTypeId=''
          this.searchOptions.createTimeStart=''
          this.searchOptions.createTimeEnd=''
          this.$emit('off_sm')
      },

      //查询参数
      searchOption: function () {
        let vm = this
        let opts = {
          mobileNumber:   vm.searchOptions.mobileNumber,
          drealName:      vm.searchOptions.drealName,
          driverId:       vm.searchOptions.driverId,
          flowStatus:     vm.searchOptions.flowStatus,
          businessTypeId: vm.searchOptions.businessTypeId,
          createTimeStart:vm.searchOptions.createTimeStart,
          createTimeEnd:  vm.searchOptions.createTimeEnd,
        }
        return opts
      },
      //高级查询
      search_More: function () {
        let opt = this.searchOption()
        // 审核状态，证件类型转换为int
        if(opt.businessTypeId!==''){
          opt.businessTypeId = parseInt(opt.businessTypeId)
        }
        if(opt.flowStatus!==''){
          opt.flowStatus = parseInt(opt.flowStatus)
        }

        let opt1 = {}
        for (let k in opt){
          if(opt[k] !== '') {
            opt1[k] = opt[k]
          }
        }
        let data = {
          opt:opt1,
          cur:1
        }
        this.$emit('submitOption',data)
      },
      //导出
      output(){
        let opt = this.searchOption()
        // 审核状态，证件类型转换为int
        if(opt.businessTypeId!==''){
          opt.businessTypeId = parseInt(opt.businessTypeId)
        }
        if(opt.flowStatus!==''){
          opt.flowStatus = parseInt(opt.flowStatus)
        }

        let opt1 = {}
        for (let k in opt){
          if(opt[k] !== '') {
            opt1[k] = opt[k]
          }
        }
        let data = {
          ...opt1
        }
        this.$emit('download',data)
      },
    }
  }
</script>

<style scoped>
  .searchBox{
    padding-top: 12px;
    padding-bottom: 12px;
    border-top:1px dotted #5e5e5e;
    border-bottom:1px dotted #5e5e5e;
    margin:7px auto;
  }
  .btnGroup{
    float: none;
  }
</style>
