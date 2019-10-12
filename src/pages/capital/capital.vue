<template>
  <div class="capital">
    <div class="capital-content">
      <el-form :size="'mini'" ref="ruleForm" :rules="rule" :model="form">
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="form.key">
                <el-option
                  v-for="item in selectArr.keyArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item
              prop="value"
            >
              <el-input v-model="form.value"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="2">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import axios_post from '@/api/extendAxios.js'
  import urls from '@/config/api.js'
  import searchMore from '@/pages/capital/searchMore.vue'
  // queryDrvAccFlow
  export default {
    name:'capital',
    data () {
      let checkValue = (rule, value, callback) => {
        if (this.form.key !== 'driverName') {
          let str = this.form.value.toString()
          let arr = str.split('')
          arr.map((value) => {
            if (isNaN(Number(value))) {
              callback(new Error('请填写数字'))
            }
          })
        }
        callback()
      }
      return {
        form: {
          key: 'driverId',
          value: ''
        },
        selectArr: {
          keyArr: [{label: '司机编号', value: 'driverId'}, {label: '司机手机', value: 'mobileNumber'},
            {label: '司机姓名', value: 'driverName'}]
        },
        rule: {
          value: [{required: true, message: '查询信息不能为空', trigger: 'blur'}, {validator: checkValue, trigger: 'blur'}]
        }
      }
    },
    methods: {
      search () {
        let vm = this
        let param = {
          currentPage: 1,
          pageSize: 20
        }
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            param[this.form.key] = this.form.value
            axios_post.post(urls.queryDrvAccFlow, param).then(res => {
              let code = res.data.code
              if (code === '10000') {
                let len = res.data.data.data.length
                if (len > 0) {
                  let opt = {
                  }
                  opt[this.form.key]= this.form.value
                  vm.$router.push({name:'capitalList', params: {opt: JSON.stringify(opt)}})
                } else {
                  vm.$message.error('未查询到信息')
                }
              } else {
                vm.$message.error(res.data.msg)
              }
            }).catch(err => {
              vm.$message.error('查询失败，请联系管理员')
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
.capital{
  width: 100%;
  height: calc(100vh - 160px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.capital-content{
  width: 70%;
}
</style>
