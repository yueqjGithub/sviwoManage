<template>
    <div>
      <el-form ref="form" :model="form" label-width="130px" :inline="true" labelPosition="left">
        <el-form-item label="提现编号">
          <el-input v-model.trim="form.withdrawId" placeholder="提现编号"></el-input>
        </el-form-item>
        <el-form-item label="提现状态">
          <el-select v-model="form.withdrawStatus" placeholder="请选择">
            <!--提现状态 1.已提交 2.审核中 3.打款中 4.已打款 5.打款失败 6.审核失败-->
            <el-option label="已提交" :value="1"></el-option>
            <el-option label="审核中" :value="2"></el-option>
            <el-option label="打款中" :value="3"></el-option>
            <el-option label="已打款" :value="4"></el-option>
            <el-option label="打款失败" :value="5"></el-option>
            <el-option label="审核失败" :value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="司机姓名">
          <el-input v-model.trim="form.realName" placeholder="请输入司机姓名"></el-input>
        </el-form-item>
        <el-form-item label="司机手机号">
          <el-input v-model.trim="form.mobileNumber" placeholder="请输入司机姓名"></el-input>
        </el-form-item>
        <el-form-item label="	申请提现开始时间">
          <el-date-picker
            v-model="form.createTimeStart"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="	申请提现结束时间">
          <el-date-picker
            v-model="form.createTimeEnd"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" icon="el-icon-download" @click.prevent="makeOptions">导出</el-button>
      </el-form>
    </div>
</template>

<script>
    export default {
        name: 'withdrawalOutput',
        data: function () {
          return {
              form:{
                withdrawId: '',
                withdrawStatus: '',
                realName: '',
                mobileNumber: '',
                createTimeStart: '',
                createTimeEnd: ''
              }
          }
        },
        methods:{
          makeOptions:function () {
            let vm = this
            let opt={}
            if (vm.form.createTimeStart !== '') {
              vm.form.createTimeStart = vm.eleTimeExchange(vm.form.createTimeStart)
            }
            if (vm.form.createTimeEnd !== '') {
              vm.form.createTimeEnd = vm.eleTimeExchange(vm.form.createTimeEnd)
            }
            for (let k in vm.form) {
                if (vm.form[k] !== '') {
                    opt[k] = vm.form[k]
                }
            }
            vm.$emit('download',opt)
          }
        }
    }
</script>

<style scoped>

</style>
