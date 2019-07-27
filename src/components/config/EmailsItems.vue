<template>
    <div>
        <DataTable
                v-bind:option="{
                url:'config/emails',
                help:true,
                help_name:'domain_items'}"></DataTable>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';

    declare let $: any;

    @Component({
        name: 'EmailsItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class EmailsItems extends Vue {

        @Prop({default: 'emails_items_page'})
        page_route: string;

        @Prop({default: 'emails_items'})
        help_name: string;

        @Prop({default: 'emails_item'})
        create_route: string;

        mounted(): void {
            this.$emit('setDataUrl', 'config/emails');
        }
    }
</script>

<style scoped>

</style>
