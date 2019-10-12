<template>
  <div>
    <driver-detail :driver="initObject" :type="type" @refresh="refresh" :areaList="areaSelect"></driver-detail>
  </div>
</template>

<script>
    import urls from '@/config/api'
    import axios_post from '@/api/extendAxios.js'
    import driverDetail from '@/pages/driver/driverDetail'
    export default {
      name: 'appendDriver',
      components: {
        driverDetail
      },
      data () {
        return {
          type: 1,
          initObject: {},
          areaSelect: []
        }
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
        refresh () {}
      }
    }
</script>

<style scoped>
    .append_ul {
        width:98%;
        margin:0 auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
    }
    .append_li {
        width:48%;
        margin-top: 7px;
    }
    .append_li_row{
        width:100%;
        margin: 7px auto;
    }
    .append_li input,select{
        width:80%;
    }
    #h_img{
        width: 200px;
        height: 150px;
        margin:7px 0;
    }
    .l_img{
        width: 240px;
        height: 180px;
        margin: 7px 0;
    }
    .l_img1{
      width: 240px;
      height: 180px;
      margin: 7px 0;
    }
    .btn_div{
        display: flex;
        margin: 7px auto;
        padding-left: 7px;
    }
</style>
