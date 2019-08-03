<template>
    <div class="tabs-container tooltip-container">
        <ul class="nav nav-tabs">
            <li class="active"><a data-toggle="tab" href="#tab-matatags">Meta tags</a></li>
            <li><a data-toggle="tab" href="#tab-metasearch">{{'Поиск по сайту'|_}}</a></li>
            <li><a data-toggle="tab" href="#tab-alternate">{{'Альтернативные версии'|_}}</a></li>
        </ul>
        <div class="tab-content">
            <div id="tab-matatags" class="tab-pane active">
                <div class="panel-body">
                    <div class="form-group" v-if="show_canonicals">
                        <div class="col-sm-12">
                            <label>{{'Каноническая ссылка'|_}}</label>
                            <div class="input-group">
                                <input type="text" class="form-control"
                                       v-model="metadata.canonical" readonly>
                                <span class="input-group-btn">
                                        <search-table
                                                :callback=setCanonical
                                                :data_url=data_canonicals_url
                                                :title="'Доступные канонические ссылки'">
                                        </search-table>
                                    </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" v-if="metadata.meta_robots">
                        <div class="col-sm-12">
                            <label>Robots
                                <i class="fa fa-question-circle"
                                   :data-placement="'right'"
                                   :data-toggle="'tooltip'"
                                   :title="tooltip_robots|_"></i>
                                <i class="fa fa-exclamation-triangle text-danger"
                                   :data-placement="'right'"
                                   :data-toggle="'tooltip'"
                                   :title="danger_robots|_"
                                ></i>
                            </label>
                            <select name="meta_robots"
                                    v-model="metadata.meta_robots"
                                    class="form-control chosen-select-seo-multiple"
                                    multiple="multiple">
                                <option value="NOINDEX"
                                        v-bind:selected="(metadata.meta_robots.indexOf('NOINDEX') !== -1)">
                                    NOINDEX
                                </option>
                                <option value="INDEX"
                                        v-bind:selected="(metadata.meta_robots.indexOf('INDEX') !== -1)">INDEX
                                </option>
                                <option value="FOLLOW"
                                        v-bind:selected="(metadata.meta_robots.indexOf('FOLLOW') !== -1)">FOLLOW
                                </option>
                                <option value="ALL"
                                        v-bind:selected="(metadata.meta_robots.indexOf('ALL') !== -1)">ALL
                                </option>
                                <option value="NONE"
                                        v-bind:selected="(metadata.meta_robots.indexOf('NONE') !== -1)">NONE
                                </option>
                                <option value="NOARCHIVE"
                                        v-bind:selected="(metadata.meta_robots.indexOf('NOARCHIVE') !== -1)">NOARCHIVE
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-12">
                            <label>{{'Заголовок окна браузера (title)'|_}}</label>
                            <input type="text" v-model="metadata.meta_title"
                                   class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-12">
                            <label>{{'Мета описание (description)'|_}}
                                <i class="fa fa-question-circle"
                                   :data-toggle="'tooltip'"
                                   :data-placement="'right'"
                                   :title="tooltip_meta|_"></i>
                            </label>
                            <textarea class="form-control" rows="6"
                                      v-model="metadata.meta_description"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-12">
                            <label>{{'Мета-ключевые слова (keywords)'|_}}
                                <i class="fa fa-question-circle"
                                   :data-toggle="'tooltip'"
                                   :data-placement="'right'"
                                   :title="tooltip_keywords|_"></i>
                            </label>
                            <textarea class="form-control" rows="6"
                                      v-model="metadata.meta_keywords"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div id="tab-metasearch" class="tab-pane">
                <div class="panel-body">
                    <div class="form-group">
                        <div class="col-sm-12">
                            <label>{{'Ключевые слова для поиска по сайту (теги)'|_}}</label>
                            <textarea class="form-control" rows="6"
                                      v-model="metadata.meta_search_keywords"></textarea>
                        </div>
                    </div>
                    <div class="form-group" v-if="metadata.search_index">
                        <div class="col-sm-12">
                            <label>{{'Поисковый индекс'|_}}</label>
                            <textarea class="form-control" rows="6" readonly
                                      v-model="metadata.search_index"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div id="tab-alternate" class="tab-pane">
                <div class="panel-body">
                    <div class="form-group" v-for="domain in metadata.hreflang">
                        <div class="col-sm-12">
                            <label>{{'Версия страницы для:'|_}} #{{domain.code}} ({{domain.lang}})</label>
                            <input type="text" class="form-control" v-model="domain.value">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator';
    import {FdTranslator} from '@/FdTranslator';
    import SearchTable from "@/components/form/components/SearchTable.vue";


    declare let $: any;

    @Component({
        name: 'Seo',
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
        components: {
            'search-table': SearchTable
        }
    })

    export default class Seo extends Vue {
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

        }

        mounted(): void {
            this.$set(this, 'metadata', this.item.data);
        }

        setCanonical(item): void {
            let me = this;
            me.metadata.canonical = item.link
        }

    }
</script>

<style scoped>

</style>
