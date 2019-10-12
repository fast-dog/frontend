<template>
  <div>
    <iframe frameborder="0" :src="getElfindeerRoute()"
            border="0"
            height="620" width="100%"
            noresize="noresize"></iframe>
  </div>

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

        mounted(): void {
            let me = this;
            me.$store.dispatch('setBreadcrumbs', {
                items: [{}],
                page_title: 'Обзор файлов '
            });
        }

        getElfindeerRoute(): string {
            return window.location.protocol + '//' + window.location.hostname + '/elfinder/popup/ckeditor';
        }
    }
</script>

<style scoped>

</style>
