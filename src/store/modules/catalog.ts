import {Util} from '@/Util';
import {CrudService} from '@/services/CrudService';


declare let $: any;

const state = {
    properties: [],
    categoryProperties: [],
    itemProperties: [],
    itemPropertiesOffer: [],
};

// getters
const getters = {
    getProperties: state => state.properties,
    getCategoryProperties: state => state.categoryProperties,
    getItemProperties: state => state.itemProperties,
    getItemPropertiesOffer: state => state.itemPropertiesOffer,
};

// actions
const actions = {
    loadProperties({commit, state}, payload) {
        if (payload.item.category_id.id === undefined) {
            return;
        }
        let me = this, data_url = Util.httpRoot + 'catalog/category-properties-list?item_id=' + payload.item.id +
            '&category_id=' + payload.item.category_id.id + '&storage=' + payload.storage;
        if (payload.is_calculate) {
            data_url += '&is_calculate=Y';
        }
        if (payload.is_search) {
            data_url += '&is_search=Y';
        }
        CrudService.get(data_url, {}).then((response: any) => {
            if (response.data.success) {
                $(response.data.properties).each(function (idx, property) {
                    $(property.children).each(function (idx, element) {
                        switch (element.type) {
                            case 'data_source':
                                let url: string = 'data-source/value-list?id=' + parseInt(element.data.default_value) +
                                    '&property_id=' + element.id;

                                if (element.value && parseInt(element.value.id) > 0) {
                                    url += '&value_id=' + element.value.id +
                                        '&value=' + (parseInt(element.value.value)/* / element.id*/)
                                }
                                if (element.load_data) {
                                    CrudService.get(Util.httpRoot + url, {}).then((response: any) => {
                                        if (response.data.success) {
                                            commit('setItemPropertyField', {
                                                item: element,
                                                field: 'default_data',
                                                value: response.data.items
                                            });
                                        }
                                    }, (response) => {
                                        Util.errorHandler(response);
                                    });
                                }
                                break;
                        }
                    });
                });
                if (payload.is_calculate) {
                    commit('setItemPropertiesOffer', response.data.properties);
                } else {
                    commit('setItemProperties', response.data.properties);
                }

                if (payload.callback) {
                    payload.callback();
                }
            }
        }, (response) => {
            Util.errorHandler(response)
        });
        commit('setProperties', payload);
    },
    pushProperty({commit, state}, payload) {
        commit('pushProperty', payload);
    },
    pushCategoryProperties({commit, state}, payload) {
        commit('pushCategoryProperties', payload);
    },
    setItemProperties({commit, state}, payload) {
        commit('setItemProperties', payload);
    },
    setItemPropertiesOffer({commit, state}, payload) {
        commit('setItemPropertiesOffer', payload);
    },
    setItemPropertyField({commit, state}, payload) {
        commit('setItemPropertyField', payload);
    },
    setItemPropertyValue({commit, state}, payload) {
        commit('setItemPropertyValue', payload);
    },
    setItemPropertyHidden({commit, state}, payload) {
        commit('setItemPropertyHidden', payload);
    },
    addPropertyMediaItem({commit, state}, payload) {
        commit('addPropertyMediaItem', payload);
    },
};


// mutations
const mutations = {
    setItemPropertyField(state, payload: { item: any, field: string, value: any }) {
        state.itemProperties.forEach(function (item, idx) {
            if (item.children.length) {
                item.children.forEach(function (property, idxChild) {
                    if (property.id == payload.item.id) {
                        state.itemProperties[idx].children[idxChild][payload.field] = payload.value;
                    }
                })
            }
        });
    },
    setItemPropertyHidden(state, payload: { grouping_id: any, value: any }) {
        state.itemProperties.forEach(function (item, idx) {
            if (item.children.length) {
                item.children.forEach(function (property, idxChild) {
                    if (property.grouping_id == payload.grouping_id) {
                        state.itemProperties[idx].children[idxChild].hidden = payload.value;
                    }
                })
            }
        });
    },
    setItemPropertyValue(state, payload: { item: { id: number, remove?: boolean, is_calculate?: boolean }, value: any }) {


        let properties = (payload.item.is_calculate) ? state.itemPropertiesOffer : state.itemProperties;

        properties.forEach(function (item, idx) {

            if (item.children.length) {
                item.children.forEach(function (property, idxChild) {

                    if (property.id == payload.item.id) {
                        switch (property.type) {
                            case 'data_source':
                                if (payload.value === null) {
                                    if (payload.item.is_calculate) {
                                        state.itemPropertiesOffer[idx].children[idxChild].value = (property.multiple) ? [] : null;
                                    } else {
                                        state.itemProperties[idx].children[idxChild].value = (property.multiple) ? [] : null;
                                    }
                                } else {
                                    property.default_value.forEach(function (value) {
                                        if (property.multiple) {
                                            payload.value.forEach(function (payloadValue) {
                                                if (value.id == payloadValue.id) {
                                                    let add = true, tmp = [];
                                                    properties[idx].children[idxChild].value.forEach(function (element) {
                                                        if (payload.item.remove === false && element.id == payloadValue.id) {
                                                            add = false;
                                                        }
                                                        if (payload.item.remove === true) {
                                                            if (element.id != value.id) {
                                                                tmp.push(element);
                                                            }
                                                        }
                                                    });
                                                    if (payload.item.remove === false && add) {
                                                        if (payload.item.is_calculate) {
                                                            state.itemPropertiesOffer[idx].children[idxChild].value.push(value);
                                                        } else {
                                                            state.itemProperties[idx].children[idxChild].value.push(value);
                                                        }
                                                    }
                                                    if (payload.item.remove === true) {
                                                        if (payload.item.is_calculate) {
                                                            state.itemPropertiesOffer[idx].children[idxChild].value = tmp;
                                                        } else {
                                                            state.itemProperties[idx].children[idxChild].value = tmp;
                                                        }
                                                    }
                                                }
                                            })
                                        } else {

                                        }

                                        if (value.id == payload.value) {

                                            if (property.multiple) {
                                                let add = true, tmp = [];
                                                properties[idx].children[idxChild].value.forEach(function (element) {
                                                    if (payload.item.remove === false && element.id == value.id) {
                                                        add = false;
                                                    }
                                                    if (payload.item.remove === true) {
                                                        if (element.id != value.id) {
                                                            tmp.push(element);
                                                        }
                                                    }
                                                });
                                                if (payload.item.remove === false && add) {
                                                    if (payload.item.is_calculate) {
                                                        state.itemPropertiesOffer[idx].children[idxChild].value.push(value);
                                                    } else {
                                                        state.itemProperties[idx].children[idxChild].value.push(value);
                                                    }
                                                }
                                                if (payload.item.remove === true) {
                                                    if (payload.item.is_calculate) {
                                                        state.itemPropertiesOffer[idx].children[idxChild].value = tmp;
                                                    } else {
                                                        state.itemProperties[idx].children[idxChild].value = tmp;
                                                    }
                                                }
                                            } else {
                                                if (payload.item.is_calculate) {
                                                    state.itemPropertiesOffer[idx].children[idxChild].value = value
                                                } else {
                                                    state.itemProperties[idx].children[idxChild].value = value
                                                }
                                            }
                                        }
                                    });
                                    if (property.multiple) {

                                    } else {


                                    }
                                }

                                break;
                            case 'list':
                            case 'exist':
                                if (payload.value === null) {
                                    if (payload.item.is_calculate) {
                                        state.itemPropertiesOffer[idx].children[idxChild].value = (property.multiple) ? [] : null;
                                    } else {
                                        state.itemProperties[idx].children[idxChild].value = (property.multiple) ? [] : null;
                                    }
                                }
                                property.default_value.forEach(function (value) {
                                    if (value.id == payload.value) {
                                        if (value.multiple) {
                                            let add = true, tmp = [];
                                            properties[idx].children[idxChild].value.forEach(function (element) {
                                                if (payload.item.remove === false && element.id == value.id) {
                                                    add = false;
                                                }
                                                if (payload.item.remove === true) {
                                                    if (element.id != value.id) {
                                                        tmp.push(element);
                                                    }
                                                }
                                            });
                                            if (payload.item.remove === false && add) {
                                                if (payload.item.is_calculate) {
                                                    state.itemPropertiesOffer[idx].children[idxChild].value.push(value);
                                                } else {
                                                    state.itemProperties[idx].children[idxChild].value.push(value);
                                                }
                                            }
                                            if (payload.item.remove === true) {
                                                if (payload.item.is_calculate) {
                                                    state.itemPropertiesOffer[idx].children[idxChild].value = tmp;
                                                } else {
                                                    state.itemProperties[idx].children[idxChild].value = tmp;
                                                }
                                            }
                                        } else {
                                            if (payload.item.is_calculate) {
                                                state.itemPropertiesOffer[idx].children[idxChild].value = value
                                            } else {
                                                state.itemProperties[idx].children[idxChild].value = value
                                            }
                                        }
                                    }
                                });
                                break;
                            case 'string':
                                // case 'number':
                                if (payload.item.is_calculate) {
                                    state.itemPropertiesOffer[idx].children[idxChild].value.value = payload.value;
                                } else {
                                    state.itemProperties[idx].children[idxChild].value.value = payload.value;
                                }
                                break;
                            default:
                                if (payload.item.is_calculate) {
                                    state.itemPropertiesOffer[idx].children[idxChild].value = payload.value;
                                } else {
                                    state.itemProperties[idx].children[idxChild].value = payload.value;
                                }
                                break;
                        }
                    }
                })
            }
        });
    },
    setItemProperties(state, payload) {
        state.itemProperties = payload;
    },
    setItemPropertiesOffer(state, payload) {
        state.itemPropertiesOffer = payload;
    },
    setProperties(state, payload) {
        state.properties = payload;
    },
    pushProperty(state, payload) {
        state.properties.push(payload);
    },
    pushCategoryProperties(state, payload) {
        state.categoryProperties.push(payload);
    },
    updateProperty(state, payload) {
        payload.property.default_data = payload.value;
    },
    updateField(state, payload) {
        payload.model[payload.field] = payload.value;
    },
    addPropertyMediaItem(state, payload) {
        let tmp = [];
        payload.property.forEach(function (element, idx) {
            if (payload.media.value != element.value) {
                tmp.push(payload.media);
            }
        });
        payload.property = tmp;

    },
};

export default {
    state,
    getters,
    actions,
    mutations
}