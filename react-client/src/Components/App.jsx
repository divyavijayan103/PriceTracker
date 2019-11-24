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
  }
  updateJWTToken(val){
    this.setState({authToken:val})
  }
  updateProductData(val){
    this.setState({savedProductData:val})
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
      this.setState({savedProductData:tempData});
      fetch('/pricetracker/addToWatchList', {
        method: 'put',
        body: JSON.stringify(tempData),
        headers: {
          'oauthtoken': _this.state.authToken
        },
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        // ChromeSamples.log('Created Gist:', data.html_url);
      });
    }catch(ex){
      
    }
  }
  render() {
    return (
      <Router>
        <NavBar />
        <div className="container">
          <h2>Amazon Price Monitoring</h2>
          {/* <Route name="login" exact path="/login" component={loginPage} /> */}
          <Route path='/login' render={(props) => <LoginPage {...props} updateJWTToken={this.updateJWTToken} updateProductData={this.updateProductData}/>}/>
          <Route path='/homepage' render={(props) => <HomePage {...props} authToken={this.state.authToken} savedProductData={this.state.savedProductData} addWatchListData={this.addWatchListData}/>}/>
          {/* <Route name="home" exact path="/homepage" component={HomePage} /> */}
          <Route name="register" exact path="/register" component={RegisterationPage} />
        </div>
      </Router >
    )
  }
}
export default App;