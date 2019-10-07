<template>
  <form-manager :model="item"></form-manager>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Provide} from 'vue-property-decorator'
    import FormBuilder from '@/components/form/FormBuilder.vue';
    import {Util} from '@/Util';
    import {MenuService} from '@/services/MenuService';

    declare let $: any;

    @Component({
        name: 'page_item',
        components: {
            'form-manager': FormBuilder
        }
    })

    export default class PageItem extends Vue {

        @Provide()
        item: any = null;

        mounted(): any {
            this.getPage();
        }


        getPage(): void {
            let me = this;
            MenuService.getPage(this.$route.params.id).then((response: any) => {
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

                let url = me.item.id == 0 ? response.data.form.create_url : response.data.form.update_url;

                me.$store.dispatch('setForm', {// <-- ставим форму в хранилище
                    form_builder: (response.data.form.form_builder) ? response.data.form.form_builder : false,
                    name: 'user-item',
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
                                route_name: 'users'
                            }),
                            Util.buttonUpdate({
                                callback: function () {
                                    me.$store.dispatch('setBreadcrumbs', {
                                        items: []
                                    });
                                    me.$set(me, 'item', {});
                                    me.$store.dispatch('clearForm');
                                    me.getPage();
                                }
                            }),
                            Util.buttonDelete('users/update', me.item)
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
