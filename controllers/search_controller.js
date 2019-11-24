const CDP = require('chrome-remote-interface');
const chromeLauncher = require('chrome-launcher');
const jwt = require('jsonwebtoken');
const ProductData = require('../models').productData;
module.exports = {
  search: async function (req, res) {
    (async function () {
      try {
        let url1 = decodeURI(req.query.url);
        url1 = createUrl(url1, req.query)
        const chrome = await launchChrome(true);
        const protocol = await CDP({ port: chrome.port });
        const oauthToken=req.headers.oauthtoken;
        let username='';
        jwt.verify(oauthToken, 'secret', function(err, decoded) {
          if(decoded)
          username=decoded.username
        });
        if(username===''){
          return Promise.resolve(res.status(401).send({
            'success': false,
            'message': 'No valid user found making request',
            status:401
          }));
        }
        // Extract the DevTools protocol domains we need and enable them.
        // See API docs: https://chromedevtools.github.io/devtools-protocol/
        const { Page, Runtime,Network } = protocol;
        await Promise.all([Page.enable(), Runtime.enable(),Network.enable()]);
        Network.setUserAgentOverride({'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36'});
        Network.setExtraHTTPHeaders({'headers': {'X-Requested-by': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36'}});
        Page.navigate({ url: url1 });

        // Wait for window.onload before doing stuff.
        Page.loadEventFired(async () => {
          const originalPricejs = "document.querySelector('#priceblock_ourprice').textContent";
          const dealPricejs = "document.querySelector('#priceblock_dealprice').textContent";
          const productTitlejs = "document.querySelector('#productTitle').textContent.trim()";
          const productImageJs = "document.querySelector('#landingImage').src";
          const productReviewsJs="document.querySelector('#acrCustomerReviewText').textContent";
          const AmazonOurPricejs="document.querySelector('#priceblock_ourprice').textContent";
          const salesPricejs="document.querySelector('#priceblock_saleprice').textContent";
          //const js="(function(){let price=document.querySelector('#priceblock_ourprice').textContent;let dealPrice=	document.querySelector('#priceblock_dealprice').textContent;let obj={'price':price,'dealPrice':dealPrice};return obj;}())";
          // Evaluate the JS expression in the page.
          const originalPriceValue = await Runtime.evaluate({ expression: originalPricejs });
          const dealPriceValue = await Runtime.evaluate({ expression: dealPricejs });
          const productTitle = await Runtime.evaluate({ expression: productTitlejs });
          const imageUrl = await Runtime.evaluate({ expression: productImageJs });
          const productReviews = await Runtime.evaluate({ expression: productReviewsJs });
          const AmazonPrice = await Runtime.evaluate({ expression: AmazonOurPricejs });
          const salesPrice = await Runtime.evaluate({ expression: salesPricejs });
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
            url:url1,
            salesPrice:salesPrice.result && !salesPrice.result.subtype? salesPrice.result.value:'',
            amazonPrice:AmazonPrice.result && !AmazonPrice.result.subtype? AmazonPrice.result.value:'',
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
          'message': error.message
        });
      }
    })();
  },
  addToWatchList:async function(req,res){
    const oauthToken=req.headers.oauthtoken;
    const data=req.body;
        let username='';
        jwt.verify(oauthToken, 'secret', function(err, decoded) {
          if(decoded)
          username=decoded.username
        });
        if(username===''){
          return Promise.resolve(res.status(401).send({
            'success': false,
            'message': 'No valid user found making request',
            status:401
          }));
        }
  return ProductData.findOne({ where: { username: username } })
  .then(ProductRecord=>{
      return ProductRecord
      .update({
          products:data
      })
    })
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