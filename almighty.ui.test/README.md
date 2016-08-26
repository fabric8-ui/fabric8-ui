(draft)README File for ALMighty UI tests
========================================

(Adapted from: https://gitlab.mw.lab.eng.bos.redhat.com/jboss-apiman-qe/apiman-qe-tests/blob/master/apiman-it-ui/README.md)

How to run these tests:
-----------------------
TBD

Implementation details for these tests:
---------------------------------------

* The tests will be written using Selenide (http://selenide.org, https://github.com/codeborne/selenide/wiki/Selenide-vs-Selenium) and Selenium WebDriver (http://www.seleniumhq.org/projects/webdriver)

* The test design will follow the Page Object (http://code.google.com/p/selenium/wiki/PageObjects) and Page Fragment (https://docs.jboss.org/author/display/ARQGRA2/Page+Fragments) model.

* In order to avoid creating duplicate test objects (users, policies, organizations, etc.) to represent all the objects in the UI, the tests' pom.xml file includes this dependency:

```xml
<!-- Pull in the ALMighty defininitions for all UI elements -->
<dependency>
  <groupId>tbd.tbd</groupId>
  <artifactId>tbd.tbd.tbd</artifactId>
</dependency>
```

General Design conventions for these tests:
-------------------------------------------

* The goal of each UI test is to verify that configuration performed via the UI (utilizing the UI in the same manner as a human user) is propagated into backend services. (In this context, "backend" refers to persistent data objects created and manipulated in the UI.)

* The UI tests will not attempt to duplicate the actions performed by unit or other tests (such as the REST-based tests), but should focus on the operation of and user navigation through the UI. Accordingly, the tests will navigate through the UI in the same manner as (human) users.

* The validation of the results of a UI test will be to validate that the data is saved in the UI, and can then be retrieved from the UI.

* Ultimately, the tests will exist in 2 forms:
 - First, create entities in the UI and verify that they are correctly saved/shown, and that they are correctly propagated to a persistent backend.
 - Second, create entities with the REST API, and verify information displayed in the UI.

* Each test class should create its own test data using JUnit runner.

UI Abstraction Design and Programming conventions:
-------------------------------------------------

* [Selenide framework](http://selenide.org) is our tool of choice for writing UI tests
 - Use [Page-Object desing pattern](http://selenide.org/documentation/page-objects.html)
 - Use fluent/builder style page objects = methods should return a page object representing a page displed in browser after the action is performed.
 - Structure the page object into Layouts and Components (see the next section).

* Assertions of test results will take (2) forms:
 - [BeanAssert classes](class BeanAssert.java) will verify that the backend objects created by the UI tests are correct
 - [PageAssert classes](class PageAssert.java) will verify that the information in the UI pages displayed to the user are correct
 - [Selenide assertions](https://github.com/codeborne/selenide/wiki/Selenide-vs-Selenium) should be used to verify state of the elements (e.g. button is visible and enabled).

Pages, Layouts, and Components:
-------------------------------
Different pages quite often share some similarities, that means that either the overall layout of the page is the same or pages share some smaller part (form to create/manipulate a component). In order to prevent code duplicities pages objects are structured as follows:

* Package **tbd.ui.support.selenide.layout**
 - Contains (usually abstract) classes representing the overall layout of the page
 - The [AbstractPage<P>](tbd/ui/support/selenide/layouts/AbstractPage.java) class represents the main layout of regular ALMighty pages and contains the elemenst shared among all pages available to authenticated use.
 - Use [@Layout(String pattern)](tbd/ui/support/selenide/Layout.java) to document the subset of pages which should be using this layout.

* Package **tbd.ui.support.selenide.components**
 - Components are elements shared between pages which can't be a part of layout for some reason (e.g. pages are using sligtly different layout)
 - Components are implemented as java interfaces with extension methods. This allows to "mix in" an arbitrary number of components into single page while preserving the flat structure (yes, this approach has disadventages, as does any other).
 - In order to support the fluent/builder style page objects, components should extend the [PageComponent<P>](tbd/ui/support/selenide/components/PageComponent.java) interface.

```java
@Layout("/browse/*")
public class BrowsePage extends AbstractPage<BrowsePage> {
    // implementation omitted
}
```

The class example above represents a layout for all pages available at http://localhost:8080/tbd/browse/*

* Package **tbd.ui.support.selenide.pages**
 - Contains classes representing the specific pages in the UI
 - Use [@PageLocation(String url)](tbd/ui/support/selenide/PageLocation.java) to document the url of page represented by this class.

### Fluent style classes (Generic parametrization)
You usually need to pass the current class as a generic paramter to superclass and interfaces. This is necessary in order to make the  fluent/builder style page objects.

The reason why this works is the [AbstractPage<P>](tbd/ui/support/selenide/layouts/AbstractPage.java) class, which implements the following method from [PageComponent<P>](tbd/ui/support/selenide/components/PageComponent.java):

```java
    /**
     * Return this object cast to expected type (specified by Generic parameter P)
     * @return this page object
     */
    @SuppressWarnings("unchecked")
    public P getPageObject() {
        return (P) this;
    }
```

This method will always return the  object represented by ```this``` as the expected type.

### Extends vs Implements
In case you are confused by classes always having a superclass and often implementing few interfaces. The rule of thumb here is

* Class inheritance is used to extend a layout
* Interfaces are mixins containg smaller parts of the page which can't be a part of the layout.


