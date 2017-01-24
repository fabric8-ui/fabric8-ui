/**
 * POC test for automated UI tests for ALMighty
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/296
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly.
 *
 * @author 
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page, items, browserMode;
  var until = protractor.ExpectedConditions;
  var waitTime = 30000;

/* Troublesome strings reference: https://github.com/minimaxir/big-list-of-naughty-strings */
var UnicodeSymbols = "Ω≈ç√∫˜µ≤≥÷åß∂ƒ©˙∆˚¬…æœ∑´®†¥¨ˆøπ“‘¡™£¢∞§¶•ªº–≠¸˛Ç◊ı˜Â¯˘¿ÅÍÎÏ˝ÓÔÒÚÆ☃Œ„´‰ˇÁ¨ˆØ∏”’`⁄€‹›ﬁﬂ‡°·‚—±⅛⅜⅝⅞ЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя٠١٢٣٤٥٦٧٨٩";
var TwoByteCharacters = "田中さんにあげて下さいパーティーへ行かないか和製漢語部落格사회과학원 어학연구소찦차를 타고 온 펲시맨과 쑛다리 똠방각하社會科學院語學研";
var JapaneseEmoticons = "ヽ༼ຈل͜ຈ༽ﾉ ヽ༼ຈل͜ຈ༽ﾉ(｡◕ ∀ ◕｡)｀ｨ(´∀｀∩__ﾛ(,_,*)・(￣∀￣)・:*:ﾟ･✿ヾ╲(｡◕‿◕｡)╱✿･ﾟ,。・:*:・゜’( ☻ ω ☻ )。・:*:・゜’(╯°□°）╯︵ ┻━┻)(ﾉಥ益ಥ）ﾉ﻿ ┻━┻┬─┬ノ( º _ ºノ)( ͡° ͜ʖ ͡°)";
var RightToLeftStrings = "בְּרֵאשִׁית, בָּרָא אֱלֹהִים, אֵת הַשָּׁמַיִם, וְאֵת הָאָרֶץم نفس سقطت وبالتحديد،, جزيرتي باستخدام أن دنو. إذ هنا؟ الستار وتنصيب كان. أهّل ايطاليا، بريطانيا-فرنسا قد أخذ. سليمان، إتفاقية بين ما,";
var ScriptInjection = "<script>alert(123)</script> &lt;script&gt;alert(&#39;123&#39;);&lt;/script&gt; <img src=x onerror=alert(123) /> <svg><script>123<1>alert(123)</script>";

/* Protractor and/or Jasmine and/or Javascript is unable to handle these strings */
var UnicodeSubscriptSuperscriptAccents = "⁰⁴⁵₀₁₂⁰⁴⁵₀₁₂";
var Emoji = "😍❤️ 💔 💕 💓 💗 💖 💘 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣";
var UnicodeFont = "Ｔｈｅ ｑｕｉｃｋ ｂｒｏｗｎ 𝐟𝐨𝐱 𝐣𝐮𝐦𝐩𝐬 𝐨𝐯𝐞𝐫  𝖙𝖍𝖊 𝖑𝖆𝖟𝖞 𝖉𝖔𝖌";
var UnicodeNumbers = "１２３١٢٣";

  beforeEach(function () {
    testSupport.setBrowserMode('phone');
    page = new WorkItemListPage(true);
  });

it('Quick create UnicodeSymbols workitems', function () { quickCreateWorkItem (UnicodeSymbols); });
it('Quick create TwoByteCharacters workitems', function () { quickCreateWorkItem (TwoByteCharacters); });
it('Quick create JapaneseEmoticons workitems', function () { quickCreateWorkItem (JapaneseEmoticons); });
it('Quick create RightToLeftStrings workitems', function () { quickCreateWorkItem (RightToLeftStrings); });
it('Quick create ScriptInjection workitems', function () { quickCreateWorkItem (ScriptInjection); });

it('Create UnicodeSymbols workitems', function () { createWorkItem (UnicodeSymbols); });
it('Create TwoByteCharacters workitems', function () { createWorkItem (TwoByteCharacters); });
it('Create JapaneseEmoticons workitems', function () { createWorkItem (JapaneseEmoticons); });
it('Create RightToLeftStrings workitems', function () { createWorkItem (RightToLeftStrings); });
it('Create ScriptInjection workitems', function () { createWorkItem (ScriptInjection); });

/* Quick create a workitem */
var quickCreateWorkItem = function(theText) {  
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(theText);
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(theText);
    });
}

/* Create a workitem */
var createWorkItem = function(theText) {   

    testSupport.setBrowserMode('desktop');
    //console.log (theText);

   page.clickDetailedDialogButton();
   var detailPage = page.clickDetailedIcon("userstory");

   browser.wait(until.visibilityOf(detailPage.workItemDetailTitle), waitTime, 'Failed to find workItemList');  
   detailPage.setWorkItemDetailTitle (theText, false);

   browser.wait(until.visibilityOf(detailPage.workItemTitleSaveIcon), waitTime, 'Failed to find workItemList');  
   detailPage.clickWorkItemTitleSaveIcon();

   detailPage.clickWorkItemDetailDescription();
   browser.wait(until.visibilityOf(detailPage.workItemDetailDescription), waitTime, 'Failed to find workItemList');  
   detailPage.setWorkItemDetailDescription (theText, false);
   detailPage.clickWorkItemDescriptionSaveIcon();

   expect(detailPage.clickWorkItemDetailTitle.getText()).toBe(theText);
   expect(detailPage.workItemDetailDescription.getText()).toBe(theText);

   detailPage.clickWorkItemDetailCloseButton();
   browser.wait(until.visibilityOf(page.firstWorkItem), waitTime, 'Failed to find workItemList');  
}

});
