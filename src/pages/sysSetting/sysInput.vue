<template>
    <div class="box" v-if="needShow">
        <div class="input-group sysOption">
            <label>名称</label>
            <input type="text" class="form-control giftName" v-model="name1">
        </div>
        <div class="input-group sysOption">
            <label>值</label>
            <input type="text" class="form-control giftCount" v-model="value1">
        </div>
        <div class="inc_button" @click = "inclist">
            <img src="../../assets/img/inc.png" alt="">
        </div>
        <div  class="inc_button" @click="removeSelf">
            <img src="../../assets/img/uninc.png" alt="">
        </div>
    </div>
</template>

<script>
    import api_admin from '@/api/admin'
    export default {
        name: '',
        props:['name','value'],
        data() {
            return {
                giftList: [],
                count: 0,
                needShow: true
            }
        },
        created:function () {

        },
        methods: {
            inclist: function () {
                this.$emit('morelist')
            },
            removeSelf: function (){
                this.needShow = false
            }
        },
        computed:{
            name1:function () {
                return this.name
            },
            value1:function () {
                return this.value
            }
        }
    }
</script>

<style scoped>
    .flow-ul {
        max-height: 270px;
        overflow-y: scroll;
    }
    .box {
        padding: 0;
        display: flex;
        justify-content: space-between;
        margin:7px auto;
    }
    .giftName {
        display: block;
        width: 70%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        flex:2;
    }
    .giftCount {
        display: block;
        width: 70%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        flex:2;
    }
    .inc_button {
        width: 7%;
        margin-left: 9px;
    }
    .inc_button img {
        max-width: 35px;
        /*max-width: 100%;*/
    }
    .sysOption{
        display: flex;
        align-items: center;
    }
    .sysOption label {
        margin-right: 3px;
        margin-left: 3px;
    }
</style>
