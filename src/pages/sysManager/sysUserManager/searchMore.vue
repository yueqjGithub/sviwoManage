<template>
    <div>
        <div class="col-md-12 search_more_box">
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>手机号码</label>
                <input type="tel" placeholder="手机号码" class="search_input" v-model="mobile">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>真实名称</label>
                <input type="text" placeholder="真实名称" class="search_input" v-model="realName">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>用户状态</label>
                <select name="" class="search_input" v-model="enabled">
                    <option value='' disabled selected style='display:none;'>请选择</option>
                    <option value="false">禁用</option>
                    <option value="true">启用</option>
                </select>
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>创建人</label>
                <input type="text" placeholder="创建人" class="search_input" v-model="createUser">
            </div>
            <p class="col-md-12 col-lg-12 col-sm-12 col-xs-12"></p>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>修改时间</label>
                <input type="datetime-local" placeholder="修改时间" class="search_input" v-model="updateTime">
            </div>
            <p class="col-md-12 col-lg-12 col-sm-12 col-xs-12"></p>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>创建开始时间</label>
                <input type="datetime-local" placeholder="创建开始时间" class="search_input" v-model="createTimeStart">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>创建结束时间</label>
                <input type="datetime-local" placeholder="创建结束时间" class="search_input" v-model="createTimeEnd">
            </div>
            <!--<div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">-->
                <!--<label>修改开始时间</label>-->
                <!--<input type="datetime-local" placeholder="修改开始时间" class="search_input" v-model="updateTimeStart">-->
            <!--</div>-->
            <!--<div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">-->
                <!--<label>修改结束时间</label>-->
                <!--<input type="datetime-local" placeholder="修改结束时间" class="search_input" v-model="updateTimeEnd">-->
            <!--</div>-->

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
                mobile:'',
                realName:'',
                enabled:'',
                createUser:'',
                updateTime:'',
                departName:'',
                createTimeStart:'',
                createTimeEnd:'',
//                updateTimeStart:'',
//                updateTimeEnd:'',
            }
        },
        methods: {
            clearOption:function () {
                this.mobile        =''
                this.realName      =''
                this.enabled        =''
                this.createUser      =''
                this.updateTime             =''
                this.departName           =''
                this.createTimeStart             =''
                this.createTimeEnd       =''
//                this.updateTimeStart       =''
//                this.updateTimeEnd       =''
            },
            // 关闭高级搜索面板
            offSelf: function () {
                this.$emit('off_sm')
            },
            //查询参数
            searchOption: function () {
                let vm = this
                let opts = {
                    mobile:             vm.mobile,
                    realName:           vm.realName,
                    enabled:            vm.enabled,
                    createUser:         vm.createUser,
                    updateTime:         vm.updateTime,
                    departName:         vm.departName,
                    createTimeStart:    vm.createTimeStart,
                    createTimeEnd:      vm.createTimeEnd,
//                    updateTimeStart:    vm.updateTimeStart,
//                    updateTimeEnd:      vm.updateTimeEnd,
                }
                return opts
            },
            //高级查询
            search_More: function () {
                let opt = this.searchOption()
                // 转换为int
                if(opt.enabled!==''){
                    opt.enabled = opt.enabled
                }


                // 转换为时间戳 getTime()
                if(opt.updateTime!==''){
                    opt.updateTime = this.timeExchange(opt.updateTime)
                }
                if(opt.createTimeStart!==''){
                    opt.createTimeStart = this.timeExchange(opt.createTimeStart)
                }
                if(opt.createTimeEnd!==''){
                    opt.createTimeEnd = this.timeExchange(opt.createTimeEnd)
                }
//                if(opt.updateTimeStart!==''){
//                    opt.updateTimeStart = this.timeExchange(opt.updateTimeStart)
//                }
//                if(opt.updateTimeEnd!==''){
//                    opt.updateTimeEnd = this.timeExchange(opt.updateTimeEnd)
//                }

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
        float: none;
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
