<template>
    <div class="detail2">
        <div class="main">
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5 setInput">
                <label>参数类型名称</label>
                <input type="text" placeholder="请输入备注" class="form-control" v-model="typeName">

            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5 setInput">
                <label>参数类型编码</label>
                <input type="text" placeholder="请输入备注" class="form-control" v-model="code" disabled v-if="dicType !== 'add'">
                <input type="text" placeholder="请输入备注" class="form-control" v-model="code" v-if="dicType === 'add'">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5 setInput">
                <label>备注</label>
                <input type="text" placeholder="请输入备注" class="form-control" v-model="remark">
            </div>
            <div class="col-mg-3 col-lg-3 col-sm-3 col-xs-3 btn-div">
                <input type="button" class="btn btn-primary" value="保存" @click="save">
            </div>
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api.js'

    export default {
        name: 'addType',
        props:['dicType'],
        data:function () {
            return {
                code:'',
                typeName:'',
                remark:'',
                dicTypeId:''
            }
        },
        mounted:function () {
            if (this.dicType !== 'add') {
                this.code = this.dicType.code
                this.typeName = this.dicType.typeName
                this.remark = this.dicType.remark
                this.dicTypeId = this.dicType.dicTypeId
            }
        },
        methods:{
            save:function () {
                let vm = this
                let params = {
                    "code": vm.code,        //参数类型CODE *
                    "typeName": vm.typeName,        //参数类型名称 *
                    "remark": vm.remark
                }
                if(vm.dicType !== 'add') {
                    params['dicTypeId'] = vm.dicTypeId
                }
                let opt={}
                for (let k in params) {
                    if(params[k]===''){
                        layer.msg('所有项为必填')
                        return false
                    }
                }
                let index = layer.confirm('确认提交吗',{icon:3,title:'提示'},function () {
                    axios_post.post(urls.addOrUpdateDicType,params).then((res)=>{
                        let code = res.data.code
                        layer.msg(res.data.msg)
                        if(code === '30006'){
                            vm.$router.go(0)
                        }
                    },(err)=>{
                        layer.msg(err.message)
                    })
                    layer.close(index)
                },function () {
                    layer.close(index)
                })

            }
        },
    }
</script>

<style scoped>
    .main {
        width:100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .setInput {
        display: flex;
        align-items: baseline;
        margin: 17px 0 0 7px;
    }
    label {
        width: 120px;
    }
    .btn-div{
        margin: 7px 0 0 7px;
    }
    .btn-div input {
        width:100%;
        margin:17px auto;
    }
</style>
