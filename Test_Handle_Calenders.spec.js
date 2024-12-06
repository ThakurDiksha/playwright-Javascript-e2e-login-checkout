
const {test, expect} = require('@playwright/test');


test("Calendar validations",async({page})=>
    {
//Get desired month/date/year from calednder page     
const monthNumber = "6";
const date = "15";
const year = "2027";
const expectedlist = [monthNumber, date, year];
       
await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
await page.locator(".react-date-picker__inputGroup").click();
await page.locator(".react-calendar__navigation__label").click();
await page.locator(".react-calendar__navigation__label").click();
await page.getByText(year).click(); 
await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();   //selector for the month
await page.locator("//abbr[text()='"+date+"']").click();  //xpath for the date


//Validate if the month/date/year is as expected
const inputs = await page.locator(".react-date-picker__inputGroup input");

 for (let i=0; i < inputs.length; i++)
 {
    const value = inputs[i].getAttribute("value");
    expect(value).toEqual(expectedlist[i]);

 }

}
);

/** OR the other way to use this above loop and make sure the values are correct,, use try/catch, catch is optional
 * try {
  for (let i = 0; i < inputs.length; i++) {
    const value = inputs[i].getAttribute("value");
    expect(value).toEqual(expectedList[i]); // Throws an error if a value doesn’t match
  }
  console.log("All the values are correctly picked from calender"); // Only runs if all assertions pass
} catch (error) {
  console.log("Not all values are correct");
}
 * 
 * 
 */

