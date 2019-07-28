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
    import {CrudService} from '@/services/CrudService';

    declare let $: any;
    declare let parameters: any;
    declare let CKEDITOR: any;


    @Component({
        name: 'UsersMailingItem',
        components: {
            'form-manager': FormBuilder
        }
    })

    export default class UsersMailingItem extends Vue {

        @Provide()
        id: number = null;

        @Provide()
        item: any = null;

        mounted(): any {
            let me = this;
            this.id = parseInt(this.$route.params.id);
            if (this.$route.params.id == 'new') {
                this.id = 0;
            }
            me.getItem();
        }

        getItem(): void {
            let me = this;
            UsersService.getMailing(this.id).then((response: any) => {
                if (response.data.success) {
                    me.prepareResponse(response);
                } else {
                    Util.errorHandler(response)
                }
            }, (response) => {
                Util.errorHandler(response)
            });
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
            let url = me.item.id == 0 ? response.data.form.create_url : response.data.form.update_url;

            me.$store.dispatch('setForm', {// <-- ставим форму в хранилище
                name: 'catalog-item',
                help: response.data.form.help,
                content: {
                    buttons: Util.buttons([
                        Util.buttonSave({
                            me: me,
                            url: url,
                            item: me.item,
                            callback: function (response) {
                                me.getItem();
                            },
                            route_name: 'mailing'
                        }),
                        Util.buttonSaveAndClose({
                            me: me,
                            url: url,
                            item: me.item,
                            route_name: 'mailing'
                        }),
                        {
                            text: FdTranslator._('Сохранить и запустить'),
                            icon: 'fa-envelope',
                            cls: 'btn-success btn-sm',
                            id: 'save-and-close-btn',
                            action: function ($event) {
                                me.$validator.validateAll().then((result) => {
                                    if (result) {
                                        me.item.create_process = 'Y';
                                        Util.sendData({
                                            url: 'users/mailing/save',
                                            data: me.item,
                                            event: $event,
                                            callback: function (response) {
                                                me.$store.dispatch('setRouteNotify', false);
                                                me.$router.push({name: 'mailing_status'});
                                            }
                                        }, me)
                                    }
                                });
                            }
                        },
                        Util.buttonUpdate({
                            callback: function () {
                                me.update();
                            }
                        }),
                        Util.buttonDelete('users/mailing/update', me.item)
                    ]),
                    tabs: response.data.form.tabs
                }
            });

            me.$nextTick(function () {

                $('.dropdown-toggle').dropdown();
                $('.tooltip-container').tooltip({
                    selector: '[data-toggle=tooltip]',
                    container: 'body'
                });
                if (me.item) {
                    if (me.item.files_module == 'Y') {
                        CKEDITOR.config.filebrowserBrowseUrl = '/elfinder/ckeditor?parent_type=' +
                            me.item.el_finder.parent_type + '&parent_id=' + me.item.el_finder.parent_id;
                    } else {
                        CKEDITOR.config.filebrowserBrowseUrl = '/elfinder/ckeditor?parent_type=none&parent_id=0'
                    }
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
