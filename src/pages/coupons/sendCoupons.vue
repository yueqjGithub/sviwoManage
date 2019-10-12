<template>
    <div>
        <h1 class="page-header">发送优惠券</h1>
        <div class="coupons_main">
            <div class="coupons_row">
                <h5 class="h5">券信息</h5>
                <span class="label label-primary coupons_info" v-if="$route.query.couponType==='1'">满减券</span>
                <span class="label label-primary coupons_info" v-if="$route.query.couponType==='2'">折扣券</span>
                <span class="label label-primary coupons_info">{{$route.query.couponContent}}</span>
                <span class="label label-primary coupons_info">{{$route.query.remark}}</span>
            </div>
            <div class="coupons_row">
                <h5 class="h5">接收类型</h5>
                <div class="type1 couponsType">
                    <label class="radio-inline">
                        <input type="radio" value="0" name="couponsType" v-model="sendType"> 全员接收
                    </label>
                    <label class="radio-inline">
                        <input type="radio" value="1" name="couponsType" v-model="sendType"> 指定人员接收
                    </label>
                </div>
            </div>
            <div class="coupons_row" v-if="sendType === '1'">
                <h5 class="h5 rc_tit">配置接收者</h5>
                <div class="type1 couponsType">
                    <div class="reciverList">
                        <reciver @inc="incList" v-for="k in num" :key='k.index' @recId="pushId"></reciver>
                    </div>
                </div>
            </div>
            <div class="coupons_row">
                <h5 class="h5">有效期</h5>
                <div class="couponsType">
                  <el-date-picker
                    v-model="effectiveTime"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </div>
            </div>
            <div class="coupons_btn">
                <input type="button" class="btn btn-primary" value="保存" @click="save" :disabled="couldSave">
                <router-link to="/couponsList">
                    <input type="button" class="btn btn-primary" value="返回列表">
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import Reciver from '@/pages/coupons/reciver.vue'
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'

    export default {
        name: 'sendCoupons',
        components: {
            reciver: Reciver
        },
        data: function () {
            return {
                sendType: '0',
                num:1,
                userIdGroup: '',
                effectiveTime: '',
                couldSave:false
            }
        },
        methods:{
            //接收id
            pushId:function (id) {
                let vm = this
                vm.userIdGroup += ''+id+','
            },
            incList: function () {
                this.num++
            },

            //发送
            save: function () {
                let vm = this
                vm.couldSave = true
                let index = layer.confirm('确认信息无误',{icon:5,title:'提示'},function () {
                    //声明TIME，防止时间输入框变化
                    let overTime
                    //到期时间
                    if (vm.effectiveTime !== '') {
                        overTime = vm.eleTimeExchange(vm.effectiveTime)
                    } else {
                        layer.msg('信息未填写完整')
                        layer.close(index)
                        vm.couldSave = false
                        return false
                    }

                    let updateUser = sessionStorage.getItem('admin/user')
                    updateUser = JSON.parse(updateUser)
                    let grantUer = updateUser.sysUserId

                    let params = {
                        "couponId": vm.$route.query.couponId,     //优惠券模版id *
                        "passengerId": vm.userIdGroup,     //乘客id(注意是字符串类型) *
                        "effectiveTime": overTime,     //优惠券到期时间 *
                        "grantUser": grantUer,     //发放人id *
                        "remark": vm.$route.query.remark,     //发放优惠券的备注
                    }

                    if(vm.sendType === '0'){//发送给所有人
                        params['grantAll'] = true
                    }
                    let opt = {}
                    for (let k in params) {
                        if(params[k]!== ''){
                            opt[k] = params[k]
                        }
                    }
                    axios_post.post(urls.couponGrant,opt).then((res)=>{
                        layer.msg(res.data.msg)
                        layer.close(index)
                        vm.couldSave = false
                    },(err)=>{
                        layer.msg(err.message)
                        layer.close(index)
                        vm.couldSave = false
                    })
                },function () {
                    layer.close(index)
                })
            }
        }
    }
</script>

<style scoped>
    .coupons_main{
        display: flex;
        flex-direction: column;
    }
    .coupons_row{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top:7px;
    }
    .coupons_row textarea{
        max-width: 70%;
    }
    .couponsType{
        margin-left: 27px;
    }
    .h5{
        width:100px;
    }
    .coupons_btn{
        display: flex;
        align-items: center;
        justify-content: center;
        margin:9px auto;
    }
    .coupons_info{
        margin-left: 27px;
        margin-right: 5px;
        font-size: large;
    }
    .reciverList{
        width:50%;
    }
    .rc_tit{
        align-self: flex-start;
    }
    .coupons_btn input{
        margin:0 9px;
    }
</style>
