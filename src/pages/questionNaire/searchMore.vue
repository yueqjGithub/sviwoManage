<template>
    <div class="search-cont">
      <el-form ref="form" :model="form" label-width="120px" :inline="true" class="search-module">
        <div class="search-left">
          <el-form-item label="问卷问题">
            <el-input v-model="form.problem" placeholder="问卷问题" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择交易状态" size="mini">
              <el-option label="停用" :value="0"></el-option>
              <el-option label="正常" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-form-item label="创建开始时间">
              <el-date-picker
                v-model="form.createTimeStart"
                type="datetime"
                placeholder="创建开始时间"
                size="mini"
                @change="createTimeStart"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="创建结束时间">
              <el-date-picker
                v-model="form.createTimeEnd"
                type="datetime"
                placeholder="创建结束时间"
                size="mini"
                @change="createTimeEnd"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="修改开始时间">
              <el-date-picker
                v-model="form.updateTimeStart"
                type="datetime"
                placeholder="修改开始时间"
                size="mini"
                @change="updateTimeStart"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="修改结束时间">
              <el-date-picker
                v-model="form.updateTimeEnd"
                type="datetime"
                placeholder="修改结束时间"
                size="mini"
                @change="updateTimeEnd"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="search-right">
          <el-button type="primary" icon="el-icon-search" @click="search_More" size="mini">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="clearOption" size="mini">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="emitAdd" size="mini">添加问卷</el-button>
        </div>
      </el-form>
    </div>
</template>

<script>
    export default {
        name: 'searchMore',
        data(){
            return {
                form:{
                  problem:'',
                  status:'',
                  createTimeStart:'',
                  createTimeEnd:'',
                  updateTimeStart:'',
                  updateTimeEnd:'',
                }
            }
        },
        methods:{
          //增加问卷
          emitAdd(){
              this.$emit('addQuestion')
          },
          //清除选项
          clearOption:function () {
            let vm = this
            for (let k in vm.form) {
              vm.form[k] = ''
            }
            this.$emit('off_sm')
          },
          createTimeEnd(time){
            let vm = this
            let data = vm.eleTimeExchange(time)
            this.form.createTimeEnd = data
          },
          createTimeStart(time){
            let vm = this
            let data = vm.eleTimeExchange(time)
            this.form.createTimeStart = data
          },
          updateTimeStart(time){
            let vm = this
            let data = vm.eleTimeExchange(time)
            this.form.updateTimeStart = data
          },
          updateTimeEnd(time){
            let vm = this
            let data = vm.eleTimeExchange(time)
            this.form.updateTimeEnd = data
          },
          //查询参数
          searchOption: function () {
            let vm = this
            let opts = {
              problem:vm.form.problem,
              status:vm.form.status,
              createTimeStart:vm.form.createTimeStart,
              createTimeEnd:vm.form.createTimeEnd,
              updateTimeStart:vm.form.updateTimeStart,
              updateTimeEnd:vm.form.updateTimeStart
            }
            return opts
          },
          //高级查询
          search_More: function () {
            let opt = this.searchOption()

            let opt1 = {}
            for (let k in opt){
              if(opt[k] !== '') {
                opt1[k] = opt[k]
              }
            }
            let data = {
              opt:opt1,
              cur:1
            }
            this.$emit('submitOption',data)
          },
        }
    }
</script>

<style scoped>
  .search-cont .el-form-item{
    margin-bottom: 4px;
  }
  .search-cont{
    margin-bottom: 4px;
  }
  .search-module{
    display: flex;
  }
  .search-left{
    flex:2;
  }
  .search-right{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    flex:1;
  }
</style>
