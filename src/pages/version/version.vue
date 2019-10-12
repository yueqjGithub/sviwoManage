<template>
  <div>
    <div style="margin-bottom: 8px;">
      <el-button size="mini" @click="openDetail({},2,1)" type="primary">添加IOS更新</el-button>
      <el-button size="mini" @click="openDetail({},2,2)" type="primary">添加安卓更新</el-button>
    </div>
    <el-table
      :data="data"
      stripe
      v-loading="loading"
      height="77vh"
      :row-style="{height: '15vh'}"
    >
      <el-table-column
        prop="date"
        label="编号"
      >
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateOrigin"
        label="APP"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.updateOrigin === 1">乘客端</span>
          <span v-if="scope.row.updateOrigin === 2">司机端</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="systemType"
        label="端口"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.systemType === 1">IOS</span>
          <span v-if="scope.row.systemType === 2">Android</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="versionCode"
        label="版本号"
      ></el-table-column>
      <el-table-column
        label="更新类型"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.forced === 1">强更</span>
          <span v-if="scope.row.forced === 0">弱更</span>
          <span v-if="scope.row.tips === 1">强提示</span>
          <span v-if="scope.row.tips === 0">弱提示</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="prompt"
        label="更新文案"
      >
        <template slot-scope="scope">
          <span v-html="scope.row.prompt.split(';').join('\n')"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <a href="javascript:void(0)"
             @click="openDetail(scope.row, 1,scope.row.systemType)"
             v-if="new Date().getTime() < eleTimeExchange(scope.row.updateTime)">
            操作
          </a>
        </template>
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
<!--    ！！！！！！！！！！！！弹出层！！！！！！！！！！！！！！-->
    <div class="popModule" v-if="showMode !== 0">
      <div class="closePop" @click = 'offDetail'></div>
      <div class="cutLine"></div>
<!--      <income-order :opt="paramOne" v-if="showMode === 1"></income-order>-->
<!--      <subsily-list :opt="paramOne" v-if="showMode === 2"></subsily-list>-->
      <detail :type="showMode" :pro="param" @refresh="refresh"></detail>
    </div>
  </div>
</template>

<script>
  import axios_post from '@/api/extendAxios.js'
  import urls from '@/config/api.js'

  import detail from '@/pages/version/editVersion'

  export default {
    name: 'version',
    components: {
      detail: detail
    },
    data(){
      return {
        loading: false,
        showMode: 0, // 0 - 隐藏， 1-修改， 2-添加
        data:[],
        currentPage:1,
        pageSize: 10,
        allPage:1,
        total: 0, // 总条数
        searchOptions:{},//储存搜索参数
        searchStatus:false,//判断是否在搜索状态中
        // 弹出层相关
        param: {},
        nowOrigin: 1
      }
    },
    created(){
    },
    mounted(){
      // console.log(this.$route.path)
      if (this.$route.path === '/driversion') {
        this.nowOrigin = 2
        this.searchOptions = {
          updateOrigin: 2
        }
      } else {
        this.nowOrigin = 1
        this.searchOptions = {
          updateOrigin: 1
        }
      }
      let vm = this
      let params = {
        currentPage: 1,
        pageSize: 10,
        ...vm.searchOptions
      }
      vm.getOnePage(params)
    },
    methods:{
      // 提交成功后触发的刷新
      refresh () {
        let vm = this
        vm.currentPage = 1
        vm.offDetail()
        let params = {
          currentPage: 1,
          pageSize: vm.pageSize,
          ...vm.searchOptions
        }
        vm.getOnePage(params)
      },
      // 打开弹出层
      openDetail(obj, type, sys){ // obj-传入对象，type-1修改2添加， systype: 系统， upda-端口
        let vm = this
        if (type === 1) { // 修改
          this.showMode = type
          obj['updateOrigin'] = this.nowOrigin
          this.param=obj
          this.param['prompt'] = obj.prompt.split(';').join('\n')
        } else if (type === 2) { // 添加
          let info = {
            systemType: sys,
            updateOrigin: this.nowOrigin
          }
          axios_post.post(urls.inspectVersionUpdateTime, info).then(res => {
            let code = res.data.code
            if (code === '10000') {
              this.showMode = type
              obj['updateOrigin'] = this.nowOrigin
              obj['systemType'] = sys
              this.param=obj
            } else {
              vm.$message.error(res.data.msg)
              return false
            }
          }, err => {
            vm.$message.error('验证是否有未过时更新记录出错，请联系管理员')
            return false
          })
        }
      },
      // 关闭弹出层
      offDetail(){ //关闭弹出层
        this.showMode = 0
      },
      //获取一页信息
      getOnePage: function (params) {
        let vm = this
        vm.loading = true
        let requestUrl = ''
        if (this.$route.path === '/driversion') {
          requestUrl = urls.queryDriverVersion
        } else {
          requestUrl = urls.queryPassengerVersion
        }
        axios_post.post(requestUrl,params).then(res=>{
          let code = res.data.code
          let response = res.data.data
          if (code === '10000') {
            vm.data = response.data
            vm.allPage = response.totalPage
            vm.currentPage = response.currentPage
            vm.total = response.totalNumber
          } else {
            vm.$message.error(res.data.msg)
          }
          vm.loading = false
        },err=>{
          vm.$message.error('获取列表失败,请联系管理员')
          vm.loading = false
        })
      },
      //点击页码
      jumpTo: function (e) {
        let num = e.target.innerText
        let vm = this
        num = parseInt(num)
        this.currentPage = num
        let params = {
          currentPage: num,
          pageSize: vm.pageSize,
          ...vm.searchOptions
        }
        vm.getOnePage(params)
      },
      //前一页
      prev: function () {
        let vm = this
        if(this.currentPage > 1){
          this.currentPage --
          let params = {
            currentPage: vm.currentPage,
            pageSize: vm.pageSize,
            ...vm.searchOptions
          }
          vm.getOnePage(params)
        } else {
          vm.$message.info('前面没有了')
        }
      },
      //下一页
      next: function () {
        let vm = this
        if(this.currentPage < this.allPage) {
          this.currentPage ++
          let params = {
            currentPage: vm.currentPage,
            pageSize: vm.pageSize,
            ...vm.searchOptions
          }
          vm.getOnePage(params)
        } else {
          vm.$message.info('已经是最后一页了')
        }
      }
    },
    watch: {
      //监听路由，只要路由有变化(路径，参数等变化)都有执行下面的函数，你可以
      $route: {
        handler: function (val, oldVal) {
            this.loading=false
            this.showMode=0 // 0 - 隐藏， 1-修改， 2-添加
            this.data=[]
            this.currentPage=1
            this.allPage=1
            this.total=0 // 总条数
            this.searchOptions={}//储存搜索参数
            this.searchStatus=false,//判断是否在搜索状态中
            // 弹出层相关
            this.param={}
            if (this.$route.path === '/driversion') {
              this.nowOrigin = 2
              this.searchOptions = {
                updateOrigin: 2
              }
            } else {
              this.nowOrigin = 1
              this.searchOptions = {
                updateOrigin: 1
              }
            }
            let vm = this
            let params = {
              currentPage: 1,
              pageSize: 10,
              ...vm.searchOptions
            }
            vm.getOnePage(params)
        },
        deep: true
      }
    },
  }
</script>

<style scoped>
  .eleTableSingle{
    display: flex;
    justify-content: space-between;
  }
</style>
