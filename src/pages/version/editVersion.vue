<template>
  <div style="width: 100%;" class="pop_detail">
    <el-form ref="ruleForm" :model="version" label-width="120px" :rules="rules">
<!--      <el-form-item label="APP"  size="mini" prop="updateOrigin">-->
<!--        <el-radio-group v-model="version.updateOrigin">-->
<!--          <el-radio :label="2">司机APP</el-radio>-->
<!--          <el-radio :label="1">乘客APP</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="端口"  size="mini" prop="systemType">-->
<!--        <el-radio-group v-model="version.systemType">-->
<!--          <el-radio :label="1">IOS</el-radio>-->
<!--          <el-radio :label="2">Android</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
      <el-form-item label="版本号" size="mini" prop="code">
        <el-col :span="22">
          <el-input-number :style="{width: '56px'}" v-model="versionNum.one" :controls="false" :precision="0" :max="99" :min="0"></el-input-number>
          <span>.</span>
          <el-input-number :style="{width: '56px'}" v-model="versionNum.two" :controls="false" :precision="0" :max="99" :min="0"></el-input-number>
          <span>.</span>
          <el-input-number :style="{width: '56px'}" v-model="versionNum.three" :controls="false" :precision="0" :max="99" :min="0"></el-input-number>
          <span class="tip-after">
            *大于当前最大版本号
          </span>
        </el-col>
      </el-form-item>
      <el-form-item label="是否强更"  size="mini" prop="forced">
        <el-radio-group v-model="version.forced">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否强提示"  size="mini" prop="tips" v-if="version.forced === 0">
        <el-radio-group v-model="version.tips">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <span class="tip-after">
            *强制更新默认强制提示
        </span>
      </el-form-item>
      <el-form-item label="提示时间" size="mini" prop="updateTime">
        <el-date-picker
          v-model="version.updateTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        <span class="tip-after">
            *大于当前最大版本更新时间
        </span>
      </el-form-item>
      <el-form-item label="apk上传" size="mini" v-if="version.systemType === 2">
        <el-upload
          class="upload-demo"
          :action="src"
          name="file"
          :limit="1"
          :accept="'.apk'"
          :on-progress="controlBtn"
          :on-error="uploadErr"
          :with-credentials="true"
          :on-success="uploadSuc"
          :file-list="fileList">
          <el-button type="primary" size="mini" :diabled="disabledSave" :loading="disabledSave">{{btnString}}</el-button>
        </el-upload>
        <span class="tip-after">
            *安卓更新必须带有apk
        </span>
      </el-form-item>
      <el-form-item label="更新提示语" prop="prompt">
        <el-col :span="14">
          <el-input
            type="textarea"
            v-model="version.prompt"
            :minLength="0"
            :maxlength="100"
            :rows="5"
            :show-word-limit="true"
          >
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" size="mini" :diabled="disabledSave" :loading="disabledSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios_post from '@/api/extendAxios.js'
import urls from '@/config/api'

export default {
  name: "editVersion",
  props: ['type', 'pro'],
  data () {
    let checkCode = (rule, value, callback) => {
      for (let k in this.versionNum) {
        if (typeof this.versionNum[k] !== 'number') {
          callback(new Error('版本号只能由数字组成'))
        }
      }
      callback()
    }
    let checkUpdateTime = (rule, value, callback) => {
      let now = new Date().getTime()
      let stamp = this.eleTimeExchange(value)
      if (now > stamp) {
        callback(new Error('必须大于当前时间'))
      } else {
        callback()
      }
    }
    return {
      btnString: '点击上传',
      src: urls.uploadFile,//oos地址
      fileList:[],//文件列表
      disabledSave: false,
      versionNum: {
        one: '',
        two: '',
        three: ''
      },
      version: {
        versionCode: '',
        forced: 0,
        tips: 0,
        systemType: 0,
        updateOrigin: 0,
        downloadUrlApk: '',
        updateTime: '',
        prompt: ''
      },
      rules: {
        systemType: [
          {required: true, message: 'APP必须选择'}
        ],
        updateOrigin: [
          {required: true, message: '端口必须选择'}
        ],
        code: [
          {validator: checkCode, trigger: 'blur',required: true}
        ],
        forced: [
          {required: true, message: '是否强更必须选择'}
        ],
        updateTime: [
          {validator: checkUpdateTime, trigger: 'blur'},{required: true, message: '时间不能为空'}
        ],
        prompt: [
          {required: true, message: '提示语不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    let vm = this
    for (let k in vm.pro) {
      if (vm.version.hasOwnProperty(k)) {
        vm.version[k] = vm.pro[k]
      }
    }
    if (vm.type === 1) {
      let arr = vm.version.versionCode.split('.')
      vm.versionNum['one'] = parseInt(arr[0])
      vm.versionNum['two'] = parseInt(arr[1])
      vm.versionNum['three'] = parseInt(arr[2])
    }
  },
  methods: {
    // 更新提示换行
    submitForm(formName) {
      let vm = this
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          // 版本号验证
          for (let k in vm.versionNum) {
            if (vm.versionNum[k] === '' || vm.versionNum[k] === undefined) {
              vm.$message.error('版本号未填写完整')
              return false
            }
          }
          // 强更强提示关联
          if (vm.version.forced === 1) {
            vm.version.tips = 1
          }
          // apk校验
          if (vm.version.systemType === 2) {
            if (vm.version.downloadUrlApk === '') {
              vm.$message.error('安卓版本更新必须携带APK')
              return false
            }
          }
          // 修改时添加ID
          if (vm.type === 1) {
            vm.version.id = vm.pro.id
          }
          // 其余非空验证
          if (vm.version.updateTime === '') {
            vm.$message.error('更新时间不能为空')
            return false
          }

          if (vm.version.prompt === '') {
            vm.$message.error('提示语不能为空')
            return false
          }
          // 版本号拼接
          let codeArr = []
          for (let k in vm.versionNum) {
            codeArr.push(vm.versionNum[k])
          }
          vm.version.versionCode = codeArr.join('.')
          // 提交
          vm.disabledSave = true
          // 声明参数组，并赋值给param1,以便转换时间戳时不影响vm.version
          let param1 = {}
          for (let k in vm.version) {
            param1[k] = vm.version[k]
          }
          // let reg = new RegExp("\r\n", "g");//g,表示全部替换

          // lst[count].Action = lst[count].Action.replace(reg, "<br/>")
          param1['prompt']=vm.version.prompt.replace (/[\r\n]/g, ';');
          param1['updateTime'] = vm.eleTimeExchange(param1['updateTime'])
          axios_post.post(urls.saveOrUpdateVersion, param1).then(res => {
            let code = res.data.code
            if (code === '30006' || code === '30004') {
              vm.$message.success(res.data.msg)
              vm.$emit('refresh')
            } else {
              vm.$message.error(res.data.msg)
            }
            vm.disabledSave = false
          }).catch(err => {
            vm.$message.error('提交出错，请与管理员联系')
            vm.disabledSave = false
          })
        } else { // validate false
          vm.$message.warning('信息未正确填写')
          return false
        }
      })
    },
    //保存按钮控制
    controlBtn:function () {
      this.disabledSave = true
      this.btnString='上传中'
    },
    // 上传出错
    uploadErr () {
      this.$message.error('上传出错')
      setTimeout(() => {
        this.disabledSave = false
        this.btnString = '点击上传'
      }, 1500)
    },
    //上传文件列表成功
    uploadSuc:function (res) {
//                this.downloadUrlApk = res.data[0].filePath
//                console.log(this.downloadUrlApk)
      let vm = this
      let code = res.code
//              console.log(res)
      if(code === '10000'){
        vm.version.downloadUrlApk = urls.imgOrigin+res.data[0].filePath
        vm.disabledSave = false
      } else {
        vm.$message.error('上传文件出错')
        vm.disabledSave = false
      }
      this.btnString = '点击上传'
    }
  }
}
</script>

<style scoped>
.tip-after{
  font-size: 12px;
  color: #e6a23c;
  white-space: nowrap;
  display: block;
}
</style>
