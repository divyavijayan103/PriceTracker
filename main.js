const CDP = require('chrome-remote-interface');
const chromeLauncher = require('chrome-launcher');
const ProductData = require('../models').productData;

function readDatabaseinAdminMode(){
    return ProductData.findAll({
        attributes: ['username', 'products']
      }).then(data=>{
          debugger;
      });
    // return ProductData.findOne({ where: { username: username } })
    // .then(ProductRecord=>{
    //     return ProductRecord
    //     .update({
    //         products:data
    //     })
    //   })
}
function crawl(url){
    return new Promise(async(resolve, reject)=>{
    const chrome = await launchChrome(true);
      const protocol = await CDP({ port: chrome.port });
      const { Page, Runtime,Network } = protocol;
      await Promise.all([Page.enable(), Runtime.enable(),Network.enable()]);
      Network.setUserAgentOverride({'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36'});
      Network.setExtraHTTPHeaders({'headers': {'X-Requested-by': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36'}});
      Page.navigate({ url: url });
      Page.loadEventFired(async () => {
        const originalPricejs = "document.querySelector('#priceblock_ourprice').textContent";
        const dealPricejs = "document.querySelector('#priceblock_dealprice').textContent";
        // const productTitlejs = "document.querySelector('#productTitle').textContent.trim()";
        // const productImageJs = "document.querySelector('#landingImage').src";
        // const productReviewsJs="document.querySelector('#acrCustomerReviewText').textContent";
        const AmazonOurPricejs="document.querySelector('#priceblock_ourprice').textContent";
        const salesPricejs="document.querySelector('#priceblock_saleprice').textContent";
        //const js="(function(){let price=document.querySelector('#priceblock_ourprice').textContent;let dealPrice=	document.querySelector('#priceblock_dealprice').textContent;let obj={'price':price,'dealPrice':dealPrice};return obj;}())";
        // Evaluate the JS expression in the page.
        const originalPriceValue = await Runtime.evaluate({ expression: originalPricejs });
        const dealPriceValue = await Runtime.evaluate({ expression: dealPricejs });
        // const productTitle = await Runtime.evaluate({ expression: productTitlejs });
        // const imageUrl = await Runtime.evaluate({ expression: productImageJs });
        // const productReviews = await Runtime.evaluate({ expression: productReviewsJs });
        const AmazonPrice = await Runtime.evaluate({ expression: AmazonOurPricejs });
        const salesPrice = await Runtime.evaluate({ expression: salesPricejs });
        console.log('Original Price: ' + originalPriceValue.result.value);
        console.log('DealPrice: ' + dealPriceValue.result.value);
        protocol.close();
        chrome.kill(); // Kill Chrome.
        let response = {
          originalPrice: originalPriceValue.result && !originalPriceValue.result.subtype? originalPriceValue.result.value: '' ,
          dealprice: dealPriceValue.result &&  !dealPriceValue.result.subtype? dealPriceValue.result.value : '',
          salesPrice:salesPrice.result && !salesPrice.result.subtype? salesPrice.result.value:'',
          amazonPrice:AmazonPrice.result && !AmazonPrice.result.subtype? AmazonPrice.result.value:'',
        }
        resolve(response)
      });
    });
  }
  function launchChrome(headless = false) {
    return chromeLauncher.launch({
      // port: 9222, // Uncomment to force a specific port of your choice.
      chromeFlags: [
        '--headless',
        '--window-size=1920,1280',
        '--disable-gpu'
      ]
    });
  }

console.log("Hello", Date.now())