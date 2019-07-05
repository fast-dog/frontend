import Vue from 'vue'
import Vuex from 'vuex'

import createLogger from '../logger';
import form from '@/store/modules/form';
import table from '@/store/modules/table';
import main from '@/store/modules/main';
import catalog from '@/store/modules/catalog';
// import form from './modules/form';
// import catalog from './modules/catalog';


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions: {},
    getters: {},
    strict: debug,
    modules: {
        main: main,
        table: table,
        form: form,
        catalog: catalog
    },
    plugins: debug ? [createLogger()] : []
})