import {FdTranslator} from '@/FdTranslator';

const defFilter = [
    {
        id: 'filter-name',
        placeholder: 'Название',
        name: 'name',
        type: 'null',
        validate: 'required|min:5',
        value: null,
        display: false,
        operator: {
            value: '=',
            variant: [
                {id: '=', name: '=', tooltip: 'Поле равно указаному значению'},
                {id: '!=', name: '!=', tooltip: 'Поле не равно указаному значению'},
            ]
        }
    },
    {
        type: 'operator',
        value: 'AND',
        display: false,
        variant: [
            {id: 'AND', name: 'И', tooltip: 'Логическое условие И'},
            {id: 'OR', name: 'ИЛИ', tooltip: 'Логическое условие ИЛИ'},
        ]
    }
];
const state = {
    items: [],
    item: null,
    data_url: '',
    height: 600,
    parameters: {
        page: 1,
    },
    limits: [
        {id: 25, name: 25},
        {id: 50, name: 50},
        {id: 100, name: 100}
    ],
    order_list: [
        {id: 'id:desc', name: FdTranslator._('ID (по убыванию)')},
        {id: 'id:asc', name: FdTranslator._('ID (по возрастанию)')},
        {id: 'title:desc', name: FdTranslator._('Заголовок (по убыванию)')},
        {id: 'title:asc', name: FdTranslator._('Заголовок (по возрастанию)')},
        {id: 'created_at:desc', name: FdTranslator._('Дата создания (по убыванию)')},
        {id: 'created_at:asc', name: FdTranslator._('Дата создания (по возрастанию)')},
        {id: 'updated_at:desc', name: FdTranslator._('Дата обновления (по убыванию)')},
        {id: 'updated_at:asc', name: FdTranslator._('Дата обновления (по возрастанию)')},
        {id: 'published_at:desc', name: FdTranslator._('Дата публикации (по убыванию)')},
        {id: 'published_at:asc', name: FdTranslator._('Дата публикации (по возрастанию)')},
        {id: 'view_counter:desc', name: FdTranslator._('Кол-во просмотров (по убыванию)')},
        {id: 'view_counter:asc', name: FdTranslator._('Кол-во просмотров (по возрастанию)')}
    ],
    state_list: [
        {id: 'default', name: FdTranslator._('Значение не выбрано')},
        {id: 'published', name: FdTranslator._('Опубликованные')},
        {id: 'not_published', name: FdTranslator._('Неопубликованные')},
        {id: 'in_trashed', name: FdTranslator._('В корзине')},
    ],
    action_buttons: [],
    cols: [],
    switch_view: false,
    filters: [
        defFilter
    ],
    _filters: [],
    applyFilters: [],
    update: null
};


// getters
const getters = {
    getTableItems: state => state.items,
    getTableCols: state => state.cols,
    getTableHeight: state => state.height,
    getCrudLimits: state => state.limits,
    getCrudOrderList: state => state.order_list,
    getCrudStateList: state => state.state_list,
    getCrudActionButtons: state => state.action_buttons,
    getSwitchView: state => state.switch_view,
    getSelectedItems: state => {
        let result = [];
        state.items.forEach(function (element) {
            if (element.checked) {
                result.push(element)
            }
        });
        return result;
    },
    getFilters: state => state.filters,
    getApplyFilters: state => state.applyFilters,
    getTableUpdate: state => state.update,
};

// actions
const actions = {
    setDataUrl({commit, state}, payload) {
    },
    setTableItems({commit, state}, payload) {
        commit('setTableItems', {
            items: payload.items,
            cols: payload.cols
        })
    },
    setTableCols({commit, state}, payload) {
        commit('setTableCols', {
            items: payload
        })
    },
    setTableSwitchView({commit, state}, payload) {
        commit('setTableSwitchView', payload)
    },
    setTableItemChecked({commit, state}, payload) {
        commit('setTableItemChecked', payload)
    },
    setTableItemCheckedAll({commit, state}, payload) {
        commit('setTableItemCheckedAll', payload)
    },
    setFilterValue({commit, state}, payload) {
        commit('setFilterValue', payload)
    },
    setFilters({commit, state}, payload) {
        commit('setFilters', payload)
    },
    clearFilters({commit, state}, payload) {
        commit('clearFilters', payload)
    },
    applyFilters({commit, state}, payload) {
        commit('applyFilters', payload)
    },
    updateOperator({commit, state}, payload) {
        commit('updateOperator', payload)
    },
    setTableUpdate({commit, state}, payload) {
        commit('setTableUpdate', payload)
    },
    deleteFilters({commit, state}, payload) {
        commit('deleteFilters');
    }
};

// mutations
const mutations = {
    setFilterValue(state, payload) {
        let applyTmp = [],
            total = state._filters.length,
            pushOperator = function (prev, idx) {
                if (prev >= 0) {
                    let prevValue = state._filters.filter(function (element, idx) {
                        if (idx <= prev) {
                            return element.type != 'operator' && (element.value != null && element.value != '');
                        }
                        return false;
                    });
                    if (prevValue.length > 0) {
                        applyTmp.push(state._filters[idx - 1]);
                    }
                }
            };


        state._filters.forEach(function (element, idx) {
                if (payload.name == element.name) {
                    element.value = payload.value;
                }
                if (element.value) {
                    let prev = idx - 2;
                    switch (element.type) {
                        case 'select':
                            pushOperator(prev, idx);
                            let tmp = element.data.filter(function (value) {
                                return (element.multiple) ? (element.value.indexOf(value.id) !== -1) :
                                    (value.id.toString() == element.value.id.toString());
                            });
                            console.log(tmp)
                            if (tmp.length == 1) {
                                applyTmp.push({
                                    type: element.type,
                                    operator: element.operator,
                                    name: element.name,
                                    placeholder: element.placeholder,
                                    value: tmp[0].name,
                                    values: tmp[0].id,
                                });
                            } else if (tmp.length > 1) {
                                let tmpName = [], ids = [];
                                tmp.forEach(function (value) {
                                    tmpName.push(value.name);
                                    ids.push(value.id);
                                });
                                applyTmp.push({
                                    type: element.type,
                                    operator: element.operator,
                                    name: element.name,
                                    placeholder: element.placeholder,
                                    value: tmpName.join(', '),
                                    values: tmpName.join(','),
                                });
                            }
                            break;
                        case 'operator':
                            break;
                        case 'text':
                        default:
                            pushOperator(prev, idx);
                            applyTmp.push({
                                type: element.type,
                                name: element.name,
                                placeholder: element.placeholder,
                                value: element.value,
                                operator: element.operator,
                                idx: idx
                            });
                            break;
                    }
                }
            }
        );
        state.applyFilters = applyTmp;

    },
    setTableItems(state, payload) {
        state.cols = payload.cols;
        state.items = payload.items;
    },
    setTableCols(state, payload) {
        state.cols = payload.items;
    },
    setTableSwitchView(state, payload) {
        state.switch_view = payload;
    },
    setTableItemChecked(state, payload) {
        state.items.forEach(function (item) {
            if (item.id == payload.item.id) {
                item.checked = payload.state;
            }
        })
    },
    setTableItemCheckedAll(state, payload) {
        state.items.forEach(function (item) {
            item.checked = payload.state;
        })
    },
    setFilters(state, payload) {
        console.log(payload.length);
        if (payload.length > 0) {
            state.filters = payload;
            state._filters = [];
            payload.forEach(function (filters) {
                filters.forEach(function (element) {
                    state._filters.push(element);
                })
            })
        }
    },
    clearFilters(state, payload) {
        state._filters = [];
        let len = state.filters.length;
        state.filters.forEach(function (filters) {
            filters.forEach(function (element) {
                if (element.type != 'operator') {
                    element.value = '';
                }
                state._filters.push(element);
            })
        });
        state.applyFilters = [];
        if (len > 0) {
            state.update();
        }
    },
    deleteFilters(state, payload) {
        state.filters = defFilter;
        state.applyFilters = [];
    },
    updateOperator(state, payload) {
        state.filters.forEach(function (filters) {
            filters.forEach(function (element) {
                if (element.type == 'operator' && element.id == payload.id) {
                    element.value = payload.value;
                }
            })
        });
    },
    applyFilters(state, payload) {
        if (state.applyFilters.length > 0) {
            state.update();
        }
    },
    setTableUpdate(state, payload) {
        state.update = payload;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}