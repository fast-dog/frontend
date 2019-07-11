<template>
    <div class="tooltip-container">
        <div class="col-md-9">
            <div class="btn-group" style="margin-bottom: 10px">
                <button data-toggle="dropdown" class="btn btn-sm btn-default dropdown-toggle"
                        id="presentation-one">
                    {{'Добавить параметр'|_}}
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li v-for="(property,index) in properties" v-if="property.show == false">
                        <a href="javascript:void(0)" v-on:click="showElement(property)">
                            <i class="fa fa-question-circle" style="margin-top: 5px"
                               :data-toggle="'tooltip'"
                               :data-placement="'right'"
                               :title="property.data.description"></i>
                            {{property.name}}
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li><a href="javascript:void(0)" v-on:click="openSetting($event)" class="font-bold">
                        <i class="fa fa-gear"></i>
                        {{'Список параметров'|_}}</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="push-right col-md-3" v-if="tourSteps">
            <presentation :steps="tourSteps"></presentation>
        </div>
        <div class="col-md-12" v-if="selectedProperties.length == 0">
            <p class="alert alert-info">
                {{'Дополнительные параметры не выбраны, будут использованы значения по умолчанию'|_}}
            </p>
        </div>
        <table class="table table-striped" v-if="selectedProperties.length > 0">
            <thead>
            <tr>
                <th class="col-md-8">{{'Описание'|_}}</th>
                <th class="col-md-3">{{'Значение'|_}}</th>
                <th class="col-md-1"></th>
            </tr>
            </thead>
            <tbody id="presentation-two">
            <tr v-for="(property,index) in properties" v-if="property.show == true">
                <td v-html="property.data.description" :id=" (index == 0) ? 'presentation-three': false"></td>
                <td :id=" (index == 0) ? 'presentation-four': false">
                    <select-form-field
                            v-if="property.type.id == 'select'"
                            :model="property"
                            :id="property.code"
                            :readonly="false"
                            :css_class="''"
                            :form_group="false"
                            :option_group="false"
                            :data="property.data.values"
                            :field="'value'">
                    </select-form-field>
                    <div class="input-group" v-if="property.type.id == 'location' || property.type.id == 'file'">
                        <input type="text" class="form-control" placeholder="" v-model="property.value">
                        <span class="input-group-btn" v-if="property.type.id == 'file'">
                        <button type="button" v-on:click="openFinder(property)" class="btn btn-primary">
                            <i class="fa fa-folder-o"></i>
                        </button>
                    </span>
                        <span class="input-group-btn" v-if="property.type.id == 'location'">
                        <button type="button" v-on:click="openMap(property)" class="btn btn-primary">
                            <i class="fa fa-map-marker"></i>
                        </button>
                    </span>
                    </div>

                    <div v-if="property.type.id == 'string'">
                        <input type="text" class="form-control" v-model="property.value"
                               maxlength="245"
                               placeholder="">
                    </div>
                    <div class="input-group" v-if="property.type.id == 'number'">
                        <input type="number" class="form-control"
                               data-validate="integer" step="0.1"
                               v-model="property.value" placeholder="">
                    </div>
                </td>
                <td class="text-center" :id=" (index == 0) ? 'presentation-five': false">
                    <button type="button" v-on:click="hideElement(property)"
                            class="btn btn-danger">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="modal fade bs-example-modal-lg" id="property-table" tabindex="-1" role="dialog" data-backdrop="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span aria-hidden="true">×</span>
                            <span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title">{{'Управление'|_}}</h4>
                    </div>
                    <div class="modal-body" style="padding-bottom: 0; padding-top: 0">
                        <table class="table table-striped" v-if="!editProperty">
                            <thead>
                            <tr>
                                <th class="col-md-3">{{'Название'|_}}</th>
                                <th class="col-md-3">{{'Тип'|_}}</th>
                                <th class="col-md-5"></th>
                                <th class="col-md-1"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(property,index) in properties">
                                <td v-html="property.alias"></td>
                                <td>{{property.type.name}}</td>
                                <td v-html="property.data.description"></td>
                                <td>
                                    <button type="button" v-on:click="editElement($event,property)"
                                            class="btn btn-xs btn-success">
                                        <i class="fa fa-gear"></i>
                                    </button>
                                    <button type="button" v-on:click="deleteElement($event,property)"
                                            class="btn btn-xs btn-danger">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colspan="4" class="text-right">
                                <span v-on:click="addElement($event)" class="btn btn-primary btn-sm">
                                    <i class="fa fa-plus-circle"></i>
                                    {{'Добавить параметр'|_}}
                                </span>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                        <form method="post" class="form-horizontal m-b-md" v-if="editProperty">
                            <div class="row">
                                <template v-for="(field,idx) in editFormFields">
                                    <text-form-field
                                            v-if="field.type == 'text-form-field'"
                                            :id="field.id"
                                            :name="field.name"
                                            :field="field.name"
                                            :label="field.label"
                                            :model="editProperty"
                                            :required="(field.required != undefined) ? field.required : false"
                                            :validate="field.validate"
                                            :form_group="field.form_group"
                                            :readonly="(field.readonly != undefined) ? field.readonly : false"
                                            :css_class="(field.css_class) ? field.css_class : 'col-sm-6'"
                                            :help_string="(field.help != undefined) ? field.help : ''"
                                            :placeholder="(field.placeholder  != undefined )?field.placeholder:''"></text-form-field>
                                    <select-form-field
                                            v-if="field.type == 'select-form-field'"
                                            :label="field.label"
                                            :model="editProperty"
                                            :id="field.id"
                                            :required="(field.required != undefined) ? field.required : false"
                                            :validate="field.validate"
                                            :readonly="(field.readonly != undefined) ? field.readonly : false"
                                            :css_class="(field.css_class) ? field.css_class : 'col-sm-6'"
                                            :form_group="(field.form_group != undefined) ? field.form_group : true"
                                            :option_group="(field.option_group != undefined) ? field.option_group : false"
                                            :data="field.items"
                                            :placeholder="(field.placeholder  != undefined )?field.placeholder:''"
                                            :field="field.name">
                                    </select-form-field>
                                </template>
                                <div>
                                    <div class="col-sm-12">
                                        <label class="control-label">{{'Описание'|_}}</label>
                                        <textarea v-model="editProperty.data.description" class="form-control"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="alert alert-info" style="margin-top: 10px"
                                 v-if="((editProperty.items && editProperty.id == 0 )|| (editProperty.type.id == 'select'&& editProperty.id == 0 ))">
                                {{'Для добавления варианов значения необходимо сохранить параметр'|_}}
                            </div>
                            <table class="table table-bordered m-t-md"
                                   v-if="((editProperty.items && editProperty.id > 0 )|| (editProperty.type.id == 'select'&& editProperty.id > 0 ))">
                                <caption>{{'Варианты значений'|_}}</caption>
                                <thead>
                                <tr>
                                    <th style="width: 50px" class="text-center">ID</th>
                                    <th>ALIAS</th>
                                    <th>NAME</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="value in editProperty.data.values">
                                    <td class="text-center">{{value.id}}</td>
                                    <td v-bind:class="{'has-error':errors.has('property_alias_'+value.id)}">
                                        <input type="text" v-validate="'required'" v-model="value.alias"
                                               :name="'property_alias_' + value.id" class="form-control">
                                    </td>
                                    <td>
                                        <div class="input-group" v-bind:class="{'has-error':errors.has('property_name_'+value.id)}">
                                            <input type="text" v-model="value.name"
                                                   v-validate="'required'"
                                                   :name="'property_name_' + value.id"
                                                   class="form-control">
                                            <span class="input-group-btn">
                                             <button type="button" data-style="zoom-in"
                                                     v-on:click="saveValue($event, value)" class="btn btn-primary btn-md">
                                                <i class="fa fa-check"></i>
                                             </button>
                                            <button type="button" data-style="zoom-in"
                                                    v-on:click="deleteValue($event, value)" class="btn btn-danger btn-md">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </span>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colspan="3" class="text-right">
                                        <button type="button" v-on:click="addValue($event)" class="btn btn-primary btn-sm">
                                            <i class="fa fa-plus-circle"></i>
                                            {{'Добавить значение'|_}}
                                        </button>
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-white" v-if="!editProperty" data-dismiss="modal">{{'Закрыть'|_}}</button>
                        <a href="#" class="btn btn-warning" v-if="editProperty" v-on:click="editElement($event,null)">
                            <i class="fa fa-chevron-left"></i> {{'Назад'|_}}
                        </a>
                        <button type="button" class="btn btn-primary" data-style="zoom-in"
                                v-on:click="saveElement($event)" v-if="editProperty">
                            <i class="fa fa-check"></i>
                            {{'Сохранить'|_}}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade bs-example-modal-lg" id="property-setting" tabindex="-1" role="dialog" data-backdrop="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span aria-hidden="true">×</span>
                            <span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title" v-if="editProperty">{{'Редактирование параметра'|_}}:
                            #{{editProperty.id}}-{{editProperty.alias}}</h4>
                    </div>
                    <div class="modal-body" v-if="editFormFields && editProperty">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-white" data-dismiss="modal">{{'Закрыть'|_}}</button>
                        <button type="button" class="btn btn-primary">{{'Применить'|_}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import TextFormField from '@/components/form/fields/TextFormField.vue';
    import SelectFormField from '@/components/form/fields/SelectFormField.vue';
    import {FdTranslator} from '@/FdTranslator';
    import {Util} from '@/Util';
    import {Validator} from 'vee-validate';
    import Presentation from '@/components/Presentation.vue';

    declare let ymaps: any;
    declare let map: any;
    declare let $: any;

    @Component({
        name: 'SamplePropertyTable',
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
        components: {
            'presentation': Presentation,
            'text-form-field': TextFormField,
            'select-form-field': SelectFormField
        }
    })

    export default class SamplePropertyTable extends Vue {

        @Prop({default: null})
        item: any;

        @Prop({default: null})
        model_id: number;

        @Prop({default: null})
        model_class: string;

        @Provide()
        properties: [{ name: string, value: string, sort: string, type: string, show: boolean }] = null;

        @Provide()
        selectedProperties: any = [];

        @Provide()
        tourSteps: any = null;

        @Provide()
        sort: any = 'Y';

        @Provide()
        editProperty: any = null;

        @Provide()
        editFormFields: any = null;

        protected myPlacemark: any;


        mounted(): void {
            let me = this;
            me.$set(me, 'properties', (me.item.properties) ? me.item.properties : {});
            me.checkOpen();

            me.$nextTick(function () {
                $('.dropdown-toggle').dropdown();
                // me.initChosen();
            });


            // me.$set(me, 'tourSteps', [
            //     {
            //         target: '#presentation-one',
            //         content: FdTranslator._('Выберите параметр из списка'),
            //         after: () => {
            //             me.showElement(me.properties[0]);
            //             return new Promise((resolve, reject) => {
            //                 resolve();
            //             })
            //         }
            //     },
            //     {
            //         target: '#presentation-two',
            //         content: FdTranslator._('Выбранный параметр отображается в таблице')
            //     },
            //     {
            //         target: '#presentation-three',
            //         content: FdTranslator._('Ознакомтесь с описанием и вариантами действий при разных значениях параметра')
            //     },
            //     {
            //         target: '#presentation-four',
            //         content: FdTranslator._('Определите значение параметра')
            //     },
            //     {
            //         target: '#presentation-five',
            //         content: FdTranslator._('Удалите параметр для возврата к значению по умолчанию')
            //     },
            //     {
            //         target: '#save-content-btn',
            //         content: FdTranslator._('После определения значений выбранных параметров, не забудтье сохранить объект редактирования!!!')
            //     }
            // ]);

            me.$set(me, 'editFormFields', [
                {
                    id: 'p-name',
                    type: 'text-form-field',
                    name: 'name',
                    label: FdTranslator._('Название'),
                    required: true,
                    css_class: 'col-sm-6',
                    validate: 'required'
                }, {
                    id: 'p-alias',
                    type: 'text-form-field',
                    name: 'alias',
                    label: FdTranslator._('Псевдоним'),
                    required: true,
                    css_class: 'col-sm-6',
                    validate: 'required'
                }, {
                    id: 'p-type',
                    type: 'select-form-field',
                    name: 'type',
                    label: FdTranslator._('Тип'),
                    required: true,
                    validate: 'required',
                    items: [
                        {id: 'string', name: FdTranslator._('Строка')},
                        {id: 'number', name: FdTranslator._('Число')},
                        {id: 'select', name: FdTranslator._('Список')},
                        {id: 'location', name: FdTranslator._('Координаты')},
                        {id: 'file', name: FdTranslator._('Файл')},
                    ],
                    css_class: 'col-sm-6',
                    form_group: false
                }, {
                    id: 'p-sort',
                    type: 'text-form-field',
                    name: 'sort',
                    label: FdTranslator._('Сортировка'),
                    // required: true,
                    css_class: 'col-sm-6'
                },
            ])
        }

        beforeDestroy(): void {
            let me = this;
            if (me.myPlacemark) {
                map.geoObjects.remove(me.myPlacemark);
            }
        }

        showElement(element: any): void {
            element.show = true;
            let me = this;
            switch (element.type) {
                case 'select':

                    break;
            }
            me.checkOpen();
        }

        hideElement(element: any): void {
            let me = this;
            element.show = false;
            me.checkOpen();
        }

        checkOpen(): void {
            let me = this, tmp = [];
            me.properties.forEach(function (element) {
                if (element.show) {
                    tmp.push(element)
                }
            });
            me.selectedProperties = tmp;
        }

        openFinder(mediaItem: any, params: string): void {
            let me = this;
            Util.openElFinder({
                name: 'image',
                params: params,
                callback: function (selectedFile) {
                    console.log(selectedFile);
                    if (selectedFile && selectedFile.length > 0) {
                        mediaItem.value = selectedFile[0].url.toString().replace(window.location.protocol + '//' + window.location.hostname, '');
                    }
                }
            })
        }

        arrayMaxSort(arr: any): any {
            let result = arr.reduce(function (p, v) {
                return (p.sort > v.sort ? p.sort : v.sort);
            });
            return (typeof result == 'number') ? result : result.sort;
        }


        openMap(property: any): void {
            let me = this;
            $('#mapModal').on('hide.bs.modal', function (e) {
                map.geoObjects.remove(me.myPlacemark);
                me.myPlacemark = null;
                $('#mapModal').unbind('show.bs.modal');

            }).on('show.bs.modal', function (e) {
                let center = [55.76, 37.64];
                if (me.myPlacemark) {
                    map.geoObjects.remove(me.myPlacemark);
                }

                if (property.value !== null && property.value !== '' && property.value !== undefined) {

                    center = property.value.split(',');
                }
                if (!map) {
                    map = new ymaps.Map('map', {
                        center: center,
                        zoom: 15
                    });
                }
                if (property.value !== '') {
                    add(center, property.name);
                }
                map.events.add('click', function (e) {
                    let coords = e.get('coords');
                    if (me.myPlacemark) {
                        me.myPlacemark.geometry.setCoordinates(coords);
                    } else {
                        add(coords, 'поиск...');
                    }
                    getAddress(coords);
                });

                function add(coords, name) {
                    me.myPlacemark = new ymaps.Placemark(coords, {
                        iconCaption: name
                    }, {
                        preset: 'islands#violetDotIconWithCaption',
                        draggable: true
                    });
                    map.geoObjects.add(me.myPlacemark);
                    me.myPlacemark.events.add('dragend', function () {
                        getAddress(me.myPlacemark.geometry.getCoordinates());
                    });
                }

                function getAddress(coords) {
                    me.myPlacemark.properties.set('iconCaption', 'поиск...');
                    ymaps.geocode(coords).then(function (res) {
                        let firstGeoObject = res.geoObjects.get(0);
                        me.myPlacemark.properties
                            .set({
                                iconCaption: firstGeoObject.properties.get('name'),
                                balloonContent: firstGeoObject.properties.get('text')
                            });
                    });
                }

                $('.btn-primary', this).unbind('click').click(function () {
                    if (me.myPlacemark) {
                        property.value = me.myPlacemark.geometry.getCoordinates().join(',');
                        property.name = me.myPlacemark.properties.get('iconCaption');
                        map.geoObjects.remove(me.myPlacemark);
                        me.myPlacemark = null;
                    }
                    $('#mapModal').modal('hide');
                })
            }).modal('show');
        }


        changePropertyType(item: any, index: any, type: string, $event: Event): void {
            let me = this;
            item.type = type;
        }

        openSetting($event: Event): void {
            $event.preventDefault();
            let me = this;
            $('#property-table').on('hide.bs.modal', function (e) {
                $('#property-table').unbind('show.bs.modal');
                me.$set(me, 'editProperty', null);
            }).on('show.bs.modal', function (e) {
                // $('.btn-primary', this).unbind('click').click(function () {
                //     $('#property-table').modal('hide');
                // })
            }).modal('show')
        }

        deleteElement($event: Event, property: any): void {
            $event.preventDefault();
        }

        addElement($event: Event): void {
            $event.preventDefault();
            this.editProperty = {
                id: 0,
                name: '',
                alias: '',
                type: 'string',
                sort: 100,
                model_id: this.model_id,
                model_class: this.model_class,
                item_id: this.item.id,
                items: [],
                data: {
                    description: ''
                }
            }
        }

        editElement($event: Event, property: any): void {
            $event.preventDefault();
            if (property !== null) {
                this.$set(this, 'editProperty', {
                    id: property.id,
                    name: property.name,
                    alias: property.alias,
                    type: property.type,
                    data: property.data,
                    sort: property.sort,
                    item_id: property.item_id,
                    model_class: this.model_class,
                    model_id: property.model,
                });
            } else {
                this.$set(this, 'editProperty', null);
            }
        }

        saveElement($event: Event): void {
            $event.preventDefault();
            let me = this,
                validator = new Validator({
                    name: 'required',
                    alias: 'required',
                    type: 'required'
                }, {});

            validator.validateAll(me.editProperty).then((result) => {
                if (result) {
                    me.editProperty.model_class = me.model_class;
                    Util.sendData({
                        event: $event,
                        url: 'content/save-property',
                        data: me.editProperty,
                        callback: function (response) {
                            if (response.data.success) {
                                me.properties = response.data.items;
                                me.editProperty = response.data.item;
                                if (response.data.item.data.values) {
                                    me.editProperty.values = response.data.item.data.values;
                                }
                            } else {
                                Util.showWarning(FdTranslator._('Ошибка сохранения парамтера'))
                            }
                        }
                    }, me)
                } else {
                    Util.showWarning(FdTranslator._('Проверьте правильность заполнения формы'));
                }
            })
        }

        deleteValue($event: Event, value): void {
            let me = this;
            let tmp = [];
            if (me.editProperty.data) {
                for (let i in me.editProperty.data.values) {
                    if (me.editProperty.data.values[i].id != value.id) {
                        tmp.push(me.editProperty.data.values[i]);
                    }
                }
            }

            if (value.id > 0) {
                Util.deleteDialog({
                    callback: function () {
                        Util.sendData({
                            event: $event,
                            url: 'content/delete-select-value',
                            data: {
                                id: value.id,
                                type: me.editProperty.type,
                                property_id: me.editProperty.id,
                                model_class: me.model_class,
                            },
                            callback: function (response) {
                                if (response.data.success) {
                                    me.editProperty.data.values = tmp;
                                }
                            }
                        }, me);
                    },
                    title: FdTranslator._('Подтверждение удаления значения параметра!!!'),
                    text: FdTranslator._('При удаление варианта значения, все заполненные парамерты с этим вариантом будут удалены, продолжить?')
                });
            } else {
                me.editProperty.data.values = tmp;
            }
        }

        addValue($event: Event): void {
            let me = this, add = true;
            $event.preventDefault();
            me.editProperty.data.values.forEach(function (element) {
                if (element.id == 0) {
                    add = false;
                }
            });
            if (add) {
                me.editProperty.data.values.push({
                    id: 0, alias: '', value: '', property_id: me.editProperty.id
                })
            }
        }

        saveValue($event: Event, value): void {
            $event.preventDefault();
            let me = this;
            me.$validator.validateAll().then((result) => {
                if (result) {
                    Util.sendData({
                        event: $event,
                        url: 'content/add-select-value',
                        data: {
                            id: value.id,
                            name: value.name,
                            alias: value.alias,
                            property_id: value.property_id,
                            type: me.editProperty.type,
                            model_class: me.model_class,
                        },
                        callback: function (response) {
                            if (response.data.success) {
                                me.editProperty.values = response.data.items;
                                me.editProperty.data.values = response.data.items;
                            }
                        }
                    }, me);
                }
            })
        }
    }
</script>

<style>
    .modal-backdrop.in {
        display: none !important;
    }
</style>