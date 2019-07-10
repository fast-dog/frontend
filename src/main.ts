import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import {Util} from '@/Util';
import VeeValidate from 'vee-validate';
import Multiselect from 'vue-multiselect'
import './../node_modules/gentelella/vendors/bootstrap/js/tooltip.js';

require('jquery-slimscroll/jquery.slimscroll.js');

require('ckeditor/ckeditor.js');

declare let CKEDITOR: any;
let DOMAIN_CODE: any = '000';


CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
CKEDITOR.config.allowedContent = true;
CKEDITOR.config.basePath = '/';
CKEDITOR.dtd.$removeEmpty['i'] = false;
CKEDITOR.dtd.$removeEmpty['span'] = false;

/*
 * Редакторы
 */
CKEDITOR.config.filebrowserBrowseUrl = '/elfinder/ckeditor';
CKEDITOR.config.contentsCss = ['http://' + window.location.hostname + '/themes/' + DOMAIN_CODE + '/default/assets/editor/style.css'];

Vue.component('multiselect', Multiselect);
Vue.use(VeeValidate);


let axios = require('axios');

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
    render: h => h(App),
    methods: {},
    created() {

    }
}).$mount('#app');
