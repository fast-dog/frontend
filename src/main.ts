import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import {Util} from '@/Util';
import './../node_modules/gentelella/vendors/bootstrap/js/tooltip.js';

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    store.dispatch('setBreadcrumbs', {
        items: []
    });
    if (store.getters.getRouteNotify == true) {
        alert('Подтверждение перехода');
        Util.deleteDialog({
            title: 'Подтверждение перехода',
            text: 'На странице были внесены изменения, подтвердите переход...',
            text_ok: 'Перейти',
            callback: function () {
                store.dispatch('setRouteNotify', false);
                next()
            }
        });
        next(false)
    } else {
        next()
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
