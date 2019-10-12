<template>
    <div class="detail2">
        <h3 class="page-header">{{title}}</h3>
        <table class="table table-striped table-bordered table-hover table-full-width">
            <tbody>
                <tr v-if="workType===0">
                    <td>角色编码</td>
                    <td>
                        <input type="text" class="form-control" v-model.trim="code">
                    </td>
                </tr>
                <tr>
                    <td>角色名</td>
                    <td v-if="workType===2">{{roleName}}</td>
                    <td v-if="workType!==2">
                        <input type="text" class="form-control" v-model.trim="roleName">
                    </td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td v-if="workType===2">{{remark}}</td>
                    <td v-if="workType!==2">
                        <input type="text" class="form-control" v-model.trim="remark">
                    </td>
                </tr>
                <tr v-if="workType===2">
                    <td>创建时间</td>
                    <td>{{createTime}}</td>
                </tr>
                <tr v-if="workType===2 && updateTime !== ''">
                    <td>修改时间</td>
                    <td>{{updateTime}}</td>
                </tr>
            </tbody>
        </table>
        <div v-if="workType !== 2">
            <input type="button" class="btn btn-primary" value="保存" @click="save" style="display: block;margin: 7px auto;">
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'

    export default {
        name:'roleDetail',
        props:['info'],
        mounted:function () {
            if(this.info.title==='reset') {
                let data = this.info.data
                this.workType = 1
                this.title='修改角色'
                this.roleId = data.roleId
                this.roleName = data.roleName
                this.remark = data.remark
            } else if (this.info.title === 'detail'){
                let data = this.info.data
                this.workType = 2
                this.title='角色详情'
                this.roleId = data.roleId
                this.roleName = data.roleName
                this.remark = data.remark
                this.createTime = data.createTime
                this.updateTime = data.updateTime
            } else if (this.info.title==='add'){
                this.workType=0
                this.title='添加角色'
            }
        },
        data:function () {
            return{
                workType:0,//操作类型 0-添加 1-修改 2-查看
                title:'',
                roleId:'',
                roleName:'',
                createUserId:'',
                updateUserId:'',
                remark:'',
                createTime:'',
                updateTime:'',
              //新增角色编码
                code:'',
            }
        },
        methods:{
            save:function () {
                let vm = this
                let params = {
                    roleName:vm.roleName,
                    remark:vm.remark
                }
                let session = sessionStorage.getItem('admin/user')
                session = JSON.parse(session)
                let user = session.sysUserId
                if (this.workType === 1) { //修改
                    params['roleId']=vm.roleId,
                    params['updateUserId']=user
                } else if (this.workType === 0) {
                    params['createUserId']=user
                    if(vm.code===''){
                        layer.open({
                          title:'警告',
                          content:'code必填',
                        })
                        return false
                    }else {
                      params['name']=vm.code
                    }
                }
                let index = layer.confirm('确定要保存吗',{icon:3,title:'提示'},function () {
                    axios_post.post(urls.saveOrUpdateRole,params).then(res=>{
                        layer.open({
                            title:res.data.code,
                            content:res.data.msg
                        })
                        vm.$router.go(0)
                    },err=>{
                        layer.open({
                            title:'失败',
                            content:err.message
                        })
                    })
                    layer.close(index)
                },function () {
                    layer.close(index)
                })

            }
        }
    }
</script>

<style scoped>

</style>
