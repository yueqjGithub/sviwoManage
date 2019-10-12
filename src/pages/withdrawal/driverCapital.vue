<template>
    <div class="contTable">
      <el-table
        :data="capitalList"
        stripe
        height="300"
      >
        <el-table-column
          type="expand"
          fixed="left"
        >
          <template slot-scope="props">
            <el-form label-position="left" inline class="feedCont">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="流水号">
                    <span>{{ props.row.accountFlowId }}</span>
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="10">
                  <el-form-item label="发生金额">
                    <span>{{ props.row.amount }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8"><el-form-item label="业务类型">
                  <span v-if="props.row.businessTypeId===1000">乘客付款</span>
                  <span v-if="props.row.businessTypeId===2000">司机提现流水</span>
                  <span v-if="props.row.businessTypeId===2001">订单奖励</span>
                  <span v-if="props.row.businessTypeId===2002">司机收到乘客付款</span>
                  <span v-if="props.row.businessTypeId===2004">账户余额减少到可提现余额</span>
                  <span v-if="props.row.businessTypeId===2005">冻结可用余额</span>
                  <span v-if="props.row.businessTypeId===2006">可用余额转入冻结余额</span>
                  <span v-if="props.row.businessTypeId===2007">解冻锁定余额</span>
                  <span v-if="props.row.businessTypeId===2008">冻结余额转入可用余额</span>
                  <span v-if="props.row.businessTypeId===2009">冻结余额转入司机账户</span>
                  <span v-if="props.row.businessTypeId===2010">转出失败</span>
                  <span v-if="props.row.businessTypeId===2011">转出成功</span>
                </el-form-item></el-col>
                <el-col :offset="1" :span="10"><el-form-item label="交易状态">
                  <span v-if="props.row.flowStatus===-1">直接生效</span>
                  <span v-if="props.row.flowStatus===3">审核中</span>
                  <span v-if="props.row.flowStatus===4">转出中</span>
                  <span v-if="props.row.flowStatus===5">转出失败</span>
                  <span v-if="props.row.flowStatus===6">转出成功</span>
                </el-form-item></el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="流水说明">
                    <span>{{props.row.flowDetail}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="创建时间">
                    <span>{{props.row.createTime}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="手续费">
                    <span>{{props.row.poundageAmount}}</span>
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="10">
                  <el-form-item label="实际到账金额">
                    <span>{{props.row.accountAmount}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="司机真实姓名">
                    <span>{{props.row.drealName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="10">
                  <el-form-item label="司机手机号">
                    <span>{{props.row.mobileNumber}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="备注">
                <span>{{props.row.remark}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          prop="amount"
          label="发生金额"
        >
        </el-table-column>

        <el-table-column
          label="业务类型"
          prop="businessTypeId"
          :filters="[{ text: '乘客付款', value: 1000 }, { text: '司机提现流水', value: 2000 },
          { text: '订单奖励', value: 2001 },{ text: '司机收到乘客付款', value: 2002 },
          { text: '账户余额减少', value: 2003 },{ text: '账户余额减少到可提现余额', value: 2004 },
          { text: '冻结可用余额', value: 2005 },{ text: '可用余额转入冻结余额', value: 2006 },
          { text: '解冻锁定余额', value: 2007 },{ text: '冻结余额转入可用余额', value: 2008 },
          { text: '冻结余额转入司机账户', value: 2009 },{ text: '转出失败', value: 2010 },{ text: '转出成功', value: 2011 },
          ]"
          :filter-method="filterTag"
          :formatter="showOrigin"
        >
        </el-table-column>
        <el-table-column
          label="交易状态"
          prop="flowStatus"
          :filters="[{ text: '直接生效', value: -1 }, { text: '审核中', value: 3 },
          { text: '转出中', value: 4 },{ text: '转出失败', value: 5 },
          { text: '转出成功', value: 6 }
          ]"
          :filter-method="filterStatus"
          :formatter="showStatus"
        >
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable
        >
        </el-table-column>

      </el-table>
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
    export default {
        name:'driverCapital',
        props:['driver'],
        data:function () {
          return {
            capitalList:[],
            allPage:1,
            currentPage:1,
          }
        },
        mounted:function () {
          let vm = this
          let params = {
              currentPage:1,
              pageSize:50,
              driverId:this.driver
          }
          axios_post.post(urls.queryDrvAccFlow,params).then(res=>{
              let code = res.data.code
              let response = res.data.data
              if(code === '10000'){
                  vm.allPage = response.totalPage
                  vm.capitalList = response.data
                  for(let k of vm.capitalList){
                      k.createTime = vm.timeBasic(k.createTime)
                  }
              }
          }).catch(err=>{
              vm.$message({
                type:'error',
                message:'获取该司机流水失败，请与管理员联系'
              })
          })
        },
        methods:{
          //类型显示--formatte
          showOrigin:function (row) {
            switch (row.businessTypeId) {
              case 1000 :
                return '乘客付款'
                break
              case 2000 :
                return '司机提现流水'
                break
              case 2001 :
                return '订单奖励'
                break
              case 2002 :
                return '司机收到乘客付款'
                break
              case 2003 :
                return '账户余额减少'
                break
              case 2004 :
                return '账户余额减少到可提现余额'
                break
              case 2005 :
                return '冻结可用余额'
                break
              case 2006 :
                return '可用余额转入冻结余额'
                break
              case 2007 :
                return '解冻锁定余额'
                break
              case 2008 :
                return '冻结余额转入可用余额'
                break
              case 2009 :
                return '冻结余额转入司机账户'
                break
              case 2010 :
                return '转出失败'
                break
              case 2011 :
                return '转出成功'
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
          //获取一页信息
          getDriverInfo: function () {
            let vm = this
            let params = {
              currentPage: this.currentPage,
              pageSize: 50,
            }
            axios_post.post(urls.queryDrvAccFlow,params).then((res)=>{
              let response = res.data.data
              if(res.data.code === '10000'){
                vm.capitalList = res.data.data.data
                for(let k of vm.capitalList){
                  k.createTime = vm.timeBasic(k.createTime)
                }
                vm.allPage = response.totalPage
                vm.currentPage = response.currentPage
              } else {
                vm.$message({
                  type:'error',
                  message:res.data.msg
                })
              }
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
            vm.getDriverInfo()
          },
          //前一页
          prev: function () {
            let vm = this
            if(this.currentPage > 1){
              this.currentPage --
              vm.getDriverInfo()
            } else {
              layer.msg('前面没有了')
            }
          },
          //下一页
          next: function () {
            let vm = this
            if(this.currentPage < this.allPage) {
              this.currentPage ++
              vm.getDriverInfo()
            } else {
              layer.msg('已经是最后一页啦')
            }
          },
        },
    }
</script>

<style scoped>
.contTable{
  width:100%;
}
.pgBtn{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
