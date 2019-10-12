<template>
    <div class="detail2">
        <ul class="detail_ul">
            <li>
                真实姓名: <span>{{info.realName}}</span>
            </li>
            <!--<li>-->
                <!--用户ID: {{info.passengerId}}-->
            <!--</li>-->
            <li>
                用户昵称: {{info.passengerName}}
            </li>
            <!--<li>-->
                <!--名: {{info.firstName}}-->
            <!--</li>-->
            <!--<li>-->
                <!--姓: {{info.lastName}}-->
            <!--</li>-->
            <li>
                头像: <img :src="imgSrc+info.headImage" alt="" v-if="info.headImage !== null">
                <img src="../../assets/img/default_headImg.png" alt="" v-else>
            </li>
            <li>
                用户名:{{info.userName}}
            </li>
            <li>
                证件类型:
                <span v-if="info.certificateNo === 1">身份证</span>
            </li>
            <li>
                证件号:{{info.certificateNo}}
            </li>
            <li>
                证件照片:
                <img :src="imgSrc+k" alt="" v-if="info.certificateImage !== null" v-for="k in info.certificateImage">
                <img src="../../assets/img/img_notloaded.png" alt="" v-else>
            </li>
            <li>
                账号状态:
                <span v-if="info.passengerStatus === 0">冻结</span>
                <span v-if="info.passengerStatus === 1">正常</span>
            </li>
            <li>
                注册ip:{{info.registerIp}}
            </li>
            <li>
                创建时间:{{info.createTime}}
            </li>
            <li>
                客户端:
                <span v-if="info.registerOrigin === 1">IOS</span>
                <span v-if="info.registerOrigin === 2">Android</span>
            </li>
            <li v-if="info.passengerStatus === 0">
                冻结时间:{{info.freezingTime}}
            </li>
            <li v-if="info.passengerStatus === 0">
                解冻时间:{{info.freezingExpireTime}}
            </li>
        </ul>
        <!--冻结账号按钮&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
        <ul class="freezingBtn" v-if="info.passengerStatus===1">
            <li>
                <input type="button" value="冻结账号" @click="frezz">
            </li>
            <li>
                <label>冻结到</label>
                <input type="date" v-model="frezTime">
            </li>
        </ul>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api.js'
    export default {
        name: 'driverDetail',
        data: function () {
            return {
                imgSrc:urls.imgOrigin,
                // 冻结时间戳
                frezTime: ''
            }
        },
        methods:{
            //转换为时间戳
            timeExchange: function (time) {
                let date = time.split('T')
                let date1 = date.join(" ")
                date1 = date1.replace(/-/g,'/')
                date1 = new Date(date1)
                let date2 = date1.getTime()
                return date2
            },
            // 冻结
            frezz: function () {
                let time = this.timeExchange(this.frezTime)
                let vm = this
                if (isNaN(time)) {
                    layer.msg('请输入完整的时间')
                    return false
                }
                let params = {
                    'passengerId': this.info.passengerId,
                    'freezingExpireTime': time
                }
                let index = layer.confirm('确定要冻结该乘客吗',{icon:7,title:'警告'},function () {
                    axios_post.post(urls.frozenPassenger,params).then((res)=>{
                        if(res.data.code === '30002'){
                            //冻结成功
                            layer.open({
                                title:res.data.code,
                                content:res.data.msg,
                                end:function () {
                                    vm.$emit('changeStatus')
                                    vm.$router.go(0)
                                }
                            })
                        } else{
                            //冻结失败
                            layer.open({
                                title:res.data.code,
                                content:res.data.msg
                            })
                        }
                    },(err)=>{
                        layer.open({
                            title:'出错啦',
                            content:err.message
                        })
                    })
                    layer.close(index)
                },function () {
                    layer.close(index)
                })
            }
        },
        props:['info']
    }
</script>

<style scoped>
    .detail2{
        display: flex;
        padding: 5px 0;
    }
    .detail_ul{
        width:48%;
    }
    .detail_ul li {
        margin: 5px auto;
        padding-left: 15px;
        display: flex;
    }
    .detail_ul li img {
        min-width: 150px;
        min-height: 150px;
    }
    .r_name {
        display: flex;
        align-items: center;
    }
    .r_name span {
        font-size:22px;
    }
</style>
