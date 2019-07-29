<template>
    <div>
        <DataTable
                v-bind:option="{
                url:'config/helps',
                help:true,
                help_name:'domain_items'}"></DataTable>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';

    declare let $: any;

    @Component({
        name: 'HelpItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class HelpItems extends Vue {

        @Prop({default: 'help_items_page'})
        page_route: string;

        @Prop({default: 'help_items'})
        help_name: string;

        @Prop({default: 'help_item'})
        create_route: string;

    }
</script>

<style scoped>

</style>
