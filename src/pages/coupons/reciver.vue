<template>
    <div>
        <div class="recive" v-if="needShow">
            <input type="tel" :class="{'redInput':isFail}" class="form-control rc_input" v-model.lazy.trim="tel" placeholder="请输入接收者用户名" @change="getId">
            <div class="inc_button" @click = "addSelf">
                <img src="../../assets/img/inc.png" alt="">
            </div>
            <div  class="inc_button remove_btn" @click="removeSelf">
                <img src="../../assets/img/uninc.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'

    export default {
        name: 'reciver',
        props:['count'],
        data: function () {
          return{
              needShow: true,
              tel:'',
              isFail:false,
          }
        },
        methods:{
            addSelf: function () {
                this.$emit('inc')
            },
            removeSelf: function (){
                this.needShow = false
            },
            //通过手机号获取ID
            getId:function () {
                let vm = this
               let params = {
                   appUserName:vm.tel
               }
               axios_post.post(urls.getPassengerIdByAppUserName,params).then(res=>{
                   if(res.data.code === '10000'){
                        vm.$emit('recId',res.data.data)
                       vm.isFail = false
                   } else {
                       vm.$message.error(res.data.msg);
                       vm.isFail = true
                   }
               },err=>{
                   layer.open({
                       title:'出错啦',
                       content:err.message
                   })
               })
            }
        },
        mounted:function () {
            $('.remove_btn').eq(0).css('visibility','hidden')
        }
    }
</script>

<style scoped>
.recive{
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}
.inc_button{
    width:9%;
    margin:0 5px;
}
.inc_button img{
    max-width: 100%;
}
.rc_input{
    width: 70%;
}
    .redInput{
        border-color: red;
    }
</style>
