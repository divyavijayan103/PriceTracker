import React, { Component } from 'react';
class RegisterationPage extends Component {
  render() {
    return (
     <form  action="/pricetracker/register" method="post">  
            <div className="registeration-panel">
                <div className="fieldSet">
                    <div className="row">
                        <div className="col">
                            <span>FirstName:</span>
                        </div>
                        <div className="col">
                            <input type="text" name="firstname"></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <span>LastName:</span>
                        </div>
                        <div className="col">
                            <input type="text" name="lastname"></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <span>Email:</span>
                        </div>
                        <div className="col">
                            <input type="text" name="username"></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <span>Password:</span>
                        </div>
                        <div className="col">
                            <input type="password" name="password"></input>
                        </div>
                    </div>
                </div>
            </div>
            <input type="submit" value="Submit"></input>
      </form> 
    )
  }
}
export default RegisterationPage;