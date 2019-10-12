<template>
    <div>
        <h1 class="page-header">添加或修改参数明细值</h1>
        <div class="input-group col-md-5 col-lg-5 col-sm-12 col-xs-12 addInput" v-if="!isUpdate">
          <label class="fLabel">参数明细编码</label>
          <input type="text" class="form-control" v-model="code">
        </div>
        <div class="input-group col-md-5 col-lg-5 col-sm-12 col-xs-12 addInput">
            <label class="fLabel">参数明细内容</label>
            <input type="text" class="form-control" v-model="detailText">
        </div>
        <div class="input-group col-md-5 col-lg-5 col-sm-12 col-xs-12  addInput">
            <label class="fLabel">参数明细值</label>
            <div class="box" v-for="k in listCount">
                <div class="input-group sysOption">
                    <label>名称</label>
                    <input type="text" class="form-control giftName" v-model="nameArr[k-1]">
                </div>
                <div class="input-group sysOption">
                    <label>值</label>
                    <input type="text" class="form-control giftCount" v-model="valueArr[k-1]">
                </div>
                <div class="inc_button" @click = "incList">
                    <img src="../../assets/img/inc.png" alt="">
                </div>
                <div  class="inc_button" @click="removeSelf">
                    <img src="../../assets/img/uninc.png" alt="">
                </div>
            </div>
        </div>
        <div class="input-group col-md-5 col-lg-5 col-sm-12 col-xs-12  addInput">
            <label class="fLabel">备注</label>
            <input type="text" class="form-control" v-model="remark">
        </div>
        <div class="input-group col-md-4 col-lg-3 col-sm-12 col-xs-12 sub_div">
            <input class="btn btn-primary" type="button" value="提交" @click="subMsg" style="margin-right: 8px;">
            <router-link to="/sysOption">
                <input type="button" class="btn btn-primary" value="返回">
            </router-link>
        </div>
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api.js'

    export default {
        name:'addSysDetail',
        data:function(){
            return {
                listCount:1,
                dicDetailId:null,         //参数明细主键id
                detailText: '',         //参数明细内容
                remark:'',         //备注
//                "dicDetailValue": "5",         //参数明细值
                dicTypeId:null,        //参数类型ID
                nameArr:[],
                valueArr:[],
//                新加code
                code:'',
                isUpdate:false
            }
        },
        mounted:function () {
            let vm = this
            let query = this.$route.query
            vm.dicTypeId = query.dicTypeId
//            console.log(query)
            if(query.obj !== null){
                vm.isUpdate = true
                vm.listCount = 0
                vm.detailText = query.obj.detailText
                vm.remark = query.obj.remark
                vm.dicDetailId = query.obj.dicDetailId
                vm.code = query.obj.code
                let keyValue = JSON.parse(query.obj.dicDetailValue)
                for(let k in keyValue){
                    vm.listCount ++
                    vm.nameArr.push(k)
                    vm.valueArr.push(keyValue[k])
                }
            }
        },
        methods:{
            //new
            incList:function () {
              this.listCount++
            },
            removeSelf:function () {
              this.listCount--
            },
            moreList: function () {
                this.listCount +=1
            },
            //提交
            subMsg:function () {
                let vm = this
                let opt = {}
                let len = $('.box').length
                for (let i=0;i<len;i++){
                    let name=$('.box').eq(i).find('.giftName').val()
                    let value=$('.box').eq(i).find('.giftCount').val()
                    opt[name]=value
                }
                opt = JSON.stringify(opt)
                let params={
                    "detailText": vm.detailText,         //参数明细内容
                    "remark": vm.remark,         //备注
                    "dicDetailValue": opt,         //参数明细值
                    "dicTypeId": vm.dicTypeId,         //参数类型ID
//                    "code":vm.code
                }
                if(vm.$route.query.obj !==null){
                    params['dicDetailId']=vm.dicDetailId
                }else {
                    params['code']=vm.code
                }
                axios_post.post(urls.addOrUpdateDicDetail,params).then(res=>{
                    layer.msg(res.data.msg)
                    let timeOut = setTimeout(function () {
                        vm.$router.push({path:'/sysOption'})
                    },2000)

                },err=>{
                    layer.msg(err.message)
                })
            }
        }
    }
</script>

<style scoped>
.addInput{
    margin-top: 9px;
}
    .fLabel{
        font-size: 24px;
    }
    .sub_div{
        margin: 8px;
    }
    /*--------------------new------------*/
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
    max-width: 100%;
}
.sysOption{
    display: flex;
    align-items: center;
}
.sysOption label {
    margin-right: 3px;
    margin-left: 3px;
}
    /*--------------------new------------*/

</style>
