<template>
  <div>
    <el-form ref="form" :model="searchOptions" label-width="120px" labelPosition="left">
      <el-row>
        <el-col :span="7">
          <el-form-item label="司机姓名">
            <el-input v-model.trim="searchOptions.realName" placeholder="司机姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="司机手机号">
            <el-input v-model.trim="searchOptions.mobileNumber" placeholder="司机手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="提现编号">
            <el-input v-model.trim="searchOptions.withdrawId" placeholder="提现编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="处理状态">
            <el-select v-model="searchOptions.withdrawStatus" placeholder="请选择处理状态">
              <!--1.已提交 2.审核中 3.打款中 4.已打款 5.打款失败 6.审核失败-->
              <el-option label="已提交" value="1"></el-option>
              <el-option label="审核中" value="2"></el-option>
              <el-option label="打款中" value="3"></el-option>
              <el-option label="已打款" value="4"></el-option>
              <el-option label="打款失败" value="5"></el-option>
              <el-option label="审核失败" value="6"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7">
          <el-form-item label="申请开始时间">
            <el-date-picker
              v-model="searchOptions.createTimeStart"
              type="datetime"
              placeholder="选择日期时间"
              @change="createTimeStart"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="申请结束时间">
            <el-date-picker
              v-model="searchOptions.createTimeEnd"
              type="datetime"
              placeholder="选择日期时间"
              @change="createTimeEnd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="primary" icon="el-icon-search" @click="search_More">搜索</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="clearOption">重置</el-button>
    </el-form>
    <!--<div class="btnGroup col-lg-12 col-md-12 col-sm-12 col-xs-12">-->
      <!---->
      <!--&lt;!&ndash;<input class="btn btn-default searchBtn" type="button" value="高级搜索" @click="search_More">&ndash;&gt;-->
      <!--&lt;!&ndash;<input class="btn btn-default searchBtn" type="button" value="重置" @click="clearOption">&ndash;&gt;-->
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
          realName:'',
          mobileNumber:'',
          withdrawId: '',
          withdrawStatus: '',
          createTimeStart: '',
          createTimeEnd: '',
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
          this.searchOptions.withdrawId         = ''
          this.searchOptions.withdrawStatus     = ''
          this.searchOptions.createTimeStart    = ''
          this.searchOptions.createTimeEnd      = ''
          this.searchOptions.realName           = ''
          this.searchOptions.mobileNumber       = ''
          this.$emit('off_search')
      },
      // 关闭高级搜索面板
      offSelf: function () {
        this.$emit('off_sm')
      },
      //查询参数
      searchOption: function () {
        let vm = this
        let opts = {
          withdrawId: vm.searchOptions.withdrawId,
          withdrawStatus: vm.searchOptions.withdrawStatus,
          createTimeStart:  vm.searchOptions.createTimeStart,
          createTimeEnd:  vm.searchOptions.createTimeEnd,
          realName:  vm.searchOptions.realName,
          mobileNumber:  vm.searchOptions.mobileNumber,
        }
        return opts
      },
      //高级查询
      search_More: function () {
        let opt = this.searchOption()
        // 审核状态，证件类型转换为int
        if(opt.withdrawStatus!==''){
          opt.withdrawStatus = parseInt(opt.withdrawStatus)
        }


        let opt1 = {}
        for (let k in opt){
          if(opt[k] !== '') {
            opt1[k] = opt[k]
          }
        }
//        console.log(opt1)
        let data = {
          opt:opt1,
          cur:1
        }
        this.$emit('submitOption',data)
      }
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
