<template>
    <div class="x_panel data_preview animated fadeInRight" v-if="$store.getters.getPreview">
        <div class="x_title">
            <h2 v-html="$store.getters.getPreview.title"></h2>
            <div class="navbar-right">
                <a class="print-link" href="#"
                   v-if="$store.getters.getPreview.print"
                   v-on:click.prevent="closeModal($event)">
                    <i class="fa fa-print"></i>
                </a>
                <a class="close-link" href="#" v-on:click.prevent="closeModal($event)">
                    <i class="fa fa-times-circle-o"></i>
                </a>

            </div>
            <div class="clearfix"></div>
        </div>
        <div class="x_content">
            <table class="table table-hover">
                <tbody>
                <template v-for="row in $store.getters.getPreview.table.rows">
                    <tr v-if="row.type === 'image'">
                        <td><strong v-html="row.label"></strong></td>
                        <td>
                            <img style="max-width: 200px; display: block; margin: 0 auto;"
                                 class="img-responsive"
                                 v-bind:src="row.src" alt="">
                        </td>
                    </tr>
                    <tr v-if="row.type === 'string'">
                        <td><strong v-html="row.label"></strong></td>
                        <td v-html="row.value"></td>
                    </tr>
                    <tr v-if="row.type === 'separator'">
                        <td colspan="2" class="text-center">
                            <h4 v-html="row.label"></h4>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>
    </div>

</template>

<script lang="ts">

    import Vue from 'vue';
    import {FdTranslator} from '@/FdTranslator';
    import Component from 'vue-class-component';
    import {Prop, Provide, Watch} from 'vue-property-decorator';
    import ymaps from 'ymaps';

    declare let $: any;

    @Component({
        name: 'DataPreview',
        components: {},
        filters: {
            'json': function (value) {
                return JSON.stringify(value, null, 2)
            },
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class DataPreview extends Vue {

        @Provide()
        show_modal: boolean = false;

        showModal($event, item) {
            let me = this;
            me.show_modal = true;
            me.$nextTick(function () {

                $('.data_preview').slimScroll({
                    height: '100%',

                });

                if ($('#address-map').length) {
                    ymaps
                        .load()
                        .then(maps => {
                            const map = new maps.Map('address-map', {
                                center: [-8.369326, 115.166023],
                                zoom: 15
                            });

                            var myGeocoder = maps.geocode($('#address-map').data('geocode'));

                            myGeocoder.then(function (res) {
                                map.geoObjects.add(res.geoObjects);
                                // Выведем в консоль данные, полученные в результате геокодирования объекта.
                                map.setCenter(res.geoObjects.get(0).geometry.getCoordinates());
                            }, function (err) {
                                // Обработка ошибки.
                                console.log(err)
                            });
                        })
                        .catch(error => console.log('Failed to load Yandex Maps', error));
                }
            })
        }

        closeModal($event) {
            this.$store.dispatch('setPreview', null);
        }
    }
</script>

<style scoped lang="scss">

    .data_preview {
        width: 500px;
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 2510;
        margin: 0;

        .close-link {
            font-size: 20px;
        }

        .print-link {
            font-size: 20px;
            margin-right: 10px;
        }
    }
</style>