const axios = require('axios');
const qs = require('qs');
const urls = require('../config/api');
axios.defaults.withCredentials = true
const ele = require('element-ui')

const request = axios.create({
    timeout:15000,
    transformResponse: [function (data) {
        // 这里提前处理返回的数据
        if(typeof(data) === 'string')
        {
            return JSON.parse(data);
        }
        return data;
    }],
});

/**
 * 管理员登录
 * @param {Object} params
 * @returns {*|PromiseLike<vuejs.HttpResponse>|AxiosPromise<any>}
 */
exports.login = function (params) {
    return request.post(urls.login,qs.stringify(params))
};

//获取验证码
exports.vercode = function () {
  return request.get(urls.vercode,{
    responseType: 'arraybuffer',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
  })
}

/**
 * 管理员退出登录
 * @returns {*|PromiseLike<vuejs.HttpResponse>|AxiosPromise<any>}
 */
exports.logout = function () {
  request.interceptors.request.use(config => {
    let token = sessionStorage.getItem('token')
    if(token){
      config.headers['token'] = token
      return config
    } else {
      alert('您的登陆信息已过期，请重新登陆')
    }
  });
  return request.post(urls.logout);
};

/**
 * 获取管理员信息
 * @returns {*|PromiseLike<vuejs.HttpResponse>|AxiosPromise<any>}
 */

// 明红--------------------------
//司机信息列表
exports.driverInfo = function (params) {
  // 拦截请求-发送时携带token
  request.interceptors.request.use(config => {
    let token = sessionStorage.getItem('token')
    if(token){
      config.headers['token'] = token
      return config
    } else {
      ele.MessageBox.alert('登陆信息已过期，请重新登陆','point-driverInfo',{
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

  request.interceptors.response.use( response => {
    // console.log(response)
    if (response.data.code === '30076') {
      ele.MessageBox.alert('登陆信息已经过期，请重新登陆', {
        confirmButtonText: '确定',
        callback: action => {
          sessionStorage.setItem('admin/user', null)
          sessionStorage.setItem('token', null)
          sessionStorage.setItem('admin/guest', true)
          sessionStorage.setItem('user/menu', {})
          window.location.href='/'
        }
      })
      return false
    }
    return response
  }, err => {
    let status = err.response.status
    if (status === 302) {
      window.location.href = '/login'
    }
  })
  return request.post(urls.driverInfo, qs.stringify(params))

}

// 乘客信息列表
exports.passengerInfo = function (params) {
  // 拦截请求-发送时携带token
  request.interceptors.request.use(config => {
    let token = sessionStorage.getItem('token')
    if(token){
      config.headers['token'] = token
      return config
    } else {
      ele.MessageBox.alert('登陆信息已过期，请重新登陆','point-driverInfo',{
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

  request.interceptors.response.use(response=>{
    // console.log(response)
    if (response.data.code === '30076') {
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
  return request.post(urls.passengerInfo,qs.stringify(params))
}


