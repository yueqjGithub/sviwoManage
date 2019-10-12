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
              <el-option label="平台扣减优惠券补贴金额" value="3011"></el-option>
              <el-option label="平台扣减优惠券补贴金额" value="3012"></el-option>
              <el-option label="平台扣减优惠券补贴金额" value="3013"></el-option>
            </el-select>
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
        <el-col :span="7">
          <el-form-item label="流水号">
            <el-input v-model.trim="searchOptions.accountFlowId" placeholder="流水号"></el-input>
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
    name:'platformSearch',
    data:function () {
      return {
        searchOptions:{
          accountFlowId: '',
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
        this.searchOptions.accountFlowId=''
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
          accountFlowId:       vm.searchOptions.accountFlowId,
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

</style>
