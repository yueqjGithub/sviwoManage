<template>
    <div class="container" @keyup.enter="login">
        <form class="form-signin">
          <!--v-on:submit.prevent="login"-->
            <h2 class="form-signin-heading">{{title}}</h2>
            <label for="account" class="sr-only">账号</label>
            <input type="text" v-model.trim="account" id="account" class="form-control password" placeholder="账号" required="" autofocus="">
            <label for="password" class="sr-only">密码</label>
            <input type="password" v-model.trim="password" id="password" class="form-control" placeholder="密码" required="">
            <!--<label for="password" class="sr-only">验证码</label>-->
            <!--<input type="text" v-model.trim="loginVercode" id="vercode" class="form-control" placeholder="验证码" required="">-->
            <!--<img :src="getVercode" alt="" id="qrcode">-->
            <!--<button @click.prevent="refreshVcode">刷新验证码</button>-->
            <div class="checkbox">
                <label style="color: #ffffff;">
                    <input type="checkbox" name="remember_me" v-model="needRemember" @change="saveUser($event)"> Remember me
                </label>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="button" @click.prevent="login" id="loginBtn">登录</button>
        </form>

    </div>
</template>

<script>
    import config from '@/config'
    import api_admin from '@/api/admin'
    import urls from '@/config/api'
    export default {
        name: 'Login',
        data: function () {
            return {
                vercodeHost: urls.vercode,
                getVercode: urls.vercode,
                title: config.name,
                account: '',
                password: '',
                loginVercode: '',
                needRemember: false
            }
        },
        computed: {

        },
        filters: {

        },
        methods: {
            //refreshvercode
            refreshVcode: function () {
              let vm = this
              vm.getVercode =vm.vercodeHost + '?d='+Math.random()
            },
            // rememberME
            saveUser: function (e) {
//              console.log(this.needRemember)
            },
            login: function () {
                let self = this;
                let params = {
                    sysUserName: this.account,
                    sysUserPassword: this.password,
                }
                if (params['sysUserName'] === '') {
                  layer.msg('请输入用户名',{icon:5,time:1500})
                  return false
                }
                if (params['sysUserPassword'] === '') {
                  layer.msg('请输入密码',{icon:5,time:1500})
                  return false
                }
//                if (params['verificationCode'] === '') {
//                  layer.msg('请输入验证码',{icon:5,time:1500})
//                  return false
//                }
                let loading = layer.load(2);
                this.$store.dispatch('admin/login',params).then(function (data) {
                    if (self.needRemember) {
                        let obj = {'account': self.account, 'password': self.password, 'remember': true}
//                        console.log(JSON.stringify(obj))
                        localStorage.setItem('saveUserInfo', JSON.stringify(obj))
                    } else {
                        localStorage.removeItem('saveUserInfo')
                    }
                    layer.msg(data.msg,{icon:1,time:1500});
                    self.account = ''
                    self.password = ''
                    params['sysUserName'] = self.account
                    params['sysUserPassword'] = self.password
                    setTimeout(function () {
                      self.$router.push({'path':'/driverInfo'});
                    },1500);
                }).catch(function (err) {
//                    console.log(err.message)
                    if(err.message === '10006'){
                      layer.msg('用户名或密码错误',{icon:5,time:3000});
                    }else if (err.message === '30083') {
                      layer.msg('验证码出错',{icon:5,time:3000});
                    } else {
                      layer.msg(err.message,{icon:5,time:3000});
                    }
                }).finally(function () {
                    layer.close(loading);
                });
            }
        },
        created: function () {

        },
        mounted: function () {
          let vm = this
          let user = localStorage.getItem('saveUserInfo')
          if (user) {
              user = JSON.parse(user)
              vm.account = user.account
              vm.password = user.password
              vm.needRemember = true
          } else {

          }
//          window.addEventListener('keydown',function (e) {
//            let code = e.keyCode
//            if (code === 13) {
//              vm.login()
//            }
//          })
        },
        updated: function () {

        }
    }
</script>

<style>
    body {
        padding-top: 40px;
        padding-bottom: 40px;
        height: 100vh;
    }
</style>

<style scoped>
    .container{
      width: 100vw;
      height: 100vh;
      background-image: url("../assets/img/bg.jpg") !important;
      -webkit-background-size:100% 100% !important;
      background-size:100% 100% !important;
      background-repeat: no-repeat !important;
      position: fixed;
      top:0;
      left:0;
    }
    .password {
        margin-bottom: 5px;
    }
    .form-signin {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }
    .form-signin-heading{
        text-align: center;
        color: #ffffff;
    }
    .form-signin .form-signin-heading,
    .form-signin .checkbox {
        margin-bottom: 10px;
    }
    .form-signin .checkbox {
        font-weight: normal;
    }
    .form-signin .form-control {
        position: relative;
        height: auto;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding: 10px;
        font-size: 16px;
    }
    .form-signin .form-control:focus {
        z-index: 2;
    }
    .form-signin input[type="email"] {
        margin-bottom: -1px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
    .form-signin input[type="password"] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
#vercode{
  margin-bottom: 7px;
}
</style>
