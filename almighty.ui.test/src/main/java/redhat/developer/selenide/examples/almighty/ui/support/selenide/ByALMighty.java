/*
 * Copyright 2016 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package redhat.developer.selenide.examples.almighty.ui.support.selenide;

import org.openqa.selenium.By;

/**
 * Adapted from io.apiman.test.integration.ui.support.selenide.ByApiman by jcechace
 */
public class ByALMighty {

    /**
     * Create a css based selector for Angular Model attribute "ng-model"
     * @param property model property
     * @return By selector
     */
    public static By ngModel(String property) {
        if (property == null) {
            throw new IllegalArgumentException("Cannot find elements when model property is null.");
        } else {
            return new By.ByCssSelector("*[ng-model='" + property + "']");
        }
    }

    /**
     * Create a css based selector for Angular model attribute "ng-show"
     * @param property model property
     * @return By selector
     */
    public static By ngShow(String property) {
        if (property == null) {
            throw new IllegalArgumentException("Cannot find elements when model property is null.");
        } else {
            return new By.ByCssSelector("*[ng-show='" + property + "']");
        }
    }
    
    /* TODO - Will ALMighty include similar I18N constructs?  */    

    /**
     * Create a css based selector for i18n attribute "apiman-i18n-key"
     *
     * @param element element type
     * @param key i18n key
     * @return By selector
     */
    public static By i18n(String element, String key) {
        if (key == null) {
            throw new IllegalArgumentException("Cannot find elements when i18n key is null.");
        } else {
            return new By.ByCssSelector(element + "[apiman-i18n-key='" + key + "']");
        }
    }

    /**
     * Create a css based selector for i18n attribute "apiman-i18n-key"
     *
     * @param key i18n key
     * @return By selector
     */
    public static By i18n(String key) {
        return i18n("*", key);
    }

}
