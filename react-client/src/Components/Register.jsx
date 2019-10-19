import React, { Component } from 'react';
class RegisterationPage extends Component {
    submitForm(e) {
        var _this = this;
        e.preventDefault();
        const data = new URLSearchParams();
        for (const pair of new FormData(e.target)) {
            data.append(pair[0], pair[1].trim());
        }

        fetch('./pricetracker/register', {
            method: 'post',
            body: data,
        })
            .then((data) => {
                if (data && data.status === 200) {
                    _this.props.history.push('/login');
                    _this.setState({ message: 'registerationSuccess' })
                }
                else if (data && data.status === 401) {
                    _this.setState({ message: "registerationError" });
                }
                else {
                    _this.props.history.push('/errorpage');
                }
            });

    }
    render() {
        return (
            <main className="login-form">
                <div className="cotainer">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">Register</div>
                                <div className="card-body">
                                    <form onSubmit={this.submitForm.bind(this)} method="post">
                                        <div className="form-group row">
                                            <label htmlFor="username" className="col-md-4 col-form-label text-md-right">User Name</label>
                                            <div className="col-md-6">
                                                <input type="text" id="username" className="form-control" name="username"
                                                    required autoFocus></input>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="firstname" className="col-md-4 col-form-label text-md-right">First Name</label>
                                            <div className="col-md-6">
                                                <input type="text" id="firstname" className="form-control" name="firstname"
                                                    required ></input>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label htmlFor="lastname" className="col-md-4 col-form-label text-md-right">Last Name</label>
                                            <div className="col-md-6">
                                                <input type="text" id="lastname" className="form-control" name="lastname"
                                                    required ></input>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label htmlFor="password" className="col-md-4 col-form-label text-md-right">Password</label>
                                            <div className="col-md-6">
                                                <input type="password" id="password" className="form-control"
                                                    name="password" required></input>
                                            </div>
                                        </div>

                                        <div className="col-md-6 offset-md-4">
                                            <button type="submit" className="btn btn-primary">
                                                Register
                                            </button>

                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        )
    }
}
export default RegisterationPage;