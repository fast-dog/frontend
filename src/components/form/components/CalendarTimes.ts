import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop, Provide, Watch} from 'vue-property-decorator';
import {ClockFormField} from '../fields/ClockFormField';
import  moment from 'moment';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';


declare let $: any;

@Component({
    name: 'calendar-times',
    template: require('./views/calendar-times.html'),
    components: {
        'clock-field': ClockFormField
    },
    filters: {
        'json': function (value) {
            return JSON.stringify(value, null, 2)
        },
        _: function (value) {
            return FdTranslator._(value);
        }
    },
})

export class CalendarTimesComponent extends Vue {

    @Prop({default: null})
    model: any;

    @Prop({default: null})
    remove: any;

    @Prop({default: null})
    create: any;

    @Provide()
    data: any = null;

    @Provide()
    times: any = [];

    @Watch('model.times')
    onUpdateTimes(nv, ov) {

    }

    @Provide()
    set_model: any = null;

    mounted(): void {
        let me = this,
            count = 6;
        me.$set(me, 'set_model', (me.model) ? me.model : {times: []});

        if (me.set_model.times.length == 0) {
            for (let i = 1; i <= count; i++) {
                me.times.push({
                    deleted_at: null,
                    id: i,
                    _id: null,
                    from: {
                        value: '',
                        label: FdTranslator._('Начало приема')
                    },
                    to: {
                        value: '',
                        label: FdTranslator._('Окончание приема')
                    },
                    delete: [i],
                })
            }
        } else {
            for (let i in me.set_model.times) {
                me.times.push(me.set_model.times[i]);
            }
        }
        me.set_model.times = me.times;
    }

    addMore($event: Event, count): void {
        $event && $event.preventDefault();
        let me = this, total = me.set_model.times.length + +moment().milliseconds();
        for (let i = 1; i <= count; i++) {
            total++;
            me.times.push({
                deleted_at: null,
                id: total,
                _id: null,
                from: {
                    value: '',
                    label: FdTranslator._('Начало приема')
                },
                to: {
                    value: '',
                    label: FdTranslator._('Окончание приема')
                },
                delete: [total],
            })
        }
    }

    save($event: Event): void {
        let me = this;
        Util.sendData({
            event: $event,
            url: me.create.url,
            data: {
                times: me.times,
                day: me.create.day
            },
            callback: function (response) {
                me.times = response.data.items;
                let parent: any = me.$parent;
                if (parent.callback) {
                    parent.callback();
                }
            }
        }, me)
    }

    deleteTimes($event: Event, time): void {
        let me = this;
        Util.deleteDialog({
            title: FdTranslator._('Подтверждение удаления периода'),
            text: FdTranslator._('Период времени с - по, будет удален, Вы хотите продолжить?'),
            text_ok: FdTranslator._('Удалить'),
            callback: function () {
                let tmp = [];
                me.times.forEach(function (item) {
                    if (time.delete.indexOf(parseInt(item.id)) !== -1) {

                        if (me.remove !== null) {
                            Util.sendData({
                                event: $event,
                                url: me.remove.url,
                                data: {
                                    item: item
                                },
                                callback: function (response) {
                                    item.deleted_at = new Date();
                                }
                            }, me)
                        } else {
                            item.deleted_at = new Date();
                        }
                    }
                })
            }
        });
    }
}