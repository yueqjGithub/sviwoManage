<template>
  <div class="drawerCustom">
    <h5 class="cutDiv">操作</h5>
    <el-row>
      <div v-if="type === 2 && !edit">
        <!------------点击详情------------->
        <el-button @click="toEdit" size="mini" type="primary">编辑</el-button>
        <el-button size="mini" type="primary" @click="showHis">查看编辑历史</el-button>
        <el-button  size="mini" @click="changeDriverStatus(driver.driverStatus)" type="primary">{{driver.driverStatus === 3 ? '冻结' : '解封'}}</el-button>
      </div>
      <div v-if="edit">
        <!-------------编辑状态下----------------------->
        <el-button @click="submitDriver" size="mini" type="primary">保存</el-button>
        <el-button @click="cancelConfirm" size="mini" v-if="type === 2" type="primary">放弃</el-button>
      </div>
    </el-row>
    <el-form :size="'mini'" :rules="rule" :label-width="'120px'" :model="driverInfo" :hide-required-asterisk="true"  ref="ruleForm">
      <h5 class="cutDiv">基础信息</h5>
<!--      <h5 class="cutDiv">操作</h5>----------------------------------->
      <el-row>
        <el-col :span="6" :offset="2">
          <el-form-item
            label="司机头像"
          >
            <a-avatar :src="uploadSrc + driver.headImage" v-if="!edit" :size="160" icon="user"/>
            <a-upload
              v-if="edit"
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :action="uploadUrl"
              :file-list="hImgList"
              :headers="{token: token}"
              :withCredentials="true"
              @change="handleChange"
            >
              <div v-if="hImgList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="4">
          <el-form-item
            label="电话号码"
            prop="mobileNumber"
          >
            <el-input :inline='true' v-model.trim="driverInfo.mobileNumber" v-if="edit"></el-input>
            <span v-else>{{driverInfo.mobileNumber}}</span>
          </el-form-item>
          <el-form-item
            label="司机类型"
            prop="driverType"
          >
            <el-select v-model="driverInfo.driverType" placeholder="请选择" v-if="edit">
              <el-option
                v-for="item in selectArr.driverType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-else>
              <span v-if="k.value === driverInfo.driverType" v-for="k in selectArr.driverType" :key="k.label">{{k.label}}</span>
            </div>
          </el-form-item>
          <el-form-item
            label="加入城市"
            prop="areaName"
          >
            <!--<p>{{driverInfo.areaName}}</p>-->
            <el-select v-model="driverInfo.areaName" placeholder="请选择" v-if="edit">
              <el-option
                v-for="item in areaList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-else>
              <span>{{trueArea}}</span>
            </div>
          </el-form-item>
          <!---------------------基础信息不可变更信息------------------------->
          <el-row v-if="type !== 1">
            <el-form-item label="司机状态">
              <span v-if="driver.driverStatus === 3">已认证</span>
              <span v-if="driver.driverStatus === 4">已封号</span>
            </el-form-item>
            <el-form-item label="注册时间">
              <span>{{driver.createTime}}</span>
            </el-form-item>
            <el-form-item label="审核通过时间">
              <span>{{driver.auditAdoptTime}}</span>
            </el-form-item>
            <el-form-item label="最近登录时间">
              <span>{{driver.loginTime}}</span>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
      <!------------------基础信息结束------------------------------------------------------>
      <h5 class="cutDiv">身份信息</h5>
      <el-row>
        <el-col :span="6" :offset="2">
          <el-form-item
            label="真实姓名"
            prop="realName"
          >
            <el-input v-model.trim="driverInfo.realName" v-if="edit"></el-input>
            <span v-else>{{driverInfo.realName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="4">
          <el-form-item
            label="性别"
            prop="sex"
          >
            <el-select v-model="driverInfo.sex" placeholder="请选择" v-if="edit">
              <el-option
                v-for="item in selectArr.sex"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-else>
              <span v-if="k.value === driverInfo.sex" v-for="k in selectArr.sex" :key="k.label">{{k.label}}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item
            label="身份证号"
            prop="certificateNo"
          >
            <el-input v-model.trim="driverInfo.certificateNo" v-if="edit"></el-input>
            <span v-else>{{driverInfo.certificateNo}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item
            label="身份证人像面"
          >
            <el-image
              :src="uploadSrc + driver.certificateJustImage"
              v-if="!edit"
              @click="preView(driver.certificateJustImage)"
              class="cImg"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <a-upload
              v-if="edit"
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :action="uploadUrl"
              :file-list="justImage"
              :headers="{token: token}"
              :withCredentials="true"
              @change="certificateChange1"
            >
              <div v-if="justImage.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item
            label="身份证国徽面"
          >
            <el-image
              :src="uploadSrc + driver.certificateBackImage"
              v-if="!edit"
              @click="preView(driver.certificateBackImage)"
              class="cImg"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <a-upload
              v-if="edit"
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :action="uploadUrl"
              :file-list="backImage"
              :headers="{token: token}"
              :withCredentials="true"
              @change="certificateChange2"
            >
              <div v-if="backImage.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!------------------------------------身份信息结束，车辆信息开始---------------------------------------------->
      <h5 class="cutDiv">车辆信息</h5>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item
            label="车牌号"
            prop="licensePlates"
          >
            <el-input v-model.trim="driverInfo.licensePlates" v-if="edit" :maxLength="15"></el-input>
            <span v-else>{{driverInfo.licensePlates}}</span>
          </el-form-item>
          <el-form-item
            label="车架号"
            prop="vehicleNumber"
          >
            <el-input v-model.trim="driverInfo.vehicleNumber" v-if="edit"  :maxLength="25"></el-input>
            <span v-else>{{driverInfo.vehicleNumber}}</span>
          </el-form-item>
          <el-form-item
            label="行驶证号"
            prop="licenseNumber"
          >
            <el-input v-model.trim="driverInfo.licenseNumber" v-if="edit"  :maxLength="17"></el-input>
            <span v-else>{{driverInfo.licenseNumber}}</span>
          </el-form-item>
          <el-form-item
            label="行驶证照片"
          >
            <el-image
              :src="uploadSrc + driver.licenseImage"
              v-if="!edit"
              @click="preView(driver.licenseImage)"
              class="cImg"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <a-upload
              v-if="edit"
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :action="uploadUrl"
              :file-list="licenseImageList"
              :headers="{token: token}"
              :withCredentials="true"
              @change="licenseImageChange"
            >
              <div v-if="licenseImageList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item
            label="车型"
            prop="carType"
          >
            <el-select v-model="driverInfo.carType" placeholder="请选择" v-if="edit">
              <el-option
                v-for="item in selectArr.carType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-else>
              <span v-if="k.value === driverInfo.carType" v-for="k in selectArr.carType" :key="k.label">{{k.label}}</span>
            </div>
          </el-form-item>
          <el-form-item
            label="车座数"
            prop="seatingCapacity"
          >
            <el-select v-model="driverInfo.seatingCapacity" placeholder="请选择" v-if="edit">
              <el-option
                v-for="item in selectArr.seatingCapacity"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-else>
              <span v-if="k.value === driverInfo.seatingCapacity" v-for="k in selectArr.seatingCapacity" :key="k.label">{{k.label}}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!------------------------------------车辆信息结束，支付信息开始---------------------------------------------->
      <h5 class="cutDiv">汇款信息</h5>
      <el-row>
        <el-col :span="6" :offset="2">
          <el-form-item
            label="汇款类型"
            prop="paymentCodeType"
          >
            <el-select v-model="driverInfo.paymentCodeType" placeholder="请选择" v-if="edit">
              <el-option
                v-for="item in selectArr.paymentCodeType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-else>
              <span v-if="k.value === driverInfo.paymentCodeType" v-for="k in selectArr.paymentCodeType" :key="k.label">{{k.label}}</span>
            </div>
          </el-form-item>
          <el-form-item
            label="收款码"
          >
            <el-image
              :src="uploadSrc + driver.paymentCode"
              v-if="!edit"
              @click="preView(driver.paymentCode)"
              class="cImg"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <a-upload
              v-if="edit"
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :action="uploadUrl"
              :file-list="payImg"
              :headers="{token: token}"
              :withCredentials="true"
              @change="paymentCodeChange"
            >
              <div v-if="payImg.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!----------------弹出层区域-------------------->
    <a-drawer
      placement="right"
      :closable="true"
      :maskClosable="false"
      title=''
      :z-index="2000"
      @close="drawerClose"
      :visible="drawerShow"
      :width="'42vw'"
      :destroyOnClose="true"
    >
      <!--<driver-detail :driver="initObject" :type="type" @refresh="refresh" :areaList="areaSelect"></driver-detail>-->
      <driver-history :his="driver.updateHistory"></driver-history>
    </a-drawer>
  </div>
</template>

<script>
import axios_post from '@/api/extendAxios.js'
import driverHistory from '@/pages/driver/history'
import urls from '@/config/api'
export default {
  name: 'driverDetail',
  props: ['driver', 'type', 'areaList'],
  components: {
    driverHistory
  },
  data () {
    let certificateReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    let checkPhone = (rule, value, callback) => {
      if (!(/^1[3456789]\d{9}$/.test(this.driverInfo.mobileNumber)) && this.driverInfo.mobileNumber) {
        callback(new Error('手机号码填写错误'))
      }
      callback()
    }
    let checkCertificate = (rule, value, callback) => {
      if (!certificateReg.test(this.driverInfo.certificateNo) && this.driverInfo.certificateNo) {
        callback(new Error('身份证号码格式错误'))
      }
      callback()
    }
    let checkLicensePlate = (rule, value, callback) => {
      if (this.driverInfo.licensePlates) {
        let str = this.driverInfo.licensePlates.toString()
        if (str.length < 7 || str.length > 10) {
          callback(new Error('车牌号必须大于6位小于11位'))
        }
      }
      callback()
    }
    const token = sessionStorage.getItem('token')
    return {
      token,
      edit: true,
      drawerShow: false,
      rule: {
        mobileNumber: [{validator: checkPhone, trigger: 'blur'}, {required: true, trigger: 'blur', message: '电话号码不能为空'}],
        certificateNo: [{validator: checkCertificate, trigger: 'blur'}, {required: true, trigger: 'blur', message: '证件号码不能为空'}],
        driverType: [{required: true, trigger: 'change', message: '必须选择司机类型'}],
        areaName: [{required: true, trigger: 'change', message: '必须选择地区'}],
        realName: [{required: true, trigger: 'blur', message: '姓名为必填'}],
        sex: [{required: true, trigger: 'change', message: '必须选择司机性别'}],
        carType: [{required: true, trigger: 'change', message: '必须选择车型'}],
        paymentCodeType: [{required: true, trigger: 'change', message: '必须选择收款类型'}],
        seatingCapacity: [{required: true, trigger: 'change', message: '必须选择核载人数'}],
        licensePlates: [{required: true, trigger: 'blur', message: '车牌号不能为空'}, {validator: checkLicensePlate, trigger: 'blur'}],
        vehicleNumber: [{required: true, trigger: 'blur', message: '车架号必填'}, {min: 17, trigger: 'blur', message: '不能小于17位'}],
        licenseNumber: [{required: true, trigger: 'blur', message: '行驶证号必填'}, {min: 12, trigger: 'blur', message: '不能小于12位'}]
      },
      selectArr: {
        driverType: [{label: '签约司机', value: 1}, {label: '加盟司机', value: 2}],
        // areaName: [],
        sex: [{label: '男', value: 1}, {label: '女', value: 0}],
        carType: [{label: 'leo power', value: 1},{label: 'air pro', value: 2}],
        seatingCapacity: [{label: '2人车', value: 1},{label: '4人车', value: 2},{label: '6人车', value: 3}],
        paymentCodeType: [{label: '微信', value: 0}, {label: '支付宝', value: 1}]
      },
      uploadSrc: urls.imgOrigin,
      uploadUrl: urls.uploadImage,
      hImgList: [], // 头像图片组
      justImage: [], // 身份证正面
      backImage: [], // 身份证背面
      licenseImageList: [], // 行驶证照片
      payImg: [], // 收款码
      trueArea: '',
      driverInfo: {
        mobileNumber: '',
        driverType: 2, // 司机类型 1签约司机 2加盟司机
        areaName: '',	//地区名，传地区id
        realName: '', //string	真是姓名
        sex: 1,	// 性别0:女.1:男
        headImage: '',	// 是	string	头像
        certificateNo: '', //	是	string	证件号
        certificateJustImage: '', //	是	string	身份证头像面
        certificateBackImage: '', //	是	string	身份证国徽面
        paymentCodeType: 0, //	是	number	收款码类型 0:微信 1:支付宝
        paymentCode: '', //	是	string	司机收款码
        licensePlates: '', //	是	string	车牌号
        vehicleNumber: '', //	是	string	车架号
        carType: 1, // 	是	string	车型
        licenseNumber: '', //	是	string	行驶证号
        licenseImage: '', //	是	string	行驶证照片，多个以 ;隔开
        seatingCapacity: '', //	是	number	荷载人数：1=2人车；2=4人车，3=6人车
      }
    }
  },
  mounted () {
    this.cancelEdit()
  },
  methods: {
    showHis () {
      this.drawerShow = true
    },
    drawerClose () {
      this.drawerShow = false
    },
    handleChange (file) { // 更改头像
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error('上传头像出错')
        return false
      }
      this.hImgList = file.fileList
    },
    certificateChange1 (file) { // 更改身份证正面
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error('上传身份证头像面出错')
        return false
      }
      this.justImage = file.fileList
    },
    certificateChange2 (file) { // 更改身份证正面
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error('上传身份证国徽面出错')
        return false
      }
      this.backImage = file.fileList
    },
    licenseImageChange (file) {
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error('上传驾驶证照片出错')
        return false
      }
      this.licenseImageList = file.fileList
    },
    paymentCodeChange (file) {
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error('上传收款码出错')
        return false
      }
      this.payImg = file.fileList
    },
    toEdit () { // 点击编辑
      this.edit = true
    },
    // 提交编辑----------------------
    submitDriver () {
      let vm = this
      let sysUser = sessionStorage.getItem('admin/user')
      let sysUserId = JSON.parse(sysUser).sysUserId
      // 验证图片是否上传
      if (vm.hImgList.length < 1) {
        vm.$message.error('头像未上传')
        return false
      }
      if (vm.justImage.length < 1) {
        vm.$message.error('身份证正面未上传')
        return false
      }
      if (vm.backImage.length < 1) {
        vm.$message.error('身份证背面未上传')
        return false
      }
      if (vm.licenseImageList.length < 1) {
        vm.$message.error('行驶证照片未上传')
        return false
      }
      if (vm.payImg.length < 1) {
        vm.$message.error('收款码未上传')
        return false
      }
      // 验证图片是否上传
      vm.$confirm('确认保存后将会更新/添加该司机信息，确认保存吗','请确认',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.$refs['ruleForm'].validate((valid) => {
          if (valid) { // 参数验证完毕
            //----------------------保存--->拼接参数----------
            let param = {
              mobileNumber: vm.driverInfo.mobileNumber,
              driverType: vm.driverInfo.driverType,
              areaName: vm.driverInfo.areaName,
              realName: vm.driverInfo.realName,
              sex: vm.driverInfo.sex,
              headImage: vm.hImgList[0].url ? vm.driver.headImage : vm.hImgList[0].response.data[0].filePath,
              certificateNo: vm.driverInfo.certificateNo,
              certificateJustImage: vm.justImage[0].url ? vm.driver.certificateJustImage : vm.justImage[0].response.data[0].filePath,
              certificateBackImage: vm.backImage[0].url ? vm.driver.certificateBackImage : vm.backImage[0].response.data[0].filePath,
              paymentCodeType: vm.driverInfo.paymentCodeType,
              paymentCode: vm.payImg[0].url ? vm.driver.paymentCode : vm.payImg[0].response.data[0].filePath,
              licensePlates: vm.driverInfo.licensePlates,
              vehicleNumber: vm.driverInfo.vehicleNumber,
              carType: vm.driverInfo.carType,
              licenseNumber: vm.driverInfo.licenseNumber,
              licenseImage: vm.licenseImageList[0].url ? vm.driver.licenseImage : vm.licenseImageList[0].response.data[0].filePath,
              seatingCapacity: vm.driverInfo.seatingCapacity
              // createUser: vm.driverInfo.createUser
            }
            debugger
            let url = ''
            if (vm.type === 1) {
              param['createUser'] = sysUserId
              url = urls.saveDriver
            } else if (vm.type === 2) {
              param['driverId'] = vm.driver.driverId
              param['updateUser'] = sysUserId
              url = urls.updateDriver
            }
            axios_post.post(url, param).then(res => {
              let code = res.data.code
              if (code === '10000') {
                if (vm.type === 1) {
                  vm.$message.success('添加成功，即将前往审核页面')
                  vm.$router.push({path: '/audit'})
                } else if (vm.type === 2) {
                  vm.$message.success('修改成功')
                  vm.$emit('refresh')
                }
              } else {
                vm.$message.error(res.data.msg)
              }
            })
          } else { // 参数不齐全
            vm.$message.error('请检查信息是否填写完整')
            return false
          }
        })
      })
    },
    // 放弃编辑----------------------
    cancelConfirm () {
      this.$confirm('确认放弃后所有的变更都将还原，确认要放弃编辑吗', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelEdit()
      })
    },
    cancelEdit () {
      let vm = this
      if (vm.type === 2) {
        vm.edit = false
        vm.hImgList = []// 头像图片组
        vm.justImage = [] // 身份证正面
        vm.backImage = [] // 身份证背面
        vm.licenseImageList = [] //行驶证照片
        vm.payImg = [] // 收款码
        for (let k in vm.driver) {
          if (vm.driverInfo.hasOwnProperty(k)) {
            vm.driverInfo[k] = vm.driver[k]
          }
        }
        vm.trueArea = vm.driverInfo.areaName
        let areaId = vm.areaList.find(item => item.label === vm.driverInfo.areaName).value
        vm.driverInfo.areaName = areaId
        if (vm.driverInfo.headImage) { // init头像
          vm.hImgList.push({
            uid: Math.random() * -10,
            name: 'headImg',
            status: 'done',
            url: vm.uploadSrc + vm.driver.headImage
          })
        }
        if (vm.driverInfo.certificateJustImage) { // init身份证正面
          vm.justImage.push({
            uid: Math.random() * -10,
            name: 'cImg1',
            status: 'done',
            url: vm.uploadSrc + vm.driver.certificateJustImage
          })
        }
        if (vm.driverInfo.certificateJustImage) { // init身份证背面
          vm.backImage.push({
            uid: Math.random() * -20,
            name: 'cImg2',
            status: 'done',
            url: vm.uploadSrc + vm.driver.certificateBackImage
          })
        }
        if (vm.driverInfo.licenseImage) { // init 驾驶证照片
          vm.licenseImageList.push({
            uid: Math.random() * -30,
            name: 'licenseImg',
            status: 'done',
            url: vm.uploadSrc + vm.driver.licenseImage
          })
        }
        if (vm.driverInfo.paymentCode) { // init 收款码
          vm.payImg.push({
            uid: Math.random() * -40,
            name: 'payImage',
            status: 'done',
            url: vm.uploadSrc + vm.driver.paymentCode
          })
        }
      }
    },
    // ------------------冻结解封---------------------
    changeDriverStatus (statu) { // 冻结解封--------------
      let vm = this
      let user = sessionStorage.getItem('admin/user')
      let uId = JSON.parse(user)
      if (statu === 3) { // 冻结
        let param = {
          driverId: vm.driver.driverId,
          updateUser: uId.sysUserId
        }
        vm.$confirm('确定要冻结该司机？','警告',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios_post.post(urls.freezeDriver, param).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.info('已冻结该司机')
              vm.$emit('refresh')
            } else {
              vm.$message.error(res.data.msg)
            }
          }, err => {
              vm.$message.error('冻结司机出错，请与管理员联系')
          })
        }).catch(() => {

        })
      } else { // 解封000000000000
        vm.$confirm('确定要为该司机解封吗', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            driverId: vm.driver.driverId,
            updateUser: uId.sysUserId
          }
          axios_post.post(urls.unFreezeDriver, param).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.info('已解封该司机')
              vm.$emit('refresh')
            } else {
              vm.$message.error(res.data.msg)
            }
          }, err => {
            vm.$message.error('解封司机出错，请与管理员联系')
          })
        }).catch(() => {

        })
      }
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
  .cImg {
    width: 243px;
    height: 156px;
  }
  .cImg .image-slot{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #e4e4e4;
  }
</style>
