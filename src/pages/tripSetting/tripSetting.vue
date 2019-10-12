<template>
  <div>
    <!----------------搜索区域------------------->
    <div class="searchDiv">
      <el-form :size="'mini'" :label-position="'left'"  :inline="true">
        <el-form-item
          label="区域名称"
        >
          <el-input v-model.trim="search.areaName"></el-input>
        </el-form-item>
        <el-form-item
          label="区域状态"
        >
          <el-select v-model="search.areaStatus"  clearable placeholder="全部">
            <el-option
              v-for="item in selectArr.areaStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!----------------按钮区域------------------->
    <div class="buttonDiv">
      <div class="buttonList">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchArea">查询</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="openDrawer(null, 1)">新增区域</el-button>
        <el-button type="primary" size="mini" icon="el-icon-tickets" @click="showRule">计价说明</el-button>
      </div>
    </div>
    <!----------------表格区域------------------->
    <el-table
      :data="data"
      stripe
      border
      v-loading="loading"
      height="calc(100vh - 150px)"
    >
      <el-table-column
        label="区域名称"
        prop="areaName"
      ></el-table-column>
      <el-table-column
        label="区域状态"
      >
        <template slot-scope="scope">
          <span v-for="k in selectArr.areaStatus" v-if="k.value === scope.row.areaStatus">{{k.label}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="sysUserName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="修改时间"
        prop="updateTime"
      ></el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="openDrawer(scope.row, 2)">详情</a>
          <a href="javascript:void(0);" @click="changeStatu(scope.row)">{{scope.row.areaStatus === 1 ? '冻结' : '开放'}}</a>
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
    <!------->
    <!----------------弹出层区域-------------------->
    <a-drawer
      placement="right"
      :closable="true"
      :maskClosable="false"
      title=''
      :z-index="1999"
      @close="drawerClose"
      :visible="drawerShow"
      :width="'78vw'"
      :destroyOnClose="true"
    >
<!--      <driver-detail :driver="initObject" :type="type" @refresh="refresh"></driver-detail>-->
      <area-detail :area="initObject" :type="type" @refresh="refresh" @freeze="changeStatu"></area-detail>
    </a-drawer>
    <!--------------计价规则显示----------------------->
    <div class="popModule" v-if="ruleShow">
      <div class="closePop" @click = 'offRule'></div>
      <div class="cutLine"></div>
      <div class="rule_cont">
        <p class="rule_tit">情况一</p>
        <P class="rule_detail">
          如果全部行驶里程-远程里程 <0
        </P>
        <p class="rule_detail">
          起步费+里程费*全部行驶里程+总时长*时长费
        </p>
        <p class="rule_tit">情况二</p>
        <P class="rule_detail">
          如果全部行驶里程-远程里程>=0
        </P>
        <p class="rule_detail">
          起步费+里程费*全部行驶里程+总时长*时长费+（全部行驶里程-远程里程）*远程费
        </p>
      </div>
    </div>
    <!--------------计价规则显示----------------------->
  </div>
</template>

<script>
import axios_post from '@/api/extendAxios.js'
import urls from '@/config/api'
import areaDetail from '@/pages/tripSetting/tripDetail'

export default {
  name: "tripSetting",
  components: {
    areaDetail
  },
  data () {
    return {
      search: {
        areaName: '',
        areaStatus: undefined
      },
      selectArr: {
        areaStatus: [{label: '冻结', value: 0}, {label: '正常', value: 1}]
      },
      data: [],
      initObject: {},
      type: 0,
      loading: false,
      cur: 1,
      pageSize: 20,
      total: 0,
      drawerShow: false,
      ruleShow: false,
    }
  },
  created () {
    let param = {
      currentPage: this.cur,
      pageSize: this.pageSize
    }
    this.getOnePage(param)
  },
  methods: {
    showRule () {
      this.ruleShow = true
    },
    offRule(){ //关闭弹出层
      this.ruleShow = false
    },
    openDrawer (obj, type) {
      this.drawerShow = true
      this.initObject = obj
      this.type = type
    },
    drawerClose () {
      this.drawerShow = false
    },
    handleCurrentChange (val) { // 翻页
      this.cur = val
      let param = {
        currentPage: this.cur,
        pageSize: this.pageSize,
      }
      this.getOnePage(param)
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
      axios_post.post(urls.getArea, params).then(res => {
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
    searchArea () {
      let param = {
        currentPage: 1,
        pageSize: this.pageSize,
      }
      this.getOnePage(param)
    },
    refresh () {
      this.search = {
        areaName: '',
        areaStatus: undefined
      }
      this.cur = 1
      this.drawerShow = false
      let params = {
        currentPage: 1,
        pageSize: this.pageSize,
      }
      this.getOnePage(params)
    },
    changeStatu (obj) { // if type {详情页内触发的冻结
      let vm = this
      let url = ''
      if (obj.areaStatus === 1) {
        url = urls.freezeArea
      } else if (obj.areaStatus === 0) {
        url = urls.unFreezeArea
      }
      let param = {
        areaId: obj.areaId
      }
      let tips = `确定要${obj.areaStatus === 1 ? '冻结' : '开放'}${obj.areaName}吗`
      vm.$confirm(tips,'警告',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios_post.post(url, param).then(res => {
          let code = res.data.code
          if (code === '10000') {
            vm.$message.info(res.data.msg)
            vm.refresh()
          } else {
            vm.$message.error(res.data.msg)
          }
        }, err => {
          vm.$message.error('操作失败，请联系管理员')
        })
      })
    }
  }
}
</script>

<style scoped>
.tripMain{
  width: 100%;
  height: calc(100vmin - 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tripCont{
  width: 60%;
}
.tips{
  font-size: 12px;
  color: red;
  width: 100%;
  white-space: nowrap;
}
.showRule{
  margin-bottom: 12px;
  align-self: flex-end;
}
.rule_cont{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
