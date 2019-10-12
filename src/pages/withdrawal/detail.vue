<template>
  <div class="drawerCustom">
    <el-breadcrumb separator="/" class="breadMode">
      <!--                      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>-->
      <el-breadcrumb-item>司机中心</el-breadcrumb-item>
      <el-breadcrumb-item>司机提现</el-breadcrumb-item>
      <el-breadcrumb-item>{{info.withdrawId}}</el-breadcrumb-item>
    </el-breadcrumb>
    <h5 class="cutDiv">操作</h5>
    <el-row>
      <el-button size="mini" type="primary" @click="confirmWithdraw" v-if="info.withdrawStatus === 1">打款</el-button>
      <el-button size="mini" type="primary" v-if="info.withdrawStatus === 1" @click="refuseHandle">拒绝打款</el-button>
      <el-button size="mini" type="primary" @click="seeCapital">查看司机流水</el-button>
    </el-row>
    <el-form :size="'mini'" :label-width="'120px'" :model="info" :hide-required-asterisk="true"  ref="ruleForm">
      <h5 class="cutDiv">提现信息</h5>
      <el-form-item
        label="提现金额"
      >
        <span>{{info.amount}}</span>
      </el-form-item>
      <el-form-item
        label="收款类型"
      >
        <span v-for="k in selectArr.payArr" v-if="info.paymentCodeType === k.value">{{k.label}}</span>
      </el-form-item>
      <el-form-item
        label="汇款码"
      >
        <el-image
          :src="uploadSrc + info.paymentCode"
          @click="preView(info.paymentCode)"
          class="dImg"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" v-if="info.paymentCode"></i>
            <span v-if="!info.paymentCode">暂未上传收款码</span>
          </div>
        </el-image>
      </el-form-item>
      <el-form-item
        label="处理状态"
      >
        <span v-for="k in selectArr.statusArr" v-if="info.withdrawStatus === k.value">{{k.label}}</span>
      </el-form-item>
      <el-form-item
        label="司机姓名"
      >
        <span>{{info.driverName}}</span>
        <a href="javascript: void(0);" @click="toPage('driverInfo', info.mobileNumber)">查看司机信息</a>
      </el-form-item>
      <el-form-item
        label="司机手机号"
      >
        <span>{{info.mobileNumber}}</span>
      </el-form-item>
      <el-form-item
        label="操作人"
      >
        <span>{{info.updateUser ? info.updateUser : '暂无'}}</span>
      </el-form-item>
      <el-form-item
        label="申请时间"
      >
        <span>{{info.createTime}}</span>
      </el-form-item>
      <el-form-item
        label="操作时间"
      >
        <span>{{info.updateTime ? info.updateTime : '暂无'}}</span>
      </el-form-item>
      <el-form-item
        label="拒绝原因"
        v-if="info.withdrawStatus === 3"
      >
        <p>{{info.withdrawInfo}}</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api.js'

    export default {
      name:'detail',
      props: ['info'],
      data () {
        return {
          uploadSrc: urls.imgOrigin,
          selectArr: {
            statusArr: [{label: '已申请', value: 1}, {label: '已打款', value: 2}, {label: '已返款', value: 3}],
            payArr: [{label: '微信', value: 0}, {label: '支付宝', value: 1}]
          }
        }
      },
      methods: {
        seeCapital () {
          this.$emit('close')
          this.$emit('capital', this.info.mobileNumber)
        },
        toPage (url, phone) {
          this.$emit('close')
          this.$router.push({name: url, params: {phone: phone}})
        },
        confirmWithdraw () {
          let vm = this
          this.$confirm('确认已打款，且打款信息无误？', '确认打款', {
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }).then(() => {
            let param = {
              withdrawId: vm.info.withdrawId
            }
            axios_post.post(urls.withdrawAuditAdopt, param).then(res => {
              let code = res.data.code
              if (code === '10000') {
                vm.$message.success('已成功提交')
                vm.$emit('refresh')
              } else {
                vm.$message.error(res.data.msg)
              }
            }).catch(err => {
              vm.$message.error('提交出错，请联系管理员')
            })
            // withdrawAuditAdopt
          }).catch(() => {

          })
        },
        reasonValidator (value) {
          let str = ''
          if (value && value.length > 20) {
            str = '拒绝原因不能大于20个字符'
            return str
          } else if (value === '' || !value) {
            str = '拒绝原因不能为空'
            return str
          }
        },
        refuseHandle () {
          let vm = this
          vm.$prompt('请输入拒绝原因', '不通过', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: vm.reasonValidator
          }).then(({ value }) => {
            // withdrawAuditNotPass
            let param = {
              withdrawId: vm.info.withdrawId,
              withdrawInfo: value
            }
            axios_post.post(urls.withdrawAuditNotPass, param).then(res => {
              let code = res.data.code
              if (code === '10000') {
                vm.$message.success('已拒绝通过')
                vm.$emit('refresh')
              } else {
                vm.$message.error(res.data.msg)
              }
            }).catch(() => {
              vm.$message.error('提交失败，请联系管理员')
            })
          }).catch(() => {

          })
        }
      },
    }
</script>

<style scoped>
.cutDiv{
  width: 100%;
  padding: 3px 5px;
  background: #e4e4e4;
}
.dImg{
  width: 221px;
  height: 221px;
}
.dImg .image-slot{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e4e4e4;
}
</style>
