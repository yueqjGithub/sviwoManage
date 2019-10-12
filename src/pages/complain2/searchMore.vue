<template>
  <div class="searchBox">
    <el-form ref="form" :model="searchOptions" label-width="120px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="投诉编号">
            <el-input v-model="searchOptions.complaintId" placeholder="投诉编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="投诉状态状态">
            <el-select v-model="searchOptions.complaintStatus" placeholder="请选择处理状态">
              <el-option label="未处理" :value="0"></el-option>
              <el-option label="已处理" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7">
          <el-form-item label="乘客手机号">
            <el-input v-model="searchOptions.pMobile" placeholder="乘客手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="司机手机号">
            <el-input v-model="searchOptions.dMobile" placeholder="司机手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7">
          <el-form-item label="乘客真实姓名">
            <el-input v-model="searchOptions.prealName" placeholder="乘客真实姓名"></el-input>
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
          <el-form-item label="处理开始时间">
            <el-date-picker
              v-model="searchOptions.handleTimeStart"
              type="datetime"
              placeholder="选择日期时间"
              @change="handlingTimeStart"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="处理结束时间">
            <el-date-picker
              v-model="searchOptions.handleTimeEnd"
              type="datetime"
              placeholder="选择日期时间"
              @change="handlingTimeEnd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="投诉开始时间">
            <el-date-picker
              v-model="searchOptions.feedbackTimeStart"
              type="datetime"
              placeholder="选择日期时间"
              @change="feedbackTimeStart"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="投诉结束时间">
            <el-date-picker
              v-model="searchOptions.feedbackTimeEnd"
              type="datetime"
              placeholder="选择日期时间"
              @change="feedbackTimeEnd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!--<el-col :span="7">-->
        <!--<el-form-item label="用户帐号">-->
        <!--<el-input v-model="searchOptions.userName" placeholder="用户帐号"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="7">
          <el-form-item label="	处理人真实姓名">
            <el-input v-model="searchOptions.sysRealName" placeholder="处理人真实姓名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btnGroup col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <input class="btn btn-default searchBtn" type="button" value="高级搜索" @click="search_More">
      <input class="btn btn-default searchBtn" type="button" value="重置" @click="clearOption">
      <input class="btn btn-default searchBtn" type="button" value="关闭" @click = 'offSelf'>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name:'searchMore',
    data:function () {
      return {
        searchOptions:{
          complaintId:'', //	        string	主键id
          createTime:'', //	        string	投诉时间
          complaintStatus:0, //	    number	投诉状态 0:未处理 1:已处理
          pmobile:'', //	            string	乘客手机号
          dmobile:'', //	            string	司机手机号
          prealName:'', //	          string	乘客真实姓名
          drealName:'', //	          string	司机真实姓名
          sysRealName:'', //	        string	处理人真实姓名
          handleTimeStart:'', //	    string	处理开始时间,传时间戳字符串
          handleTimeEnd:'', //	      string	处理结束时间,传时间戳字符串
          createTimeStart:'', //	    string	投诉开始时间,传时间戳字符串
          createTimeEnd:'', //	      string	投诉结束时间,传时间戳字符串
        }
      }
    },
    methods:{
      handlingTimeStart:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.handlingTimeStart = data
      },
      handlingTimeEnd:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.handlingTimeEnd = data
      },
      feedbackTimeStart:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.feedbackTimeStart = data
      },
      feedbackTimeEnd:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.feedbackTimeEnd = data
      },
      //清除搜索选项
      clearOption:function () {
//            feedbackId
        for (let k in this.searchOptions) {
            this.searchOptions[k] = ''
        }
      },
      // 关闭高级搜索面板
      offSelf: function () {
        this.$emit('off_sm')
      },
      //查询参数
      searchOption: function () {
        let vm = this
        let opts = {
          complaintId: vm.searchOptions.complaintId,
          createTime: vm.searchOptions.createTime,
          complaintStatus: vm.searchOptions.complaintStatus,
          pmobile: vm.searchOptions.pmobile,
          dmobile: vm.searchOptions.dmobile,
          prealName: vm.searchOptions.prealName,
          drealName: vm.searchOptions.drealName,
          sysRealName: vm.searchOptions.sysRealName,
          handleTimeStart: vm.searchOptions.handleTimeStart,
          handleTimeEnd: vm.searchOptions.handleTimeEnd,
          createTimeStart: vm.searchOptions.createTimeStart,
          createTimeEnd: vm.searchOptions.createTimeEnd,
        }
        return opts
      },
      //高级查询
      search_More: function () {
        let opt = this.searchOption()
        // 审核状态，证件类型转换为int
        if(opt.status!==''){
          opt.status = parseInt(opt.status)
        }

        let opt1 = {}
        for (let k in opt){
          if(opt[k] !== '') {
            opt1[k] = opt[k]
          }
        }
        console.log(opt1)
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
