<template>
  <div>
    <el-button type="primary" icon="el-icon-search"  @click="showSearchMore">打开搜索</el-button>
    <!--<input class="btn btn-default searchBtn" type="button" value="打开搜索">-->
    <search-more v-if="show_sm" @off_sm="offSearchMore" @submitOption="sub"></search-more>
    <div class="contTable">
      <el-table
        :data="feedList"
        border
        stripe
      >
        <el-table-column
          type="expand"
        >
          <template slot-scope="props">
            <el-form label-position="left" :inline="true" class="feedCont">
              <el-form-item label="投诉编号">
                <span>{{ props.row.complaintId }}</span>
              </el-form-item>
              <el-form-item label="处理状态">
                <!--<span>{{ props.row.complaintStatus }}</span>-->
                <span>{{props.row.complaintStatus === 0 ? '未处理':'已处理'}}</span>
              </el-form-item>
              <el-form-item label="订单编号">
                <span>{{ props.row.orderId }}</span>
              </el-form-item>
              <el-form-item label="投诉时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="乘客真实姓名">
                <span>{{ props.row.prealName }}</span>
              </el-form-item>
              <el-form-item label="司机真实姓名">
                <span>{{ props.row.drealName }}</span>
              </el-form-item>
              <el-form-item label="投诉内容">
                <span>{{ props.row.complaintContent }}</span>
              </el-form-item>
              <el-form-item label="处理方式内容">
                <span>{{ props.row.handleMode }}</span>
              </el-form-item>
              <el-form-item label="处理人">
                <span>{{ props.row.sysRealName }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="complaintId"
          label="投诉编号"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="投诉时间"
          sortable
          width="170"
        >
        </el-table-column>
        <el-table-column
          label="处理状态"
          width="110"
          prop="complaintStatus"
          :filters="[{ text: '未处理', value: 0 }, { text: '已处理', value: 1 }]"
          :filter-method="filterStatus"
          :formatter="showStatus"
        >
        </el-table-column>
        <el-table-column
          prop="sysRealName"
          label="处理人真实姓名"
          width="125"
          :formatter="worker"
        >
        </el-table-column>
        <el-table-column
          prop="handleMode"
          label="处理方案"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="handleTime"
          label="处理时间"
          sortable
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop = "pmobile"
          label="乘客手机号"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop = "dmobile"
          label="司机手机号"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="prealName"
          width="125"
          label="乘客真实姓名"
        >
        </el-table-column>
        <el-table-column
          prop="drealName"
          label="	司机真实姓名"
          width="125"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="120"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="answer(scope.row)" v-if="scope.row.complaintStatus === 0">标记处理</el-button>
          </template>
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
  import searchMore from '@/pages/complain2/searchMore.vue'
  export default {
    name:'complaints',
    components:{
      searchMore: searchMore
    },
    data:function () {
      return{
        currentPage:1,
        allPage:1,
        feedList:[],//投诉列表
        searchOptions:{},//储存搜索参数
        searchStatus:false,//判断是否在搜索状态中
        show_sm:false,//是否显示搜索面板
      }
    },
    created:function () {
      let params={
        pageSize:10,
        currentPage:1,
      }
      axios_post.post(urls.queryComplaint,params).then(res=>{
        let vm = this
        let code = res.data.code
//              console.log(code)
        if(code==='10000'){//suc
          vm.feedList = res.data.data.data
          for(let k of vm.feedList){
            k.createTime = vm.timeBasic(k.createTime)
            if (k.handleTime) {
              k.handleTime = vm.timeBasic(k.handleTime)
            }
          }
//                console.log(vm.feedList)
          vm.allPage = res.data.data.totalPage
        }else{
          layer.open({
            title:code,
            content:res.data.msg
          })
        }
      },err=>{
        vm.$message.error('请求投诉列表失败')
      })

    },
    mounted:function () {

    },
    methods:{
      //打开搜索
      showSearchMore:function () {
        this.show_sm = true
      },
      //关闭搜索
      offSearchMore: function () {
        this.show_sm = false
        this.searchStatus = false
      },
      //处理人显示--formatte
      worker:function (row,column) {
        return row.complaintStatus===1?row.sysRealName:'无'
      },
      //处理状态显示-- formatter
      showStatus:function (row) {
        return row.complaintStatus===0?'未处理':'已处理'
      },
      filterStatus(value, row) {
        return row.complaintStatus === value;
      },
      //点击回复
      answer:function (row) {
//            console.log(row)
        let vm = this
        vm.$prompt('请输入回复','处理投诉',{
          confirmButtonText: '提交回复',
          cancelButtonText: '取消',
        }).then(value=>{
//              console.log(value)
          let session = sessionStorage.getItem('admin/user')
          session = JSON.parse(session)
          let usr = session.sysUserId
          let params = {
            complaintId:row.complaintId,
            handleUser:usr,
            handleMode:value.value
          }
//              console.log(params)
          axios_post.post(urls.handleComplaint,params).then(res=>{
            let code = res.data.code
            if(code==='30012'){
              row.complaintStatus=1
              row.handleMode = params.handleMode
            } else {

            }
            vm.$message({
              type:'success',
              message:res.data.msg
            })
          }).catch(err=>{
            vm.$notify.error({
              title: '错误',
              message: err.message,
              duration: 0
            });
          })
        }).catch(()=>{
          vm.$message({
            type: 'info',
            message: '取消回复'
          })
        })
      },
      //高级搜索
      sub: function (opt) {
//                console.log(opt)
//                @param
//                    opt.opt 搜索参数
//                @param
//                    opt.cur 当前页数
        let vm = this
        this.searchOptions = opt.opt
        this.searchStatus = true
        let opt2 = opt.opt
        let option = {
          pageSize: 10,
          currentPage: opt.cur,
          ...opt2
        }
        axios_post.post(urls.queryComplaint,option).then((res)=>{
          let response = res.data.data
          vm.feedList = res.data.data.data
          for(let k of vm.feedList){
            k.createTime = vm.timeBasic(k.createTime)
            if (k.handleTime) {
              k.handleTime = vm.timeBasic(k.handleTime)
            }
          }
          vm.allPage = response.totalPage
          vm.currentPage = response.currentPage
        },(err)=>{
          console.log(err)
        }).finally(()=>{
          layer.close()
        })
      },
      //获取一页信息
      getDriverInfo: function () {
        let vm = this
        let params = {
          currentPage: this.currentPage,
          pageSize: 10,
        }
        axios_post.post(urls.queryComplaint,params).then((res)=>{
          let response = res.data.data
          vm.feedList = response.data
          for(let k of vm.feedList){
            k.createTime = vm.timeBasic(k.createTime)
            if (k.handleTime) {
              k.handleTime = vm.timeBasic(k.handleTime)
            }
          }
          vm.allPage = response.totalPage
//                    vm.currentPage = response.currentPage
        },(err)=>{
          layer.msg(err.message)
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
