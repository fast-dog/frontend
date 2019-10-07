import axios, {AxiosPromise} from 'axios';
import {Util} from '@/Util';

declare let $: any;

export class ConfigService {

  static getItem(id: any): AxiosPromise {
    return axios.get(Util.httpRoot + 'config/domains/' + id)
  }

  static getComponentItem(id: any): AxiosPromise {
    return axios.get(Util.httpRoot + 'config/components/' + id)
  }

  static getEmailItem(id: any): AxiosPromise {
    return axios.get(Util.httpRoot + 'config/emails/' + id)
  }

  static getHelpItem(id: any): AxiosPromise {
    return axios.get(Util.httpRoot + 'config/help/' + id)
  }


  static getLocalizationItem(id: any): AxiosPromise {
    return axios.get(Util.httpRoot + 'config/localization/' + id)
  }

  static getForm(id: any): AxiosPromise {
    return axios.get(Util.httpRoot + 'config/forms/' + id)
  }

  static getInfo(): AxiosPromise {
    return axios.get(Util.httpRoot + 'config/admin-info')
  }
}
