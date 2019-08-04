<template>
    <div v-if="getUrl()">
        <DataTable
                v-bind:option="{
                url: getUrl(),
                help:true,
                help_name:'menu_items'}"></DataTable>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from "@/components/table/Table.vue";


    declare let $: any;

    @Component({
        name: 'MenuItems',
        components: {
            'DataTable': DataTable
        }
    })

    export default class MenuItems extends Vue {

        @Prop()
        name: any;

        @Provide()
        create_route: any;

        @Provide()
        url: any = null;

        @Prop({default: 'menu/reorder'})
        reorder_url: string;


        mounted(): void {
            let me = this,
                root_id = parseInt(this.$route.params.id);

            if (root_id > 0) {
                me.url = 'menu/list/' + root_id;
                me.create_route = function () {
                    me.$router.push({name: 'menu_create_children', params: {parent_id: me.$route.params.id}});
                };
            }
        }

        getUrl(): any {
            return this.url;
        }
    }
</script>

<style scoped>

</style>
