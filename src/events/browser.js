import bus from '@/lib/bus'
import router from '@/router'

const events = {
    ChangeTitle:'change:title'
};

bus.$on(events.ChangeTitle,function (val) {
    document.title = val;
});

window.goBack = function () {
    router.back();
};

export default events;