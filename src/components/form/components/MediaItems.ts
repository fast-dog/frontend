import Vue from 'vue';
import {Component, Prop, Provide} from 'vue-property-decorator';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';


declare let $: any;

@Component({
    name: 'media',
    template: require('./views/media-items.html'),
    components: {
        // 'presentation': Presentation
    },
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})

export class MediaItems extends Vue {

    @Provide()
    tourSteps: any = null;

    @Prop({default: null})
    item: any;

    @Prop({default: true})
    presentation: boolean;

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