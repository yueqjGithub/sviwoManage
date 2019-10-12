<template>
    <div class="detail2 input_control">
        <h3 class="page-header">{{title}}</h3>
        <el-form :model="version" :rules="rules" ref="versionForm" label-width="100px" class="demo-ruleForm">
            <el-row>
                <el-col :span="wid">
                    <el-form-item label="版本名" prop="versionCode">
                        <el-input v-model.trim="version.versionCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="wid">
                    <el-form-item label="更新类型" prop="forced">
                        <el-select v-model="version.forced" placeholder="请选择">
                            <el-option label="非强制更新弱提示 " value="-1"></el-option>
                            <el-option label="非强制更新强提示 " value="0"></el-option>
                            <el-option label="强制更新" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="wid">
                    <el-form-item label="操作系统" prop="systemType">
                        <el-select v-model="version.systemType" placeholder="请选择">
                            <el-option label="Android" value="1"></el-option>
                            <el-option label="IOS " value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="wid">
                <el-form-item label="更新来源" prop="updateOrigin">
                  <el-select v-model="version.updateOrigin" placeholder="请选择">
                    <el-option label="乘客端" :value="1"></el-option>
                    <el-option label="司机端 " :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!--<el-row>-->
                <!--<el-col :span="wid">-->
                    <!--<el-form-item label="页面下载地址" prop="downloadUrl">-->
                        <!--<el-input v-model="version.downloadUrl"></el-input>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
            <!--</el-row>-->

            <el-row>
                <el-col :span="wid">
                    <el-form-item label="安卓渠道" prop="channel">
                        <!--<el-input v-model="version.channel"></el-input>-->
                      <el-select placeholder="请选择" v-model="version.channel">
                        <!--<el-option label="Android" value="1"></el-option>-->
                        <el-option v-for="k in channelList" :value="k.channel" :label="k.channel" :key="k.index"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="wid">
                    <el-form-item label="版本号" prop="versionNumber">
                        <el-input v-model.trim="version.versionNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="wid+4">
                    <el-form-item label="更新提示语" prop="prompt">
                        <!--<el-input v-model="version.prompt"></el-input>-->
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model.trim="version.prompt">
                      </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--APK-->
            <el-row>
                <el-col :span="wid+4">
                    <el-form-item label="APK上传" prop="downloadUrlApk">
                        <el-upload
                                class="upload-demo"
                                :action="src"
                                :on-remove="handleRemove"
                                name="file"
                                :limit="1"
                                :on-progress="controlBtn"
                                :with-credentials="true"
                                :on-success="uploadSuc"
                                :file-list="fileList">
                            <el-button type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--APK-->
            <!--按钮组-->
            <el-form-item class="btn-group">
                <el-button type="primary" @click="submitForm('versionForm')" :disabled="canSave">保存</el-button>
                <el-button @click="resetForm('versionForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'

    export default {
        name:'versionDetail',
        props:['info'],
        data:function () {
            return{
                wid:8,
                fileList:[],//文件列表
                src:urls.uploadFile,//oos地址
                title:'',
                channelList:'',//渠道列表
                canSave:false,//保存按钮是否可点击
                version:{
                    id:'',
                    versionCode:'',
                    forced:'',
                    systemType:'',
                    downloadUrl:'',
                    downloadUrlApk:'',
                    channel:[],
                    versionNumber:'',
                    updateOrigin: '',
                    prompt:'',
                },
                rules:{
                  versionCode:[
                    { required: true, message: '请输入版本名', trigger: 'blur' }
                  ],
                  forced:[
                    {required: true, message: '请选择更新类型', trigger: 'change'}
                  ],
                  systemType:[
                    {required: true, message: '请选择操作系统', trigger: 'change'}
                  ],
                  versionNumber:[
                    {required: true, message: '请输入版本号', trigger: 'blur'}
                  ],
                  updateOrigin: [
                    {required: true, message: '请选择更新来源', trigger: 'change'}
                  ]
                }
            }
        },
        mounted:function () {
            let vm = this
            let obj = vm.info.data


            if (vm.info.type === 1) {
                vm.title = '修改版本信息'
              obj.forced =obj.forced.toString()
              obj.systemType =obj.systemType.toString()
            }else if(vm.info.type === 2) {
                vm.title = '添加版本信息'
            }
            for(let k in obj){
                if(vm.version.hasOwnProperty(k)){
                    vm.version[k]=obj[k]
                }
            }
            axios_post.post(urls.findChannel).then(res=>{//获取渠道列表
                let code = res.data.code
                if(code === '10000'){
                    vm.channelList = res.data.data
                }else{
                    layer.open({
                      title:code,
                      content:'获取渠道列表失败',
                      end:function () {
                        return false
                      }
                    })
                }
            })
//            console.log(vm.version)
        },
        methods:{
            //保存按钮控制
            controlBtn:function () {
                this.canSave = true
            },
            submitForm(formName) {
                let vm = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
//                        alert('submit!');
                      let params = {
                        versionCode:vm.version.versionCode,
                        forced:parseInt(vm.version.forced),
                        systemType:parseInt(vm.version.systemType),
                        downloadUrl:vm.version.downloadUrl,
                        downloadUrlApk:vm.version.downloadUrlApk,
//                        channel:vm.version.channel,
                        updateOrigin: parseInt(vm.version.updateOrigin),
                        versionNumber:vm.version.versionNumber,
                        prompt:vm.version.prompt
                      }
                      if(vm.version.channel !== [] && vm.version.channel !== ''){
                          params['channel']=vm.version.channel
                      }
                      if(vm.info.type === 1){
                          params['id']=vm.version.id
                      }
                      let index = layer.confirm('确定要保存吗',{icon:7,title:'提示'},function () {
                        axios_post.post(urls.saveOrUpdateVersion,params).then(res=>{
                          let response = res.data
                          if(response.code === "30004"){
                            vm.$message({
                              type:'success',
                              message:response.msg
                            })
                            setTimeout(function () {
                              vm.$router.go(0)
                            },1500)
                          } else {
                              layer.open({
                                title:response.code,
                                content:response.msg
                              })
                          }
                        },err=>{
                          layer.open({
                            title:'出错啦',
                            content:err.message
                          })
                        })
                        layer.close(index)
                      },function () {
                        layer.close(index)
                      })
                    } else {
//                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //删除文件列表
            handleRemove(file, fileList) {
                console.log(file, fileList);
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
                  vm.version.downloadUrl = urls.imgOrigin+res.data[0].filePath
                  vm.canSave = false
              } else {
                  layer.open({
                    title:code,
                    content:'上传文件出错'
                  })
              }
            }
        }
    }
</script>

<style scoped>
input{
    width:60%;
}

    .btn-group{
        margin-top: 14px;
    }
</style>
