const CDP = require('chrome-remote-interface');
const chromeLauncher = require('chrome-launcher');
const ProductData = require('./models').productData;
const nodemailer = require('nodemailer');

function createEmailBody(product,newPrice)
{
    let text="<p>Hello Customer</p>"+'<br/>';
        text+='<b>Product Title : </b>'+product.productTitle+'<br/>'+
        '<b>Old Prices</b>'+
        '<br/> Sales Price:'+product.salesPrice +'<br/>'+
        'Amazon Price:'+product.amazonPrice +'<br/>'+
        'Deal Price:'+product.dealprice +'<br/>'+
        '<b> New Prices : </b>'+
        '<br/> Sales Price:'+newPrice.salesPrice +'<br/>'+
        '<br/> Amazon Price:'+newPrice.amazonPrice +'<br/>'+
        '<br/> Deal Price:'+newPrice.dealprice +'<br/>'+
        '<br/><br/><br/>'
    
    return text;
}
function sendEmailMethod(email,product,newPrice){console.log([email,product])
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dummyemail@gmail.com',
            pass: 'dummyemailpassword'
        }
  });
  let body=createEmailBody(product,newPrice)
  var mailOptions = {
    from: "divyavijayan199@gmail.com",
    to:email,
    subject: 'Price changed for one of saved items!',
    html: body
  };
  transporter.sendMail(mailOptions, function(error, info){
      console.log(info);
      console.log(error);
  });
}
function readDatabaseinAdminMode(){
    let newPrice={
       salesPrice:10,
       amazonPrice :0,
       dealprice:0,
       originalPrice:0
    }
    return ProductData.findAll({
        attributes: ['username', 'products']
      }).then(data=>{
           let adminData=data;
           //console.log(adminData);
           for(let i=0;i<adminData.length;i++){
            let values=adminData[i].dataValues;
            let username=values.username;
            //console.log(values.username);
           // let email=values.email;
            let products= JSON.parse(values.products).products;
            //console.log(products);
            for(let j=0;j<products.length;j++){
              //console.log(products[j]);
                let url=products[j].url;
                //let storedPrice=products[j].currentPrice;
                //console.log(storedPrice);
                let sendEmail=false;
                //console.log(storedPrice.salesPrice);
                if(products[j].salesPrice!=""){
                    let temp = Number(products[j].salesPrice.replace(/[^0-9.-]+/g,""));
                    console.log(temp);
                    if(temp>newPrice.salesPrice)
                        sendEmail=true;
                }
                if(products[j].amazonPrice!=""){
                    let temp = Number(products[j].amazonPrice.replace(/[^0-9.-]+/g,""));
                    console.log(temp);
                    if(temp>newPrice.amazonPrice)
                        sendEmail=true;
                }
                if(products[j].dealprice!=""){
                    let temp = Number(products[j].dealprice.replace(/[^0-9.-]+/g,""));
                    console.log(temp);
                    if(temp>newPrice.dealprice)
                        sendEmail=true;
                }
                console.log('hello');
                if(sendEmail){
                    sendEmailMethod(username,products[j],newPrice)
                }
                // crawl(url).then(data=>{
                //     console.log(data);
                // })
            }
           }
      });
   
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
        //chrome.kill(); // Kill Chrome.
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
      
        '--window-size=1920,1280',
        '--disable-gpu'
      ]
    });
  }

console.log("Hello", Date.now());
readDatabaseinAdminMode();
