import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class NavBar extends Component {
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
            <ul className="navbar-nav ml-auto">
              {/* <li className="nav-item active">
                <a className="nav-link" href="#">Home
                <span className="sr-only">(current)</span>
                </a>
              </li> */}
              <li className="nav-item active">
                <a className="nav-link" href="#">Login</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Register</a>
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