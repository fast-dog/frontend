<template>
  <div>
    <DataTable
      v-bind:option="{
                url:'sitemap',
                help:true,
                help_name:'sitemap_help'}"></DataTable>
  </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';
    import {FdTranslator} from "@/FdTranslator";
    import {Util} from "@/Util";

    declare let $: any;

    @Component({
        name: 'UsersItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class Sitemap extends Vue {

        @Prop({default: 'sitemap'})
        data_url: string;

        @Prop()
        name: any;

        @Prop({default: 'sitemap_page'})
        page_route: string;

        @Provide()
        extend_buttons: any = [{
            text: FdTranslator._('Перестроить карту сайта'),
            icon: 'fa-bolt',
            cls: 'btn-sm btn-danger',
            visible: true,
            action: function () {
                let me = this.me;
                Util.deleteDialog({
                    title: FdTranslator._('Подтверждение команды'),
                    text: FdTranslator._('Данное действие перестроит карту сайта в формате xml, Вы хотите продолжить?'),
                    text_ok: FdTranslator._('Перестроить'),
                    callback: function () {
                        Util.sendData({
                            url: 'sitemap/reorder',
                            data: {},
                            callback: function (response) {

                            }
                        }, me);
                    }
                });

            }
        }];

        mounted(): void {
            let me = this;

            me.$store.dispatch('setExternalFilters', false);


            this.$emit('setDataUrl', this.data_url);
        }
    }
</script>

<style scoped>

</style>
