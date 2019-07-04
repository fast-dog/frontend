import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop, Provide} from 'vue-property-decorator';
import {Validator} from 'vee-validate';
import {TextFormField} from '../fields/TextFormField';
import {SelectFormField} from '../fields/SelectFormField';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';


declare let $: any;
declare let ymaps: any;
declare let map: any;

@Component({
    name: 'sample-properties-table',
    template: require('./views/sample-properties-table.html'),
    components: {
        // 'presentation': Presentation,
        'text-form-field': TextFormField,
        'select-form-field': SelectFormField
    },
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})

export class SamplePropertyTable extends Vue {

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


        me.$set(me, 'tourSteps', [
            {
                target: '#presentation-one',
                content: FdTranslator._('Выберите параметр из списка'),
                after: () => {
                    me.showElement(me.properties[0]);
                    return new Promise((resolve, reject) => {
                        resolve();
                    })
                }
            },
            {
                target: '#presentation-two',
                content: FdTranslator._('Выбранный параметр отображается в таблице')
            },
            {
                target: '#presentation-three',
                content: FdTranslator._('Ознакомтесь с описанием и вариантами действий при разных значениях параметра')
            },
            {
                target: '#presentation-four',
                content: FdTranslator._('Определите значение параметра')
            },
            {
                target: '#presentation-five',
                content: FdTranslator._('Удалите параметр для возврата к значению по умолчанию')
            },
            {
                target: '#save-content-btn',
                content: FdTranslator._('После определения значений выбранных параметров, не забудтье сохранить объект редактирования!!!')
            }
        ]);

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
        return (typeof  result == 'number') ? result : result.sort;
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