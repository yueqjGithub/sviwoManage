import store from '@/store'

export function auth(to,from,next) {
    let guest = store.getters['admin/guest'];
    // console.log('guest='+guest);
    //是否为访客（guest）判断
    if(guest){
        // store.dispatch("admin/getAdminInfo").then(function () {
        //     return next();
        // }).catch(function () {
        //     return next({'name':'login'});
        // });
        return next({'name':'login'})
    }else {
        return next();
    }
    // return next();
}
