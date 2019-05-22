<template>
    <div class="splash-screen animated fadeInDown" v-if="$store.getters.getSplashScreen === true"
         :style="{minHeight: height+ 'px'}">
        <i class="fa fa-paw" style="font-size: 200px"></i>
    </div>
</template>

<script lang="ts">
    import {Component, Provide, Vue, Watch} from 'vue-property-decorator'

    declare let $: any;

    @Component({
        name: 'SplashScreen',
        components: {}
    })

    export default class SplashScreen extends Vue {

        @Provide()
        height: number = 500;

        @Watch('$store.getters.getSplashScreen')
        onChangeSplashScreen(set, old) {
            let me = this;
            if (set == false) {
                me.$store.commit('setSplashScreen', false);
            }
        }

        mounted(): void {
            this.height = ($(window).outerHeight(true) - 120);
        }
    }
</script>

<style scoped>

</style>