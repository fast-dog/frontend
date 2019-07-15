<template>
    <form-manager :model="item"></form-manager>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Provide, Watch} from 'vue-property-decorator'
    import {Util} from '@/Util';
    import {UsersService} from '@/services/UsersService';
    import {FdTranslator} from '@/FdTranslator';
    import FormBuilder from '@/components/form/FormBuilder.vue';
    import {ConfigService} from '@/services/ConfigService';

    declare let $: any;

    @Component({
        name: 'ComponentsItem',
        components: {
            'form-manager': FormBuilder
        }
    })

    export default class ComponentsItem extends Vue {

        @Provide()
        id: number = null;

        @Provide()
        load: boolean = false;

        @Provide()
        item: any = {id: 0};

        @Watch('item.type')
        onChangeItemType(n, o) {
            if (n != o && o != undefined/**/) {
                let me = this,
                    parentIdFieldData: any = this.$store.getters.getSelectDataById('type'),
                    templatesIdFieldData: any = this.$store.getters.getSelectDataById('template');
                if (parentIdFieldData) {
                    parentIdFieldData.items.forEach(function (element) {
                        element.items.forEach(function (type) {
                            if (type.id == n.id) {
                                let templates = [];
                                for (let key in type.templates) {
                                    let tpm = [];
                                    for (let id in type.templates[key].templates) {
                                        tpm.push({
                                            id: type.templates[key].templates[id].id,
                                            name: type.templates[key].templates[id].name,
                                        })
                                    }
                                    templates.push({
                                        id: key,
                                        name: key,
                                        items: tpm
                                    })
                                }

                                templatesIdFieldData.callback(templates);
                            }
                        })
                    })
                }
            }
        }

        @Watch('item.item_id')
        onChangeItemId(n, o) {
            let me = this;
            switch (me.item.type) {
                case 'data_source::pages':
                    let elementSearch: any = this.$store.getters.getFormItemById('data_source_item_id');
                    if (elementSearch) {
                        me.$store.dispatch('updateSearchFieldFilter', {
                            instance: elementSearch.instance(),
                            filter: {
                                id: n
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        }


        getItem(): void {
            let me = this;
            ConfigService.getComponentItem(this.id).then((response: any) => {
                if (response.data.success) {
                    me.prepareResponse(response);
                } else {
                    Util.errorHandler(response)
                }
            }, (response) => {
                Util.errorHandler(response)
            });
        }

        mounted(): void {
            let me = this;
            this.id = parseInt(this.$route.params.id);
            if (this.$route.params.id == 'new') {
                this.id = 0;
            }
            me.getItem();
        }

        prepareResponse(response: any): void {
            let me = this;
            me.$store.dispatch('setBreadcrumbs', {
                items: response.data.breadcrumbs,
                page_title: response.data.page_title
            });

            me.item = response.data.items[0];// <-- Обновляемый объект

            if (response.data.notifications) {
                me.$store.dispatch('setNotifications', response.data.notifications);
            }


            me.$store.dispatch('setForm', {// <-- ставим форму в хранилище
                name: 'component-item',
                help: response.data.form.help,
                content: {
                    buttons: Util.buttons([
                        Util.buttonBack(function () {
                            me.$router.push({name: 'component_items'});
                        }),
                        {
                            text: FdTranslator._('Сохранить'),
                            icon: 'fa-pencil-square-o',
                            cls: 'btn-primary btn-sm',
                            id: 'save-content-btn',
                            action: function ($event) {
                                me.$validator.validateAll().then((result) => {
                                    if (result) {
                                        Util.sendData({
                                            url: me.item.id > 0 ? 'config/components/save' : 'config/components/add',
                                            data: me.item,
                                            event: $event,
                                            callback: function (response) {
                                                if (response.data.success) {
                                                    me.prepareResponse(response);
                                                }
                                                me.$store.dispatch('setRouteNotify', false);
                                            }
                                        }, me)
                                    }
                                });
                            }
                        },
                        {
                            text: FdTranslator._('Сохранить и закрыть'),
                            icon: 'fa-check',
                            cls: 'btn-default btn-sm',
                            id: 'save-and-close-btn',
                            action: function ($event) {
                                me.$validator.validateAll().then((result) => {
                                    if (result) {
                                        Util.sendData({
                                            url: me.item.id > 0 ? 'config/components/save' : 'config/components/add',
                                            data: me.item,
                                            event: $event,
                                            callback: function (response) {
                                                me.$store.dispatch('setRouteNotify', false);
                                                me.$router.push({name: 'component_items'});
                                            }
                                        }, me)
                                    }
                                });
                            }
                        },
                        {
                            text: FdTranslator._('Сохранить копию'),
                            icon: 'fa-copy',
                            cls: 'btn-default btn-sm',
                            id: 'replicate-btn',
                            visible: false,
                            action: function ($event) {
                                me.$validator.validateAll().then((result) => {
                                    if (result) {
                                        Util.sendData({
                                            url: 'config/components/replicate',
                                            data: me.item,
                                            event: $event,
                                            callback: function (response) {
                                                me.$store.dispatch('setRouteNotify', false);
                                                me.$router.push({
                                                    name: 'component_item',
                                                    params: {id: response.data.id}
                                                });
                                            }
                                        }, me)
                                    }
                                });
                            }
                        },
                        {
                            text: FdTranslator._('Обновить'),
                            icon: 'fa-repeat',
                            cls: 'btn-sm btn-default',
                            visible: true,
                            id: 'update-content-btn',
                            action: function ($event) {
                                me.update();
                            }
                        }
                    ]),
                    tabs: response.data.form.tabs
                }
            });

            me.$nextTick(function () {
                me.$set(me, 'load', true);// <-- флаг загрузки модели
                $('.dropdown-toggle').dropdown();
                $('.tooltip-container').tooltip({
                    selector: '[data-toggle=tooltip]',
                    container: 'body'
                });
            })
        }

        update(): void {
            let me = this;
            me.$store.dispatch('setRouteNotify', false);
            me.$store.dispatch('setBreadcrumbs', {
                items: []
            });
            me.$set(me, 'item', {});
            me.$store.dispatch('clearForm');
            me.getItem();
        }

    }
</script>

<style scoped>

</style>