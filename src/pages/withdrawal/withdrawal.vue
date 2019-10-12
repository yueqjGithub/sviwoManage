<template>
  <div>
    <!----------------搜索区域------------------->
    <div class="searchDiv">
      <el-form :size="'mini'" :label-position="'left'"  :inline="true" :rules="rule">
        <el-form-item
          label="提现ID"
        >
          <el-input v-model.trim="search.withdrawId"></el-input>
        </el-form-item>
        <el-form-item
          label="司机电话"
        >
          <el-input v-model.trim="search.mobileNumber"></el-input>
        </el-form-item>
        <el-form-item
          label="司机姓名"
        >
          <el-input v-model.trim="search.driverName"></el-input>
        </el-form-item>
        <el-form-item
          label="处理状态"
        >
          <el-select v-model="search.withdrawStatus"  clearable placeholder="全部">
            <el-option
              v-for="item in selectArr.statusArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="申请时间"
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
      </el-form>
    </div>
    <!----------------按钮区域------------------->
    <div class="buttonDiv">
      <div class="buttonList">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchHandle">查询</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button type="primary" size="mini" icon="el-icon-download" @click="exportHandle">导出</el-button>
      </div>
    </div>
    <!--------------------------统计区域------------------->
    <div class="cuntOrder">
      <div class="cuntDiv">
        <span class="cuntTit">申请数：</span>
        <countTo :startVal='0' :endVal='sum.number' :duration='1500' class="cuntCount"
                 :decimals="0"
        ></countTo>
      </div>
      <div class="cuntDiv">
        <span class="cuntTit">提现金额：</span>
        <countTo :startVal='0' :endVal='sum.amount' :duration='1500' class="cuntCount"
                 :decimals="2"
        ></countTo>
      </div>
      <div class="cuntDiv">
        <span class="cuntTit">实打款：</span>
        <countTo :startVal='0' :endVal='sum.money' :duration='1500' class="cuntCount"
                 :decimals="2"
        ></countTo>
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
        label="提现ID"
        prop="withdrawId"
      ></el-table-column>
      <el-table-column
        label="司机姓名"
        prop="driverName"
      ></el-table-column>
      <el-table-column
        label="手机号"
        prop="mobileNumber"
      ></el-table-column>
      <el-table-column
        label="申请时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="处理状态"
      >
        <template slot-scope="scope">
          <span v-for="k in selectArr.statusArr" v-if="scope.row.withdrawStatus === k.value">{{k.label}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="金额"
        prop="amount"
      ></el-table-column>
      <el-table-column
        label="收款类型"
      >
        <template slot-scope="scope">
          <span v-for="k in selectArr.payArr" v-if="scope.row.paymentCodeType === k.value">{{k.label}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="openDetail(scope.row)">详情</a>
          <a href="javascript:void(0);" @click="seeCapital(scope.row.mobileNumber)">流水</a>
        </template>
      </el-table-column>
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
    <!----------------弹出层区域-------------------->
    <a-drawer
      placement="right"
      :closable="true"
      :maskClosable="false"
      title=''
      :z-index="2000"
      @close="drawerClose"
      :visible="drawerShow"
      :width="'58vw'"
      :destroyOnClose="true"
    >
      <detail :info="initObject" @refresh="refresh" @close="drawerClose" @capital="seeCapital"></detail>
<!--      <driver-detail :driver="initObject" :type="type" @refresh="refresh" :areaList="areaSelect"></driver-detail>-->
    </a-drawer>
  </div>
</template>

<script>
  import axios_post from '@/api/extendAxios.js'
  import urls from '@/config/api.js'
  import countTo from 'vue-count-to'
  import detail from '@/pages/withdrawal/detail'

  export default {
    name:'callPolice',
    components: {
      countTo,
      detail,
    },
    data () {
      return {
        loading: false,
        drawerShow: false,
        initObject: {},
        cur: 1,
        pageSize: 20,
        total: 0,
        data: [],
        search: {
          withdrawId: undefined, //	number	提现id
          driverName: '', //	string	司机姓名
          mobileNumber: '', //	string	司机手机号
          withdrawStatus: undefined, //	number	状态 1.已申请 2.已打款 3.已返款
          createTimeStart: '', //	string	申请提现开始时间,传时间戳字符串
          createTimeEnd: '', //	string	申请提现结束时间，传时间戳字符串
        },
        rule: {},
        selectArr: {
          statusArr: [{label: '已申请', value: 1}, {label: '已打款', value: 2}, {label: '已返款', value: 3}],
          payArr: [{label: '微信', value: 0}, {label: '支付宝', value: 1}]
        },
        sum: {
          number: 0, //	string	申请数
          amount: 0, //	string	提现金额
          money: 0, //	string	实打款金额
        }
      }
    },
    created() {
      let param = {
        currentPage: this.cur,
        pageSize: this.pageSize
      }
      this.getOnePage(param)
    },
    methods: {
      handleCurrentChange (val) {
        this.cur = val
        let param = {
          currentPage: this.cur,
          pageSize: this.pageSize,
          listType: 'queryDriver'
        }
        this.getOnePage(param)
      },
      seeCapital (phone) {
        this.$emit('close')
        let param = {
          mobileNumber: phone
        }
        this.$router.push({name: 'capitalList', params: {opt: JSON.stringify(param)}})
      },
      openDetail (obj) {
        this.drawerShow = true
        this.initObject = obj
      },
      drawerClose () {
        this.drawerShow = false
      },
      getOnePage (param) {
        let vm = this
        vm.loading = true
        let searchOptions = {}
        for (let k in this.search) {
          if (this.search[k] !== '' && this.search[k]) {
            searchOptions[k] = this.search[k]
          }
        }
        let params = {
          ...param,
          ...searchOptions
        }
        axios_post.post(urls.withdrawRecord, params).then(res => {
          let code = res.data.code
          if (code === '10000') {
            vm.data = res.data.data.data
            vm.cur = res.data.data.currentPage
            vm.total = res.data.data.totalNumber
            vm.getSum(params)
          } else {
            vm.$message.error(res.data.data)
          }
          vm.loading = false
        }).catch(err => {
          vm.$message.error('获取列表数据失败，请联系管理员')
          vm.loading = false
        })
      },
      getSum (opt) { // 获取统计
        axios_post.post(urls.withdrawTitleData,opt).then(res => {
          let vm = this
          let code = res.data.code
          if (code === '10000') {
            let data = res.data.data
            for (let k in data) {
              if (vm.sum.hasOwnProperty(k)) {
                vm.sum[k] = Number(data[k])
              }
            }
          } else {
            vm.$message.error(res.data.msg)
          }
        },err => {
          vm.$message.error('获取提现统计失败，请联系管理员')
        })
      },
      searchHandle () { // 搜索
        let param = {
          currentPage: 1,
          pageSize: this.pageSize,
        }
        this.getOnePage(param)
      },
      refresh () { // 重置
        let vm = this
        vm.drawerShow = false,
        vm.loading = false,
        // vm.showSearchMore = false,
        vm.search = {
          withdrawId: undefined, //	number	提现id
          driverName: '', //	string	司机姓名
          mobileNumber: '', //	string	司机手机号
          withdrawStatus: undefined, //	number	状态 1.已申请 2.已打款 3.已返款
          createTimeStart: '', //	string	申请提现开始时间,传时间戳字符串
          createTimeEnd: '', //	string	申请提现结束时间，传时间戳字符串
        }
        vm.cur = 1
        let param = {
          currentPage: vm.cur,
          pageSize: vm.pageSize
        }
        vm.getOnePage(param)
      },
      exportHandle () { // 导出 exportOrder
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
        this.$axios.post(urls.withdrawExcel,fm, {
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
