<template>
    <div class="detail2">
        <h3 class="page-header">{{title}}</h3>
        <table class="table table-striped table-bordered table-hover table-full-width">
            <tbody>
            <!--<tr>-->
                <!--<td v-if="workType!==0">权限id</td>-->
                <!--<td v-if="workType===2">{{permId}}</td>-->
                <!--<td v-if="workType===1">-->
                    <!--<input type="text" class="form-control" v-model="permId">-->
                <!--</td>-->
            <!--</tr>-->
            <tr>
                <td>权限名</td>
                <td v-if="workType===2">{{permName}}</td>
                <td v-if="workType!==2">
                    <input type="text" class="form-control" v-model="permName">
                </td>
            </tr>
            <tr>
                <td>权限url</td>
                <td v-if="workType===2">{{permUrl}}</td>
                <td v-if="workType!==2">
                    <input type="text" class="form-control" v-model="permUrl">
                </td>
            </tr>
            <tr>
                <td>权限状态</td>
                <td v-if="workType===2">
                    <span v-if="permStatus==='0'">禁用</span>
                    <span v-if="permStatus==='1'">正常</span>
                </td>
                <td v-if="workType!==2">
                    <input type="radio" name="status" value="0" v-model="permStatus">禁用
                    <input type="radio" name="status" value="1" v-model="permStatus">正常
                </td>
            </tr>
            <!--<tr>-->
                <!--<td>权限编码</td>-->
                <!--<td v-if="workType===2">{{code}}</td>-->
                <!--<td v-if="workType!==2">-->
                    <!--<input type="text" class="form-control" v-model="code">-->
                <!--</td>-->
            <!--</tr>-->
            <tr v-if="workType===2">
                <td>创建时间</td>
                <td>{{createTime}}</td>
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
        name:'permDetail',
        props:['info'],
        mounted:function () {
            if(this.info.title==='reset') {
                let data = this.info.data
                this.workType = 1
                this.title='修改权限'
                this.permId = data.permId
                this.permName = data.permName
                this.permUrl = data.permUrl
                this.permStatus=data.permStatus.toString()
//                this.code = data.code
            } else if (this.info.title === 'detail'){
                let data = this.info.data
                this.workType = 2
                this.title='权限详情'
                this.permId = data.permId
                this.permName = data.permName
                this.permUrl = data.permUrl
                this.permStatus=data.permStatus.toString()
//                this.code = data.code
                this.createTime = data.createTime
            } else if (this.info.title==='add'){
                this.workType=0
                this.title='添加权限'
            }
        },
        data:function () {
            return{
                workType:0,//操作类型 0-添加 1-修改 2-查看
                title:'',
                permId:'',
                permName:'',
                permUrl:'',
                permStatus:'',
//                code:'',
                createUserId:'',
                updateUserId:'',
                createTime:'',
            }
        },
        methods:{
            save:function () {
                let vm = this
                let params = {
                    permName:this.permName,
                    permUrl:this.permUrl,
                    permStatus:this.permStatus,
//                    code:this.code,
                }
                let session = sessionStorage.getItem('admin/user')
                session = JSON.parse(session)
                let user = session.sysUserId
                if (this.workType === 1) { //修改
                    params['updateUserId']=user
                    params['permId']=vm.permId
                } else if (this.workType === 0) {//添加
                    params['createUserId']=user
                }
                let index = layer.confirm('确定要保存吗',{icon:3,title:'提示'},function () {
                    axios_post.post(urls.saveOrUpdatePermis,params).then(res=>{
                        layer.open({
                            title:res.data.code,
                            content:res.data.msg,
                            end:function(){
                                if(res.data.code === '30006'){
                                  vm.$router.go(0)
                                }
                            }
                        })
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
