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

    declare let $: any;

    @Component({
        name: 'user_items',
        components: {
            'form-manager': FormBuilder
        }
    })

    export default class UsersItem extends Vue {

        @Provide()
        item: any = null;

        mounted(): any {

            this.getUser();
        }


        getUser(): void {
            let me = this;
            UsersService.getUser(this.$route.params.id).then((response: any) => {
                me.prepareResponse(response);
            }, (response) => {
                Util.errorHandler(response)
            });
        }

        prepareResponse(response: any): void {
            let me = this;
            if (response.data.success) {
                me.$store.dispatch('setBreadcrumbs', {
                    items: response.data.breadcrumbs,
                    page_title: response.data.page_title
                });

                me.$set(me, 'item', response.data.items[0]);// <-- Обновляемый объект

                me.$store.dispatch('setForm', {// <-- ставим форму в хранилище
                    name: 'user-item',
                    content: {
                        buttons: Util.buttons([
                            {
                                text: FdTranslator._('Сохранить'),
                                icon: 'fa-pencil-square-o',
                                cls: 'btn-primary',
                                action: function ($event) {
                                    me.sendData({
                                        url: me.item.id == 0 ? response.data.form.create_url : response.data.form.update_url,
                                        data: me.item,
                                        event: $event,
                                        callback: function (response) {
                                            if (response.success) {

                                            }
                                        }
                                    })
                                }
                            },
                            {
                                text: FdTranslator._('Сохранить и закрыть'),
                                icon: 'fa-check',
                                cls: 'btn-primary',
                                action: function ($event) {
                                    me.sendData({
                                        url: me.item.id == 0 ? response.data.form.create_url : response.data.form.update_url,
                                        data: me.item,
                                        event: $event,
                                        callback: function (response) {
                                            window.history.back()
                                        }
                                    })
                                }
                            },
                            {
                                text: FdTranslator._('Обновить'),
                                icon: 'fa-refresh',
                                action: function ($event) {
                                    me.$store.dispatch('setBreadcrumbs', {
                                        items: []
                                    });
                                    me.$set(me, 'item', {});
                                    me.$store.dispatch('clearForm');
                                    me.getUser();
                                }
                            }
                        ]),
                        tabs: response.data.form.tabs
                    }
                })
            }
        }

        sendData(data: { url: string, data: any, event: any, callback: any }): void {
            if (data.event != null) {
                if (data.event.target.nodeName != 'BUTTON') {
                    return;
                }
                data.event.preventDefault();
            }
            Util.sendData(data, this);
        }

    }

</script>

<style scoped>

</style>
