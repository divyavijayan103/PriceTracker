import React, { Component } from 'react';
class LoginPage extends Component {
  submitForm (e) {debugger;
        var _this=this;
        e.preventDefault();
        const data = new URLSearchParams();
            for (const pair of new FormData(e.target)) {
                data.append(pair[0], pair[1].trim());
            }

            fetch('./pricetracker/login', {
                method: 'post',
                body: data,
            })
            .then((data)=>{
                if(data && data.status===200){
                    _this.props.history.push('/homepage');
                }
                else if(data && data.status===401){debugger;
                    _this.setState({error:"loginError"});
                }
                else{
                    _this.props.history.push('/errorpage');
                }
            });
		
  }

  render() {
    return (
     <form  onSubmit={this.submitForm.bind(this)} method="post">  
            <div className="login-panel">
                <div className="fieldSet">
                <div className="row">
                        <div className="col">
                            <span>UserName:</span>
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
export default LoginPage;