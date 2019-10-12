<template>
    <div class="detail2">
        <h3 class="page-header">{{title}}</h3>
        <div class="table-responsive info">
            <table class="table table-striped table-bordered table-hover table-full-width">
                <tbody>
                <!--id到数据中处理-->
                <tr>
                    <td>用户名</td>
                    <td v-if="info.type === 0">{{user.sysUserName}}</td>
                    <td v-else-if="info.type === 1">
                        <input type="text" v-model="sysUserName" class="form-control engInput">
                    </td>
                    <td v-else-if="info.type===2">
                        <input type="text" v-model.lazy="sysUserName" class="form-control engInput" @change="checkName">
                    </td>
                </tr>
                <tr v-if="info.type !== 0">
                    <td>密码</td>
                    <!--<td v-if="info.type === 0">{{user.sysUserPassword}}</td>-->
                    <td>
                        <input type="text" v-model="sysUserPassword" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td>手机号</td>
                    <td v-if="info.type === 0">{{user.mobile}}</td>
                    <td v-else>
                        <input type="tel" v-model="mobile" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td>真实名称</td>
                    <td v-if="info.type === 0">{{user.realName}}</td>
                    <td v-else>
                        <input type="text" v-model="realName" class="form-control">
                    </td>
                </tr>
                <tr v-if="info.type !== 2">
                    <td>用户状态</td>
                    <td v-if="info.type === 0">
                        <span v-if="user.enabled === false">禁用</span>
                        <span v-if="user.enabled === true">正常</span>
                    </td>
                    <td v-else-if="info.type === 1">
                        <input type="radio" name="uStatus" v-model="enabled" value="false">禁用
                        <input type="radio" name="uStatus" v-model="enabled" value="true">启用
                    </td>
                </tr>
                <tr  v-if="info.type === 0">
                    <td>创建人</td>
                    <td>{{user.createUser}}</td>
                </tr>
                <tr v-if="info.type === 0">
                    <td>创建时间</td>
                    <td>{{user.createTime}}</td>
                </tr>
                <tr v-if="info.type === 0">
                    <td>修改时间</td>
                    <td>{{user.updateTime}}</td>
                </tr>
                <!--<tr v-if="info.type === 0">-->
                    <!--<td>部门名称</td>-->
                    <!--<td>{{user.departName}}</td>-->
                <!--</tr>-->
                <tr>
                    <td>备注</td>
                    <td v-if="info.type === 0">{{user.remark}}</td>
                    <td v-else>
                        <input type="text" v-model="remark" class="form-control">
                    </td>
                </tr>
                </tbody>
            </table>
            <div v-if="info.type !== 0" style="text-align: center;">
                <input type="button" class="btn btn-primary" value="提交" @click = 'save'>
            </div>
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'

    export default {
        name:'userDetail',
        props:['info'],
        data:function () {
            return {
                title:'',
                user:{},
                sysUserId:'',
                sysUserName:'',
                sysUserPassword:'',
                enabled:'',
                mobile:'',
                realName:'',
                remark:'',
                //用户名重复状态
                userNameUse:null,
            }
        },
        methods:{
            //用户名重复验证
            checkName:function () {
                let vm = this
                for(let i=0;i<vm.sysUserName.length;i++){
                    if(vm.sysUserName.charCodeAt(i)<0&&vm.sysUserName.charCodeAt(i)>255){
                        vm.$message.error('用户名非法')
                        vm.userNameUse = false
                        return false
                    }
                }
                let params = {
                    username:vm.sysUserName
                }
                axios_post.post(urls.validateUsername,params).then(res=>{
                    let response = res.data
                    if(response.code === '30044'){
                        vm.userNameUse = false
//                        vm.nameCouldUse = false
                        vm.$message.error(response.msg)
                    } else if (response.code === '10000') {
                        vm.userNameUse = true
                        vm.$message({
                            message:'恭喜,帐户名可以使用',
                            type:'success'
                        })
                    }
                    console.log(vm.userNameUse)
                },err=>{
                    layer.open({
                        title:'出错啦',
                        content:err.message
                    })
                })
            },
            //提交
            save:function () {
                let vm = this
                let params = {
                    sysUserName:vm.sysUserName,
                    sysUserPassword:vm.sysUserPassword,
//                    userStatus : vm.userStatus,
                    mobile:vm.mobile,
                    realName:vm.realName,
                    sysDepartId:'',
                    remark:vm.remark,
                }
                let session = sessionStorage.getItem('admin/user')
                session = JSON.parse(session)
                let usr = session.sysUserId
                if(vm.info.type === 1){
                    params['sysUserId'] = vm.sysUserId
                    params['updateUserId'] = usr
                    params['enabled']=vm.enabled
                } else if (vm.info.type === 2) {
                    params['createUserId'] = usr
                }

                let reg_tel = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                if (reg_tel.test(vm.mobile) === false) {
                    layer.msg('手机号格式错误')
                    return false
                }

                if(vm.userNameUse !== true){
                    layer.open({
                        title:'warning',
                        content:'用户名不可用',
                        end:function () {
                            return false
                        }
                    })
                }
                let index = layer.confirm('确定要提交吗',{icon:7,title:'提示'},()=>{
                    axios_post.post(urls.saveOrUpdate,params).then(res=>{
                        layer.open({
                            title:res.data.code,
                            content:res.data.msg,
                            end:function () {
                                if(res.data.code==='30006'||'30004'){
                                    vm.$router.go(0)
                                }
                            }
                        })
                    },err=>{
                        layer.open({
                            title:'出错啦',
                            content:err.message
                        })
                    })
                    layer.close(index)
                },()=>{
                    layer.close(index)
                })
//                console.log(params)
            }
        },
        mounted:function () {
            let vm = this
            if (vm.info.type === 0) {
                vm.user = vm.info.data
                vm.title = '用户详情'
            } else if (vm.info.type === 1) {
                vm.title = '修改用户'
                vm.sysUserId=vm.info.data.sysUserId
                vm.sysUserName=vm.info.data.sysUserName
                vm.sysUserPassword=vm.info.data.sysUserPassword
                vm.enabled = vm.info.data.enabled
                vm.mobile=vm.info.data.mobile
                vm.realName=vm.info.data.realName
                vm.remark=vm.info.data.remark
            } else if (vm.info.type === 2){
                vm.title = '添加用户'
            }
        },
    }
</script>

<style scoped>
.form-control{
    max-width: 70%;
}
    .redInput{
        border-color: red;
    }
</style>
