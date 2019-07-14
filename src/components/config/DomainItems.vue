<template>
    <div>
        <DataTable
                v-bind:option="{
                url:'config/domains',
                help:true,
                help_name:'domain_items'}"></DataTable>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';

    declare let $: any;

    @Component({
        name: 'DomainItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class DomainItems extends Vue {

        @Prop({default: 'domain_items_page'})
        page_route: string;

        @Prop({default: 'domain_items'})
        help_name: string;

        @Prop({default: 'domain_item'})
        create_route: string;
    }
</script>

<style scoped>

</style>