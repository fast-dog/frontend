import Vue from 'vue';
import {Component, Prop, Provide, Watch} from 'vue-property-decorator';
import {SelectFormField} from '../fields/SelectFormField';
import {DataSourceSelectField} from '../fields/DataSourceSelectField';
import {CodeEditorFormField} from '../fields/CodeEditorFormField';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';

declare let $: any;


@Component({
    name: 'catalog-item-properties',
    template: require('./views/catalog-item-properties.html'),
    components: {
        'select-form-field': SelectFormField,
        'data-source-form-field': DataSourceSelectField,
        'code-editor-form-field': CodeEditorFormField
    },
    filters: {
        'json': function (value) {
            return JSON.stringify(value, null, 2)
        },
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})

export class CatalogItemProperties extends Vue {

    @Prop({default: null})
    item: any;

    @Prop({default: false})
    is_calculate: boolean;

    @Prop({default: false})
    is_search: boolean;

    @Prop({default: 'catalog'})
    storage: string;

    @Provide()
    properties: any = [];

    @Prop({default: null})
    parent: any;

    @Provide()
    show_update_btn: boolean = false;

    showProperties(item: any): void {
        let me = this;
        item.open = (item.open == 0) ? 1 : 0;
        $(item.children).each(function (idx, element) {
            element.open = item.open;
        })
    }

    beforeDestroy(): void {
        $('a[data-toggle="tab"]').unbind('shown.bs.tab');
        this.$store.dispatch('setItemProperties', []);
    }

    @Watch('item.category_id')
    onChangeCategoryId(n, o) {
        console.log(n);
        if (n != o) {
            this.loadPropertiesTable();
        }
    }


    @Watch('$store.getters.getItemProperties')
    onChangeProperties(newValue, oldValue) {
        let me = this;
        $(newValue).each(function (idx, categories) {
            $(categories.children).each(function (idx, element) {
                let hidden = Util.getLocalVar('show-group-section-' + element.grouping_id, 'null');
                if (hidden != 'null') {
                    me.$store.dispatch('setItemPropertyField', {
                        item: element,
                        field: 'pin',
                        value: true,
                        is_calculate: me.is_calculate,
                        is_search: me.is_search,
                    });
                    me.$store.dispatch('setItemPropertyHidden', {
                        grouping_id: element.grouping_id,
                        value: JSON.parse(hidden.toString())
                    });
                }
            })
        });
    }

    mounted(): void {
        let me = this, init: boolean = false;
        me.loadPropertiesTable();
        $('a[data-toggle="tab"]').unbind('shown.bs.tab').on('shown.bs.tab', function (e) {
            switch ($(e.target).attr('href')) {
                case '#tab-properties':
                case '#tab-offer-catalog-item-properties':
                    if (init === false) {
                        init = true;
                    }
                    Util.initDigitValidators();
                    break;
                default:
                    break;
            }
        });
    }


    textChange($event: Event): void {
        let me = this;
        this.$store.dispatch('setItemPropertyValue', {
            item: {
                id: $($event.target).data('id'),
                is_calculate: me.is_calculate,
                is_search: me.is_search,
            },
            value: $($event.target).val()
        });
    }

    openFinderMulti(name: string, property: any, $index: number, $event: Event): void {
        let me = this;
        Util.openElFinder({
            name: name,
            params: {},
            callback: function (selectedFiles) {
                if (property.value.length == 1) {
                    if (property.value[0].value == '') {
                        property.value = [{id: 0, value: '', description: '', data: {hash: ''}}];
                    }
                }
                selectedFiles.forEach(function (selectedFile, idx) {
                    if (selectedFile) {
                        let push: boolean = true,
                            _mediaItem = Util.buildMediaObject(selectedFile);
                        property.value.forEach(function (element) {
                            if (push == true && element.data != undefined && _mediaItem.data.hash == element.data.hash) {
                                push = false;
                            }
                        });

                        if (push) {
                            property.value.push(Util.buildMediaObject(selectedFile))
                        }
                    }
                });
            }
        })
    }

    deleteMediaItem(property: any, media: any, $event: Event, $index?: number): void {
        let me = this, tmp = [];
        if (media.id) {
            Util.sendData({
                event: $event,
                url: 'catalog/category-properties-delete-file',
                data: {
                    id: media.id
                },
                callback: function () {
                    $(property.value).each(function (idx, element) {
                        if (media.id !== element.id) {
                            tmp.push(element);
                        }
                    });
                    if (tmp.length == 0) {
                        tmp.push({id: 0, value: '', description: '', data: {hash: ''}})
                    }
                    property.value = tmp;
                }
            }, me);
        } else {
            $(property.value).each(function (idx, element) {
                if (idx !== $index) {
                    tmp.push(element);
                }
            });
            if (tmp.length == 0) {
                tmp.push({id: 0, value: '', description: '', data: {hash: ''}})
            }
            property.value = tmp;
        }
    }

    toggleProperty(property: any): void {
        let me = this,
            key = 'show-group-section-' + property.grouping_id,
            hidden = (property.hidden == true) ? false : true;

        me.$store.dispatch('setItemPropertyHidden', {
            grouping_id: property.grouping_id,
            value: hidden
        });

        this.$store.dispatch('setItemPropertyField', {
            item: property,
            field: 'pin',
            value: false
        });
        Util.setLocalVar(key, null);
    }

    toggleShowProperty(property: any): void {
        if (property.grouping_id > 0) {
            let key = 'show-group-section-' + property.grouping_id,
                value = Util.getLocalVar(key, null);

            if (value === 'null') {
                this.$store.dispatch('setItemPropertyField', {
                    item: property,
                    field: 'pin',
                    value: true
                });
                Util.setLocalVar(key, property.hidden);
            } else {
                this.$store.dispatch('setItemPropertyField', {
                    item: property,
                    field: 'pin',
                    value: false
                });
                Util.setLocalVar(key, null);
            }
        }
    }

    loadPropertiesTable(callback?: any): void {
        let me = this;
        me.$set(me, 'properties', []);
        if (me.item.category_id !== null) {
            me.$store.dispatch('loadProperties', {
                item: me.item, callback: callback,
                is_calculate: me.is_calculate,
                is_search: me.is_search,
                storage: me.storage,
            });
        }
    }

    removedSelectModel(payload): void {
        if (payload) {
            let me = this;
            this.$store.dispatch('setItemPropertyValue', {
                item: {
                    id: payload.property_id,
                    is_calculate: me.is_calculate,
                    is_search: me.is_search,
                },
                value: null
            });
        }
    }

    removedSelectMultipleModel(payload): void {
        if (payload) {
            let me = this;
            this.$store.dispatch('setItemPropertyValue', {
                item: {
                    id: payload.property_id,
                    remove: true,
                    is_calculate: me.is_calculate,
                    is_search: me.is_search,
                },
                value: payload.id
            });
        }
    }

    updatedSelectModel(payload): void {
        if (payload) {
            let me = this;
            this.$store.dispatch('setItemPropertyValue', {
                item: {
                    id: payload.property_id,
                    is_calculate: me.is_calculate,
                    is_search: me.is_search,
                },
                value: payload.id
            });
        }
    }

    updatedSelectMultipleModel(payloads): void {
        if (payloads) {
            let me = this;
            payloads.forEach(function (payload) {
                me.$store.dispatch('setItemPropertyValue', {
                    item: {
                        id: payload.property_id,
                        remove: false,
                        is_calculate: me.is_calculate,
                        is_search: me.is_search,
                    },
                    value: payload.id
                });
            })

        }
    }

    propertyChange($event: Event): void {
        console.log($event);
    }

    getProperties(): any {
        let result = (this.is_calculate) ? this.$store.getters.getItemPropertiesOffer : this.$store.getters.getItemProperties;

        return (result == undefined) ? [] : result;
    }

}