package redhat.developer.selenide.examples.almighty.poc_tests;

import static com.codeborne.selenide.Selenide.open;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.codeborne.selenide.ElementsCollection;
import com.codeborne.selenide.WebDriverRunner;

import redhat.developer.selenide.examples.almighty.ui.support.selenide.pages.MainPage;

/**
 * Simple/POC test to access ALMighty UI via SelenIDE
 * 
 * @author ldimaggi
 *
 */

public class ToddTest {
  @Test
  public void findTodd() throws InterruptedException {
     
	/*
	 * UI hangs unless Selenium WebDriver is defined - should not be needed - but it is
	 * TODO - Find an answer to this  
	 */
    WebDriver driver = new FirefoxDriver();
    WebDriverRunner.setWebDriver(driver);

    MainPage<?> page = open("http://localhost:8088", MainPage.class); 
    Thread.sleep(3000);
    
    page.primaryButton().click();  
    Thread.sleep(3000);
    
    page.primaryField().setValue("Hello Todd");
    Thread.sleep(3000);

    page.saveButton().click();
    Thread.sleep(3000);

    ElementsCollection theCollection = page.workitemsOnPage();
    org.junit.Assert.assertTrue("We did not find Todd", findElement(theCollection,"Hello Todd"));
          
    driver.close();
    
  }
  
  /**
   * 
   * Simple method to locate a string in an ElementsCollection
   * 
   * TODO Replace this with a better search of the elements as displayed in the UI
   * 
   * @param testCollection
   * @param testString
   * @return 
   */
  private Boolean findElement (ElementsCollection testCollection, String testString) {
	  Boolean found = false;
	    
	    for (int i = 0; i < testCollection.size(); i++) {
	    	if (testCollection.get(i).getText().equals(testString)) {
	    		found = true;
	    		break;
	    	}
	    }
    	return found;
  }
 
}
