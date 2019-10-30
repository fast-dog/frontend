<template>
    <div>
        <DataTable
                v-bind:option="{
                url:'pages',
                help:true,
                help_name:'menu_pages'}"></DataTable>
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

    export default class PageItems extends Vue {

        @Prop({default: 'page_item_page'})
        page_route: string;

        @Prop({default: 'page_item'})
        create_route: string;

        mounted(): void {

        }
    }

</script>

<style scoped>

</style>
