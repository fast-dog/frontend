<template>
    <div>
        <DataTable
                v-bind:option="{
                title:'Пользователи',
                url:'users',
                help:true,
                help_name:'user_items'}"></DataTable>
    </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import {Component, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';

    declare let $: any;

    @Component({
        name: 'users_items',
        components: {
            'DataTable': DataTable
        }
    })

    export default class UsersItems extends Vue {

        @Provide()
        items: any [] = [];

        mounted(): void {
            console.log('ok');
        }
    }

</script>

<style scoped>

</style>