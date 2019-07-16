<template>
    <div class="text-right">
        <button
                :data-toggle="'tooltip'"
                :data-placement="'left'"
                :title="'Обучающая презентация'|_"
                class="btn btn-success btn-sm" v-on:click="start($event)">
            <i class="fa fa-film"></i>
        </button>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator';
    import Tour from 'tour/dist/tour.js';
    import {FdTranslator} from '@/FdTranslator';

    declare let $: any;

    @Component({
        name: 'Presentation',
        components: {},
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
    })

    export default class Presentation extends Vue {

        @Prop({default: null, type: Array})
        steps: any;

        @Provide()
        Tour: Tour = null;

        mounted(): void {
            let me = this;

        }

        start($event: Event): void {
            let me = this;
            $event.preventDefault();
            if (me.steps) {
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
                me.Tour = {
                    canExit: true,
                    previousText: 'Назад',
                    nextText: 'Вперед',
                    finishText: 'Завершить',
                    showPrevious: true, // Setting to false hides the previous button
                    showNext: true,
                    steps: me.steps,
                };
            }

            Tour.start(me.Tour)
                .then(() => {
                    console.log('Tour Finished!');
                })
                .catch(() => {
                    console.log('Tour Interrupted!')
                });
        }
    }
</script>

<style scoped>

</style>