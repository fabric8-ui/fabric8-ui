import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {
  constructor() { }

  setCookie(cName: string, cValue: Array<any>) {
    document.cookie = cName + "=" + JSON.stringify(cValue);
  }

  getCookie(itemLength: Number) {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].includes('datatableColumn')) {
        let array = cookies[i].split('=');
        if(array.length > 1 && Array.isArray(JSON.parse(array[1])) && JSON.parse(array[1]).length === itemLength){
                return {status: true, array: JSON.parse(array[1])};
          }
        }
      }
      return {status: false, array: []};
    }
}