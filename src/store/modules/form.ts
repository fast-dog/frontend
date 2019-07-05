const default_form = {
    name: '',
    content: {
        buttons: [],
        tabs: [{
            general: {
                id: '',
                name: '',
                fields: [],
                side: []
            },
        }]
    }
};

const state = {
    form: default_form,
    form_item: [],
    select_data: []
};

// getters
const getters = {
    getForm: state => state.form,
    getFormItem: state => state.form_item,
    getSelectDataById: (state) => (id) => {
        return state.select_data.find(item => item.id === id)
    },
    getFormItemById: (state) => (id) => {
        return state.form_item.find(item => item.id === id)
    },

};

// actions
const actions = {
    setForm({commit, state}, payload) {
        commit('setForm', payload);
    },
    clearForm({commit, state}, payload) {
        commit('clearForm', default_form);
        commit('clearSelectData');
        commit('clearFormItems');
    },
    setFormItem({commit, state}, payload) {
        commit('setFormItem', payload);
    },
    setSelectData({commit, state}, payload) {
        commit('setSelectData', payload);
    },
    deleteSelectDataById({commit, state}, payload) {
        let newArray = state.select_data.filter(function (item) {
            return item.id != payload.id;
        });
        commit('setClearSelectData', newArray);
    },
    updateSearchFieldFilter({commit, state}, payload) {
        commit('updateSearchFieldFilter', payload);
    },
    toggleButton({commit, state}, payload) {
        commit('toggleButton', payload);
    },
    updatedFieldModel({commit, state}, payload) {
        commit('updatedFieldModel', payload);
    },
    updatedSelectModel({commit, state}, payload) {
        console.log(payload);
    }
};


// mutations
const mutations = {
    setForm(state, payload) {
        state.form = payload;
    },
    clearForm(state, payload) {
        state.form = payload;
    },
    setFormItem(state, payload) {
        state.form_item.push({
            id: payload.id,
            instance: payload.instance
        });
    },
    setSelectData(state, payload) {
        state.select_data.push({
            id: payload.id,
            items: payload.items,
            callback: payload.callback,
            clearValue: payload.clearValue,
        });
    },
    clearSelectData(state, payload) {
        state.select_data = [];
    },
    clearFormItems(state, payload) {
        state.form_item = [];
    },
    setClearSelectData(state, payload) {
        state.select_data = payload;
    },
    updateSearchFieldFilter(state, payload) {
        payload.instance.filter = payload.filter;
    },
    toggleButton(state, payload) {
        state.form.content.buttons.filter(function (element) {
            if (element.id == payload.id) {
                element.visible = payload.visible;
            }
        })
    },
    updatedFieldModel(state, payload) {
        payload.model[payload.field] = payload.value;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}