<template>
  <div>
    <!--<ul class="nav nav-sidebar">-->
      <!--<li v-for="m in modules" v-if="m.enable">-->
        <!--<router-link :to="m.link" v-if="!m.child" active-class="active" exact>{{m.name}}</router-link>-->
        <!--<ul v-if="m.child" class="nav fnav">-->
          <!--<li @click="jump(m.link)" class="navtit">{{m.name}}</li>-->
          <!--<li v-for="k in m.child" v-if="k.enable">-->
            <!--<router-link :to="k.link" active-class="active" exact>{{k.name}}</router-link>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</li>-->
    <!--</ul>-->
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      :unique-opened="true"
      :default-openeds="defaultOpenList"
      active-text-color="#ffd04b"
      @select="showPath">
      <el-submenu v-for="m in modules"
        v-if="JSON.stringify(m.children)!=='[]'&&JSON.stringify(m.children)!=='{}'"
        :key="m.index"
        :index="m.name"
      >
        <template slot="title">
          <span>{{m.name}}</span>
        </template>
        <el-menu-item v-for="k in m.children" :key="k.index" :index="k.name">
          <template>
            <router-link :to="k.link" active-class="active" exact>{{k.name}}</router-link>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>

</template>

<script>
    import modules from '@/config/modules'
    import axios_post from '@/api/extendAxios.js'
    import urls from '@/config/api'

    export default {
        name: 'AdminNav',
        data: function () {
            return {
                modules: modules,
                defaultOpenList:[]
            }
        },
        created:function () {
          let vm = this
          let session = sessionStorage.getItem('admin/user')
          session = JSON.parse(session)
          let uId = session.sysUserId
//          console.log(uId)
          axios_post.post(urls.getMenuByloginUser,{userId:uId}).then(res=>{
            if(res.data.code === '10000'){
              vm.modules=res.data.data
              let point = vm.modules.find(item=>item.children.find(k=>k.link === vm.routeExact))
              vm.defaultOpenList.push(point.name)
              let realPath = point.children.find(item => item.link === vm.routeExact)
              let breadArr = [point.name, realPath.name]
              vm.$store.commit('admin/setBread', breadArr)
              let str = JSON.stringify(res.data.data)
              sessionStorage.setItem('user/menu',str)
            }else{
                vm.$message.error(res.data.data)
            }
          },err=>{
            vm.$message.error('获取用户菜单出错')
          })
        },
        mounted:function () {
          let session = sessionStorage.getItem('user/menu')
          session = JSON.parse(session)
          this.modules = session
//          console.log(typeof this.modules[3].children)
        },
        methods: {
          jump: function (url) {
              this.$router.push({path:'/'+url})
          },
          showPath (index, indexPath) {
            // console.log(index)
            this.$store.commit('admin/setBread', indexPath)
          }
        },
        computed:{
            routeExact: function () {
                let arr = this.$route.path.split('/')
                return arr[1]
            }
        }
    }
</script>

<style scoped>
    .fnav li{
        padding-left: 20px;
    }
    .fnav li:first-child{
        color: #337ab7;
        text-decoration: none;
        cursor:pointer
    }
    .navtit{
        padding:10px 0px;
    }
    .navtit:hover{
        background-color: #e7e7e7;
    }
    .active {
        color:rgb(255, 208, 75);
    }
    .el-menu{
      border:none;
    }
    a{
      color: #ffffff;
      text-decoration: none;
      display: inline-block;
      width: 100%;
    }
    a:hover{
      color:rgb(255, 208, 75);
      text-decoration: none;
    }
</style>
