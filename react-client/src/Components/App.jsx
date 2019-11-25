import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { browserHistory } from 'react-router';
import HomePage from './HomePage';
import RegisterationPage from './Register';
import LoginPage from './Login';
import NavBar from './HeaderComponent/NavBar';
class App extends Component {
  constructor(props){
    super(props);
    this.state={};
    this.updateJWTToken=this.updateJWTToken.bind(this);
    this.updateProductData=this.updateProductData.bind(this);
    this.addWatchListData=this.addWatchListData.bind(this);
    this.updateFirstName=this.updateFirstName.bind(this);
  }
  updateJWTToken(val){
    this.setState({authToken:val})
  }
  updateFirstName(val){
    this.setState({firstName:val})
  }
  updateProductData(val){
    let url=[];
    let data=val;
    try{
     data=JSON.parse(val);
    }catch(ex){}
    if(data && typeof data!=="string"){
      if(data.products){
        for(let i=0;i<data.products.length;i++){
          url.push(data.products[i].url);
        }
      }
    }
    fetch('/pricetracker/getCurrentPrice',{
      headers: {
        'urlList': JSON.stringify(url)
      },
    }).then(data=>data.json()).then(response=>{
      for(let i=0;i<data.products.length;i++){
       data.products[i].currentPrice=response.priceData[i];
      }
      val=JSON.stringify(data);
      this.setState({savedProductData:val});
    });
    
  }
  addWatchListData({
    imageUrl,
    dealprice,
    amazonPrice,
    productTitle,
    url,
    salesPrice
  }){
    let _this=this;
    let temp=this.state.savedProductData;
      try{
        let tempData={};
        if(typeof temp==="string"){
        tempData=JSON.parse(temp);
        }else
        tempData=temp;
      if(tempData && tempData.products){
        tempData.products.push({imageUrl,dealprice,amazonPrice,productTitle,url,salesPrice});
      }
      fetch('/pricetracker/addToWatchList', {
        method: 'put',
        body: JSON.stringify(tempData),
        headers: {
          'oauthtoken': _this.state.authToken
        },
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
      });
      this.setState({savedProductData:tempData});

    }catch(ex){
      
    }
  }
  render() {
    return (
      <Router>
        <NavBar authToken={this.state.authToken} firstName={this.state.firstName}/>
        <div className="container">
          <h2>Amazon Price Monitoring</h2>
          {/* <Route name="login" exact path="/login" component={loginPage} /> */}
          <Route path='/login' render={(props) => <LoginPage {...props} updateFirstName={this.updateFirstName} updateJWTToken={this.updateJWTToken} updateProductData={this.updateProductData}/>}/>
          <Route path='/homepage' render={(props) => <HomePage {...props} authToken={this.state.authToken} savedProductData={this.state.savedProductData} addWatchListData={this.addWatchListData}/>}/>
          {/* <Route name="home" exact path="/homepage" component={HomePage} /> */}
          <Route name="register" exact path="/register" component={RegisterationPage} />
        </div>
      </Router >
    )
  }
}
export default App;