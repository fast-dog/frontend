<template>

</template>

<script lang="ts">
    import {Component, Provide, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class Table extends Vue {

        @Provide()
        items: any;
    }
</script>

<style scoped>

</style>