<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="搜索导出" name="1">
        <search-more @off_sm="offSearchMore" @submitOption="sub" @download="test"></search-more>
      </el-tab-pane>
    </el-tabs>
    <div class="contTable">
      <el-table
        :data="capitalList"
        border
        stripe
        v-loading="loading"
        height="80vmin"
      >
        <el-table-column
          prop="accountFlowId"
          label="流水号"
        >
        </el-table-column>
        <el-table-column
          prop="relationFlowId"
          label="关联流水号"
        >
        </el-table-column>
        <el-table-column
          prop="passengerId"
          label="乘客id"
        >
        </el-table-column>
        <el-table-column
          prop="userMobile"
          label="乘客手机号"
        >
        </el-table-column>
        <el-table-column
          prop="prealName"
          label="乘客真实姓名"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          label="发生金额"
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
          prop = "poundageAmount"
          label="手续费"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop = "accountAmount"
          label="实际到账"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop = "remark"
          label="备注"
          width="140"
        >
        </el-table-column>
      </el-table>
    </div>
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
  </div>
</template>

<script>
  import axios_post from '@/api/extendAxios.js'
  import urls from '@/config/api.js'
  import pasSearch from '@/pages/capital/pasSearch.vue'
  export default {
    name:'pasCapital',
    components:{
      searchMore: pasSearch
    },
    data:function () {
      return{
        loading: false,
        activeName:'1',
        currentPage:1,
        allPage:1,
        capitalList:[],//投诉列表
        searchOptions:{},//储存搜索参数
        searchStatus:false,//判断是否在搜索状态中
        show_sm:false,//是否显示搜索面板
      }
    },
    created:function () {
      let vm = this
      let params={
        pageSize:10,
        currentPage:1,
      }
      vm.loading = true
      axios_post.post(urls.queryPsgAccFlow,params).then(res=>{
        let code = res.data.code
//              console.log(code)
        if(code==='10000'){//suc
          vm.capitalList = res.data.data.data
          for(let k of vm.capitalList){
            k.createTime = vm.timeBasic(k.createTime)
          }
          vm.allPage = res.data.data.totalPage
          vm.loading = false
        }else{
          vm.$message.error(res.data.msg)
          vm.loading = false
        }
      },err=>{
        vm.$message.error('获取乘客流水失败，请与管理员联系')
        vm.loading=false
      })

    },
    mounted:function () {

    },
    methods:{
      //导出
      test:function (opt) {
        let vm = this
        let token = sessionStorage.getItem('token')
        let fm = new FormData()
        for (let it in opt) {
          fm.append(it,opt[it])
        }
        this.$axios.post(urls.exportPsgAccFlow,fm, {
          headers:{
//            'Accept': 'application/ms-excel',
            'Access-Control-Allow-Origin': '*',
            'Content-Type':'application/octet-stream;charset=UTF-8',
            token: token
          },
          responseType: 'blob'
        }).then(res => {
          let str = res.headers['content-disposition']
          let str1 = str.split('_')
          let str2 = str1[0].split('=')
          let fileName = decodeURIComponent(str2[1])
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+str1[1])
//
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }).catch(err=>{
          vm.$message.error('导出失败')
        })
      },
      //打开搜索
      showSearchMore:function () {
        this.show_sm = true
      },
      //关闭搜索
      offSearchMore: function () {
        this.show_sm = false
        this.searchStatus = false
      },

      //类型显示--formatte
      showOrigin:function (row) {
        switch (row.businessTypeId) {
          case 1000 :
            return '乘客付款'
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
      //类型筛选--filter-methods
      filterTag(value, row) {
        return row.businessTypeId === value;
      },
      filterStatus(value, row) {
        return row.flowStatus === value;
      },

      //高级搜索
      sub: function (opt) {
//                @param
//                    opt.opt 搜索参数
//                @param
//                    opt.cur 当前页数
        let vm = this
        vm.loading = true
        this.searchOptions = opt.opt
        this.searchStatus = true
        let opt2 = opt.opt
        let option = {
          pageSize: 10,
          currentPage: opt.cur,
          ...opt2
        }
        axios_post.post(urls.queryPsgAccFlow,option).then((res)=>{
          let response = res.data.data
          if(res.data.code === '10000'){
            vm.capitalList = res.data.data.data
            for(let k of vm.capitalList){
              k.createTime = vm.timeBasic(k.createTime)
            }
            vm.allPage = response.totalPage
            vm.currentPage = response.currentPage
            vm.loading = false
          } else {
            vm.$message({
              type:'error',
              message:res.data.msg
            })
            vm.loading = false
          }
        },(err)=>{
          vm.$message({
            type:'error',
            message:'获取乘客流水列表出错'
          })
          vm.loading = false
        })
      },
      //获取一页信息
      getDriverInfo: function () {
        let vm = this
        let params = {
          currentPage: this.currentPage,
          pageSize: 10,
        }
        vm.loading = true
        axios_post.post(urls.queryPsgAccFlow,params).then((res)=>{
          let response = res.data.data
          if(res.data.code === '10000'){
            vm.capitalList = res.data.data.data
            for(let k of vm.capitalList){
              k.createTime = vm.timeBasic(k.createTime)
            }
            vm.allPage = response.totalPage
            vm.currentPage = response.currentPage
            vm.loading = false
          } else {
            vm.$message({
              type:'error',
              message:'获取乘客流水列表出错'
            })
            vm.loading = false
          }
        },(err)=>{
          layer.msg(err.message)
          vm.loading = false
        })
      },
      //点击页码
      jumpTo: function (e) {
        let num = e.target.innerText
        let vm = this
        num = parseInt(num)
        this.currentPage = num
        if (vm.searchStatus) {
          let data = {
            opt:vm.searchOptions,
            cur:vm.currentPage
          }
          vm.sub(data)
        } else {
          vm.getDriverInfo()
        }
      },
      //前一页
      prev: function () {
        let vm = this
        if(this.currentPage > 1){
          this.currentPage --
          if (vm.searchStatus) {
            let data = {
              opt:vm.searchOptions,
              cur:vm.currentPage
            }
            vm.sub(data)
          } else {
            vm.getDriverInfo()
          }
        } else {
          layer.msg('前面没有了')
        }
      },
      //下一页
      next: function () {
        let vm = this
        if(this.currentPage < this.allPage) {
          this.currentPage ++
          if (vm.searchStatus) {
            let data = {
              opt:vm.searchOptions,
              cur:vm.currentPage
            }
            vm.sub(data)
          } else {
            vm.getDriverInfo()
          }
        } else {
          layer.msg('已经是最后一页啦')
        }
      },
    }
  }
</script>

<style scoped>
  .feedCont .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .pgBtn{
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .searchBtn{
    height:50%;
    align-self: flex-end;
    margin:0 4px 0 4px;
  }
  .contTable{
    margin-top: 7px;
  }
</style>
