import { browser, ExpectedConditions as until, $, by } from 'protractor';
import * as support from '../support';
import { BaseElement } from '../ui';

import { BasePage } from './base.page';

export abstract class AppPage extends BasePage {
  appTag = $('f8-app');

  /**
   * Extend this class, to describe Application Page(after logging in)
   *
   * @param {url} string URL where the extended page resides
   */
  constructor(url?: string) {
    super(url);
  }

  /**
   * Returns an instance of the BaseElement that can be found using
   * the {css} and contains the {text}.
   *
   * @param {ui} The Base Element Class e.g. Button, TextInput
   * @param {css}  Css within the appTag that identifies the element
   * @param {text} text in the element
   *
   */
  innerElement(ui: typeof BaseElement, css: string, text: string): BaseElement {
    const element = this.appTag.element(by.cssContainingText(css, text));
    return new ui(element, text);
  }

  async ready() {
    await browser.wait(until.presenceOf(this.appTag));
  }

}