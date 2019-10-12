<template>
    <div>
        <div class="col-md-12 search_more_box">
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>使用开始时间</label>
                <input type="datetime-local" placeholder="使用开始时间" class="search_input" v-model="applyTimeStart">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>使用结束时间</label>
                <input type="datetime-local" placeholder="使用结束时间" class="search_input" v-model="applyTimeEnd">
            </div>
            <p class="col-md-12 col-lg-12 col-sm-12 col-xs-12"></p>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>优惠券类型</label>
                <select name="" class="search_input" v-model="couponType" autocomplete="off">
                    <option value='' disabled selected style='display:none;'>请选择</option>
                    <option value="1" selected="selected">满减券</option>
                    <option value="2" selected="selected">折扣券</option>
                </select>
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>发放人姓名</label>
                <input type="text" placeholder="发放人姓名" class="search_input" v-model="grantUserRealName">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>乘客姓名</label>
                <input type="text" placeholder="乘客姓名" class="search_input" v-model="pasRealName">
            </div>
            <!--<div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">-->
                <!--<label>模板状态</label>-->
                <!--<select name="" class="search_input" v-model="couponStatus" autocomplete="off">-->
                    <!--<option value='' disabled selected style='display:none;'>请选择</option>-->
                    <!--<option value="0" selected="selected">停用</option>-->
                    <!--<option value="1" selected="selected">正常</option>-->
                <!--</select>-->
            <!--</div>-->
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>使用状态</label>
                <select name="" class="search_input" v-model="applyStatus" autocomplete="off">
                    <option value='' disabled selected style='display:none;'>请选择</option>
                    <option value="0" selected="selected">未使用</option>
                    <option value="1" selected="selected">已使用</option>
                    <option value="2" selected="selected">撤销</option>
                </select>
            </div>

            <div class="btnGroup col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <input class="btn btn-default searchBtn" type="button" value="搜索" @click="search_More">
                <input class="btn btn-default searchBtn" type="button" value="重置" @click="clearOption">
                <input class="btn btn-default searchBtn" type="button" value="关闭" @click = 'offSelf'>
            </div>
        </div>
    </div>
</template>

<script>
    import serachOption from '@/model/searchOption.js'
    export default {
        name: 'searchGrant',
        data: function () {
            return {
                applyTimeStart:'',
                applyTimeEnd:'',
                couponType:'',
                grantUserRealName:'',
                pasRealName:'',
//                couponStatus:'',
                applyStatus:'',
            }
        },
        methods: {
            //清除搜索选项
            clearOption:function () {
                this.applyTimeStart        =''
                this.applyTimeEnd      =''
                this.couponType        =''
                this.grantUserRealName      =''
                this.pasRealName             =''
//                this.couponStatus           =''
                this.applyStatus             =''
            },
            // 时间转换时间戳
            timeExchange: function (time) {
                let date = time.split('T')
                let date1 = date.join(" ")
                date1 = date1.replace(/-/g,'/')
                date1 = new Date(date1)
                let date2 = date1.getTime()
                return date2
            },
            // 关闭高级搜索面板
            offSelf: function () {
                this.$emit('off_sm')
            },
            //查询参数
            searchOption: function () {
                let vm = this
                let opts = {
                    "applyTimeStart": vm.applyTimeStart,        //使用开始时间
                    "applyTimeEnd": vm.applyTimeEnd,        //使用结束时间
                    "couponType": vm.couponType,         //优惠券类型: 1 满减券   2 折扣券
                    "grantUserRealName": vm.grantUserRealName,           //发放人真实姓名
                    "pasRealName": vm.pasRealName,       //乘客真实姓名
//                    "couponStatus": vm.couponStatus,       //优惠券模版状态: 0:停用  1:正常
                    "applyStatus": vm.applyStatus,
                }
                return opts
            },
            //高级查询
            search_More: function () {
                let opt = this.searchOption()
                // 审核状态，证件类型转换为int
                if(opt.couponType!==''){
                    opt.couponType = parseInt(opt.couponType)
                }
//                if(opt.couponStatus!==''){
//                    opt.couponStatus = parseInt(opt.couponStatus)
//                }
                if(opt.applyStatus!==''){
                    opt.applyStatus = parseInt(opt.applyStatus)
                }

                // 转换为时间戳 getTime()
                if(opt.applyTimeStart!==''){
                    opt.applyTimeStart = this.timeExchange(opt.applyTimeStart)
                }
                if(opt.applyTimeEnd!==''){
                    opt.applyTimeEnd = this.timeExchange(opt.applyTimeEnd)
                }
//                console.log(opt)
                let opt1 = {}
                for (let k in opt){
                    if(opt[k] !== '') {
                        opt1[k] = opt[k]
                    }
                }
//                console.log(opt1)
                let data = {
                    opt:opt1,
                    cur:1
                }
                this.$emit('submitOption',data)
            }
        }
    }
</script>

<style scoped>
    .search_input {
        display: block;
        width: 80%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .search_more_box{
        display: flex;
        border-bottom: 1px dotted;
        padding-bottom: 20px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }
    .searchBtn{
        margin:0 4px;
    }
    .btnGroup{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding:12px 0;
    }
</style>
