<template>
    <router-view></router-view>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'

    @Component({
        name: 'Menu',
        components: {}
    })

    export default class Menu extends Vue {
    }
</script>

<style scoped>

</style>
