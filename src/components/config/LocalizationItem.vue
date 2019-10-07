<template>
    <form-manager :model="item"></form-manager>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Provide, Watch} from 'vue-property-decorator'
    import FormBuilder from '@/components/form/FormBuilder.vue';
    import {FdTranslator} from "@/FdTranslator";
    import {Util} from "@/Util";
    import {ConfigService} from "@/services/ConfigService";
    import {CrudService} from "@/services/CrudService";

    declare let $: any;

    @Component({
        name: 'LocalizationItem',
        components: {
            'form-manager': FormBuilder
        }
    })

    export default class LocalizationItem extends Vue {
        @Provide()
        id: number = null;

        @Provide()
        load: boolean = false;

        @Provide()
        item: any = {
            id: 0,
            data: {
                metadata: {}
            },
            properties: [],
            related: [],
            relatedChildren: []
        };

        @Watch('item', {deep: true})
        onChangeItem(newItem, oldItem) {
            if (this.load) {
                this.$store.dispatch('setRouteNotify', true);
            }
        }

        getItem(): void {
            let me = this;
            ConfigService.getLocalizationItem(this.id).then((response: any) => {
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
            let me = this,
                url = me.item.id > 0 ? response.data.form.create_url : response.data.form.update_url;

            me.$store.dispatch('setBreadcrumbs', {
                items: response.data.breadcrumbs,
                page_title: response.data.page_title
            });
            me.$set(me, 'item', response.data.items[0]);// <-- Обновляемый объект

            if (response.data.notifications) {
                me.$store.dispatch('setNotifications', response.data.notifications);
            }

             me.$store.dispatch('setForm', {// <-- ставим форму в хранилище
                    form_builder: (response.data.form.form_builder) ? response.data.form.form_builder : false,
                name: 'domain-item',
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
                            route_name: 'localization_item'
                        }),
                        Util.buttonSaveAndClose({
                            me: me,
                            url: url,
                            item: me.item,
                            route_name: 'localization_items'
                        }),
                        Util.buttonUpdate({
                            callback: function () {
                                me.update();
                            }
                        }),
                        Util.buttonDelete('config/localization/update', me.item)
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
