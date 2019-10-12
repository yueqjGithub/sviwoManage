<template>
    <div class="pop_detail">
      <el-table
        :data = 'tableList'
        border
        stripe
        v-loading="loading"
        height="59vh"
      >
        <el-table-column
          type="expand"
        >
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row  v-if="props.row.orderStatus === 7 || props.row.orderStatus === 8">
                <el-form-item label="订单取消原因">
                  <span style="color: #F56C6C;">{{ props.row.cancelReason }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="乘客手机号">
                    <span>{{ props.row.pmobile }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="乘客真实姓名">
                    <span>{{ props.row.prealName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="司机手机号">
                    <span>{{ props.row.dmobile }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="司机真实姓名">
                    <span>{{ props.row.drealName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="起始地址">
                    <span>{{ props.row.startAddress }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="结束地址">
                    <span>{{ props.row.endAddress }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="起始定位">
                    <span>{{ props.row.startPos }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="结束定位">
                    <span>{{ props.row.endPos }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="税费">
                    <span>{{ props.row.taxPrice }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="手续费">
                    <span>{{ props.row.feePrice }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="违约金">
                  <span>{{ props.row.penalSum }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="订单状态">
                    <!--<span>{{ props.row.desc }}</span>-->
                    <span v-if="props.row.orderStatus === 1">已接单</span>
                    <span v-if="props.row.orderStatus === 2">到达乘客地点</span>
                    <span v-if="props.row.orderStatus === 3">乘客上车</span>
                    <span v-if="props.row.orderStatus === 4">到达目的地</span>
                    <span v-if="props.row.orderStatus === 5">乘客已支付</span>
                    <span v-if="props.row.orderStatus === 6">乘客已评价</span>
                    <span v-if="props.row.orderStatus === 7">乘客取消</span>
                    <span v-if="props.row.orderStatus === 8">司机取消</span>
                    <span v-if="props.row.orderStatus === 9">司机关闭</span>
                    <span v-if="props.row.orderStatus === 10">客服关闭</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="订单类型">
                    <!--<span>{{ props.row.desc }}</span>-->
                    <span v-if="props.row.orderType===1">线上下单</span>
                    <span v-if="props.row.orderType===2">扫码下单</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="订单总金额">
                    <span>{{ props.row.orderPrice }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="支付时间">
                    <span>{{ props.row.payTime }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="创建时间">
                    <span>{{ props.row.createTime }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="取消时间">
                    <span>{{ props.row.cancleTime }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="到账金额">
                    <span>{{ props.row.actualPrice }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="平台补贴">
                    <span>{{ props.row.subsidy }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="距离(米)">
                  <span>{{ props.row.distance }}</span>
                </el-form-item>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="pmobile"
          label="乘客手机号"
          width="170">
        </el-table-column>
        <el-table-column
          prop="prealName"
          label="乘客姓名"
          width="170">
        </el-table-column>
        <el-table-column
          prop="dmobile"
          label="司机手机号"
          width="170">
        </el-table-column>
        <el-table-column
          prop="drealName"
          label="司机姓名"
          width="170">
        </el-table-column>
        <el-table-column
          prop="startAddress"
          label="起始地址"
          width="200">
        </el-table-column>
        <el-table-column
          prop="endAddress"
          label="结束地址"
          width="200">
        </el-table-column>

        <el-table-column
          label="订单状态"
          width="110"
          prop="orderStatus"
          :formatter="showStatus"
        >
        </el-table-column>

        <el-table-column
          label="订单类型"
          width="110"
          prop="orderType"
          :formatter="showType"
        >
        </el-table-column>
        <el-table-column
          prop="orderPrice"
          label="订单总金额">
        </el-table-column>
        <el-table-column
          prop="payTime"
          label="支付时间"
          width="170"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="170"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="cancleTime"
          label="取消时间"
          width="170"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="actualPrice"
          label="实际到账金额"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="subsidy"
          label="平台补贴"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="distance"
          label="距离（米）"
          sortable
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
      name:'IncomeOrder',
      props:['opt'],
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
            orderId: vm.opt,
            currentPage:1,
            pageSize: 20
        }
        vm.loading = true
        axios_post.post(urls.getOrder,params).then(res=>{
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
            vm.$message.error('获取订单列表失败，请联系管理员')
            vm.loading = false
        })
      },
      methods:{
        //          订单状态显示——new
        showType(row){
          switch (row.orderType) {
            case 1:
              return '线上下单'
              break
            case 2:
              return '扫码下单'
              break
          }
        },
        //订单状态显示-new
        showStatus(row) {
          switch (row.orderStatus) {
            case 1:
              return '已接单'
              break
            case 2:
              return '到达乘客地点'
              break
            case 3:
              return '乘客上车'
              break
            case 4:
              return '到达目的地'
              break
            case 5:
              return '乘客已支付'
              break
            case 6:
              return '乘客已评价'
              break
            case 7:
              return '乘客取消'
              break
            case 8:
              return '司机取消'
              break
            case 9:
              return '司机关闭'
              break
            case 10:
              return '客服关闭'
              break
          }
        },
        //获取一页信息
        getOnePage: function () {
          let vm = this
          let params = {
            currentPage: this.currentPage,
            pageSize: 20,
            orderId: vm.opt
          }
          vm.loading = true
          axios_post.post(urls.getOrder,params).then(res=>{
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
