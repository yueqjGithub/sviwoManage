<template>
    <div class="pop_detail">
      <el-form label-position="left" class="feedCont" :model="form" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="问卷问题" prop="problem">
              <el-input v-model="form.problem"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-switch
                v-model="form.status"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="选项" prop="answer">
                <el-input v-model="form.answer" type="textarea" placeholder="选项间用#隔开，例：答案1#答案2#答案3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-success" @click="saveQuestion">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api.js'

    export default {
      name: 'add',
      props:['info'],
      data(){
        return {
          form:{
            problem:'',
            remark: '',
            status: 1,
            answer: ''
          },
          titArr:['A','B','C','D','E','F','G','H','I','J'],
          rules:{
              problem:[
                {required:true,message:'请输入问卷题目',trigger:'blur'}
              ],
              answer:[
                {required:true,message:'请根据提示输入答案选项',trigger:'blur'}
              ],
          }
        }
      },
      created(){},
      methods:{
        //answer处理
        makeAnswer(){
            let vm = this
            let params = []
            if (vm.form.answer === '') {
                vm.$message.error('请按提示输入答案选项')
                return false
            } else {
              let arr = vm.form.answer.split('#')
              let len = arr.length
              for (let i=0;i<len;i++) {
                  params.push({code:vm.titArr[i],value:arr[i]})
              }
              return JSON.stringify(params)
            }
        },
        saveQuestion(){
          let vm = this

          let updateUser = sessionStorage.getItem('admin/user')
          updateUser = JSON.parse(updateUser)

          if (vm.form.problem === '') {
            vm.$message.error('请输入问卷题目')
            return false
          }
          let params = {
              problem: vm.form.problem,
              operationUser:updateUser.sysUserId,
              answer: vm.makeAnswer(),
              status: vm.form.status
          }

          if (!params.answer) {
            vm.$message.error('请按提示输入答案选项')
            return false
          }

          if (vm.form.remark !== '') {
              params['remark'] = vm.form.remark
          }

          axios_post.post(urls.saveQuestion,params).then(res=>{
              let vm = this
              let code = res.data.code
              if (code === '30006') {
                vm.$message({
                  message:res.data.msg,
                  type:'success'
                })
                setTimeout(function () {
                  vm.$router.go(0)
                },1500)

              } else {
                  vm.$message.error(res.data.msg)
              }
          },err=>{
              vm.$message.error('添加问卷失败，请联系管理员')
          })
        }
      }
    }
</script>

<style scoped>

</style>
