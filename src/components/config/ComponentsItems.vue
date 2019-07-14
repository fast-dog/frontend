<template>
    <div>
        <DataTable
                v-bind:option="{
                url:'config/components',
                help:true,
                help_name:'components_items'}"></DataTable>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';

    declare let $: any;

    @Component({
        name: 'ComponentsItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class ComponentsItems extends Vue {

        @Prop({default: 'component_items_page'})
        page_route: string;

        @Prop({default: 'component_items'})
        help_name: string;

        @Prop({default: 'component_item'})
        create_route: string;
    }
</script>

<style scoped>

</style>