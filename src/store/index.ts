import Vue from 'vue'
import Vuex from 'vuex'

import createLogger from '../logger';
import main from './modules/main';
// import table from './modules/table';
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
        // table: table,
        // form: form,
        // catalog: catalog
    },
    plugins: debug ? [createLogger()] : []
})