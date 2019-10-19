import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { browserHistory } from 'react-router';
import HomePage from './HomePage';
import RegisterationPage from './Register';
import loginPage from './Login';
import NavBar from './HeaderComponent/NavBar';
class App extends Component {
  render() {
    return (
      <Router>
        <NavBar />
        <div className="container">
          <h2>Amazon Price Monitoring</h2>
          <Route name="login" exact path="/login" component={loginPage} />
          <Route name="login" exact path="/" component={loginPage} />
          <Route name="home" exact path="/homepage" component={HomePage} />
          <Route name="register" exact path="/register" component={RegisterationPage} />
        </div>
      </Router >
    )
  }
}
export default App;