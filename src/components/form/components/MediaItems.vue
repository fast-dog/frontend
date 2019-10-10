<template>
    <div class="tooltip-container">
        <div class="push-right col-sm-12 m-b-sm" v-if="tourSteps && presentation === true">
            <presentation :steps="tourSteps"></presentation>
        </div>
        <div class="col-sm-12" v-if="set_item">
            <div class="form-group " v-for="(mediaItem,idx) in set_item.media">
                <div class="col-md-6">
                    <div class="input-group">
                        <input type="text" class="form-control"
                               v-bind:readonly="mediaItem.type==='file'"
                               v-model="mediaItem.value"
                               :disabled="disabled"
                               :placeholder="'Выбор файла'|_">
                        <span class="input-group-btn">
                    <button type="button"
                            :id="(idx === 0) ? 'presentation-media-one' : null"
                            v-if="mediaItem.type === 'file'"
                            v-on:click="openFinder(mediaItem)"
                            v-bind:data-href="mediaItem.value"
                            :title="'Выбрать файлы'|_"
                            data-toggle="tooltip"
                            data-placement="left"
                            :disabled="disabled"
                            class="btn btn-primary preview">
                        <i class="fa fa-folder-o" :title="'Выбрать файлы'|_"></i>
                    </button>
                    <button type="button" class="btn btn-danger"
                            data-toggle="tooltip"
                            data-placement="right"
                            :disabled="disabled"
                            :title="'Удалить файл'|_"
                            :id="(idx === 0) ? 'presentation-media-four' : null"
                            v-on:click="deleteItem(mediaItem)">
                       <i class="fa fa-trash"></i>
                   </button>
                </span>
                    </div>
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control"
                           :id="(idx === 0) ? 'presentation-media-two' : null"
                           v-model="mediaItem.description"
                           :disabled="disabled"
                           :placeholder="'Описание'|_">
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control"
                           v-model="mediaItem.sort"
                           :disabled="disabled"
                           :id="(idx === 0) ? 'presentation-media-three' : null"
                           :placeholder="'Сортировка'|_">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import {FdTranslator} from '@/FdTranslator';
    import {Util} from '@/Util';
    import {Validator} from 'vee-validate';
    import Presentation from '@/components/Presentation.vue';


    declare let $: any;

    @Component({
        name: 'MediaItems',
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
        components: {
            'presentation': Presentation,
        }
    })

    export default class MediaItems extends Vue {

        @Provide()
        tourSteps: any = null;

        @Prop({default: null})
        item: any;

        @Prop({default: true})
        presentation: boolean;

        @Prop({default: false})
        disabled: boolean;

        @Provide()
        set_item: any = null;

        mounted(): void {
            let me = this;
            me.$set(me, 'set_item', (me.item) ? me.item : {data: {media: {}}});

            me.$nextTick(function () {
                me.imagePreview();
            });

            me.$set(me, 'tourSteps', [
                {
                    target: '#presentation-media-one',
                    content: FdTranslator._('С помощью файлового менеджера, загрузите на сервер или выберите ранее загружанные файлы. Допускается выбор нескольких файлов с подтверждением по клавише: Enter')
                },
                {
                    target: '#presentation-media-two',
                    content: FdTranslator._('В случае если в вашем проекте используется дополнительное описание выбранного файла, заполните это поле.')
                },
                {
                    target: '#presentation-media-three',
                    content: FdTranslator._('Определите сотриовку, допускается любое целое число включая отрицательные числа с знаком минус.')
                },
                {
                    target: '#presentation-media-four',
                    content: FdTranslator._('Удалите файл если это необходимо, удаление данных из таблицы является не интерактивным действием...')
                },
                {
                    target: '#update-content-btn',
                    content: FdTranslator._('В случае ошибочного удаления, перезагрузите форму редактирования.')
                },
                {
                    target: '#save-content-btn',
                    content: FdTranslator._('После определения значений выбранных параметров, не забудтье сохранить объект редактирования!!!')
                }
            ]);
        }

        openFinder(mediaItem: any, params: string): void {
            let me = this;
            Util.openElFinder({
                name: 'image',
                params: params,
                startPathHash: mediaItem.phash,
                callback: function (selectedFiles) {
                    if (selectedFiles !== null && selectedFiles.length > 0) {
                        if (me.item.media.length == 1) {
                            if (me.item.media[0].value == '') {
                                me.item.media = [];
                            }
                        }
                        selectedFiles.forEach(function (selectedFile, idx) {
                            let push: boolean = true,
                                _mediaItem = Util.buildMediaObject(selectedFile);
                            me.item.media.forEach(function (element) {
                                if (push == true && _mediaItem.data.hash == element.data.hash) {
                                    push = false;
                                }
                            });

                            if (push) {
                                me.item.media.push(_mediaItem);
                            }
                            me.$nextTick(function () {
                                me.imagePreview();
                            })
                        })
                    }
                }
            })
        }


        addItem(): void {
            let me = this, push = true;
            me.item.media.forEach(function (element) {
                if (element.value == '') {
                    push = false;
                }
            });

            if (push) {
                this.item.media.push({
                    type: 'file', tmb: '', phash: '', hash: '', value: '',
                    sort: 100, data: {hash: ''}
                });
            }
        }

        deleteItem(element: any): void {
            let tmp = [];
            for (let i in this.item.media) {
                let item = this.item.media[i];

                if (element.data.hash != item.data.hash) {
                    tmp.push(item);
                }
            }

            if (tmp.length == 0) {
                tmp.push({
                    type: 'file', tmb: '', phash: '',
                    hash: '', value: '', sort: 100, data: {hash: ''}
                });
            }
            this.item.media = tmp;
            this.$nextTick(function () {
                Util.initTooltip();
            })
        }

        imagePreview(): void {
            let xOffset = 15, yOffset = -30,
                Mx = $(document).width(),
                My = $(document).height(),
                callback = function (event) {
                    let $img = $('#preview'),
                        trc_x = xOffset + $img.width(),
                        trc_y = yOffset + $img.height();

                    trc_x = Math.min(trc_x + event.pageX, Mx);
                    trc_y = Math.min(trc_y + event.pageY, My);

                    $img.css('top', (trc_y - $img.height()) + 'px').css('left', (trc_x - $img.width()) + 'px');
                };

            $('*.preview').hover(function (e) {
                    if ($(this).data('href')) {
                        Mx = $(document).width();
                        My = $(document).height();
                        let href = window.location.protocol + '//' + window.location.hostname + $(this).data('href');
                        if (href) {
                            $('body').append('<p id=\'preview\' style=\'z-index: 15555;\'>' +
                                '<img src=\'' + href + '\' style=\'max-width: 200px; max-height:150px;\' /></p>');
                            callback(e);
                            $('#preview').fadeIn('fast');
                        }
                    }

                },
                function () {
                    this.title = this.t;
                    $('#preview').remove();
                }
            ).mousemove(callback);

            Util.initTooltip();
        };
    }
</script>

<style scoped>

</style>
