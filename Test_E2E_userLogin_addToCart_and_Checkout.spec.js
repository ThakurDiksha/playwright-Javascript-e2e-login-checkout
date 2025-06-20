
const {test, expect} = require ('@playwright/test');


//TEST 1 

test.only('Validating user checkout End to End', async ({browser})=>   //function that has no name can also be written as ()=>
{                                                  //there is "browser" fixture comes along automatically with playwright package
  
const context = await browser.newContext();
const page =  await context.newPage();
await page.goto("https://rahulshettyacademy.com/client/");


// Log the title of the page
console.log("the title of this page is " + await page.title()); 

//strore required values into variables
const productName = 'IPHONE 13 PRO';
const userName = page.locator('input#userEmail');
const signIn = page.locator('input#login');
const password = page.locator('input#userPassword');
const email = "dikshathakurit@gmail.com";

//log in
await userName.fill(email);
await password.fill("Deepakpatial@31");
await signIn.click();
await page.waitForLoadState('networkidle');   //wait for network to be idle

await page.waitForLoadState('load');


//get all products titles
const products = page.locator(".card-body");
const titles = await page.locator(".card-body b").allTextContents();  
console.log("The titles are : " + titles);

//counting how many totol products are there under '.card-body'
const productCount = await products.count();   


//Search for the target product and add it to the cart
//iterate over each product in the products unitl the target product is found
for (let i=0; i<productCount; ++i)           
{
if ( await products.nth(i).locator("b").textContent() === productName)        //comparing each item with the target product
{
await products.nth(i).locator("text = Add To Cart").click();
console.log("Added product to cart: " + productName);
//await page.waitForTimeout(3000);  //explicit Wait for 3 seconds to ensure product is loaded
break;
}
}


//Go to the cart and verify the product is added
await page.locator("[routerlink = '/dashboard/cart']").click();  
await page.locator("div li").first().waitFor({ timeout: 60000 });     //wait untill atleast one produst is loaded on the page
const checkVisible = await page.locator("h3:has-text('IPHONE 13 PRO')").isVisible();
expect(checkVisible).toBeTruthy();


//proceed to the checkout
await page.locator("text=Checkout").click();


//fill in payment/card details
await page.locator("div.field input").first().fill("4542 9931 9292 2293");    //fill in card number

const dropdown = page.locator("div.row select").first();    //choose expiry month from dropdown
await dropdown.selectOption({index: 0});

const dropdown2 = page.locator("div.row select").last();   //choose expiry date from fropdown
await dropdown2.selectOption("16");

await page.locator("div.row input").nth(1).fill("155");   //enter CVV code

await page.locator("div.row input").nth(2).fill("diksha thakur");  //enter name on the card

await page.locator("div.row input").nth(3).fill("APPZMJHBVD");    //fill in the cupon

await page.locator("div.row button").click();    //click apply cupon



//fill in shipping information:
await page.locator("div.payment__shipping input").first().fill("dikshathakurit@gmail.com");  //fill email
await page.locator("[placeholder*='Country']").click();
await page.locator("[placeholder*='Country']").pressSequentially("can");  //start typing "can" for "canada"


//when we start typing in country, many results appear, storing them 
const countryOptions = page.locator("div.payment__shipping section");
await countryOptions.waitFor({ state: 'visible' });

//count the number of countries in countryOptions
const countryCount = await countryOptions.locator("button").count();
 

//use a for loop iterate ovar all the countries and select the target one (canada)
for (let i=0;i<countryCount;++i)
{
    const text = await countryOptions.locator("button").nth(i).textContent();
     if (text === " Canada")
   {
        await countryOptions.locator("button").nth(i).click();
        break;
   } 
}


//validate user email address:
await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);

//click place order
await page.locator(".action__submit").click();

//validate the order confirmation page
await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

//print the order number
const orderNumber = await page.locator("td.em-spacer-1 .ng-star-inserted").textContent();
console.log("Your Order number is :" + orderNumber);


//fetch your order detail from orders history
await page.locator("[routerlink = '/dashboard/myorders']").first().click();
const ordersTable = page.locator("tbody tr");
await page.locator("tbody").waitFor({ state: 'visible' });
const ordersCount = await ordersTable.count();

//use a for loop iterate ovar all the orders and select the target order number
for (let i=0; i<ordersCount; ++i)
{
   const rowOrderId = await ordersTable.nth(i).locator("th").textContent();
   if (orderNumber.includes(rowOrderId))
   {
      await ordersTable.nth(i).locator("td .btn-primary").click();
      break;
   }

   
}

//validating if we land on correct page by validating the order number
const orderIdDetails = await page.locator(".col-text").textContent();
expect(orderNumber.includes(orderIdDetails)).toBeTruthy();

console.log(`The order number is ${orderNumber} and the order ID is ${orderIdDetails}`);
}

);




//NOTE: FOR SOME METHODS, PLAYWRIGHT DOSEN'T SUPPORT AUTOMATIC WAIT, SO WE HAVE TO EXPLICITYL USED SOME WAIT
//MECHANISMS TO TELL OUR CODE TO WAIT

//Test_E2E_userLogin_addToCart_and_Checkout.spec.js

