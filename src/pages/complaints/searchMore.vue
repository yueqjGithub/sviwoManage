<template>
  <div class="searchBox">
    <el-form ref="form" :model="searchOptions" label-width="120px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="反馈来源">
            <el-select v-model="searchOptions.feedbackFrom" placeholder="请选择反馈来源">
              <el-option label="司机端" value="1"></el-option>
              <el-option label="乘客端" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="3">
          <el-form-item label="处理状态">
            <el-select v-model="searchOptions.status" placeholder="请选择处理状态">
              <el-option label="未处理" value="0"></el-option>
              <el-option label="已处理" value="1"></el-option>
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
              v-model="searchOptions.handlingTimeStart"
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
              v-model="searchOptions.handlingTimeEnd"
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
          <el-form-item label="反馈开始时间">
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
          <el-form-item label="反馈结束时间">
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
              feedbackId:'',	      //string	主键
              feedbackFrom:'',	    //number	反馈来源，1-司机端，2-乘客端
              status:'',	          //number	状态；0-未处理，1-已处理
//          userName:'',	        //string	用户帐号(手机号)
              pMobile:'',
              dMobile:'',
              sysRealName:'',	      //string	处理人真实姓名
              prealName:'',	        //string	乘客真实姓名
              drealName:'',	        //string	司机真实姓名
              handlingTimeStart:'',	//string	处理开始时间,传时间戳字符串
              handlingTimeEnd:'',	  //string	处理结束时间,传时间戳字符串
              feedbackTimeStart:'',	//string	反馈开始时间,传时间戳字符串
              feedbackTimeEnd:'',	  //string	反馈结束时间,传时间戳字符串
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
            this.searchOptions.feedbackFrom=''
            this.searchOptions.status=''
//        this.searchOptions.userName=''
            this.searchOptions.pMobile=''
            this.searchOptions.dMobile=''
            this.searchOptions.sysRealName=''
            this.searchOptions.prealName=''
            this.searchOptions.drealName=''
            this.searchOptions.handlingTimeStart=''
            this.searchOptions.handlingTimeEnd=''
            this.searchOptions.feedbackTimeStart=''
            this.searchOptions.feedbackTimeEnd=''
          },
          // 关闭高级搜索面板
          offSelf: function () {
            this.$emit('off_sm')
          },
          //查询参数
          searchOption: function () {
            let vm = this
            let opts = {
              feedbackFrom:     vm.searchOptions.feedbackFrom,
              status:           vm.searchOptions.status,
//          userName:         vm.searchOptions.userName,
              pMobile:          vm.searchOptions.pMobile,
              dMobile:          vm.searchOptions.dMobile,
              sysRealName:      vm.searchOptions.sysRealName,
              prealName:        vm.searchOptions.prealName,
              drealName:        vm.searchOptions.drealName,
              handlingTimeStart:vm.searchOptions.handlingTimeStart,
              handlingTimeEnd:  vm.searchOptions.handlingTimeEnd,
              feedbackTimeStart:vm.searchOptions.feedbackTimeStart,
              feedbackTimeEnd:  vm.searchOptions.feedbackTimeEnd
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
            if(opt.feedbackFrom!==''){
              opt.feedbackFrom = parseInt(opt.feedbackFrom)
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
