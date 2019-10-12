<template>
  <div>
    <!----------------搜索区域------------------->
    <div class="searchDiv">
      <el-form :size="'mini'" :label-position="'left'"  :inline="true" :rules="rule">
        <el-form-item
          label="记账时间"
        >
          <el-date-picker
            v-model="search.createTimeStart"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="search.createTimeEnd"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="类型"
        >
          <el-select v-model="search.flowType" placeholder="全部">
            <el-option
              v-for="item in selectArr.typeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!--          <a href="javascript:void(0);" @click="changeSearch">{{showSearchMore ? '收起' : '更多'}}</a>-->
        </el-form-item>
        <el-form-item
          label="收支金额时间"
        >
          <el-date-picker
            v-model="search.amountStart"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="search.amountEnd"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-row>
          <el-form-item
            label="业务名称"
          >
            <el-radio-group v-model="search.businessName">
              <el-radio v-for="k in selectArr.businessArr" :key="k.label" :label="k.value">{{k.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <!----------------按钮区域------------------->
    <div class="buttonDiv">
      <div class="buttonList">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchFlow">查询</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button type="primary" size="mini" icon="el-icon-download" @click="exportFlow">导出</el-button>
      </div>
    </div>
    <!--------------------------表格区域------------------------------------->
    <el-table
      :data="data"
      stripe
      border
      v-loading="loading"
      height="calc(100vh - 160px)"
    >
      <el-table-column
        label="流水ID"
        prop="accountFlowId"
      ></el-table-column>
      <el-table-column
        label="司机姓名"
        prop="driverName"
      ></el-table-column>
      <el-table-column
        label="业务名称"
        prop="businessName"
      ></el-table-column>
      <el-table-column
        label="业务编号"
        prop="bizId"
      ></el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
      ></el-table-column>
      <el-table-column
        label="类型"
      >
        <template slot-scope="scope">
          <span v-for="k in selectArr.typeArr" v-if="scope.row.flowType === k.value">{{k.label}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="金额"
        prop="amount"
      ></el-table-column>
      <el-table-column
        label="结余"
        prop="balance"
      ></el-table-column>
      <el-table-column
        label="记账时间"
        prop="createTime"
      ></el-table-column>
    </el-table>
    <!--------翻页区域--------->
    <div class="pageDiv">
      <el-pagination
        :page-size="pageSize"
        :pager-count="9"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import axios_post from '@/api/extendAxios.js'
  import urls from '@/config/api.js'
  export default {
    name:'capital',
    data () {
      return {
        data: [],
        cur: 1,
        pageSize: 20,
        total: 0,
        loading: false,
        search: {
          businessName: '',//string	业务名
          flowType: undefined	,//number	收支类型 0:支出,1:收入
          amountStart: '',//	string	收支金额开始
          amountEnd: ''	,//string	收支金额结束
          createTimeStart: '',//	string	记账时间开始
          createTimeEnd: '',//	string	记账时间结束
        },
        intoSearch: {},
        selectArr: {
          typeArr: [{label: '支出', value: 0}, {label: '收入', value: 1}],
          // 3011=优惠减免，3013=司机奖励，3014=订单补贴，3015=订单提成
          businessArr: [{label: '司机收入', value: 2002}, {label: '司机奖励', value: 2001}, {label: '订单补贴', value: 1},
            {label: '账户提现', value: 2}, {label: '提现返款', value: 3}]
        },
        rule: {},
        sum: {
          expenditure: 0, //	string	收入金额
          income: 0, //	string	支出金额
          number: 0, //	string	记录总数
        }
      }
    },
    created () {
      let vm = this
      let param = {}
      let opt = this.$route.params.opt
      if (!opt) {
        this.$router.push({name: 'capital'})
      } else {
        let query = JSON.parse(opt)
        vm.intoSearch = {...query}
        param = {
          currentPage: 1,
          pageSize: vm.pageSize,
          ...query
        }
        vm.getOnePage(param)
      }
    },
    methods: {
      getOnePage (param) {
        let vm = this
        vm.loading = true
        let searchOptions = {}
        for (let k in this.search) {
          if (this.search[k] !== '' && this.search[k] !== undefined) {
            searchOptions[k] = this.search[k]
          }
        }
        let params = {
          ...param,
          ...searchOptions,
          ...vm.intoSearch
        }
        axios_post.post(urls.queryDrvAccFlow, params).then(res => {
          let code = res.data.code
          if (code === '10000') {
            vm.data = res.data.data.data
            vm.cur = res.data.data.currentPage
            vm.total = res.data.data.totalNumber
          } else {
            vm.$message.error(res.data.data)
          }
          vm.loading = false
        }).catch(err => {
          vm.$message.error('获取列表数据失败，请联系管理员')
          vm.loading = false
        })
      },
      searchFlow () { // 搜索
        let param = {
          currentPage: 1,
          pageSize: this.pageSize,
        }
        this.getOnePage(param)
      },
      refresh () { // 重置
        let vm = this
        // vm.drawerShow = false,
        vm.loading = false,
          // vm.showSearchMore = false,
          vm.search = {
            businessName: '',//string	业务名
            flowType: ''	,//number	收支类型 0:支出,1:收入
            amountStart: '',//	string	收支金额开始
            amountEnd: ''	,//string	收支金额结束
            createTimeStart: '',//	string	记账时间开始
            createTimeEnd: '',//	string	记账时间结束
          }
        vm.cur = 1
        let param = {
          currentPage: vm.cur,
          pageSize: vm.pageSize
        }
        vm.getOnePage(param)
      },
      exportFlow () { // 导出 exportOrder
        let vm = this
        let token = sessionStorage.getItem('token')
        let fm = new FormData()
        let searchOptions = {}
        for (let k in this.search) {
          if (this.search[k] !== '' && this.search[k]) {
            searchOptions[k] = this.search[k]
          }
        }
        let param = {
          currentPage: vm.cur,
          pageSize: vm.pageSize,
          ...searchOptions
        }
        for (let it in param) {
          fm.append(it,param[it])
        }
        this.$axios.post(urls.exportDrvAccFlow,fm, {
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
      handleCurrentChange (val) {
        this.cur = val
        let param = {
          currentPage: this.cur,
          pageSize: this.pageSize,
        }
        this.getOnePage(param)
      }
    }
  }
</script>

<style scoped>
  .cuntOrder{
    padding: 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cuntDiv{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    height: 48px;
    border: 1px solid #e4e4e4;
  }
  .cuntTit{
    color: #000000;
    font-size: 14px;
  }
  .cuntCount{
    color: #409EFF;
    font-size: 22px;
    margin-left: 2px;
  }
</style>
