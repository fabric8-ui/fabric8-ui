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

package redhat.developer.selenide.examples.almighty.ui.support.selenide.pages;

import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.page;

import redhat.developer.selenide.examples.almighty.ui.support.selenide.Layout;
import redhat.developer.selenide.examples.almighty.ui.support.selenide.components.PageComponent;

import com.codeborne.selenide.SelenideElement;

/**
 * Ancestor for all pages which are available only to logged-in users.
 * Adapted from io.apiman.test.integration.ui.support.selenide.pages.AbstractPage by jkaspar
 */
@Layout("/*")
public class AbstractPage<P> implements PageComponent<P> {
	
	
    /**
     * Find element containing name of logged user
     * @return element
     */
    public SelenideElement loggedUser() {
        return userMenu().find("span:nth-of-type(2)");
    }

    /**
     * User menu toggle
     * @return element
     */
    public SelenideElement userMenu() {
        return $("#dropdown-toggle");
    }

    /**
     * Home link
     * @return element
     */
    public SelenideElement homeLink() {
        return $("#navbar-home");
    }

    /* TODO - Update when we get a home page */
    
    /**
     * Go to Home page
     * @return HomePage
     */
//    public HomePage home() {
//        userMenu().click();
//        homeLink().click();
//        return page(HomePage.class);
//    }

    /**
     * My stuff link
     * @return element
     */
    public SelenideElement myStuffLink() {
        return $("#navbar-my-stuff");
    }

    /**
     * Profile link
     * @return element
     */
    public SelenideElement userProfileLink() {
        return $("#navbar-profile");
    }


    /**
     * About apiman link
     * @return element
     */
    public SelenideElement aboutApimanLink() {
        return $("#navbar-about");
    }

    /**
     * Logout link
     * @return element
     */
    public SelenideElement logoutLink() {
        return $("#navbar-logout");
    }

    /**
     * Return this object cast to expected type (specified by Generic parameter P)
     * @return this page object
     */
    @SuppressWarnings("unchecked")
    public P thisPageObject() {
        return (P) this;
    }
}
