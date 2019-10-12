<template>
    <div class="pop_detail">
      <el-table
        :data="tableList"
        border
        stripe
        v-loading="loading"
        height="59vh"
      >
        <el-table-column
          prop="accountFlowId"
          label="流水号"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          label="发生金额"
          sortable
        >
        </el-table-column>

        <el-table-column
          label="业务类型"
          width="140"
          prop="businessTypeId"
          :formatter="showOrigin"
        >
        </el-table-column>
        <el-table-column
          label="交易状态"
          width="110"
          prop="flowStatus"
          :formatter="showStatus"
        >
        </el-table-column>
        <el-table-column
          prop="flowDetail"
          label="流水说明"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop = "accountAmount"
          label="实际到账"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop = "remark"
          label="备注"
          width="140"
        >
        </el-table-column>
      </el-table>
      <div class="turn-page">
        <nav aria-label="Page navigation" class="pgBtn">
          <span>当前第{{currentPage}}/{{allPage}}</span>
          <span style="margin-right: 4px;">页</span>
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
        </nav>
      </div>
    </div>
</template>

<script>
import axios_post from '@/api/extendAxios.js'
import urls from '@/config/api.js'
export default {
    name: 'subSilyList',
    props: ['opt'],
    data(){
        return {
          tableList:[],
          loading: false,
          currentPage:1,
          allPage: 1
        }
    },
    mounted(){
      let vm = this
      let params = {
        accountFlowId: vm.opt,
        currentPage:1,
        pageSize: 20
      }
      vm.loading = true
      axios_post.post(urls.queryPlatformAccFlow,params).then(res=>{
        let code = res.data.code
        let response = res.data.data
        if (code === '10000') {
          vm.tableList = response.data
          vm.allPage = response.totalPage
        } else {
          vm.$message.error(res.data.msg)
        }
        vm.loading = false
      },err=>{
        vm.$message.error('获取补贴列表失败，请联系管理员')
        vm.loading = false
      })
    },
    methods:{
      //类型显示--formatte
      showOrigin:function (row) {
        switch (row.businessTypeId) {
          case 3011 :
            return '平台扣减优惠券补贴金额'
            break
          case 3012 :
            return '平台扣减优惠券补贴金额'
            break
          case 3013 :
            return '平台扣减优惠券补贴金额'
            break
        }
      },
      //状态显示-- formatter
      showStatus:function (row) {
//        return row.flowStatus===0?'未处理':'已处理'
        switch (row.flowStatus) {
          case -1:
            return '直接生效'
            break
          case 3:
            return '审核中'
            break
          case 4:
            return '转出中'
            break
          case 5:
            return '转出失败'
            break
          case 6:
            return '转出成功'
            break
        }
      },
      //获取一页信息
      getOnePage: function () {
        let vm = this
        let params = {
          currentPage: this.currentPage,
          pageSize: 20,
          accountFlowId: vm.opt
        }
        vm.loading = true
        axios_post.post(urls.exportPlatformAccFlow,params).then(res=>{
          let code = res.data.code
          let response = res.data.data
          if (code === '10000') {
            vm.tableList = response.data
            vm.allPage = response.totalPage
            vm.currentPage = response.currentPage
          } else {
            vm.$message.error(res.data.msg)
          }
          vm.loading = false
        },err=>{
          vm.$message.error('获取订单列表失败，请联系管理员')
          vm.loading = false
        })
      },
      //点击页码
      jumpTo: function (e) {
        let num = e.target.innerText
        let vm = this
        num = parseInt(num)
        this.currentPage = num
        vm.getOnePage()
      },
      //前一页
      prev: function () {
        let vm = this
        if(this.currentPage > 1){
          this.currentPage --
          vm.getOnePage()
        } else {
          layer.msg('前面没有了')
        }
      },
      //下一页
      next: function () {
        let vm = this
        if(this.currentPage < this.allPage) {
          this.currentPage ++
          vm.getOnePage()
        } else {
          layer.msg('已经是最后一页啦')
        }
      }
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
