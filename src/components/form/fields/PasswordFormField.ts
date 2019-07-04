import {Component, Watch} from 'vue-property-decorator';
import {FormField} from './FormField';
import {FdTranslator} from '@/FdTranslator';


declare let $: any;
declare let parameters: any;


@Component({
    name: 'password-form-field',
    template: require('./views/password-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class PasswordFormField extends FormField {

    @Watch('set_model')
    onChangeSetModel(nv, ov) {
        let me = this;
        me.$set(me.model, me.field, nv);
    }

    mounted(): void {
        let me = this;
        me.$set(me, 'set_model', me.model[me.field]);
        this.$nextTick(function () {
            me.initPassword();
        })
    }

    initPassword(): void {
        console.log(this.id);
        let input = $('input#' + this.id),
            init = $('[data-action="generate"]', $($(input).parent())).length;

        if (init === 0) {
            // $(input).password({
            //     message: 'Отобразить пароль',
            //     eyeClass: 'glyphicon',
            //     eyeOpenClass: 'glyphicon-eye-close',
            //     eyeCloseClass: 'glyphicon-eye-open'
            // });
        }
    }
}