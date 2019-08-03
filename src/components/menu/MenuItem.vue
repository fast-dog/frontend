<template>
    <form-manager :model="item"></form-manager>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Provide, Watch} from 'vue-property-decorator'
    import FormBuilder from '@/components/form/FormBuilder.vue';
    import {FdTranslator} from "@/FdTranslator";
    import {Util} from "@/Util";
    import {MenuService} from "@/services/MenuService";

    declare let $: any;

    @Component({
        name: 'MenuItem',
        components: {
            'form-manager': FormBuilder
        }
    })

    export default class MenuItem extends Vue {

        @Provide()
        item: any = null;

        @Provide()
        menuItems: any = null;

        @Provide()
        menuTypes: any = null;

        @Provide()
        modules: any = null;

        @Watch('item.menu_id')
        onChangeMenuId(n, o) {
            if (n && n.id) {
                let me = this,
                    parentIdFieldData: any = this.$store.getters.getSelectDataById('parent_id');

                if (parentIdFieldData && me.menuItems[n.id]) {
                    parentIdFieldData.callback(me.menuItems[n.id]);
                    parentIdFieldData.clearValue();
                }
            }
        }

        @Watch('item.alias_menu_id')
        onChangeAliasMenuId(n, o) {
            if ((n && o) && (n.id != o.id)) {
                let me = this,
                    parentIdFieldData: any = this.$store.getters.getSelectDataById('alias_id');
                if (parentIdFieldData && me.menuItems[n.id]) {
                    parentIdFieldData.callback(me.menuItems[n.id]);
                    parentIdFieldData.clearValue();
                }
            }
        }

        @Watch('item.__template')
        onChangeTemplate(newTpl, oldTpl) {
            let me = this;
            if (me.modules[me.item.type] != undefined) {
                if (me.modules[me.item.type].templates !== undefined) {
                    for (let i in me.modules[me.item.type].templates) {
                        let templates = me.modules[me.item.type].templates[i].templates,
                            templateObj = templates.filter(function (element) {
                                return element.id == newTpl;
                            });
                        if (templateObj.length > 0) {
                            me.item.template_raw = templateObj[0].raw;

                            if (templateObj[0].translate !== undefined && templateObj[0].translate.length > 0) {
                                me.item.translate = templateObj[0].translate;
                            }

                            me.$nextTick(function () {
                                $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                                    switch ($(e.target).attr('href')) {
                                        case '#menu-item-translate-tab':
                                            me.$store.dispatch('toggleButton', {id: 'save-menu-lang', visible: true});
                                            break;
                                        case '#menu-item-templates-tab':
                                            let fieldObj = me.$store.getters.getFormItemById('template_raw');
                                            if (fieldObj) {
                                                let instance = fieldObj.instance();
                                                instance.mode_html = 'html';
                                                me.$nextTick(function () {
                                                    instance.initCodeMirror(me.item.template_raw);
                                                });
                                                me.$store.dispatch('toggleButton', {
                                                    id: 'save-menu-template',
                                                    visible: true
                                                });
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                }).on('hidden.bs.tab', function (e) {
                                    switch ($(e.target).attr('href')) {
                                        case '#menu-item-translate-tab':
                                            me.$store.dispatch('toggleButton', {id: 'save-menu-lang', visible: false});
                                            break;
                                        case '#menu-item-templates-tab':
                                            me.$store.dispatch('toggleButton', {
                                                id: 'save-menu-template',
                                                visible: false
                                            });
                                            break;
                                        default:
                                            break;
                                    }
                                })
                            })
                        }
                    }
                }
            }
        }

        @Watch('item.type')
        onChangeMenuType(n, o) {
            let me = this,
                type = (n) ? n.id : '',
                moduleType = (type !== '') ? type.split('::') : null;
            if (moduleType) {
                me.$nextTick(function () {
                    type = moduleType[0];
                    let typeFieldData: any = me.$store.getters.getSelectDataById('template');

                    if (n.templates) {
                        let templates = [];
                        for (let key in n.templates) {
                            let tpm = [];
                            for (let id in n.templates[key].templates) {
                                tpm.push({
                                    id: n.templates[key].templates[id].id,
                                    name: n.templates[key].templates[id].name,
                                })
                            }

                            templates.push({
                                id: key,
                                name: key,
                                items: tpm
                            })
                        }

                        typeFieldData.callback(templates);
                    }
                })
            }
        }

        mounted(): void {
            this.getItem();
        }

        getItem(): void {
            let me = this;
            if (me.$route.params.id) {
                if (me.$route.params.id == 'new') {
                    me.$route.params.id = '0';
                }
                MenuService.itemNavigation(me.$route.params.id).then((response: any) => {
                    me.prepareResponse(response);
                }, (response) => {
                    Util.errorHandler(response)
                });
            } else if (this.$route.params.parent_id) {
                MenuService.itemRoot(this.$route.params.parent_id).then((response: any) => {
                    me.prepareResponse(response);
                }, (response) => {
                    Util.errorHandler(response)
                });
            }
        }

        prepareResponse(response: any): void {
            let me = this;
            if (response.data.success) {
                me.$store.dispatch('setBreadcrumbs', {
                    items: response.data.breadcrumbs,
                    page_title: response.data.page_title
                });

                me.$set(me, 'item', response.data.item);// <-- Обновляемый объект
                me.$set(me, 'menuItems', response.data.menu_items);// <-- Структура меню
                me.$set(me, 'menuTypes', response.data.types);// <-- Типы меню
                me.$set(me, 'modules', response.data.modules);// <-- Доступные модули
                // me.$set(me, 'categories', response.data.categories);// <-- Доступные категории (Материалы, Каталог)
                let url = me.item.id == 0 ? response.data.form.create_url : response.data.form.update_url;

                me.$store.dispatch('setForm', {// <-- ставим форму в хранилище
                    name: 'menu-item',
                    content: {
                        buttons: Util.buttons([
                            Util.buttonSave({
                                me: me,
                                url: url,
                                item: me.item,
                                callback: function () {
                                    me.getItem();
                                },
                                route_name: ''
                            }),
                            Util.buttonSaveAndClose({
                                me: me,
                                url: url,
                                item: me.item,
                                route_name: '',
                                callback: function (response) {
                                    window.history.back()
                                }
                            }),
                            Util.buttonUpdate({
                                callback: function () {
                                    me.$store.dispatch('setBreadcrumbs', {
                                        items: []
                                    });
                                    me.$set(me, 'item', {});
                                    me.$store.dispatch('clearForm');
                                    me.getItem();
                                }
                            }),
                            Util.buttonDelete('menu/update', me.item)
                            // {
                            //     text: FdTranslator._('Сохранить шаблон'),
                            //     icon: 'fa-code',
                            //     cls: 'btn-success',
                            //     visible: false,
                            //     id: 'save-menu-template',
                            //     action: function ($event) {
                            //         Util.sendData({
                            //             url: 'menu/api/template',
                            //             data: {
                            //                 template: me.item.template,
                            //                 raw: me.item.template_raw
                            //             },
                            //             event: $event,
                            //             callback: function (response) {
                            //             }
                            //         }, me)
                            //     }
                            // },
                            // {
                            //     text: FdTranslator._('Сохранить локализацию'),
                            //     icon: 'fa-language',
                            //     cls: 'btn-success',
                            //     visible: false,
                            //     id: 'save-menu-lang',
                            //     action: function ($event) {
                            //         Util.sendData({
                            //             url: 'menu/api/translate',
                            //             data: {
                            //                 template: me.item.template,
                            //                 translate: me.item.translate
                            //             },
                            //             event: $event,
                            //             callback: function (response) {
                            //             }
                            //         }, me)
                            //     }
                            // }
                        ]),
                        tabs: response.data.form.tabs
                    }
                })
            }
        }

    }
</script>

<style scoped>

</style>
