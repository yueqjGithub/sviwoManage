<template>
  <div>
    <!----------------搜索区域------------------->
    <div class="searchDiv">
      <el-form :size="'mini'" :label-position="'left'"  :inline="true" :rules="rule">
        <el-form-item
          label="电话号码"
          prop="mobileNumber"
        >
          <el-input v-model.trim="search.mobileNumber"></el-input>
        </el-form-item>
        <el-form-item
          label="司机姓名"
        >
          <el-input v-model.trim="search.realName"></el-input>
        </el-form-item>
        <el-form-item
          label="身份证号"
          prop="certificateNo"
        >
          <el-input v-model.trim="search.certificateNo"></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
        >
          <!--<span>{{search.sex}}</span>-->
          <el-select v-model="search.sex"  clearable placeholder="全部">
            <el-option
              v-for="item in sexSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属区域"
        >
          <el-select v-model="search.areaName"  clearable placeholder="全部">
            <el-option
              v-for="item in areaSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="状态"
        >
          <el-select v-model="search.driverStatus"  clearable placeholder="全部">
            <el-option
              v-for="item in statuSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="注册来源"
        >
          <el-select v-model="search.registerOrigin"  clearable placeholder="全部">
            <el-option
              v-for="item in originSelect"
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
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchDriver">查询</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button type="primary" size="mini" icon="el-icon-download" @click="exportDriver">导出</el-button>
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
        label="司机姓名"
        prop="realName"
      ></el-table-column>
      <el-table-column
        label="手机号码"
        prop="mobileNumber"
      ></el-table-column>
      <el-table-column
        label="行驶证编号"
        prop="licenseNumber"
      ></el-table-column>
      <el-table-column
        label="车牌号"
        prop="vehicleNumber"
      ></el-table-column>
      <el-table-column
        label="状态"
      >
        <template slot-scope="scope">
          <span v-for="k in statuSelect" v-if="k.value === scope.row.driverStatus">{{k.label}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="注册来源"
      >
        <template slot-scope="scope">
          <span v-for="k in originSelect" v-if="k.value === scope.row.registerOrigin">{{k.label}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="注册时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <a href="javascript: void(0);" @click="openDetail(scope.row, 2)">详情</a>
          <a href="javascript: void(0);" @click="showQrcode(scope.row)">查看二维码</a>
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
    <!---------------------二维码---------------------->
    <div id="qrcode_mod" v-show="showQr">
      <div class="qrTit" @click="offQr">
      </div>
      <div ref="qrcode" id="qrcode"></div>
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
      :width="'78vw'"
      :destroyOnClose="true"
    >
      <driver-detail :driver="initObject" :type="type" @refresh="refresh" :areaList="areaSelect"></driver-detail>
    </a-drawer>
<!--    <el-drawer-->
<!--      :visible.sync="drawerShow"-->
<!--      :wrapperClosable="false"-->
<!--      size="78vw"-->
<!--      :direction="'rtl'"-->
<!--    >-->
<!--      -->
<!--    </el-drawer>-->
    <!----------------弹出层区域-------------------->
  </div>
</template>

<script>
    // import api_admin from '@/api/admin'
    import urls from '@/config/api'
    // import moment from 'moment'
    import driverDetail from '@/pages/driver/driverDetail.vue'
    // import searchMore from '@/pages/driver/searchMore.vue'
    import axios_post from '@/api/extendAxios.js'
    import QRCode from 'qrcodejs2' //二维码

    export default {
      name: 'driverList',
      components: {
        driverDetail,
        QRCode: QRCode,
      },
      data () {
        let certificateReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        let checkPhone = (rule, value, callback) => {
          if(!(/^1[3456789]\d{9}$/.test(this.search.mobileNumber)) && this.search.mobileNumber){
            callback(new Error('手机号码填写错误'))
          }
          callback()
        }
        let checkCertificate = (rule, value, callback) => {
          if (!certificateReg.test(this.search.certificateNo)) {
            callback(new Error('身份证号码格式错误'))
          }
          callback()
        }
        return {
          showQr: false,
          loading: false,
          pageSize: 20,
          cur: 1,
          total: 0,
          drawerShow: false,
          search: {
            mobileNumber: '',
            realName: '',
            certificateNo: '',
            sex: undefined,
            areaName: undefined,
            driverStatus: undefined,
            registerOrigin: undefined
          },
          rule: {
            mobileNumber: [
              // {validator: checkPhone, trigger: 'blur'}
            ],
            certificateNo: [
              // {validator: checkCertificate, trigger: 'blur'}
            ]
          },
          sexSelect: [
            {
              label: '男',
              value: 1
            },
            {
              label: '女',
              value: 0
            }
          ],
          areaSelect: [],
          statuSelect: [{label: '已认证', value: 3},{label: '已封号', value: 4}],
          originSelect: [{label: 'IOS', value: 1},{label: 'Android', value: 2},{label: '后台录入', value: 3},{label: '微信', value: 4},{label: 'web', value: 5}],
          data: [],
          initObject: {},
          type: 0 // 0, 1-add,2-update,3-audit
        }
      },
      created () {
        let params = {
          currentPage: 1,
          pageSize: this.pageSize
        }
        let dmobile = this.$route.params.phone
        if (dmobile) {
          this.search['mobileNumber'] = dmobile
        }
        this.getOnePage(params)
      },
      mounted () {
        let vm = this
        let param = {
          currentPage: 1,
          pageSize: 500
        }
        axios_post.post(urls.getArea, param).then(res => {
          let code = res.data.code
          if (code === '10000') {
            let areaList = res.data.data.data
            for (let k in areaList) {
              vm.areaSelect.push({'label': areaList[k].areaName, 'value': areaList[k].areaId})
            }
          } else {
            vm.$message.error(res.data.msg)
          }
        }, err => {
          vm.$message.error('获取地区列表出错，请联系管理员')
        })
      },
      methods: {
        openDetail (obj, type) {
          this.drawerShow = true
          this.initObject = obj
          this.type = type
        },
        drawerClose () {
          this.drawerShow = false
        },
        handleCurrentChange (val) {
          this.cur = val
          let param = {
            currentPage: this.cur,
            pageSize: this.pageSize
          }
          this.getOnePage(param)
        },
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
            ...searchOptions
          }
          axios_post.post(urls.driverInfo, params).then(res => {
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
        searchDriver () {
          let param = {
            currentPage: 1,
            pageSize: this.pageSize,
            listType: 'queryDriver'
          }
          this.getOnePage(param)
        },
        refresh () {
          this.search = {
            mobileNumber: '',
            realName: '',
            certificateNo: '',
            sex: undefined,
            areaName: undefined,
            driverStatus: undefined,
            registerOrigin: undefined
          }
          this.cur = 1
          this.drawerShow = false
          let params = {
            currentPage: 1,
            pageSize: this.pageSize,
            listType: 'queryDriver'
          }
          this.getOnePage(params)
        },
        exportDriver: function () {
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
          this.$axios.post(urls.exportDriverList,fm, {
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
        showQrcode (driver) {
          this.showQr = true
          let params = {
            "driverId": driver.driverId
          }
          let url
          let vm = this
          axios_post.post(urls.driverQRCode,params).then(res=>{
            let response = res.data
            if(response.code === '10000'){
              url = response.data
              vm.QrCode(url)
              // vm.downloadClick()
            }else {
              vm.$message.error(res.data.msg)
            }
          }).catch(err => {
            vm.$message.error('获取二维码失败')
          })
        },
        QrCode (src) { // 生成二维码
          let qrcode = new QRCode('qrcode', {
            width: 232,  // 设置宽度
            height: 232, // 设置高度
            correctLevel: QRCode.CorrectLevel.L
          })
          qrcode.makeCode(src)
        },
        //关闭二维码
        offQr:function () {
          this.showQr = false
          $('#qrcode').html('')
        }
      }
    }
</script>

<style scoped>
    .searchBox{
        display: flex;
        border-bottom: 1px dotted;
        padding-bottom: 20px;
        margin-bottom: 20px;
    }
    .giftCount {
        display: block;
        width: 80%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
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
    #qrcode_mod{
      position: fixed;
      top: 30vh;
      left: 45vw;
      z-index: 2000;
      border: 1px solid #e3e3e3;
      padding: 5px;
      background: #fff;
      border-radius: 5%;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      -moz-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }
    .qrTit{
      /*position: absolute;*/
      top: 18px;
      right: 15px;
      cursor: pointer;
      width:10%;
      margin-left:88%;
      color: #909399;
      font-size: 16px;
      font-family: element-icons!important;
      speak: none;
      font-style: normal;
      font-weight: 400;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      vertical-align: baseline;
      display: inline-block;
      -webkit-font-smoothing: antialiased;
    }
    .qrTit::before{
      content: "\e6db";
      font-size: 2.3rem;
    }
  /*----------------------------new-----------------------------*/
  .driver-todo-btn{
    margin: 2px auto;
  }
</style>
