<template>
    <div>
        <div class="col-md-12 search_more_box">
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>乘客昵称</label>
                <input type="text" placeholder="乘客昵称" class="search_input" v-model="s_passengerName">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>证件类型</label>
                <select name="" class="search_input" v-model="s_certificateType" autocomplete="off">
                    <option value='' disabled selected style='display:none;'>请选择</option>
                    <option value="1" selected="selected">身份证</option>
                </select>
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>证件号</label>
                <input type="text" placeholder="证件号" class="search_input" v-model="s_certificateNo">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>账号状态</label>
                <!--<input type="text" placeholder="认证状态" class="search_input" v-model="s_driverStatus">-->
                <select name="" class="search_input" v-model="s_passengerStatus">
                    <option value='' disabled selected style='display:none;'>请选择</option>
                    <option value="0" selected>冻结</option>
                    <option value="1">正常</option>
                </select>
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>真实名称</label>
                <input type="text" placeholder="真实名称" class="search_input" v-model="s_realName">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>注册IP地址</label>
                <input type="text" placeholder="注册IP地址" class="search_input" v-model="s_registerIp">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>app用户名</label>
                <input type="text" placeholder="app用户名" class="search_input" v-model="s_userName">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>注册来源</label>
                <!--<input type="text" placeholder="司机类型" class="search_input" v-model="s_driverType">-->
                <select name="" class="search_input" v-model="s_registerOrigin">
                    <option value='' disabled selected style='display:none;'>请选择</option>
                    <option value="1">IOS</option>
                    <option value="2">Android</option>
                </select>
            </div>
            <p class="col-md-12 col-lg-12 col-sm-12 col-xs-12"></p>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>创建开始时间</label>
                <input type="datetime-local" placeholder="创建开始时间" class="search_input" v-model="s_createTimeStart">
            </div>
            <div class = "input-group col-md-12 col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>创建结束时间</label>
                <input type="datetime-local" placeholder="创建结束时间" class="search_input" v-model="s_createTimeEnd">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5" v-show="1===2">
                <label>创建结束时间</label>
                <input type="datetime-local" placeholder="创建结束时间" class="search_input">
            </div>
            <div class="btnGroup col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <input class="btn btn-default searchBtn" type="button" value="高级搜索" @click="search_More">
                <input class="btn btn-default searchBtn" type="button" value="重置" @click="clearOption">
                <input class="btn btn-default searchBtn" type="button" value="关闭" @click = 'offSelf'>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'searchMore',
        data: function () {
            return {
                s_passengerName: '',
                s_certificateType: '',
                s_certificateNo: '',
                // 账号状态
                s_passengerStatus: '',
                // 真实名称
                s_realName: '',
                // 注册IP
                s_registerIp: '',
                // 用户名
                s_userName: '',
//                注册来源 1 IOS 2安卓
                s_registerOrigin: '',
                s_createTimeStart: '',
                s_createTimeEnd: ''
            }
        },
        methods: {
            clearOption:function () {
                this.s_passengerName        =''
                this.s_certificateType      =''
                this.s_certificateNo        =''
                this.s_passengerStatus      =''
                this.s_realName             =''
                this.s_registerIp           =''
                this.s_userName             =''
                this.s_registerOrigin       =''
                this.s_createTimeStart      =''
                this.s_createTimeEnd        =''
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
                let opts = {
                    "passengerName": this.s_passengerName,     // 司机昵称
                    "certificateType": this.s_certificateType,      //证件类型 1身份证
                    "certificateNo": this.s_certificateNo,   // 证件号
                    "passengerStatus": this.s_passengerStatus,     //乘客状态 乘客状态 0 冻结  1正常
                    "realName": this.s_realName,     //真实名称
                    "registerIp": this.s_registerIp,     //注册ip地址
                    "userName": this.s_userName, //app用户名
                    "registerOrigin": this.s_registerOrigin,		//注册来源1: ios2: 安卓
                    "createTimeStart": this.s_createTimeStart,   //创建开始时间
                    "createTimeEnd": this.s_createTimeEnd     //创建结束时间
                }
                return opts
            },
            //高级查询
            search_More: function () {
                let opt = this.searchOption()
                // 审核状态，证件类型转换INT
                if(opt.certificateType !== '') {
                    opt.certificateType = parseInt(opt.certificateType)
                }
                if(opt.passengerStatus !== '') {
                    opt.passengerStatus = parseInt(opt.passengerStatus)
                }
                if(opt.registerOrigin !== '') {
                    opt.registerOrigin = parseInt(opt.registerOrigin)
                }
//                身份证号验证
                if (opt.certificateNo !== '') {
                    let reg1 = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                    if(reg1.test(opt.certificateNo) === false) {
                        layer.msg("身份证输入不合法");
                        return false;
                    }
                }

                // IP地址验证
                if (opt.registerIp !== '') {
                    let reg_ip = /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/g;
                    if(!reg_ip.test(opt.registerIp)) {
                        layer.msg('输入的IP地址无效');
                        return false
                    }
                }

                // 转换为时间戳 getTime()
                if (opt.createTimeStart !== '') {
                    opt.createTimeStart = this.timeExchange(opt.createTimeStart)
                }
                if (opt.createTimeEnd !== '') {
                    opt.createTimeEnd = this.timeExchange(opt.createTimeEnd)
                }
//                console.log(opt)
                let opt1 = {}
                for (let k in opt){
                    if(opt[k] !== '') {
                        opt1[k] = opt[k]
                    }
                }
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
