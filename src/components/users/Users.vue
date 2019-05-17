<template>
    <div>
        <h1>User cmp</h1>
        <data-table
                :setting="{li:'op'}"
                v-bind:option="{title:'Пользователи'}"></data-table>
    </div>
</template>

<script lang="ts">
    import axios from 'axios'
    import {Component, Provide, Vue, Watch} from 'vue-property-decorator'
    import Table from '@/components/table/Table.vue';

    declare let $: any;

    @Component({
        name: 'users',
        components: {
            'data-table': Table
        }
    })

    export default class Users extends Vue {

        @Provide()
        items: any [] = [];

        mounted(): void {

        }
    }

</script>

<style scoped>

</style>