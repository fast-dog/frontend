<template>
    <router-view></router-view>
</template>

<script lang="ts">
    import {Component, Provide, Vue, Watch} from 'vue-property-decorator'

    @Component({
        name: 'Config',
        components: { }
    })

    export default class Config extends Vue {
    }
</script>

<style scoped>

</style>