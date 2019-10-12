<template>
    <div class="detail2">
        <h3>个人信息</h3>
        <div class="table-responsive info">
            <table class="table table-striped table-bordered table-hover table-full-width">
                <tbody>
                <!--<tr>-->
                    <!--<td>司机ID</td>-->
                    <!--<td>{{driver.driverId}}</td>-->
                <!--</tr>-->
                <!--<tr>-->
                    <!--<td>司机昵称</td>-->
                    <!--<td>{{driver.driverName}}</td>-->
                <!--</tr>-->
                <tr>
                    <td>证件类型</td>
                    <td>
                        <span>身份证</span>
                    </td>
                </tr>
                <tr>
                    <td>证件号</td>
                    <td>
                        {{driver.certificateNo}}
                    </td>
                </tr>
                <tr>
                    <td>认证状态</td>
                    <td>
                        <span v-if="driver.driverStatus === 0">未审核</span>
                        <span v-if="driver.driverStatus === 1">审核中</span>
                        <span v-if="driver.driverStatus === 2">审核不通过</span>
                        <span v-if="driver.driverStatus === 3">审核通过</span>
                    </td>
                </tr>
                <tr>
                    <td>头像</td>
                    <td>
                        <img :src="imgSrc+driver.headImage" alt="">
                    </td>
                </tr>
                <tr>
                    <td>真实姓名</td>
                    <td>{{driver.realName}}</td>
                </tr>
                <tr>
                  <td>性别</td>
                  <td>
                    <el-radio-group v-model="driverSex">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                  </td>
                </tr>
                <tr>
                    <td>证件照片</td>
                    <td>
                      <img :src="imgSrc+driver.licenseImage">
                    </td>
                </tr>
                <!--<tr>-->
                    <!--<td>注册IP地址</td>-->
                    <!--<td>{{driver.registerIp}}</td>-->
                <!--</tr>-->
                <tr>
                    <td>司机类型</td>
                    <td>
                        <span v-if="driver.driverType === 1">签约司机</span>
                        <span v-if="driver.driverType === 2">加盟司机</span>
                    </td>
                </tr>
                <tr>
                    <td>创建时间</td>
                    <td>{{driver.createTime}}</td>
                </tr>
                <tr>
                    <td>地区</td>
                    <td>{{driver.areaName}}</td>
                </tr>
                <tr>
                    <td>行驶证号</td>
                    <td>{{driver.licenseNumber}}</td>
                </tr>
                <tr>
                    <td>车牌号</td>
                    <td>{{driver.licensePlates}}</td>
                </tr>
                <tr>
                    <td>app用户名</td>
                    <td>{{driver.mobileNumber}}</td>
                </tr>
                <tr>
                    <td>来源</td>
                    <td>
                        <span v-if="driver.registerOrigin === 1">IOS</span>
                        <span v-if="driver.registerOrigin === 2">Android</span>
                        <span v-if="driver.registerOrigin === 3">后台录入</span>
                    </td>
                </tr>
                <!--<tr>-->
                    <!--<td>个人信息是否通过</td>-->
                    <!--<td>-->
                        <!--<label class="checkbox-inline">-->
                            <!--<input type="radio" value="1" v-model="driverAudit" name="driverInfo"> 通过-->
                        <!--</label>-->
                        <!--<label class="checkbox-inline">-->
                            <!--<input type="radio" value="0" v-model="driverAudit" name="driverInfo"> 不通过-->
                        <!--</label>-->
                    <!--</td>-->
                <!--</tr>-->
                </tbody>
            </table>
        </div>
        <!--<h3>个人信息!!!!!!!!!!!!</h3>-->
        <h3>车辆信息</h3>
        <div class="table-responsive info">
            <table class="table table-striped table-bordered table-hover table-full-width">
                <tbody>
                <tr>
                    <td>车架号</td>
                    <td>{{driver.vehicleNumber}}</td>
                </tr>
                <tr>
                    <td>行驶证号</td>
                    <td>{{driver.certificateNo}}</td>
                </tr>
                <tr>
                    <td>准载人数</td>
                    <td>
                        <span v-if="driver.seatingCapacity===1">2人</span>
                        <span v-if="driver.seatingCapacity===2">4人</span>
                        <span v-if="driver.seatingCapacity===3">6人</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <h3>是否通过</h3>
        <div class="table-responsive info">
          <table>
            <tbody>
            <tr>
              <td>
                <label class="checkbox-inline">
                  <input type="radio" :value="1" v-model="carAudit" name="carAudit"> 通过
                </label>
                <label class="checkbox-inline">
                  <input type="radio" :value="0" v-model="carAudit" name="carAudit"> 不通过
                </label>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!--<h3>车辆信息!!!!!!!!!!!!</h3>-->
        <label  v-if="carAudit===0" class="fail_reason">
            审核不通过原因
            <textarea class="form-control" rows="5" v-model="reason"></textarea>
        </label>
        <div class="btn-group sub_div">
            <button type="button" class="btn btn-primary" @click="confirmSub">提交审核结果</button>
        </div>
    </div>
</template>

<script>
import urls from '@/config/api.js'
import axios_post from '@/api/extendAxios.js'

export default {
  name: 'audit_detail',
  props: ['driver'],
  data: function () {
    return {
      driverSex: 1,
      imgSrc: urls.imgOrigin,
      // 个人信息审核状态
      driverAudit: null,
      // 车辆信息审核状态
      carAudit: null,
      // 审核不通过原因
      reason: '',
      carInfo: {},
      areaArr: []
    }
  },
  mounted: function () {
    let vm = this
    let param = {
      currentPage: 1,
      pageSize: 500
    }
    axios_post.post(urls.getArea, param).then(res => {
      let code = res.data.code
      if (code === '10000') {
        let areaList = res.data.data.data
        for (let k in areaList) {
          vm.areaArr.push({'label': areaList[k].areaName, 'value': areaList[k].areaId})
        }
      } else {
        vm.$message.error(res.data.msg)
      }
    }, err => {
      vm.$message.error('获取地区列表出错，请联系管理员')
    })
  },
  methods: {
    // 弹出提交层
    confirmSub: function () {
      let vm = this
      if (vm.carAudit === 0) { // 当某项不通过时
        vm.driver.driverStatus = 2
        if (vm.reason === '') {
          vm.$message.warning('不通过时必须填写原因')
          return false
        }
      }
      if (vm.carAudit === null) { // 为选择是否通过
        vm.$message.warning('请点选是否通过')
        return false
      }

      if (vm.carAudit === 1) { // 均通过
        vm.carInfo.carStatus = 1
      }
      let updateUser = sessionStorage.getItem('admin/user')
      updateUser = JSON.parse(updateUser)
      let conf = layer.confirm('是否确定提交', {icon: 3, title: '提示'}, function () {
        let params = {
          driverId: vm.driver.driverId,
          auditUser: updateUser.sysUserId,
          mobileNumber: vm.driver.mobileNumber,
          realName: vm.driver.realName,
          driverType: vm.driver.driverType,
          areaName: vm.areaArr.find(item => item.label === vm.driver.areaName).value,
          sex: vm.driver.sex,
          headImage: vm.driver.headImage,
          certificateNo: vm.driver.certificateNo,
          certificateJustImage: vm.driver.certificateJustImage,
          certificateBackImage: vm.driver.certificateBackImage,
          paymentCodeType: vm.driver.paymentCodeType,
          paymentCode: vm.driver.paymentCode,
          licensePlates: vm.driver.licensePlates,
          vehicleNumber: vm.driver.vehicleNumber,
          carType: vm.driver.carType,
          licenseNumber: vm.driver.licenseNumber,
          licenseImage: vm.driver.licenseImage,
          seatingCapacity: vm.driver.seatingCapacity
          // authRemark否string审核不通过原因，审核不通过必传
        }
        let paramAuditConfirm = {}
        let url = ''
        switch (vm.carAudit) {
          case 0:
            for (let k in params) {
              if (params[k] !== '' && params[k] !== undefined && params[k] !== null) {
                paramAuditConfirm[k] = params[k]
              }
            }
            url = urls.auditDriverFail
            paramAuditConfirm['authRemark'] = vm.reason
            break
          case 1:
            paramAuditConfirm = {
              ...params
            }
            url = urls.auditingDriver
            break
        }
        axios_post.post(url, paramAuditConfirm).then((res) => {
          let code = res.data.code
          if (code === '10000') {
            vm.$message.success(res.data.msg)
          } else {
            vm.$message.error(res.data.msg)
          }
        }).catch(() => {
          vm.$message.error('操作失败，请联系管理员')
        })
        layer.close(conf)
      }, function () {
        layer.close(conf)
      })
    }
  }
}
</script>

<style scoped>
.info img{
    min-width: 150px;
    min-height: 150px;
    max-width: 400px;
    max-height: 270px;
}
    .fail_reason{
        display: block;
        width: 70%;
        padding: 7px;
    }
    .sub_div{
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
