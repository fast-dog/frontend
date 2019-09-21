<template>
    <div>
        <DataTable
                v-bind:option="{
                url:'menu/roots',
                help:true,
                help_name:'menu_roots'}"></DataTable>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from "@/components/table/Table.vue";


    declare let $: any;

    @Component({
        name: 'MenuIndex',
        components: {
            'DataTable': DataTable
        }
    })

    export default class MenuIndex extends Vue {

        @Prop({default: 'menu_index'})
        help_name: string;

        @Prop({default: 'menu_create'})
        create_route: string;
    }

</script>

<style scoped>

</style>
