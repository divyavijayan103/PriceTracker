import React, { Component } from 'react';
class NavBar extends Component {
  constructor(props){
    super(props);
    let obj={
      isLoginSected:true,
      isRegisterSelected:false  
    }  
    if(window.location.href.indexOf('register')>-1){
      obj={
        isLoginSected:false,
      isRegisterSelected:true  
      }
    }
    if(window.location.href.indexOf('homepage')>-1){
      obj.displayed=false;
    }
    this.state=obj;
    
    this.handleOnClick=this.handleOnClick.bind(this);
  }
  removeActiveClass(){
    let navBarState= {
      isLoginSected:false,
      isRegisterSelected:false  
    }
    this.setState(()=>navBarState)
  }
  handleOnClick(action){
    switch(action){
      case 'login':{
        // let navBarStateTemp=Object.assign({},this.state.navBarState);
        // navBarStateTemp.isLoginSected=true;
        this.removeActiveClass();
        this.setState({isLoginSected:true})
        break;
      }case 'register':{
        // let navBarStateTemp=Object.assign({},this.state.navBarState);
        // navBarStateTemp.isRegisterSelected=true;
        this.removeActiveClass();
        this.setState({isRegisterSelected:true})
        break;
      }default:
      this.removeActiveClass();
    }
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
        <div className="container">
          <a className="navbar-brand" href="#">
          {/* <span class="nav-sprite nav-logo-base"></span> */}
          <img src="http://localhost:3000/pricetracker.png" className="navlogo" ></img>
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className={this.state.displayed===false?"navbar-nav ml-auto hidden":"navbar-nav ml-auto" }>
              {/* <li className="nav-item active">
                <a className="nav-link" href="#">Home
                <span className="sr-only">(current)</span>
                </a>
              </li> */}
              <li className={this.state.isLoginSected? "nav-item active": "nav-item"}>
                <a className="nav-link" href="/login" onClick={()=>this.handleOnClick('login')}>Login</a>
              </li>
              <li className={this.state.isRegisterSelected? "nav-item active": "nav-item"}>
                <a className="nav-link" href="/register" onClick={()=>this.handleOnClick('register')}>Register</a>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="#">Contact</a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
export default NavBar;