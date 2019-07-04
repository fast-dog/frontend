import Vue from 'vue';
import {Component, Prop, Provide, Watch} from 'vue-property-decorator';
import {FdTranslator} from '@/FdTranslator';


declare let $: any;

@Component({
    name: 'seo',
    template: require('./views/seo.html'),
    components: {
        // 'search-table': SearchTableBase,
    },
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})

export class Seo extends Vue {

    @Prop({default: null})
    item: any;

    @Provide()
    show_canonicals: boolean = false;

    @Provide()
    data_canonicals_url: string = '#';

    @Provide()
    metadata: {
        meta_title: string,
        meta_description: string,
        meta_keywords: string,
        meta_search_keywords: string,
        search_tags?: [string],
        meta_robots?: string,
        canonical?: string,
        canonical_id?: number,
    } = {meta_title: '', meta_description: '', meta_keywords: '', meta_search_keywords: ''};

    @Prop({
        default: function () {
            return 'Тег Robots управляет индексацией конкретной web-страницы. При этом роботам можно запретить не только индексацию самого документа, ' +
                'но и проход по имеющимся в нем ссылкам.' +
                'Инструкции по индексации записываются в поле content. Возможны следующие инструкции:' +
                'NOINDEX — запрещает индексирование документа;' +
                'NOFOLLOW — запрещает проход по ссылкам, имеющимся в документе;' +
                'INDEX — разрешает индексирование документа;' +
                'FOLLOW — разрешает проход по ссылкам.' +
                'ALL — равносильно INDEX, FOLLOW  NONE — равносильно NOINDEX, NOFOLLOW Значение по умолчанию: INDEX, FOLLOW';
        }
    })
    tooltip_robots: string;

    @Prop({
        default: function () {
            return 'В поле Robots дублирование инструкций, наличие противоречивых инструкций и т.п. не допускается; в частности, значение не может иметь вид none, nofollow.' +
                ' Google поддерживает дополнительное значение NOARCHIVE, которое запрещает помещать страницу в архив google'
        }
    })
    danger_robots: string;

    @Prop({
        default: function () {
            return 'Значение атрибута — строка, которая определяет текстовое описание (краткую аннотацию) конкретной страницы ' +
                'Вашего сайта. Не стоит создавать слишком длинное и подробное описание Вашего сайта в данном теге, рекомендуется ' +
                'ограничиться текстом до 100 символов, поскольку поисковые машины, в большинстве случаев, имеют ограничение на количество индексируемых символов. ' +
                'Этот тег может сильно помочь в случаях, когда в документе мало текста, когда это управляющий фреймами файл (frameset) или в начале документа используются скрипты.';
        }
    })
    tooltip_meta: string;

    @Prop({
        default: function () {
            return 'Значение атрибута — список ключевых слов, как правило, через запятую, соответствующих содержимому Вашего сайта. Это те слова,' +
                ' в запрос на которые, Вы хотели бы, появления Вашего сайиа в списке результатов поиска. Здесь также рекомендуется ограничиться ' +
                'списком до 30 слов. Можно поместить и наиболее частые опечатки ключевых слов. Также Вы можете здесь записать и английские слова, ' +
                'соответствующие содержимому Вашего сайта. Некоторые поисковые системы не индексируют сайты, в которых в данном теге повторяется одно и ' +
                'то же слово для увеличения позиции в списке результатов.'
        }
    })
    tooltip_keywords: string;

    @Watch('metadata')
    onChangeMetadata(newValue, oldValue) {
        this.initChosen();
    }

    mounted(): void {
        let me = this;
        this.$set(this, 'metadata', this.item.data);
        this.$nextTick(function () {
            me.initChosen();
        })
    }

    setCanonical(item): void {
        let me = this;
        me.metadata.canonical = item.link
    }

    initChosen(): void {
        let me = this;
        // $('.chosen-select-seo-multiple').chosen({width: '100%'}).change(function () {
        //     switch (this.name) {
        //         case 'meta_robots':
        //             let tmp = [];
        //             $('option', $(this)).each(function (idx, element) {
        //                 if (element.selected) {
        //                     tmp.push(element.value);
        //                 }
        //             });
        //             me.metadata[this.name] = tmp;
        //             break;
        //         default:
        //             me.metadata[this.name] = $('option:selected', $(this)).val();
        //             break;
        //     }
        // });
    }
}