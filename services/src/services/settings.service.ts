import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class Settings {

  private settings: any = { };

  constructor() {
    console.log('SettingsService started.');
  }

  set(key: string, value: any): void {
    this.settings[key] = value;
  }

  get(key: string): any {
    return this.settings[key];
  }
}