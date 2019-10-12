<template>
    <div>
        <!----------------------------------------类型列表-->
        <!--搜索-->
        <div class="searchBox col-md-12">
            <div class = "input-group col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <label>参数名称</label>
                <input type="text" id="s_carID" placeholder="请输入参数名称" class="giftCount" v-model="s_typeName">
            </div>
            <input class="btn btn-default searchBtn" type="button" value="搜索" @click="normalSearch(1)">
            <input class="btn btn-default searchBtn" type="button" value="添加参数类型" @click="openTypePage('add')">
        </div>
        <!--搜索-->
        <div class="content1">
            <div class=".table-responsive">
                <table class="table table-bordered .table-hover .table-condensed">
                    <thead>
                        <tr>
                            <th>参数类型名称</th>
                            <th>参数类型说明</th>
                            <th>参数类型编码</th>
                            <th>
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="k in typeList">
                            <th>{{k.typeName}}</th>
                            <th>{{k.remark}}</th>
                            <th>{{k.code}}</th>
                            <th>
                                <input type="button" class="btn btn-primary btn-xs" value="修改" @click="openTypePage(k)">
                                <input type="button" class="btn btn-primary btn-xs" value="详情" @click="openMore(k)">
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--翻页组件----------------------->
            <nav aria-label="Page navigation" class="pgBtn">
                <span>当前第</span>
                <ul class="pagination">
                    <li>
                        <a href="#" aria-label="Previous" @click.prevent = 'prev'>
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li v-for="k in pageBean" :class="{'active':currentPage===k}">
                        <a href="#" @click.prevent = 'jumpTo($event)'>{{k}}</a>
                    </li>
                    <li>
                        <a href="#" aria-label="Next" @click.prevent = 'next'>
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
                <span>页</span>
            </nav>
            <!--翻页组件--------------------->
        </div>
        <!----------------------------------------类型列表-->
        <!----------------------------------------类型列表-->
        <div class="detail"  v-if="showDetail">
            <p @click = 'offDetail' class="offBtn">X</p>
            <add-type :dicType="dicType"></add-type>
        </div>
        <!----------------------------------------参数详细面板-->
        <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
            <div class="moreMod" v-if="showMore">
                <div class="toRight" @click="offMore">
                    <img src="../../assets/img/right.png" alt="">
                </div>
                <div class="right_info">
                    <detail :dicId="d_id"></detail>
                </div>
            </div>
        </transition >
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api.js'
    import addType from '@/pages/sysSetting/addType.vue'
    import detail from '@/pages/sysSetting/DetailList.vue'
    export default {
        name:'sysOption',
        components:{
            addType:addType,
            //Mingxi
            detail:detail
        },
        data:function () {
            return {
                allPage:1,
                currentPage:1,
                typeList:[],
                //搜索参数
                s_typeName:'',
                //显示添加修改类型
                showDetail:false,
                dicType:{},
                //显示详细
                showMore:false,
                d_id: ''
            }
        },
        created:function () {
            let vm = this
            let param = {
                pageSize:10,
                currentPage:1
            }
            axios_post.post(urls.getDicType,param).then((res)=>{
                let code = res.data.code
                if(code === '10000'){
                  let respons = res.data.data
                  vm.typeList =respons.data
                  vm.allPage = respons.totalPage
                }else{
                    layer.open({
                      title:code,
                      content:res.data.msg
                    })
                }

            },(err)=>{
                layer.msg(err.message)
            })
        },
        methods:{
            //打开详细页面
            openMore: function (k) {
                this.d_id=k.dicTypeId
                this.showMore = true
            },
            //关闭
            offMore:function () {
                this.showMore = false
            },
            //打开修改TYpe页面
            openTypePage: function (dicType) {
                this.dicType = dicType
                this.showDetail = true
            },
            //关闭
            offDetail:function () {
                this.showDetail=false
            },
            //搜索
            normalSearch: function (cur) {
                let vm = this
                if(vm.s_typeName === '') {
                    layer.msg('条件不能为空')
                    return false
                }
              let params = {
                  currentPage: cur,
                  pageSize: 10,
                  typeName: vm.s_typeName
              }
                axios_post.post(urls.getDicType,params).then((res)=>{
                    let respons = res.data.data
                    vm.typeList =respons.data
                    vm.allPage = respons.totalPage
                    vm.currentPage = response.currentPage
                },(err)=>{
                    layer.msg(err.message)
                })
            },
            // 获取一页信息
            getDriverInfo: function () {
                let vm = this
                let params = {
                    currentPage: this.currentPage,
                    pageSize: 10,
                }
                axios_post.post(urls.getDicType,params).then((res)=>{
                    let respons = res.data.data
                    vm.typeList =respons.data
                    vm.allPage = respons.totalPage
                },(err)=>{
                    layer.msg(err.message)
                })
            },
            jumpTo: function (e) {
                let num = e.target.innerText
                let vm = this
                num = parseInt(num)
                this.currentPage = num
                if (vm.s_typeName !== ''){
                    vm.normalSearch(vm.currentPage)
                }else {
                    vm.getDriverInfo()
                }
            },
            prev: function () {
                let vm = this
                if(this.currentPage > 1){
                    this.currentPage --
                    if (vm.s_typeName !== ''){
                        vm.normalSearch(vm.currentPage)
                    }else {
                        vm.getDriverInfo()
                    }
                } else {
                    layer.msg('前面没有了')
                }
            },
            next: function () {
                let vm = this
                if(this.currentPage < this.allPage) {
                    this.currentPage ++
                    if (vm.s_typeName !== ''){
                        vm.normalSearch(vm.currentPage)
                    }else {
                        vm.getDriverInfo()
                    }
                } else {
                    layer.msg('已经是最后一页啦')
                }
            }
        }
    }
</script>

<style scoped>
    .searchBox{
        display: flex;
        border-bottom: 1px dotted;
        padding-bottom: 20px;
        margin-bottom: 20px;
    }
    .giftCount {
        display: block;
        width: 100%;
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
    .searchBtn{
        height:50%;
        align-self: flex-end;
        margin:0 4px 0 4px;
    }
    .pgBtn{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .content1{
        /*width:48%;*/
    }
    th{
        font-weight:normal;
        font-size: 12px;
    }
    /*---------------------------*/
    .moreMod{
        width: 70vw;
        height: 70vh;
        position: fixed;
        right:0;
        top: 20vh;
        z-index: 1000;
        display: flex;
    }
    .toRight{
        width:7%;
        /*flex:1;*/
        background: #000;
        height: 4.9vw;
        border-radius: 15% 0 0 15%;
    }
    .toRight img {
        max-width:100%;
    }
    .right_info{
        flex:2;
        width:92%;
        border:2px solid black;
        background: #e7e7e7;
    }
</style>
