<template>
    <Dashboard/>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import Dashboard from '@/components/Dashboard.vue' // @ is an alias to /src

    @Component({
        components: {
            Dashboard
        }
    })
    export default class Home extends Vue {
        static mounted(): void {

        }
    }
</script>