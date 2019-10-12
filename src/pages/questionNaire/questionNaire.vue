<template>
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane name="1" label="添加与搜索">
          <!--<search-more @off_sm="offSearchMore" @submitOption="sub" @download="test"></search-more>-->
          <search-more @off_sm="offSearchMore" @submitOption="sub" @addQuestion="appendNew"></search-more>
        </el-tab-pane>
      </el-tabs>
      <el-table
        :data="questionList"
        border
        stripe
        v-loading="loading"
        height="80vmin"
      >
        <el-table-column
          prop="questionnaireId"
          label="问卷编号"
        >
        </el-table-column>
        <el-table-column
          prop="problem"
          label="问卷问题"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
        >
        </el-table-column>
        <el-table-column
          prop="operationUser"
          label="操作人"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status===0">停用</span>
            <span v-if="scope.row.status===1">正常</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="todo-div">
              <!--<div>-->
                <!--<el-button type="primary" size="mini">修改问卷</el-button>-->
              <!--</div>-->
              <div>
                <el-popover
                  placement="left"
                  trigger="click"
                >
                  <el-table
                    stripe
                    :data="scope.row.answer"
                    size="mini"
                  >
                    <el-table-column label="选项" prop="code"></el-table-column>
                    <el-table-column label="选值" prop="value"></el-table-column>
                  </el-table>
                  <el-button type="primary" size="mini" slot="reference">查看答案</el-button>
                </el-popover>
              </div>
            </div>
          </template>
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
      <div class="popModule" v-if="showAdd">
        <div class="closePop" @click = 'offDetail'></div>
        <div class="cutLine"></div>
        <add :info="questionInfo"></add>
      </div>
    </div>
</template>

<script>
import axios_post from '@/api/extendAxios.js'
import urls from '@/config/api.js'
import searchMore from '@/pages/questionNaire/searchMore.vue'
import add from '@/pages/questionNaire/add.vue'

export default {
  name:'questionNaire',
  components:{
    searchMore:searchMore,
    add: add
  },
  data(){
      return{
        activeName: '1',
        loading: false,
        questionList: [],
        currentPage:1,
        allPage:1,
        searchOptions:{},//储存搜索参数
        searchStatus:false,//判断是否在搜索状态中
        //添加面板
        showAdd: false,
        questionInfo:{}
      }
  },
  created(){
      let vm = this
      vm.loading =  true
      let params = {
        pageSize:20,
        currentPage: 1
      }
      axios_post.post(urls.queryQuestionnaire,params).then(res=>{
          let code = res.data.code
          let response = res.data.data
          if (code === '10000') {
              vm.questionList = response.data
              for (let k of vm.questionList) {
                  if (k.updateTime !== '') {
                      k.updateTime = vm.timeBasic(k.updateTime)
                  }
                  k.createTime = vm.timeBasic(k.createTime)
              }
              vm.loading = false
              vm.allPage = response.totalPage
              vm.currentPage = response.currentPage
          } else {
              vm.$message.error(res.data.msg)
              vm.loading = false
          }
      },err=>{
          vm.$message.error('获取问卷列表失败，请联系管理员')
          vm.loading = false
      })
  },
  methods:{
    //打开问卷添加
    appendNew(){
        this.showAdd = true
        this.questionInfo = {
            type: 0 // 0-添加，1-修改
        }
    },
    offDetail(){
        this.showAdd = false
    },
    //重置时关闭搜索状态
    offSearchMore: function () {
      this.searchStatus = false
    },
    //高级搜索
    sub: function (opt) {
//                @param
//                    opt.opt 搜索参数
//                @param
//                    opt.cur 当前页数
      let vm = this
      vm.loading = true
      this.searchOptions = opt.opt
      this.searchStatus = true
      let opt2 = opt.opt
      let option = {
        pageSize: 20,
        currentPage: opt.cur,
        ...opt2
      }
      axios_post.post(urls.queryQuestionnaire,option).then((res)=>{
        let code = res.data.code
        let response = res.data.data
        if (code === '10000') {
          vm.questionList = response.data
          for (let k of vm.questionList) {
            if (k.updateTime !== '') {
              k.updateTime = vm.timeBasic(k.updateTime)
            }
            k.createTime = vm.timeBasic(k.createTime)
          }
          vm.loading = false
          vm.allPage = response.totalPage
          vm.currentPage = response.currentPage
        } else {
          vm.$message.error(res.data.msg)
          vm.loading = false
        }
      },(err)=>{
        vm.$message.error('获取问卷列表失败，请联系管理员')
        vm.loading = false
      })
    },
    //获取一页信息
    getOnePage: function () {
      let vm = this
      let params = {
        currentPage: this.currentPage,
        pageSize: 20,
      }
      vm.loading = true
      axios_post.post(urls.queryQuestionnaire,params).then((res)=>{
        let code = res.data.code
        let response = res.data.data
        if (code === '10000') {
          vm.questionList = response.data
          for (let k of vm.questionList) {
            if (k.updateTime !== '') {
              k.updateTime = vm.timeBasic(k.updateTime)
            }
            k.createTime = vm.timeBasic(k.createTime)
          }
          vm.loading = false
          vm.allPage = response.totalPage
          vm.currentPage = response.currentPage
        } else {
          vm.$message.error(res.data.msg)
          vm.loading = false
        }
      },(err)=>{
        vm.$message.error('获取问卷列表失败，请联系管理员')
        vm.loading = false
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
        vm.getOnePage()
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
          vm.getOnePage()
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
          vm.getOnePage()
        }
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
