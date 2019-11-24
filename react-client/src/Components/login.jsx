import React, { Component } from 'react';
import { ErrorPanel } from './ErrorPanel'
class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submitForm(e) {
        var _this = this;
        e.preventDefault();
        const data = new URLSearchParams();
        for (const pair of new FormData(e.target)) {
            data.append(pair[0], pair[1].trim());
        }
        
        fetch('/pricetracker/login', {
            method: 'post',
            body: data,
        })
            .then((response) => {
                return response.json();
            }).then(function (data) {
                if(data.status===200 && data.authToken){
                    _this.props.updateJWTToken(data.authToken);
                    _this.props.updateProductData(data.savedProductData);
                    _this.props.history.push('/homepage');
                }
                
                    else if (data && data.status === 401) {
                        _this.setState({ message: "loginError" });
                    }
                    else {
                        _this.props.history.push('/errorpage');
                    }
                
              });;

    }

    render() {
        let loginError = !!(this.state.message && this.state.message === 'loginError');
        return (

            <div className="login-panel">
                {loginError &&
                    <div className="alert alert-danger" role="alert">
                        <strong>Oh snap!</strong> Try hard to remember the forgotten credentials.
                    </div>
                }
                <div className="d-flex justify-content-center h-100">
                    <div className="card margin">
                        <div className="card-header">
                            <h3>Sign In</h3>
                            <div className="d-flex justify-content-end social_icon">
                                {/* <span><i className="fab fa-facebook-square"></i></span>
                                <span><i className="fab fa-google-plus-square"></i></span>
                                <span><i className="fab fa-twitter-square"></i></span> */}
                            </div>
                        </div>
                        <div className="card-body">
                            <form onSubmit={this.submitForm.bind(this)} method="post">
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        {/* <span className="input-group-text"><i className="fas fa-user"></i></span> */}
                                    </div>
                                    <input type="text" className="form-control" placeholder="username" name="username"></input>
                                </div>
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        {/* <span className="input-group-text"><i className="fas fa-key"></i></span> */}
                                    </div>
                                    <input type="password" className="form-control" placeholder="password" name="password"></input>
                                </div>
                                <button type="submit" className="btn btn-primary" >
                                                Login
                                            </button>
                            </form>
                        </div>
                    </div >
                </div>
            </div>
        )
    }
}
export default LoginPage;