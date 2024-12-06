
const {test, expect} = require('@playwright/test');

test('fill form with Playwright special locators', async({browser}) =>
{

const context = await browser.newContext();
const page =  await context.newPage();
await page.goto("https://rahulshettyacademy.com/angularpractice/");

//identify web element by special Playwright labels
await page.getByLabel("Check me out if you Love IceCreams!").check();    //or click() can also be used, same thing
await page.getByLabel("Employed").check();     
await page.getByLabel("Gender").selectOption("Female");

await page.getByPlaceholder("Password").fill("quality1");

await page.getByRole("Button", {name: 'Submit'}).click();   //click the button that has "submit" written on it

const successText = await page.getByText("Success! The Form has been submitted successfully!.").textContent();
console.log(successText);
 
//land on the shop page
await page.getByRole("link", {name: 'Shop'}).click();

//choosing a product out of many using filter() method and add it to cart
await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button", {name: 'Add '}).click()


}
);