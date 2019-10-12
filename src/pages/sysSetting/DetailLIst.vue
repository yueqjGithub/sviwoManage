<template>
    <div>
        <h1 class="page-header">参数明细</h1>
        <div class="detail_main">
            <div style="margin-bottom: 7px;">
                <router-link :to="{path:'/addSysDetail',query:{'dicTypeId':dicId,'obj':null}}">
                    <input type="button" value="添加参数明细" class="btn btn-primary">
                </router-link>
            </div>
            <div class=".table-responsive">
                <table class="table table-striped table-bordered table-hover table-full-width">
                    <thead>
                        <tr>
                            <!--<th>主键id</th>-->
                            <th>参数明细内容</th>
                            <th>参数明细说明</th>
                            <th>参数明细值</th>
                            <th>参数明细编码</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="k in detailList">
                            <!--<th>-->
                                <!--{{k.dicDetailId}}-->
                            <!--</th>-->
                            <th>
                                {{k.detailText}}
                            </th>
                            <th>
                                {{k.remark}}
                            </th>
                            <th>
                                {{k.dicDetailValue}}
                            </th>
                            <th>
                              {{k.code}}
                            </th>
                            <th>
                                <router-link :to="{path:'/addSysDetail',query:{'dicTypeId':dicId,'obj':k}}">
                                    <input type="button" class="btn btn-primary btn-xs" value="修改">
                                </router-link>
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
    </div>
</template>

<script>
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api.js'
    export default {
        name:'detailList',
        props:['dicId'],
        data:function(){
            return {
                allPage:1,
                currentPage:1,
                detailList:[]
            }
        },
        mounted:function () {
            let params = {
                "pageSize":5,
                "currentPage":1,
                "dicTypeId":this.dicId
            }
            axios_post.post(urls.getDicDetail,params).then((res)=>{
                let response = res.data.data
                this.detailList = response.data
                this.allPage = response.totalPage
            },err=>{
                layer.open({
                  title:'出错啦',
                  content:err.message
                })
            })
        },
        methods:{
            getDriverInfo: function () {
                let params = {
                    "pageSize":5,
                    "currentPage":this.currentPage,
                    "dicTypeId":this.dicId
                }
                axios_post.post(urls.getDicDetail,params).then((res)=>{
                    let response = res.data.data
                    this.detailList = response.data
                    this.allPage = response.totalPage
                },err=>{
                    layer.open({
                      title:'出错啦',
                      content:err.message
                    })
                })
            },
            jumpTo: function (e) {
                let num = e.target.innerText
                let vm = this
                num = parseInt(num)
                this.currentPage = num
                vm.getDriverInfo()
            },
            prev: function () {
                let vm = this
                if(this.currentPage > 1){
                    this.currentPage --
                    vm.getDriverInfo()
                } else {
                    layer.msg('前面没有了')
                }
            },
            next: function () {
                let vm = this
                if(this.currentPage < this.allPage) {
                    this.currentPage ++
                    vm.getDriverInfo()
                } else {
                    layer.msg('已经是最后一页啦')
                }
            }
        }
    }
</script>

<style scoped>
.detail_main{
    width:100%;
    height:100%;
}
.pgBtn{
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>
