<template>
  <div>
    <input class="btn btn-default searchBtn" type="button" value="打开搜索" @click="showSearchMore">
    <search-more v-if="show_sm" @off_sm="offSearchMore" @submitOption="sub"></search-more>
    <div class="contTable">
      <el-table
        :data="alarmList"
        border
        stripe
      >
        <el-table-column
          type="expand"
        >
          <template slot-scope="props">
            <el-form label-position="left" inline class="feedCont">
              <el-form-item label="乘客真实姓名">
                <span>{{ props.row.prealName }}</span>
              </el-form-item>
              <el-form-item label="司机真实姓名">
                <span>{{ props.row.drealName }}</span>
              </el-form-item>
              <el-form-item label="乘客手机号">
                <span>{{ props.row.pmobile }}</span>
              </el-form-item>
              <el-form-item label="	司机手机号">
                <span>{{ props.row.dmobile }}</span>
              </el-form-item>
              <el-form-item label="报警时间">
                <span>{{ props.row.alarmTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="alarmId"
          label="报警编号"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="alarmTime"
          label="报警时间"
          sortable
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="manageTime"
          label="处理时间"
          sortable
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="alarmFrequency"
          label="报警次数"
          sortable
          width="170"
        >
        </el-table-column>
        <el-table-column
          label="处理状态"
          width="104"
          prop="alarmStatus"
          :filters="[{ text: '未处理', value: 0 }, { text: '已处理', value: 1 }]"
          :filter-method="filterTag"
          :formatter="showOrigin"
        >
        </el-table-column>
        <el-table-column
          prop="pmobile"
          label="乘客手机号"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="prealName"
          label="	乘客真实姓名"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="dmobile"
          width="170"
          label="司机手机号"
        >
        </el-table-column>
        <el-table-column
          prop = "drealName"
          label="司机真实姓名"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop = "mrealName"
          label="报警处理人"
          width="170"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="220"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="answer(scope.row)" v-if="scope.row.alarmStatus===0">标记处理</el-button>
            <el-button type="primary" size="mini" @click="checkOrder(scope.row)">查看订单</el-button>
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
    <div class="popModule" v-if="show_detail">
      <div class="closePop" @click = 'offDetail'></div>
      <div class="cutLine"></div>
      <order-detail :info="orderInfo"></order-detail>
    </div>
  </div>
</template>

<script>
  import axios_post from '@/api/extendAxios.js'
  import urls from '@/config/api.js'
  import searchMore from '@/pages/callPolice/searchMore.vue'
  import orderDetail from '@/pages/callPolice/order_detail.vue'
  export default {
    name:'callPolice',
    components:{
      searchMore: searchMore,
      orderDetail:orderDetail
    },
    data:function () {
      return{
        currentPage:1,
        allPage:1,
        alarmList:[],//报警列表
        searchOptions:{},//储存搜索参数
        searchStatus:false,//判断是否在搜索状态中
        show_sm:false,//是否显示搜索面板
        show_detail:false,
        orderInfo:{},
      }
    },
    created:function () {
      let params={
        pageSize:10,
        currentPage:1,
      }
      axios_post.post(urls.getAlarm,params).then(res=>{
        let vm = this
        let code = res.data.code
//              console.log(code)
        if(code==='10000'){//suc
          vm.alarmList = res.data.data.data
          for(let k of vm.alarmList){
            k.alarmTime = vm.timeBasic(k.alarmTime)
            k.manageTime = vm.timeBasic(k.manageTime)
          }
//                console.log(vm.alarmList)
        }else{
          layer.open({
            title:code,
            content:res.data.msg
          })
        }
      },err=>{
        layer.open({
          title:'出错啦',
          content:'获取报警列表出错'
        })
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
      //设备显示--formatte
      showOrigin:function (row) {
        return row.alarmStatus===1?'已处理':'未处理'
      },
      //操作端筛选--filter-methods
      filterTag(value, row) {
        return row.alarmStatus === value;
      },
      //点击回复
      answer:function (row) {
        let vm = this
        let session = sessionStorage.getItem('admin/user')
        session = JSON.parse(session)
        let user = session.sysUserId
        let params = {
          alarmId:row.alarmId,
          manageUser:user
        }
        vm.$confirm('此操作会更改该报警信息的状态,请确认无误后进行','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            axios_post.post(urls.handingAlarm,params).then(res=>{
              let code = res.data.code
              if(code === '30012'){
                vm.$message({
                  type:'success',
                  message:res.data.msg
                })
                row.alarmStatus = 1
              }else{
                  vm.$message({
                    type:'error',
                    message:res.data.msg
                  })
              }
            },err=>{
                vm.$message({
                  type:'error',
                  message:'出错啦,请联系管理员'
                })
            })
        }).catch(

        )
      },
      //查看该笔订单
      checkOrder:function (row) {
          let vm = this
          let params = {
              pageSise:5,
              currentPage:1,
              orderId:row.orderId
          }
          axios_post.post(urls.getOrder,params).then(res=>{
              if(res.data.code === '10000'){
                let response = res.data.data
                response.payTime = vm.timeBasic(response.payTime)
                response.createTime = vm.timeBasic(response.createTime)
                response.cancleTime = vm.timeBasic(response.cancleTime)
                vm.orderInfo = response
                vm.show_detail = true
              }else{
                  vm.$message({
                    type:'error',
                    message:res.data.msg
                  })
              }
          },err=>{
            vm.$message({
              type:"error",
              message:'获取订单详情失败'
            })
          })
      },
      //关闭订单面板
      offDetail:function () {
        this.show_detail = false
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
        axios_post.post(urls.getAlarm,option).then((res)=>{
          let response = res.data.data
          vm.alarmList = res.data.data.data
          for(let k of vm.alarmList){
            k.alarmTime = vm.timeBasic(k.alarmTime)
            k.manageTime = vm.timeBasic(k.manageTime)
          }
          vm.allPage = response.totalPage
          vm.currentPage = response.currentPage
        },(err)=>{
          vm.$message({
            type:'error',
            message:'加载出错'
          })
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
        axios_post.post(urls.getAlarm,params).then((res)=>{
          let response = res.data.data
          vm.alarmList = response.data
          for(let k of vm.alarmList){
            k.alarmTime = vm.timeBasic(k.alarmTime)
            k.manageTime = vm.timeBasic(k.manageTime)
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
