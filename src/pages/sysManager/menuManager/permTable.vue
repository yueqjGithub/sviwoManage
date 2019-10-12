<template>
  <div class="detail2">
    <div class="permCont">
      <el-table
        :data="permArr"
        width="100%"
        stripe
        height="360"
        size="small"
      >
        <el-table-column width="80">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.permId"
              v-model="checkArr"
            >&nbsp
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="权限名"
          prop="permName">
        </el-table-column>
        <el-table-column
          label="权限路径"
          prop="permUrl"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createUser">
        </el-table-column>
      </el-table>
    </div>
    <div class="permBtn">
      <el-row>
        <el-col :span="4" :offset="2">
          <el-button type="primary" icon="el-icon-success" @click="sub">
            提交
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import axios_post from '@/api/extendAxios.js'
  import urls from '@/config/api'

    export default {
        name:'menuPermTree',
        props:['permList','menuId'],
        data:function () {
          return{
            id:'',
            permArr:[],
            checkArr:null,
          }
        },
        mounted:function () {
            let vm = this
          this.permArr = this.permList
          this.id = this.menuId
          axios_post.post(urls.findPermIdByMenuId,{menuId:this.id}).then(res=>{
              let code = res.data.code
              if(code === '10000'){
                  vm.checkArr = res.data.data.permId
              }else{
                  vm.$message({
                    type:'error',
                    message:'获取已有资源出错'
                  })
              }
          }).catch(err=>{
              console.log(err)
          })
        },
        methods:{
//          handleSelectionChange:function (val) {
//            this.checkArr = val
////            console.log(this.checkArr)
//          },
//          getTemplateRow:function (index, row) {
//            console.log(this.checkArr)
//          },
          sub:function () {
              let vm = this
//            let str =''
//            for(let k of vm.checkArr){
//                  str+=`${k.permId},`
//            }
            let params = {
                menuId:vm.id,
                permissionId:vm.checkArr
            }
            vm.$confirm('确认选择无误吗','提示',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=>{
              axios_post.post(urls.menuBindingPerm,params).then(res=>{
                  let code = res.data.code
                  if(code==='30012'){
                    vm.$message({
                      type:'success',
                      message:res.data.msg
                    })
                    setTimeout(function () {
                      vm.$router.go(0)
                    },1500)
                  }else{
                    vm.$message({
                      type:'warning',
                      message:res.data.msg
                    })
                  }
              })
            }).catch(() => {
              vm.$message({
                type: 'info',
                message: '已取消关联'
              });
            });

          }
        }
    }
</script>

<style scoped>
.permCont{
  padding: 5px;
}
  .permBtn{
    margin-top: 7px;
  }
</style>
