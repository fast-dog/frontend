<template>
    <div>
        <DataTable
                v-bind:option="{
                url:'users/mailing/templates',
                help:true,
                help_name:'user_items'}"></DataTable>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';

    declare let $: any;

    @Component({
        name: 'UsersMailingTemplateItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class UsersMailingTemplateItems extends Vue {

        @Prop({default: 'mailing_templates_item'})
        create_route: string;

        @Prop({default: 'mailing_templates_page'})
        page_route: string;

    }
</script>

<style scoped>

</style>