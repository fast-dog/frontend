import Vue from 'vue';
import {Prop, Provide} from 'vue-property-decorator';
import moment from 'moment';


export class FormField extends Vue {

    @Prop({default: ''})
    placeholder: string;

    @Prop({default: moment().millisecond().toString()})
    id: string;

    @Prop({default: ''})
    label: string;

    @Prop({default: ''})
    help_string: string;

    @Prop({default: false})
    readonly: boolean;

    @Prop({default: ''})
    field: string;

    @Prop({default: 300})
    height: number;

    @Prop({default: null})
    model: any;

    @Prop({default: null})
    scope: any;

    @Provide()
    set_model: any = null;

    @Prop({default: 'col-sm-12'})
    css_class: string;

    @Provide()
    set_id: any = null;

    @Prop({default: false})
    form_group: boolean;

    @Prop({default: false})
    required: boolean;

    @Prop({default: ''})
    validate: string;

    @Prop({default: ''})
    name: string;

    mounted(): void {

    }

    beforeDestroy(): void {

    }
}