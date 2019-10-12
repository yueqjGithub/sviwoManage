<template>
    <div class="redirectCont">
      您的登陆信息已过期，{{num}}秒后将会跳转到登陆页
    </div>
</template>

<script>
    export default {
        name:'redirect',
        data:function () {
          return {
              num:5
          }
        },
        created:function(){
            let vm = this
            setInterval(function () {
              if (vm.num >= 1) {
                vm.num --
              } else {
                vm.$router.push({name:'login'})
              }
            },1000)
        }
    }
</script>

<style scoped>
  .redirectCont{
    font-size: 2rem;
    text-align: center;
  }
</style>
