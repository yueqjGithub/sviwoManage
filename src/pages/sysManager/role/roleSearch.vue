<template>
    <div>
        <div class="col-md-12 search_more_box">
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>角色名</label>
                <input type="text" placeholder="角色名" class="search_input" v-model="roleName">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>创建人真实姓名</label>
                <input type="text" placeholder="创建人真实姓名" class="search_input" v-model="createRealName">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>修改人真实姓名</label>
                <input type="text" placeholder="修改人真实姓名" class="search_input" v-model="updateRealName">
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
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>修改开始时间</label>
                <input type="datetime-local" placeholder="修改开始时间" class="search_input" v-model="updateTimeStart">
            </div>
            <div class = "input-group col-md-5 col-lg-5 col-sm-5 col-xs-5">
                <label>修改结束时间</label>
                <input type="datetime-local" placeholder="修改结束时间" class="search_input" v-model="updateTimeEnd">
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
        name: 'roleSearch',
        data: function () {
            return {
                roleName:       '',
                createRealName: '',
                updateRealName: '',
                createTimeStart:'',
                createTimeEnd:  '',
                updateTimeStart:'',
                updateTimeEnd:  '',
            }
        },
        methods:{
            //清除搜索选项
            clearOption:function () {
                this.roleName        =''
                this.createRealName      =''
                this.updateRealName        =''
                this.createTimeStart      =''
                this.createTimeEnd             =''
                this.updateTimeStart           =''
                this.updateTimeEnd             =''
            },
            //查询参数
            searchOption:function () {
                let vm = this
                let opt = {
                    roleName:           vm.roleName,
                    createRealName:     vm.createRealName,
                    updateRealName:     vm.updateRealName,
                    createTimeStart:    vm.createTimeStart,
                    createTimeEnd:      vm.createTimeEnd,
                    updateTimeStart:    vm.updateTimeStart,
                    updateTimeEnd:      vm.updateTimeEnd,
                }
                return opt
            },
            //提交搜索参数
            search_More:function () {
                let opt = this.searchOption()

                // 转换为时间戳 getTime()
                if(opt.createTimeStart!==''){
                    opt.createTimeStart = this.timeExchange(opt.createTimeStart)
                }
                if(opt.createTimeEnd!==''){
                    opt.createTimeEnd = this.timeExchange(opt.createTimeEnd)
                }
                if(opt.updateTimeStart!==''){
                    opt.updateTimeStart = this.timeExchange(opt.updateTimeStart)
                }
                if(opt.updateTimeEnd!==''){
                    opt.updateTimeEnd = this.timeExchange(opt.updateTimeEnd)
                }

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
            },
            offSelf:function () {
                this.$emit('off_sm')
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
