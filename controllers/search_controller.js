const puppeteer = require('puppeteer');
const CDP = require('chrome-remote-interface');
const chromeLauncher = require('chrome-launcher');
module.exports = {
  search: async function (req, res) {
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         let url= decodeURI(req.query.url);
    //         url = createUrl(url,req.query)
    //         const browser = await puppeteer.launch({headless: false});
    //         const page = await browser.newPage();
    //         await page.setViewport({width: 1920, height: 1080});
    //         await page.goto(url, {waitUntil: 'networkidle2'});
    //         await page.evaluate(() => {
    //             let results = [];
    //             let items = document.querySelectorAll('a.storylink');
    //             items.forEach((item) => {
    //                 results.push({
    //                     url:  item.getAttribute('href'),
    //                     text: item.innerText,
    //                 });
    //             });
    //             return results;
    //         })
    //         //await browser.close();
    //         return resolve({});
    //     } catch (e) {
    //         return reject(e);
    //     }
    // })
    (async function () {
      try {
        let url1 = decodeURI(req.query.url);
        url1 = createUrl(url1, req.query)
        const chrome = await launchChrome(true);
        const protocol = await CDP({ port: chrome.port });

        // Extract the DevTools protocol domains we need and enable them.
        // See API docs: https://chromedevtools.github.io/devtools-protocol/
        const { Page, Runtime } = protocol;
        await Promise.all([Page.enable(), Runtime.enable()]);

        Page.navigate({ url: url1 });

        // Wait for window.onload before doing stuff.
        Page.loadEventFired(async () => {
          const originalPricejs = "document.querySelector('#priceblock_ourprice').textContent";
          const dealPricejs = "document.querySelector('#priceblock_dealprice').textContent";
          const productTitlejs = "document.querySelector('#productTitle').textContent.trim()";
          const productImageJs = "document.querySelector('#landingImage').src";
          const productReviewsJs="document.querySelector('#acrCustomerReviewText').textContent";
          const AmazonOurPricejs="document.querySelector('#priceblock_ourprice').textContent";
          //const js="(function(){let price=document.querySelector('#priceblock_ourprice').textContent;let dealPrice=	document.querySelector('#priceblock_dealprice').textContent;let obj={'price':price,'dealPrice':dealPrice};return obj;}())";
          // Evaluate the JS expression in the page.
          const originalPriceValue = await Runtime.evaluate({ expression: originalPricejs });
          const dealPriceValue = await Runtime.evaluate({ expression: dealPricejs });
          const productTitle = await Runtime.evaluate({ expression: productTitlejs });
          const imageUrl = await Runtime.evaluate({ expression: productImageJs });
          const productReviews = await Runtime.evaluate({ expression: productReviewsJs });
          const AmazonPrice = await Runtime.evaluate({ expression: AmazonOurPricejs });
          console.log('Original Price: ' + originalPriceValue.result.value);
          console.log('DealPrice: ' + dealPriceValue.result.value);
          protocol.close();
          chrome.kill(); // Kill Chrome.
          let response = {
            originalPrice: originalPriceValue.result && !originalPriceValue.result.subtype? originalPriceValue.result.value: '' ,
            dealprice: dealPriceValue.result &&  !dealPriceValue.result.subtype? dealPriceValue.result.value : '',
            productTitle: productTitle.result &&  !productTitle.result.subtype?productTitle.result.value :'',
            imageUrl: imageUrl.result && !imageUrl.result.subtype ? imageUrl.result.value:'' ,
            reviews: productReviews.result && !productReviews.result.subtype? productReviews.result.value:'',
            
          }
          res.status(200).send({
            'success': true,
            'message': 'success',
            'productData': response
          });
        });
      } catch (error) {
        res.status(500).send({
          'success': false,
          'message': 'Cannot create user profile'
        });
      }
    })();
  }
}

function createUrl(url, queryParams) {
  for (key in queryParams) {
    if (url.indexOf('?') > -1 && key != 'url') {
      url = url.concat(`${key}=${queryParams[key]}`)
    }
  }
  return url;
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

launchChrome().then(chrome => {

});