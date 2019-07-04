import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop, Provide, Watch} from 'vue-property-decorator';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';
import {CrudService} from '@/services/CrudService';


declare let $: any;

@Component({
    name: 'catalog-category-properties',
    template: require('./views/catalog-category-properties.html'),
    filters: {
        'json': function (value) {
            return JSON.stringify(value, null, 2)
        },
        _: function (value) {
            return FdTranslator._(value);
        }
    },
})

export class CatalogCategoryProperties extends Vue {

    @Prop({default: null})
    item: any;

    @Provide()
    properties: any = null;

    @Provide()
    openItem: any = null;

    @Provide()
    properties_type: any = null;

    @Provide()
    properties_data_source: any = null;

    @Provide()
    id: number = 0;

    @Provide()
    timeout: any = 1000;

    @Provide()
    actionButtons: [{
        text: string,
        icon: string,
        cls: string,
        action: any,
        visible: boolean
    }] = null;

    @Provide()
    grouping_list: any = null;

    @Watch('openItem.type')
    onChangeOpenItemType(newValue, oldValue) {
        if (newValue) {
            let me = this;
            switch (newValue.id) {
                case 'list':
                    if (!$.isArray(me.openItem.default_value)) {
                        me.openItem.default_value = [];
                        me.openItem.default_value.push({
                            property_id: me.openItem.id,
                            name: '', alias: '', id: 0
                        });
                    }
                    break;
            }
            // console.log(newValue);
        }
    }

    mounted(): void {
        let me = this;
        me.id = parseInt(this.$route.params.id);
        me.$set(me, 'actionButtons', [
            // Util.buttonBack(function () {
            //     me.$router.push({name: 'catalog_categories'});
            // }),
            {
                text: FdTranslator._('Сохранить'),
                icon: 'fa-pencil-square-o',
                cls: 'btn-primary btn-sm',
                visible: true,
                action: function ($event) {
                    me.openItem.base_category_id = me.id;
                    Util.sendData({
                        event: $event,
                        url: 'catalog/category/property',
                        data: me.openItem,
                        callback: function (response) {
                            if (response.data.success) {
                                me.$set(me, 'properties', response.data.properties);
                                me.properties.forEach(function (root) {
                                    root.children.forEach(function (element) {
                                        if (element.id == me.openItem.id) {
                                            me.openItem = element;
                                            me.prepareOpenItem();
                                        }
                                    })
                                });
                            }
                        }
                    }, me)
                }
            },
            {
                text: FdTranslator._('Сохранить и закрыть'),
                icon: 'fa-check',
                cls: 'btn-default btn-sm',
                visible: true,
                action: function ($event) {
                    me.openItem.base_category_id = me.id;
                    Util.sendData({
                        event: $event,
                        url: 'catalog/category/property',
                        data: me.openItem,
                        callback: function (response) {
                            let modal = $('#catalogPropertyModal');
                            $(modal).modal('hide');
                        }
                    }, me)
                }
            },
            {
                text: FdTranslator._('Очистить значения'),
                icon: 'fa-trash',
                cls: 'btn-default btn-sm',
                visible: true,
                action: function ($event) {
                    $event.preventDefault();
                    Util.deleteDialog({
                        text: 'Будут удалены все (' + me.openItem.count_property + ') значения для данного свойства',
                        title: '',
                        callback: function () {
                            if ((me.openItem.count_property > 0)) {
                                Util.sendData({
                                    event: $event,
                                    url: 'catalog/category/property-clear-value',
                                    data: me.openItem,
                                    callback: function (response) {
                                    }
                                }, me)
                            }
                        }
                    })
                }
            },
            {
                text: FdTranslator._('Удалить'),
                icon: 'fa-trash-o',
                cls: 'btn-danger btn-sm',
                visible: true,
                action: function ($event) {
                    $event.preventDefault();
                    Util.deleteDialog({
                        text: 'Свойство и все (' + me.openItem.count_property + ') значения будут удалены, Вы уверены?',
                        title: '',
                        callback: function () {
                            Util.sendData({
                                event: $event,
                                url: 'catalog/category/property-delete',
                                data: me.openItem,
                                callback: function (response) {
                                }
                            }, me)
                        }
                    })
                }
            }
        ]);
        me.$set(me, 'openItem', null);
        me.$set(me, 'properties', me.item.catalog_properties);
        me.$set(me, 'properties_type', me.item.properties_type);
        me.$set(me, 'properties_data_source', me.item.properties_data_source);
        me.$set(me, 'grouping_list', me.item.grouping_list);

        me.$nextTick(function () {
            $('a[data-action="check_tabs"]').on('shown.bs.tab', function (e) {
                Util.setLocalVar('open-tab', $(e.target).data('id'));
            })
        })

    }

    beforeDestroy(): void {
        $('a[data-toggle="tab"]').unbind('shown.bs.tab')
    }


    showProperties(item: any): void {
        let me = this;
        item.open = (item.open == 0) ? 1 : 0;
        $(item.children).each(function (idx, element) {
            element.open = item.open;
        });
    }

    cmd(item: any, action: string, $event: Event): void {
        let me = this, timeout = 1200;

        if (me.timeout) {
            clearTimeout(me.timeout);
        }
        item.base_category_id = me.id;
        switch (action) {
            case 'change':
                // if (item.id == 0) {
                //     item.code = Util.translit(item.name, 1).replace(/ |-/g, '_').toUpperCase();
                // }
                break;
            case 'published':
                timeout = 1;
                item.state = (item.state == 1) ? 0 : 1;
                break;
            case 'trashed':
                if (item.is_system == 1) {
                    return;
                }
                timeout = 1;
                item.deleted_at = (item.deleted_at == 0) ? 1 : 0;
                break;
        }
        me.timeout = setTimeout(function () {
            me.save(item);
        }, timeout)
    }

    save(item: any): void {
        let me = this;
        me.item.base_category_id = me.id;
        CrudService.post(Util.httpRoot + 'catalog/category/property', item).then((response: any) => {
            if (response.data.success) {
                Util.showSuccess('Команда выполнена успешно');
                me.$set(me, 'properties', response.data.properties);
            } else {
                Util.errorHandler(response)
            }
        }, (response) => {
            Util.errorHandler(response)
        });
    }

    prepareOpenItem(): void {
        let me = this;
        me.properties_type.forEach(function (element) {
            if (element.id == me.openItem.type) {
                me.openItem.type = element;
            }
        });

        me.grouping_list.forEach(function (element) {
            if (element.id == parseInt(me.openItem.grouping_id)) {
                me.openItem.grouping_id = element;
            }
        });
    }

    showFullSetting(item: any, propertyParent: any): void {
        let me = this;
        item.base_category_id = me.id;
        me.openItem = item;
        me.$set(me, 'actionButtons', Util.buttonCmd(me.actionButtons, {
            icon: 'fa-trash-o',
            field: 'visible',
            value: (me.openItem.is_system != 1)
        }));

        me.prepareOpenItem();


        me.$nextTick(function () {
            let modal = $('#catalogPropertyModal'), selectize = null;
            $(modal).on('show.bs.modal', function () {
                $(modal).unbind('show.bs.modal');
                Util.initDigitValidators();
                Util.initTooltip();
            });
            $(modal).modal('show');
            $(modal).on('hide.bs.modal', function () {
                me.openItem = {type: {id: ''}, data: {icon: '', grouping: ''}};
                $(modal).unbind('hide.bs.modal');

            })
        })
    }

    addGrouping(newGroupName: string): void {
        let me = this;
        Util.sendData({
            url: 'catalog/category/property/grouping/update',
            data: {
                id: 0,
                name: newGroupName,
                category_id: me.openItem.category_id
            },
            callback: function (response) {
                if (response.data.success) {
                    me.grouping_list.push(response.data.items[0]);
                    me.openItem.grouping_id = response.data.items[0];
                    return true;
                }
                return name;
            }
        }, me);
    }


    openFinder(name: string, openItem: any): void {
        let me = this;
        Util.openElFinder({
            name: name,
            params: '',
            callback: function (selectedFile) {
                if (selectedFile) {
                    me.$set(me, 'openItem.data.default_value', selectedFile.path);
                }
            }
        })
    }

    openFinderIcon(name: string, openItem: any): void {
        let me = this;
        Util.openElFinder({
            name: name,
            params: '',
            callback: function (selectedFile) {
                if (selectedFile) {
                    me.$set(me, 'openItem.data.icon', selectedFile.url.toString().replace(window.location.protocol + '//' + window.location.hostname, ''));
                }
            }
        })
    }

    getPropertyName(id: string): string {
        let result = '';
        $(this.properties_type).each(function (idx, element) {
            if (element.id == id) {
                result = element.name;
                return;
            }
        });
        return result;
    }

    addDefaultValue(item: any): void {
        if (!$.isArray(item.default_value)) {
            item.default_value = [];
        }
        item.default_value.push({
            property_id: item.id,
            name: '', alias: '', id: 0
        });
    }

    removeDefaultValue(item: any, propertyValue, idx: any, $event: Event): void {
        let me = this, tmp = [];
        if (propertyValue.id > 0) {
            Util.sendData({
                event: $event,
                url: 'catalog/category/property/delete-value',
                data: {
                    id: propertyValue.id
                },
                callback: function (response) {
                    item.default_value.forEach(function (element) {
                        if (element.id !== propertyValue.id) {
                            tmp.push(element);
                        }
                    });
                    if (tmp.length == 0) {
                        tmp.push({
                            property_id: item.id,
                            name: '', alias: '', id: 0
                        })
                    }
                    item.default_value = tmp;
                }
            }, me);
        } else {
            item.default_value.forEach(function (element, idxElement) {
                if (idx !== idxElement) {
                    tmp.push(element);
                }
            });
            if (tmp.length == 0) {
                tmp.push({
                    property_id: item.id,
                    name: '', alias: '', id: 0
                })
            }
            item.default_value = tmp;
        }
    }

    getPropertyType(type: any): string {

        let me = this, result: string = type;

        me.properties_type.forEach(function (element) {
            if (element.id == type || (type.id !== undefined && type.id == element.id)) {
                result = element.name;
            }
        });

        return result;
    }
}