<template>
<h1>User cmp</h1>
</template>

<script lang="ts">
    import axios from 'axios'
    import {Component, Provide, Vue, Watch} from 'vue-property-decorator'

    declare let $: any;

    @Component({
        name: 'users',
        components: {}
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