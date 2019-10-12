<template>
    <div class="turn-page">
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
    </div>
</template>

<script>
    export default {
        name:'pageBean',
        props:['currentPage','allPage','searchType'],
        data:function () {
            return{

            }
        },
        methods:{
            jumpTo: function (e) {
                let num = e.target.innerText
                let vm = this
                num = parseInt(num)
                let data = {
                    type:vm.searchType,
                    cur:num
                }
                this.$emit('jump',data)
            },
            prev: function () {
                this.$emit('toPrev',this.searchType)
            },
            next:function () {
                this.$emit('toNext',this.searchType)
            }
//            next: function () {
//                let vm = this
//                if(this.currentPage < this.allPage) {
//                    this.currentPage ++
//                    if (vm.searchStatus) {
//                        let data = {
//                            opt:vm.searchOptions,
//                            cur:vm.currentPage
//                        }
//                        vm.sub(data)
//                    } else {
//                        if (vm.s_pRealName !== '' || vm.s_dRealName !== '') {
//                            vm.normalSearch(vm.currentPage)
//                        } else {
//                            vm.getDriverInfo()
//                        }
//                    }
//                } else {
//                    layer.msg('已经是最后一页啦')
//                }
//            },
        }
    }
</script>

<style scoped>
    .pgBtn{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>
