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

		String testUrl = System.getProperty("test.url", "http://localhost:8088");
		
		/*
		 * UI hangs unless Selenium WebDriver is defined - should not be needed - but it is
		 * TODO - Find an answer to this  
		 */
		WebDriver driver = new FirefoxDriver();
		WebDriverRunner.setWebDriver(driver);

		MainPage<?> page = open(testUrl, MainPage.class); 
		Thread.sleep(3000);

		page.workitemTitle().setValue("Hello Todd");
		page.workitemDescription().setValue("Hello Description");
		Thread.sleep(3000);

		page.saveButton().click();
		Thread.sleep(3000);    

		//ElementsCollection theCollection = page.workitemsOnPage();
		//org.junit.Assert.assertTrue("We did not find Todd", findElement(theCollection,"Hello Todd"));
		org.junit.Assert.assertTrue("We did not find Todd", page.textOnPage().getText().contains("Hello Todd") );

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

			System.out.println(i + " " + testCollection.get(i).getText());

			if (testCollection.get(i).getText().equals(testString)) {
				found = true;
				break;
			}
		}
		return found;
	}

}
