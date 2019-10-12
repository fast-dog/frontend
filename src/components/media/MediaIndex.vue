<template>
  <iframe frameborder="0" :src="getElfindeerRoute()"
          border="0"
          height="620" width="100%"
          noresize="noresize"></iframe>
</template>


<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'


    declare let $: any;

    @Component({
        name: 'MediaIndex',
        components: {},
        filters: {}
    })

    export default class MediaIndex extends Vue {

        getElfindeerRoute(): string {
            return window.location.protocol + '//' + window.location.hostname + '/elfinder/popup/image';
        }
    }
</script>

<style scoped>

</style>
