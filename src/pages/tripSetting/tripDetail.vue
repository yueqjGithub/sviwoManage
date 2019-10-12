<template>
  <div class="drawerCustom">
    <h5 class="cutDiv">操作</h5>
    <el-row>
      <div v-if="type === 1">
        <el-button size="mini" type="primary" @click="saveArea" :loading="btnLoading" :disabled="btnLoading">保存</el-button>
        <el-button type="primary" size="mini" @click="showRule">计价说明</el-button>
      </div>
      <div v-if="type === 2">
        <el-button size="mini" type="primary" v-if="!edit" @click="toEdit">编辑</el-button>
        <el-button size="mini" type="primary" v-if="!edit" @click="frezArea(area.areaStatus)">{{area.areaStatus === 1 ? '冻结' : '开放'}}</el-button>
        <el-button size="mini" type="primary" @click="saveArea" :loading="btnLoading" :disabled="btnLoading" v-if="edit">保存</el-button>
        <el-button size="mini" type="primary" v-if="edit" @click="cancelEdit">放弃</el-button>
        <el-button size="mini" type="primary" @click="showRule">计价说明</el-button>
      </div>
    </el-row>
    <el-form :size="'mini'" :rules="rule" :label-width="'120px'" :model="trip" :hide-required-asterisk="true"  ref="ruleForm">
      <h5 class="cutDiv">基础配置</h5>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="区域名称"
            prop="areaName"
          >
            <el-input :inline='true' v-model.trim="trip.areaName" v-if="edit"></el-input>
            <span v-else>{{trip.areaName}}</span>
          </el-form-item>
          <el-form-item
            label="区域范围"
            v-if="edit"
          >
            <el-button @click='openDraw'  size="mini" type="primary" icon="el-icon-map-location">{{type === 1 ? '绘制' : '重新绘制'}}</el-button>
          </el-form-item>
          <el-form-item
            label="服务电话"
            prop="serverPhone"
          >
            <el-input v-model.number.trim="trip.serverPhone" v-if="edit"></el-input>
            <span v-else>{{trip.serverPhone}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <h5 class="cutDiv">出行配置</h5>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="起步价"
            prop="baseFare"
          >
            <el-input-number v-if="edit" v-model.number="trip.baseFare" :min="0" :step="0.01" :style="{width: '100%'}"></el-input-number>
            <span v-else>{{trip.baseFare}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="tips">*行程开始，即收取的费用</p>
        </el-col>
      </el-row>
      <!-------------------->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="里程费"
            prop="milesFare"
          >
            <el-input-number v-if="edit" v-model.number="trip.milesFare" :min="0" :step="0.01" :style="{width: '100%'}"></el-input-number>
            <span v-else>{{trip.milesFare}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="tips">*每公里收取费用，不足0.1公里按0.1公里计算</p>
        </el-col>
      </el-row>
      <!-------------------->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="时长费"
            prop="timeFare"
          >
            <el-input-number v-if="edit" v-model.number="trip.timeFare" :min="0" :step="0.01" :style="{width: '100%'}"></el-input-number>
            <span v-else>{{trip.timeFare}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="tips">*每分钟收取费用，不足1分钟按1分钟计算</p>
        </el-col>
      </el-row>
      <!-------------------->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="远程费"
            prop="remoteFare"
          >
            <el-input-number v-if="edit" v-model.number="trip.remoteFare" :min="0" :step="0.01" :style="{width: '100%'}"></el-input-number>
            <span v-else>{{trip.remoteFare}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="tips">*超出远程里程每公里收取费用，不足0.1公里按0.1公里计算</p>
        </el-col>
      </el-row>
      <!-------------------->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="行使里程"
            prop="remoteRange"
          >
            <el-input-number v-if="edit" v-model.number="trip.remoteRange" :min="0" :step="0.1" :style="{width: '100%'}"></el-input-number>
            <span v-else>{{trip.remoteRange}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="tips">*起点到终点最远距离，大于远程里程</p>
        </el-col>
      </el-row>
      <!-------------------->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="远程里程"
            prop="drivingRange"
          >
            <el-input-number v-if="edit" v-model.number="trip.drivingRange" :min="0" :step="0.1" :style="{width: '100%'}"></el-input-number>
            <span v-else>{{trip.drivingRange}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="tips">*超出该范围，加收远程费，大于派单里程，小于行驶里程</p>
        </el-col>
      </el-row>
      <!-------------------->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="派单里程"
            prop="dispatchRange"
          >
            <el-input-number v-if="edit" v-model.number="trip.dispatchRange" :min="0" :step="0.1" :style="{width: '100%'}"></el-input-number>
            <span v-else>{{trip.dispatchRange}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p class="tips">*平台最远派单范围半径</p>
        </el-col>
      </el-row>
      <!-------------------->
    </el-form>
    <!-------------------地图弹层----------------------------->
    <a-drawer
      placement="right"
      :closable="true"
      :maskClosable="false"
      title=''
      :z-index="2001"
      @close="drawerClose"
      :visible="drawerShow"
      :width="'58vw'"
      :destroyOnClose="false"
    >
<!--      <driver-detail :driver="initObject" :type="type" @refresh="refresh"></driver-detail>-->
      <map-drawer @close="drawerClose" @sub="getMap" :type="workType" :areaPath="areaEnclosure"></map-drawer>
    </a-drawer>
    <!--------------计价规则显示----------------------->
    <div class="popModule" v-if="ruleShow">
      <div class="closePop" @click = 'offRule'></div>
      <div class="cutLine"></div>
      <div class="rule_cont">
        <p class="rule_tit">情况一</p>
        <P class="rule_detail">
          如果全部行驶里程-远程里程 <0
        </P>
        <p class="rule_detail">
          起步费+里程费*全部行驶里程+总时长*时长费
        </p>
        <p class="rule_tit">情况二</p>
        <P class="rule_detail">
          如果全部行驶里程-远程里程>=0
        </P>
        <p class="rule_detail">
          起步费+里程费*全部行驶里程+总时长*时长费+（全部行驶里程-远程里程）*远程费
        </p>
      </div>
    </div>
    <!--------------计价规则显示----------------------->
  </div>
</template>

<script>
import mapDrawer from '@/pages/tripSetting/mapComponent'
import axios_post from '@/api/extendAxios.js'
import urls from '@/config/api'
export default {
  name: "tripDetail",
  components: {
    mapDrawer
  },
  props: {
    type: {
      default: 1
    },
    area: {}
  },
  data () {
    let ruleArr = [
      { required: true, message: '请填写该项',trigger: 'blur'},
      { type: 'number', message: '必须为数字',trigger: 'blur'}
    ]
    let checkPhone = (rule, value, callback) => {
      if(!(/^1[3456789]\d{9}$/.test(this.trip.serverPhone)) && this.trip.serverPhone){
        callback(new Error('服务号码填写错误'))
      }
      callback()
    }
    return {
      edit: true,
      drawerShow: false,
      ruleShow: false,
      btnLoading: false,
      rule: {
        serverPhone: [{validator: checkPhone, trigger: 'blur'}, {required: true, trigger: 'blur', message: '服务电话不能为空'}],
        areaName: [{required: true,trigger: 'blur', message: '区域名称不能为空'}],
        baseFare: ruleArr,
        milesFare: ruleArr,
        remoteFare: ruleArr,
        timeFare: ruleArr,
        dispatchRange: ruleArr,
        drivingRange: ruleArr,
        remoteRange: ruleArr
      },
      areaEnclosure: [], // 存放覆盖物经纬度，由父组件传递
      workType: 1, // 打开地图时流程状态 1 -- 新增  2--- 修改
      trip: {
        areaName: '',
        // paramConfig: '',
        areaEnclosure: '', //	是	number	区域围栏经纬度
        serverPhone: '', //是	number	服务电话
        //	是	string	区域参数配置
        dispatchRange:0,
        drivingRange:0,
        remoteRange:0,
        baseFare:0,
        milesFare:0,
        timeFare:0,
        remoteFare:0
      }
    }
  },
  mounted () {
    let vm = this
    if (vm.type === 2) {
      // 传递覆盖物坐标
      vm.areaEnclosure = vm.area.areaEnclosure
      // 传递常规参数
      vm.trip.areaName = vm.area.areaName,
      vm.trip.serverPhone = vm.area.serverPhone, //是	number	服务电话
      vm.trip.dispatchRange = vm.area.dispatchRange,
      vm.trip.drivingRange = vm.area.drivingRange,
      vm.trip.remoteRange = vm.area.remoteRange,
      vm.trip.baseFare = vm.area.baseFare,
      vm.trip.milesFare = vm.area.milesFare,
      vm.trip.timeFare = vm.area.timeFare,
      vm.trip.remoteFare = vm.area.remoteFare
      // 初始化状态
      vm.edit = false
    }
  },
  methods: {
    openDraw () {
      this.drawerShow = true
      this.workType = this.type
    },
    drawerClose () {
      this.drawerShow = false
    },
    showRule () {
      this.ruleShow = true
    },
    offRule(){ //关闭弹出层
      this.ruleShow = false
    },
    getMap (path) {
      let vm = this
      vm.trip.areaEnclosure = path[0]
      // console.log(path[0][0].lat)
      // console.log(vm.trip.areaEnclosure)
    },
    toEdit () {
      this.edit = true
    },
    cancelEdit () {
      let vm = this
      // 传递覆盖物坐标
      vm.areaEnclosure = vm.area.areaEnclosure
      // 传递常规参数
      vm.trip.areaName = vm.area.areaName,
      vm.trip.serverPhone = vm.area.serverPhone, //是	number	服务电话
      vm.trip.dispatchRange = vm.area.dispatchRange,
      vm.trip.drivingRange = vm.area.drivingRange,
      vm.trip.remoteRange = vm.area.remoteRange,
      vm.trip.baseFare = vm.area.baseFare,
      vm.trip.milesFare = vm.area.milesFare,
      vm.trip.timeFare = vm.area.timeFare,
      vm.trip.remoteFare = vm.area.remoteFare
      // 初始化状态
      vm.edit = false
    },
    makeOptions () { // 拼接参数
      let vm = this
      let user = sessionStorage.getItem('admin/user')
      let uid = JSON.parse(user) // PARSE操作人
      // 拼装围栏
      let areaStr = ''
      // console.log(vm.trip.areaEnclosure[0])
      // debugger
      if (vm.type === 1) {
        for (let k in vm.trip.areaEnclosure) {
          areaStr += `${vm.trip.areaEnclosure[k].lng},${vm.trip.areaEnclosure[k].lat};`
        }
      }

      if (vm.type === 2) {
        if (vm.trip.areaEnclosure) {
          for (let k in vm.trip.areaEnclosure) {
            areaStr += `${vm.trip.areaEnclosure[k].lng},${vm.trip.areaEnclosure[k].lat};`
          }
        } else {
          for (let k in vm.areaEnclosure) {
            areaStr += `${vm.areaEnclosure[k][0]},${vm.areaEnclosure[k][1]};`
          }
        }
      }
      // 拼装参数
      let configObject = {
        dispatchRange: vm.trip.dispatchRange,
        drivingRange: vm.trip.drivingRange,
        remoteRange: vm.trip.remoteRange,
        baseFare: vm.trip.baseFare,
        milesFare: vm.trip.milesFare,
        timeFare: vm.trip.timeFare,
        remoteFare: vm.trip.remoteFare,
      }
      let configJson = JSON.stringify(configObject)
      let param = {
        // areaId	否	number	区域id，修改必传
        // createUser: uid.sysUserId,
        // updateUser	是	number	修改人（传登陆人id），修改必传
        areaName: vm.trip.areaName,
        paramConfig: configJson,
        areaEnclosure: areaStr,
        serverPhone: vm.trip.serverPhone
      }
      if (vm.type === 1) {
        param['createUser'] = uid.sysUserId
      } else {
        param['areaId'] = vm.area.areaId
        param['updateUser'] = uid.sysUserId
      }
      return param
    },
    // 提交
    saveArea () {
      let vm = this
      if (!vm.trip.areaEnclosure && vm.type === 1) {
        vm.$message.error('请绘制区域')
        return false
      }
      vm.btnLoading = true
      vm.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = vm.makeOptions()
          axios_post.post(urls.saveOrUpdateArea, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success('成功')
              vm.$emit('refresh')
            } else {
              vm.$message.error(res.data.msg)
            }
            vm.btnLoading = false
          })
        } else {
          vm.$message.error('请检查参数是否填写正确')
          vm.btnLoading = false
        }
      })
    },
    frezArea (status) { // 冻结解冻
      this.$emit('freeze', this.area)
    }
  }
}
</script>

<style scoped>
  .cutDiv{
    width: 100%;
    padding: 3px 5px;
    background: #e4e4e4;
  }
  .tips{
    font-size: 12px;
    color: red;
    width: 100%;
    white-space: nowrap;
  }
  .showRule{
    margin-bottom: 12px;
    align-self: flex-end;
  }
  .rule_cont{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
</style>
