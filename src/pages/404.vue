<template>
    <div>
        <h1>404 Not Found</h1>
        <a href="javascript:void(0)" @click="goLogin">返回</a>
    </div>
</template>

<script>
    import bus from '@/lib/bus'
    import {browser} from '@/events'

    export default {
        name: 'notFound',
        created: function () {
            bus.$emit(browser.ChangeTitle,'404 Not Found');
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
