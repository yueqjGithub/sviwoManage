<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="1" label="统计搜索">
        <search-mode @handleSearch="sub" @download="test"></search-mode>
      </el-tab-pane>
    </el-tabs>
    <el-table
      :data="dateList"
      border
      stripe
      v-loading="loading"
      height="80vmin"
    >
      <el-table-column
        prop="accountFlowId"
        label="补贴号"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="补贴时间"
      >
      </el-table-column>
      <el-table-column
        prop="area"
        label="地区"
      >
      </el-table-column>
      <el-table-column
        prop="subsidyObject"
        label="补贴对象"
      >
      </el-table-column>
      <el-table-column
        prop="subsidyName"
        label="补贴名称"
      >
      </el-table-column>
      <el-table-column
        prop="subsidyType"
        label="补贴类型"
      >
      </el-table-column>
      <el-table-column
        prop="accountAmount"
        label="补贴金额"
        sortable
      >
      </el-table-column>
    </el-table>
    <!--------------------------翻页----------------------->
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
  import searchMode from '@/pages/subsidy/searchMode.vue'

  export default {
    name: 'roi',
    components:{
      searchMode: searchMode
    },
    data(){
      return {
        activeName: '1',
        loading: false,
        showMode: 0,
        dateList:[],
        currentPage:1,
        allPage:1,
        searchOptions:{},//储存搜索参数
        searchStatus:false,//判断是否在搜索状态中
        //弹出层参数传递
        paramsOne: {},
      }
    },
    created(){
      let vm = this
      let params = {
        currentPage: 1,
        pageSize: 20
      }
      vm.loading = true
      axios_post.post(urls.getSubsidy,params).then(res=>{
        let code = res.data.code
        let response = res.data.data
        if (code === '10000') {
          vm.dateList = response.data
          vm.allPage = response.totalPage
        } else {
          vm.$message.error(res.data.msg)
        }
        vm.loading = false
      },err=>{
        vm.$message.error('获取补贴列表失败,请联系管理员')
      })
    },
    mounted(){

    },
    methods:{
      offDetail(){ //关闭弹出层
        this.showMode = 0
      },
      open1(k){//根据付款收入查看订单
        let vm = this
        if (k[0]==='0') {
          vm.$message.warning('当天该笔类型订单为零')
          return false
        }
        let str = k.join(',')
        vm.paramOne = str
        vm.showMode = 1
      },
      open2(k){
        let vm = this
        if (k[0] === '0') {
          vm.$message.warning('当天该类型补贴为零')
          return false
        }
        let str = k.join(',')
        vm.paramOne = str
        vm.showMode = 2
      },
      test:function (opt) {
        let vm = this
        let token = sessionStorage.getItem('token')
        let fm = new FormData()
        for (let it in opt) {
          fm.append(it,opt[it])
        }
        this.$axios.post(urls.exportSubsidyList,fm, {
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
          vm.$message.success('导出成功')
        }).catch(err=>{
          vm.$message.error('导出失败')
        })
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
          pageSize: 20,
          currentPage: opt.cur,
          ...opt2
        }
        axios_post.post(urls.getSubsidy,option).then(res=>{
          let code = res.data.code
          let response = res.data.data
          if (code === '10000') {
            vm.dateList = response.data
            vm.allPage = response.totalPage
            vm.currentPage = response.currentPage
          } else {
            vm.$message.error(res.data.msg)
          }
          vm.loading = false
        },err=>{
          vm.$message.error('获取补贴列表失败,请联系管理员')
        })
      },
      //获取一页信息
      getOnePage: function () {
        let vm = this
        let params = {
          currentPage: this.currentPage,
          pageSize: 20,
        }
        vm.loading = true
        axios_post.post(urls.getSubsidy,params).then(res=>{
          let code = res.data.code
          let response = res.data.data
          if (code === '10000') {
            vm.dateList = response.data
            vm.allPage = response.totalPage
            vm.currentPage = response.currentPage
          } else {
            vm.$message.error(res.data.msg)
          }
          vm.loading = false
        },err=>{
          vm.$message.error('获取补贴列表失败,请联系管理员')
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
          vm.getOnePage()
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
            vm.getOnePage()
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
            vm.getOnePage()
          }
        } else {
          layer.msg('已经是最后一页啦')
        }
      }
    }
  }
</script>

<style scoped>
  .eleTableSingle{
    display: flex;
    justify-content: space-between;
  }
</style>
