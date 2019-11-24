import React, { Component } from 'react';
import SavedProducts from "./SavedProducts";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleButtonClick({imageUrl,dealprice,productTitle,amazonPrice,salesPrice}){
    let data={
      imageUrl,
      dealprice,
      amazonPrice,
      productTitle,
      url:this.state.url,
      salesPrice
    }
    this.props.addWatchListData(data);
  }
  handleSearchButtonClick(e) {
    let _this = this;
    let url = document.getElementById('search').value;
    if (url === '') {
      _this.setState({ message: 'emptyInput' });
      return;
    }
    let completeurl = `/pricetracker/search?url=${encodeURI(url)}`;
    fetch(completeurl,{
      headers: {
        'oauthtoken': _this.props.authToken
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(function (response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
      }).then(function (data) {
        if(data && data.status===401){
          _this.props.history.push('/login');
        }else{
        if (data && data.message && data.message === "success") {
          _this.setState({ productData: data.productData,url:url })
        }
        else {
          _this.props.history.push('/errorpage');
        }}
      });
  }
  render() {
    const productData = this.state.productData;
    let ProductNotFoundError = productData && productData.imageUrl == '';
    return (
      <div className="search-page">
        <div className="input-group mb-4 border rounded-pill p-1">
          <div className="input-group-prepend border-0">
            <button id="button-addon4" type="button" className="btn btn-link text-info" onClick={this.handleSearchButtonClick.bind(this)}><i className="fa fa-search"></i></button>
          </div>
          <input type="search" id="search" placeholder="What're you searching for?" aria-describedby="button-addon4" className="form-control bg-none border-0"></input>
        </div>
        {ProductNotFoundError &&
          <div className="alert alert-danger" role="alert">
            <strong>Oh snap!</strong> We could not find product you are looking for.
      </div>}
        {!ProductNotFoundError && productData && productData.imageUrl != '' &&
          <div className="card">
            <img src={productData.imageUrl} alt="Denim Jeans" className="image"></img>
            <h4>{productData.productTitle}</h4>
            {productData.dealprice && productData.dealprice != '' &&
              <p className="price">DealPrice: {productData.dealprice} </p>
            }
            {productData.originalPrice && productData.originalPrice &&

              <p className={productData.dealprice != '' ? "strikethrough price" : "price"}>Original Price: {productData.originalPrice}</p>
            }
            {productData.AmazonPrice && productData.AmazonPrice &&
              <p className="price">Amazon Price: {productData.AmazonPrice}</p>
            }
            {productData.salesPrice &&
              <p className="price">Sales Price: {productData.salesPrice}</p>
            }
            {productData.reviews && productData.reviews != '' &&
              <p>{productData.reviews}</p>
            }
            <p><button onClick={()=>{this.handleButtonClick(productData)}}>Add to Watch List</button></p>
          </div>
        }
        <SavedProducts savedProductdata={this.props.savedProductData}/>
      </div>
    )
  }
}
export default HomePage;