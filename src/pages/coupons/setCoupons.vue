<template>
  <div class="pop_detail">
    <el-form :model="couponsForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="优惠券类型" prop="couponsType">
        <el-radio-group v-model="couponsForm.couponsType">
          <el-radio :label="1">满减券</el-radio>
          <el-radio :label="2">折扣券</el-radio>
          <el-radio :label="4">立减券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row v-if="couponsForm.couponsType === 1">
        <el-form-item label="满" prop="paramOne">
          <el-input-number v-model="couponsForm.paramOne" :precision="2" :step="0.01" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="减" prop="paramTwo">
          <el-input-number v-model="couponsForm.paramTwo" :precision="2" :step="0.01" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="使用场景" prop="couponsType">
          <el-radio-group v-model="couponsForm.scence">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">扫描</el-radio>
            <el-radio :label="3">线上</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <!---------------------2----------------------->
      <el-row v-if="couponsForm.couponsType === 2">
        <el-form-item label="折扣系数" prop="paramOne">
          <el-input-number v-model="couponsForm.paramOne" :precision="2" :step="0.01" :min="0" :max="1"></el-input-number>
        </el-form-item>
        <el-form-item label="减免上限" prop="paramTwo">
          <el-input-number v-model="couponsForm.paramTwo" :precision="2" :step="0.01" :min="0" :max="1"></el-input-number>
        </el-form-item>
        <el-form-item label="使用场景" prop="couponsType">
          <el-radio-group v-model="couponsForm.scence">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">扫描</el-radio>
            <el-radio :label="3">线上</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <!----------------------------4------------------>
      <el-row v-if="couponsForm.couponsType === 4">
        <el-form-item label="立减数额" prop="paramOne">
          <el-input-number v-model="couponsForm.paramOne" :precision="2" :step="0.01" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="使用场景" prop="couponsType">
          <el-radio-group v-model="couponsForm.scence">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">扫描</el-radio>
            <el-radio :label="3">线上</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-form-item label="启用" v-if="isEdit">
        <el-switch v-model="couponsForm.couponStatus"
                   :active-value="1"
                   :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label="优惠券描述" prop="remark">
        <el-input type="textarea" v-model="couponsForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveCoupons" :disabled="buttonDisabled">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios_post from '@/api/extendAxios.js'
  import urls from '@/config/api'
  export default {
    name: 'setCoupons2',
    props: ['isEdit','infoForm'], //--isEdit-修改/添加   infoForm-传递过来的优惠券form
    data: function () {
      return {
        title: '',
        couponsForm:{
          type:false, //添加 - false, 修改 - true
          // 优惠券类型
          couponsType: 1,
          couponStatus: 1,
          scence:1,
          remark:'',
          paramOne:'',
          paramTwo: '',
        },
        buttonDisabled: false,
        rules:{
          couponsType:[
            {required: true, message: '请选择优惠券类型', trigger:'change'}
          ],
          paramOne:[
            {required: true, type: 'number', message:'请输入参数', trigger:'blur'}
          ],
          paramTwo:[
            {required: true, type: 'number', message:'请输入参数', trigger:'blur'}
          ],
          scence:[
            {required: true, message: '请选择场景', trigger:'change'}
          ],
          remark:[
            {required: true,message: '请输入描述', trigger: 'blur'}
          ]
        }
      }
    },
    mounted: function () {
//            console.log(this.$route.query)
      let vm = this
      let query = vm.infoForm
      if(vm.isEdit){
        vm.couponsForm.type = true
        vm.couponsForm.couponsType = query.couponType
        vm.couponsForm.couponStatus = query.couponStatus
        vm.couponsForm.remark = query.remark
        vm.couponsForm.scence = query.scence
        vm.couponsForm.paramOne = query.paramOne
        vm.couponsForm.paramTwo = query.paramTwo
      }
    },
    methods:{
      saveCoupons:function () {
        let vm = this
        let params = {
          "couponContent": '',        //优惠券内容
          "couponType": vm.couponsForm.couponsType,         //优惠券类型: 1 满减券   2 折扣券
//                        "createUser": '',           //模版创建人id
//                        "couponStatus": vm.couponStatus,       //优惠券模版状态: 0:停用  1:正常
          "scence": vm.couponsForm.scence,
          "remark": vm.couponsForm.remark,       //优惠券模版备注
          "paramOne": vm.couponsForm.paramOne,     //参数一
          "paramTwo": vm.couponsForm.paramTwo,     //参数二
          "paramThree": null      //参数三
        }
        if (params.couponType === 1) {
          let str = `满${params.paramOne}减${params.paramTwo}`
          params.couponContent = str
        } else if (params.couponType === 2) {
          let str = `${params.paramOne * 10}折,上限${params.paramTwo}元`
          params.couponContent = str
        } else if (params.couponType === 4) {
          let str = `立减${params.paramOne}元`
          params.couponContent = str
        }
        // 修改添加差异配置
        if (vm.isEdit) { // 点击修改进入的
          let updateUser = sessionStorage.getItem('admin/user')
          updateUser = JSON.parse(updateUser)
          params['updateUser'] = updateUser.sysUserId
          params['couponStatus'] = vm.couponsForm.couponStatus
          params['couponId'] = vm.infoForm.couponId
        } else if (!vm.isEdit) {
          let createUser = sessionStorage.getItem('admin/user')
          createUser = JSON.parse(createUser)
          params['createUser'] = createUser.sysUserId
        }
        vm.buttonDisabled = true //按钮置灰
        vm.$confirm('确认信息无误', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios_post.post(urls.addOrUpdateCoupTem,params).then((res)=>{
            vm.buttonDisabled=false
            let code = res.data.code
            if(code === '30006'){
              vm.$message({
                message: res.data.msg,
                type: 'success'
              })
              setTimeout(function () {
                vm.$router.go(0)
              },1500)
            } else {
              vm.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          },err=>{
            vm.buttonDisabled=false
            vm.$message({
              message: '设置优惠券出错,请联系管理员',
              type: 'error'
            })
          })
        }).catch(() => {
          vm.$message('已取消')
        })
      }
    }
  }
</script>

<style scoped>

</style>
