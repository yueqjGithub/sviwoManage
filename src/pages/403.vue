<template>
  <div>
    <h1>401 您权限不足以进行此操作,请联系管理员</h1>
    <a href="javascript:void(0)" @click="goLogin" style="margin-left: 17px">返回</a>
  </div>
</template>

<script>
  import bus from '@/lib/bus'
  import {browser} from '@/events'

  export default {
    name: 'forbidden',
    created: function () {
      bus.$emit(browser.ChangeTitle,'403');
    },
    methods:{
      goLogin () {
        this.$router.push({path: '/login'})
      }
    }
  }
</script>

<style scoped>
  h1{
    color: #000000;
    text-align: center;
  }
</style>
