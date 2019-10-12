<template>
  <div class="searchBox">
    <el-form ref="form" :model="searchOptions" label-width="120px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="报警编号">
            <el-input v-model="searchOptions.alarmId" placeholder="报警编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="处理状态">
            <el-select v-model="searchOptions.alarmStatus" placeholder="请选择处理状态">
              <el-option label="未处理" value="0"></el-option>
              <el-option label="已处理" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="乘客手机号">
            <el-input v-model="searchOptions.pmobile" placeholder="乘客手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="司机手机号">
            <el-input v-model="searchOptions.dmobile" placeholder="司机手机号"></el-input>
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
          <el-form-item label="报警处理人">
            <el-input v-model="searchOptions.mrealName" placeholder="处理人真实姓名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="报警开始时间">
            <el-date-picker
              v-model="searchOptions.alarmTimeStart"
              type="datetime"
              placeholder="选择日期时间"
              @change="alarmTimeStart"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="报警结束时间">
            <el-date-picker
              v-model="searchOptions.alarmTimeEnd"
              type="datetime"
              placeholder="选择日期时间"
              @change="alarmTimeEnd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="处理开始时间">
            <el-date-picker
              v-model="searchOptions.manageTimeStart"
              type="datetime"
              placeholder="选择日期时间"
              @change="manageTimeStart"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="处理结束时间">
            <el-date-picker
              v-model="searchOptions.manageTimeEnd"
              type="datetime"
              placeholder="选择日期时间"
              @change="manageTimeEnd"
            >
            </el-date-picker>
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
          alarmId:'',
          alarmStatus:'',
          pmobile:'',
          prealName:'',
          dmobile:'',
          drealName:'',
          mrealName:'',
          alarmTimeStart:'',
          alarmTimeEnd:'',
          manageTimeStart:'',
          manageTimeEnd:'',
        }
      }
    },
    methods:{
      alarmTimeStart:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.handlingTimeStart = data
      },
      alarmTimeEnd:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.handlingTimeEnd = data
      },
      manageTimeStart:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.feedbackTimeStart = data
      },
      manageTimeEnd	:function (time) {
        let vm = this
        let data = vm.eleTimeExchange(time)
        vm.searchOptions.feedbackTimeEnd = data
      },
      //清除搜索选项
      clearOption:function () {
          this.searchOptions.alarmId=''
          this.searchOptions.alarmStatus=''
          this.searchOptions.pmobile=''
          this.searchOptions.prealName=''
          this.searchOptions.dmobile=''
          this.searchOptions.drealName=''
          this.searchOptions.mrealName=''
          this.searchOptions.alarmTimeStart=''
          this.searchOptions.alarmTimeEnd=''
          this.searchOptions.manageTimeStart=''
          this.searchOptions.manageTimeEnd=''
      },
      // 关闭高级搜索面板
      offSelf: function () {
        this.$emit('off_sm')
      },
      //查询参数
      searchOption: function () {
        let vm = this
        let opts = {

          alarmId:            vm.searchOptions.alarmId,
          alarmStatus:        vm.searchOptions.alarmStatus,
          pmobile:            vm.searchOptions.pmobile,
          prealName:          vm.searchOptions.prealName,
          dmobile:            vm.searchOptions.dmobile,
          drealName:          vm.searchOptions.drealName,
          mrealName:          vm.searchOptions.mrealName,
          alarmTimeStart:     vm.searchOptions.alarmTimeStart,
          alarmTimeEnd:       vm.searchOptions.alarmTimeEnd,
          manageTimeStart:    vm.searchOptions.manageTimeStart,
          manageTimeEnd:      vm.searchOptions.manageTimeEnd,
        }
        return opts
      },
      //高级查询
      search_More: function () {
        let opt = this.searchOption()
        // 审核状态，证件类型转换为int
        if(opt.alarmStatus!==''){
          opt.alarmStatus = parseInt(opt.alarmStatus)
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
