package redhat.developer.selenide.examples.almighty.ui.support.selenide.pages;

import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Selectors.byClassName;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.$$;

import com.codeborne.selenide.ElementsCollection;

import static com.codeborne.selenide.Selectors.byXpath;

import com.codeborne.selenide.SelenideElement;

public class MainPage<P> extends AbstractPage<P> {
	
	/**
     * Find the only button on the page as of August 2016
     * @return element
     */
    public SelenideElement primaryButton() {
//        return $(byClassName("btn-primary"));
        return  $(byXpath("//my-app/work-item-list/div/button"));    
    }
	
	/**
     * Find the save button on the page as of August 2016
     * @return element
     */
    public SelenideElement saveButton() {
//        return $(byClassName("btn-primary"));
//        return  $(byXpath("//my-app/work-item-list/div/div/work-item-detail/div/button[2]"));
        return  $(byXpath("//my-app/work-item-list/div/div/div[1]/div/work-item-quick-add/div/div/div[4]/div/a[1]"));
    }
    
	/**
     * Find workitem title field on the page
     * @return element
     */
    public SelenideElement workitemTitle() {
        // return $(byXpath("//my-app/work-item-list/div/div/work-item-detail/div/div[2]/input"));
        return $(byXpath("//my-app/work-item-list/div/div/div[1]/div/work-item-quick-add/div/div/div[2]/div/input"));
    }
    
	/**
     * Find description field on the page
     * @return element
     */
    public SelenideElement workitemDescription() {
        // return $(byXpath("//my-app/work-item-list/div/div/work-item-detail/div/div[2]/input"));
        return $(byXpath("//my-app/work-item-list/div/div/div[1]/div/work-item-quick-add/div/div/div[3]/div/input"));
    }
    
	/**
     * Find text on the page as of September 2016
     * @return element
     */
    public SelenideElement textOnPage() {
        // return $("div.container-fluid.container-cards-pf");
        return $(byXpath("//my-app/work-item-list/div/div"));
    }    
    
    public ElementsCollection workitemsOnPage() {
        //return $$(byXpath("//my-app/work-item-list/div/div/div/div/div/div/div[3]/div/div[1]"));
        return $$(byXpath("//my-app/work-item-list/div/div"));
        
    }    
     
}
