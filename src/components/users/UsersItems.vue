<template>
    <div>
        <DataTable
                v-bind:option="{
                url:'users',
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

    export default class UsersItems extends Vue {

        @Prop({default: 'users_list_page'})
        page_route: string;

        @Prop({default: 'user_profile'})
        create_route: string;
    }

</script>

<style scoped>

</style>