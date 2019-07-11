<template>
    <form-manager :model="item"></form-manager>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Provide, Watch} from 'vue-property-decorator';
    import FormBuilder from '@/components/form/FormBuilder.vue';
    import {UsersService} from '@/services/UsersService';
    import {Util} from '@/Util';
    import {FdTranslator} from '@/FdTranslator';


    declare let $: any;


    @Component({
        name: 'UsersMailingItem',
        components: {
            'form-manager': FormBuilder
        }
    })

    export default class UsersMailingTemplateItem extends Vue {

        @Provide()
        id: number = null;


        @Provide()
        item: any = {id: 0};

        getItem(): void {
            let me = this;
            UsersService.getMailingTemplate(this.id).then((response: any) => {
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
            me.$set(me, 'item', response.data.items[0]);// <-- Обновляемый объект

            if (response.data.notifications) {
                me.$store.dispatch('setNotifications', response.data.notifications);
            }


            me.$store.dispatch('setForm', {// <-- ставим форму в хранилище
                name: 'mailing-template-item',
                help: response.data.form.help,
                content: {
                    buttons: Util.buttons([
                        {
                            text: FdTranslator._('Сохранить'),
                            icon: 'fa-pencil-square-o',
                            cls: 'btn-primary btn-sm',
                            id: 'save-content-btn',
                            action: function ($event) {
                                me.$validator.validateAll().then((result) => {
                                    if (result) {
                                        Util.sendData({
                                            url: 'users/mailing/template/save',
                                            data: me.item,
                                            event: $event,
                                            callback: function (response) {
                                                me.$store.dispatch('setRouteNotify', false);
                                                if (!me.item.id) {
                                                    me.$router.push({
                                                        name: 'mailing_templates_item',
                                                        params: {id: response.data.items[0].id}
                                                    });
                                                    me.id = response.data.items[0].id;
                                                }
                                                me.$set(me, 'item', {});
                                                me.$store.dispatch('clearForm');
                                                me.getItem();
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
                                            url: 'users/mailing/template/save',
                                            data: me.item,
                                            event: $event,
                                            callback: function (response) {
                                                me.$store.dispatch('setRouteNotify', false);
                                                me.$router.push({name: 'mailing'});
                                            }
                                        },me)
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
                if (me.item) {
                    $(document).on('keyup', '*[data-action="save"]', function (e) {
                        e.preventDefault();
                    });
                }
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