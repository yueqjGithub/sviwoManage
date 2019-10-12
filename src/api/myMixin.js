import moment from 'moment'
import urls from '@/config/api.js'

var myMxin = {
    methods:{
        timeExchange: function (time) {
            let date = time.split('T')
            let date1 = date.join(" ")
            date1 = date1.replace(/-/g,'/')
            date1 = new Date(date1)
            let date2 = date1.getTime()
            return date2
        },
        //element GMT转时间戳
        eleTimeExchange:function (time) {
          let data1 = new Date(time).getTime()
          return data1
        },
        //时间格式化
        timeBasic:function (time) {
            // console.log(moment(time).format('YYYY-MM-DD HH:mm:ss'))
            // 2018-11-23T08:51:16.000+0000
            let local
            if (time !== null && time !== undefined && time !== '') {
              local = moment.utc(time).toDate();
              local = moment(local).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
            } else {
              local = ''
            }
            // return moment.utc(time).format('YYYY-MM-DD HH:mm:ss')
            return local
          // return time
        },
        //放大图片查看
        preView:function(url){
          let src = urls.imgOrigin + url
          this.$store.commit('admin/seePic',src)
        },
        //放大图片查看---ele预览
        preViewEle:function(url){
          let src = url
          this.$store.commit('admin/seePic',src)
        },
    },
    computed: {
        pageBean: function(){
            let left = 1;
            let right = this.allPage;
            let ar = [];
            if(this.allPage>= 5){
                if(this.currentPage > 3 && this.currentPage < this.allPage-2){
                    left = this.currentPage - 2
                    right = this.currentPage + 2
                }else{
                    if(this.currentPage<=3){
                        left = 1
                        right = 5
                    }else{
                        right = this.allPage
                        left = this.allPage -4
                    }
                }
            }
            while (left <= right){
                ar.push(left)
                left ++
            }
            return ar
        }
    }
}

export default myMxin
