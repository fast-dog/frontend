<template>
    <div>
        <DataTable
                v-bind:option="{
                title:'Пользователи :: подписки',
                url:'users/subscribe',
                help:true,
                help_name:'user_items'}"></DataTable>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';

    declare let $: any;

    @Component({
        name: 'UsersItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class UsersSubscribeItems extends Vue {


        @Prop({default: 'users_subscribe_list_page'})
        page_route: string;


        mounted(): void {
            console.log('ok');
        }
    }

</script>

<style scoped>

</style>