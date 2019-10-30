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
        name: 'DomainItem',
        components: {
            'form-manager': FormBuilder
        }
    })

    export default class DomainItem extends Vue {

        @Provide()
        id: number = null;

        @Provide()
        item: any = {
            id: 0
        };

        getItem(): void {
            let me = this;
            ConfigService.getItem(this.id).then((response: any) => {
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

            let url = me.item.id > 0 ? response.data.form.create_url : response.data.form.update_url;

            if (response.data.notifications) {
                me.$store.dispatch('setNotifications', response.data.notifications);
            }

             me.$store.dispatch('setForm', {// <-- ставим форму в хранилище
                    is_preset: (response.data.form.is_preset) ? response.data.form.is_preset : 'N',
                    form_builder: (response.data.form.form_builder) ? response.data.form.form_builder : false,
                name: 'domain-item',
                help: response.data.form.help,
                content: {
                    buttons: Util.buttons([
                        Util.buttonSave({
                            me: me,
                            url: url,
                            item: me.item,
                            callback: null,
                            route_name: ''
                        }),
                        Util.buttonSaveAndClose({
                            me: me,
                            url: url,
                            item: me.item,
                            route_name: 'domain_items'
                        }),
                        Util.buttonUpdate({
                            callback: function () {
                                me.update();
                            }
                        })
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
