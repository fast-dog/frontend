<template>
    <div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class Dashboard extends Vue {
        @Prop() private msg!: string;
    }
</script>
