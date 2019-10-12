<template>
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <router-link to="/driverInfo" tag="a" class="navbar-brand">{{project_name}}</router-link>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li><el-avatar icon="el-icon-user-solid" size="small"></el-avatar></li>
                    <li><a href="#" style="color: #ffffff;">{{uName}}</a></li>
                    <li>,</li>
                    <li><a href="#" @click.prevent="logout">退出登陆</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import config from '@/config'

    export default {
        name: "AdminHeader",
        props:['m'],
        data: function () {
            return {
                project_name:config.name,
                uName: ''
            }
        },
        computed: {
            ...mapState('admin',{
                admin: state => state.user
            })
        },
        mounted () {
          let uName = sessionStorage.getItem('admin/user')
          uName = JSON.parse(uName)
          this.uName = uName.sysUserName
        },
        methods:{
            logout:function () {
                let vm = this
                this.$store.dispatch('admin/logout').then(res=>{
                    layer.msg('已退出登陆',{icon:1,time:1500});
                    setTimeout(function () {
                        vm.$router.push({'path':'/login'});
                    },1500);
                }).catch(function (err) {
//                    console.log(err)
                    layer.msg(err.message,{icon:5,time:3000});
                })
            }
        }
    }

</script>

<style scoped>
.nav{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
