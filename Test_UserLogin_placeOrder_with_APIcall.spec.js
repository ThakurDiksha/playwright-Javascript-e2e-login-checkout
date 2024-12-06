
const {test, expect, request} = require('@playwright/test');

const loginPayload = {userEmail: "dikshathakurit@gmail.com", userPassword: "Deepakpatial@31"}
let token;
let orderId;


//a block of code to skip the login and placing order
test.beforeAll( async() =>
{
//login API, to skip the login
const apiContext = await request.newContext();
const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
    {
        data:loginPayload                         //send payload stored at "loginPayload"
    } )
expect(loginResponse.ok()).toBeTruthy();          //verify the success response of login API call

const loginResponseJson = await loginResponse.json();  //get the response in json format 
token = loginResponseJson.token;           //fetch the token value from the whole response body
console.log("the token is "+token);
console.log("Full login response:"+loginResponseJson);



//API to create order
const OrderPayload = {orders:[{"country":"Canada","productOrderedId":"6581ca979fd99c85e8ee7faf"}]}
const OrderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", 
{
  data:OrderPayload, 
  headers: {
  'Authorization': token,   //this is a same token we used for the login, it has to be that one
  'content-type': 'application/json'
           }
}
)
const OrderResponseJson = await OrderResponse.json();
console.log("The order Response is :", OrderResponseJson);
orderId = OrderResponseJson.orders[0];    //fetch the order id from response body, its at 0th index
});



//TEST

test('verify the placed order', async ({page})=>   //function that has no name can also be written as ()==>
{  
page.addInitScript(value =>
{
  window.localStorage.setItem('token', value);
}, token);

await page.goto("https://rahulshettyacademy.com/client/", { waitUntil: 'networkidle' });


// Log the title of the page
console.log("the title of this page is " + await page.title()); 

//get all products titles
const products = page.locator(".card-body");
const titles = await page.locator(".card-body b").allTextContents();  
console.log("The titles are : " + titles);

//fetch your order detail from orders history
await page.locator("[routerlink = '/dashboard/myorders']").first().click();
const ordersTable = page.locator("tbody tr");
await page.locator("tbody").waitFor({ state: 'visible' });
const ordersCount = await ordersTable.count();

//use a for loop iterate ovar all the orders and select the target order number
for (let i=0; i<ordersCount; ++i)
{
   const rowOrderId = await ordersTable.nth(i).locator("th").textContent();
   if (orderId.includes(rowOrderId))
   {
      await ordersTable.nth(i).locator("td .btn-primary").click();
      break;
   }

   
}

//validating if we land on correct page by validating the order number
const orderIdDetails = await page.locator(".col-text").textContent();
page.pause();
expect(orderId.includes(orderIdDetails)).toBeTruthy();
}
);






