<template>
    <div class="detail2">
        <div class="row">
            <div class="col-md-12">
                <div class="table-responsive">
                    <table id="order_table" class="table table-striped table-bordered table-hover table-full-width">
                        <thead>
                            <tr>
                                <th>手机号</th>
                                <th>真实姓名</th>
                                <th>用户名</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="k in passengerList">
                                <th>{{k.userName}}</th>
                                <th>{{k.pasRealName}}</th>
                                <th>{{k.passengerName}}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'

    export default {
        name: 'pasList',
        props:['passengerId'],
        data:function () {
            return {
                passengerList:[]
            }
        },
        mounted:function () {
//            console.log(this.couponId)
            let vm = this
            let params = {
                "passengerId":vm.passengerId
            }
            axios_post.post(urls.queryRecipient,params).then((res)=>{
                vm.passengerList = res.data.data
            },(err)=>{
                layer.msg(err.message)
            })
        }
    }
</script>

<style scoped>

</style>
