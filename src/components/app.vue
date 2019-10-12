<template>
    <div v-if="$route.meta.layout">
        <admin-header></admin-header>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-3 col-md-2 sidebar">
                    <admin-nav></admin-nav>
                </div>
                <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <el-breadcrumb separator=">" class="breadMode" v-if="!$route.meta.breadHide">
<!--                      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>-->
                      <el-breadcrumb-item v-for="k in breadPath" :key="k">{{k}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"></router-view>
                    </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive"></router-view>
                </div>
            </div>
        </div>
        <div class="preImgMain" v-if="showPreImg" @click="closePreImg">
          <img :src="imgSrc" alt="" class="seePreImg">
        </div>
    </div>
    <div v-else>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Vue from 'vue'
    import AdminNav from "@/components/nav.vue"
    import AdminHeader from "@/components/header.vue"

    import "@/assets/css/main.css"

    export default {
        name:"App",
        data:function () {
            return {
                "title":"斯蔚沃后台管理系统",
            }
        },
        methods:{
            changeTitle:function (val) {
                document.title = val;
            },
          closePreImg:function () {
              this.$store.commit('admin/nSeePic')
          }
        },
        components:{
            AdminNav,
            AdminHeader
        },
        // mounted () {
        //   console.log(this.$route.meta)
        // },
        computed:{
          showPreImg:function () {
//              console.log(this.$store.state.admin.preImg)
            return this.$store.state.admin.preImg
          },
          imgSrc:function () {
            return this.$store.state.admin.imgSrc
          },
          ...mapState('admin',{
            breadPath: state => state.breadPath
          })
        }
    }
</script>
<style scoped>
  .sidebar{
    padding:0;
    background: rgb(84, 92, 100);
  }
  .preImgMain{
    width: 100vw;
    height:100vh;
    background: rgba(0,0,0,0.7);
    position: fixed;
    top:0;
    left: 0;
    z-index: 3000;
    zoom: 1;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .seePreImg{
    max-width:40vw;
    max-height:70vh;
  }
  .breadMode{
    margin-bottom: 4px;
    background: #e7e7e7;
    padding: 4px;
  }
</style>
