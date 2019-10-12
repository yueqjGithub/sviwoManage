/**
 * Created by llsienna on 2018/11/23.
 */
const axios = require('axios');
const qs = require('qs');
const ele = require('element-ui')

const req = axios.create({
  timeout:15000,
  transformResponse: [function (data) {
    let info
    if(typeof(data) === 'string')
    {
      info = JSON.parse(data);
    }
    let code = info.code
    // console.log(code)
    if(code === '10008'){ //拦截权限不足
      layer.open({
        code:info.code,
        content:info.msg,
        end:function () {
          window.location.href='/#/403'
          return false
        }
      })
    }
    return info
  }],
})
axios.defaults.withCredentials = true
req.interceptors.request.use(config => {
  let token = sessionStorage.getItem('token')
  if(token){
    config.headers['token'] = token
    return config
  } else {
    ele.MessageBox.alert('登陆信息已过期，请重新登陆','point-all',{
      confirmButtonText: '确定',
      callBack: () => {
        sessionStorage.setItem('admin/user',null)
        sessionStorage.setItem('token',null)
        sessionStorage.setItem('admin/guest',true)
        sessionStorage.setItem('user/menu',{})
        window.location.href='/'
      }
    })
  }
});
req.interceptors.response.use(response=>{
  // console.log(response)
  if (response.data.code === '10004') {
    ele.MessageBox.alert('登陆信息已经过期，请重新登陆',{
      confirmButtonText: '确定',
      callback: action => {
        sessionStorage.setItem('admin/user',null)
        sessionStorage.setItem('token',null)
        sessionStorage.setItem('admin/guest',true)
        sessionStorage.setItem('user/menu',{})
        window.location.href='/'
      }
    })
    return false
  }
  return response
},err=>{
  let status = err.response.status
  if(status === 302){
    window.location.href = '/login'
  }
  throw status
})

exports.post = (url,params) => {
    // let wait = layer.msg('请稍等',{time:1500})
    return req({
        url: url,
        method: 'post',
        data: qs.stringify(params),
    })
}
