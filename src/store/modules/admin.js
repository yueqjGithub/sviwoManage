import sessionstorage from 'sessionstorage'
import Admin from '@/model/admin'
import api_admin from '@/api/admin'
import serialize from '@/lib/serialize'

const state = {
    user: Admin.New(),
    guest: true,
    preImg:false,//是否显示放大图片板
    imgSrc:'',
    breadPath: []
};

const actions = {
    login: function (context,params) {
        return new Promise(function (resolve, reject) {
            api_admin.login(params).then(function (res) { //访问登陆接口
                let token = res.headers.token
                let data = res.data;
                if(data.code !== '10001'){ //状态码不为登陆成功
                    return reject(new Error(data.code));
                }
                sessionstorage.setItem('token',token)
                let user = Admin.New(data.data);
                context.commit('setUser',user);
                resolve(data);
            },err=>{
              // console.log(err)
              reject(err)
            })
        });

    },
    logout: function (context,callback) {
        return new Promise(function (resolve, reject) {
            api_admin.logout().then(function (res) {
                let data = res.data;
                if(!data.code){
                    return reject(new Error(data.msg));
                }
                sessionStorage.setItem('token',null)
                sessionStorage.setItem('user/menu',{})
                context.commit("setUser",null);
                return resolve();
            }).catch(function (err) {
                reject(err)
            })
        });

    },
    getAdminInfo: function (context) {
        return new Promise(function (resolve, reject) {
            api_admin.getAdminInfo().then(function (res) {
                let data = res.data;
                if(!data.status){
                    return reject(new Error(data.msg));
                }
                let user = Admin.New(data.data);
                // @return data={status:**,data:{Admin(CLASS)}}
                context.commit("setUser",user);
                resolve(user);
            }).catch(function (err) {
                reject(err);
            })
        })
    }
};

const mutations = {
    setUser: function (state, user) {
        state.user = user;
        // console.log(state.user)
        if(user){
            state.guest = false;
        }else {
            state.guest = true;
        }
        sessionstorage.setItem("admin/user",serialize.serialize(state.user));
        sessionstorage.setItem("admin/guest",serialize.serialize(state.guest));
        // sessionstorage.setItem("admin/sessionId",serialize.serialize())
    },
    seePic:function(state,src){
      state.preImg = true
      state.imgSrc = src
    },
    nSeePic:function (state) {
      state.preImg = false
    },
    setBread (state,path) {
      state.breadPath = path
    }
};

const getters = {
    user: function (state,getters) {
        let user = sessionstorage.getItem("admin/user");
        if(user){
            state.user = Admin.New(serialize.deserialize(user));
        }

        return state.user;
    },
    guest:function (state) {
        let guest = sessionstorage.getItem("admin/guest");
        // console.log(guest)
        if(guest!==null){
            state.guest = serialize.deserialize(guest);
        }
        // console.log(state.guest)
        return state.guest;
    }
};


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
