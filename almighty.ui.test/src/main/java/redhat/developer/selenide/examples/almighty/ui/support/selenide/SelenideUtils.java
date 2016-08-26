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

import static com.codeborne.selenide.Selenide.page;
import java.text.MessageFormat;

import com.codeborne.selenide.Selenide;

/**
 * Adapted from io.apiman.test.integration.ui.support.selenide.SelenideUtils by jcechace
 */
public class SelenideUtils {

    /**
     * Retrieve page locating from @PageLocation annotation and substitute parameters
     *
     * @param pageObjectClassClass page object class
     * @return location of given page
     */
    public static String pageLocation(Class<?> pageObjectClassClass, String... params) {
        if (!pageObjectClassClass.isAnnotationPresent(PageLocation.class)) {
            throw new IllegalStateException(
                String.format("Unknown page URL, maybe @%s is missing?", PageLocation.class.getSimpleName())
            );
        }
        PageLocation annotation = pageObjectClassClass.getAnnotation(PageLocation.class);
        return MessageFormat.format(annotation.value(), params);
    }

    /* TODO - Will ALMighty include similar Login constructs?  */    
 
    /**
     * Open page represented by given class object in browser. If authentication
     *
     * @param pageObjectClass class object representing a page
     * @return page object representing opened page
     */
//    public static <P> P open(Class<P> pageObjectClass, String... params) {
//        String relativeOrAbsoluteUrl = pageLocation(pageObjectClass, params);
//        P page = Selenide.open(relativeOrAbsoluteUrl, pageObjectClass);
//        return withLogin(pageObjectClass, page);
//    }
   
    /**
     * Conveniently perform login in required
     *
     * @param pageObjectClass class representing expected page
     * @param page page object representing expected page
     * @return expected page object after login
     */
//    private static <P> P withLogin(Class<P> pageObjectClass, P page) {
//        LoginPage loginPage = page(LoginPage.class);
//        if (!loginPage.isCurrentPage()) {
//            return page;
//        }
//        return loginPage.login("admin", "admin123!", pageObjectClass);
//    }

}
