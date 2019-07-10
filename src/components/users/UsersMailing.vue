<template>
    <div>
        <DataTable
                v-bind:option="{
                title:'Пользователи :: подписки',
                url:'users/mailing',
                help:true,
                help_name:'user_items'}"></DataTable>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';
    import {FdTranslator} from '@/FdTranslator';

    declare let $: any;

    @Component({
        name: 'UsersItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class UsersMailing extends Vue {

        @Prop({default: 'mailing_item'})
        create_route: string;

        @Provide()
        extend_buttons: any = [{
            text: FdTranslator._('Шаблоны рассылок'),
            icon: 'fa-file-code-o',
            cls: 'btn-sm btn-default',
            visible: true,
            action: function () {
                this.me.$router.push({name: 'mailing_templates_items'});
            }
        }, {
            text: FdTranslator._('Просмотр задач'),
            icon: 'fa-terminal',
            cls: 'btn-sm btn-default',
            visible: true,
            action: function () {
                this.me.$router.push({name: 'mailing_status'});
            }
        }];

        mounted(): void {
           // let me = this;
        }
    }

</script>

<style scoped>

</style>