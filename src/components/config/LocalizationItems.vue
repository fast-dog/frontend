<template>
    <div>
        <DataTable
                v-bind:option="{
                url:'config/localization',
                help:true,
                help_name:'domain_items'}"></DataTable>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';

    declare let $: any;

    @Component({
        name: 'LocalizationItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class LocalizationItems extends Vue {

        @Prop({default: 'localization_items_page'})
        page_route: string;

        @Prop({default: 'localization_items'})
        help_name: string;

        @Prop({default: 'localization_item'})
        create_route: string;

    }
</script>

<style scoped>

</style>
