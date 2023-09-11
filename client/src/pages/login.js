import React, {Component} from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import TitleComponent from "./title";
import * as Constants from '../config/constants';

export default class Login extends Component {

    state = {
        email: '',
        password: '',
        redirect: false,
        authError: false,
        isLoading: false,
        location: {},
    };

    handleEmailChange = event => {
        this.setState({email: event.target.value});
    };
    handlePwdChange = event => {
        this.setState({password: event.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        this.setState({isLoading: true});
        //this.setState({redirect: true, isLoading: false});
        const url = Constants.API_URL+"/loginUser";
        
        //console.log(url);

         const email = this.state.email;
         const password = this.state.password;
         let bodyFormData = {"data":{"email":email,"password":password}};
         //bodyFormData.set('email', email);
         //bodyFormData.set('password', password);
         const customHeaders = {
            'content-type': 'application/json',
          };
         axios.post(url, bodyFormData,customHeaders)
            .then(result => {
                var res = result.data;
                console.log("loged in1",res.status);
                if (res.status == "success") {
                    localStorage.setItem('token', res.data.accessToken);
                    
                    localStorage.setItem('isLoggedIn', true);
                    localStorage.setItem('userData', JSON.stringify(res.data));
                    this.setState({redirect: true, isLoading: false});
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({authError: true, isLoading: false});
            });

    };

    componentDidMount() {
        console.log("hi")
        // const url = 'https://freegeoip.app/json/';
        // axios.get(url)
        //     .then(response => {
        //         const location = response.data;
        //         this.setState({ location });
        //     }) 
        //     .catch(error => {
        //         this.setState({ toDashboard: true });
        //         console.log(error);
        //     });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/dashboard'/>
        }
    };

    render() {
        const isLoading = this.state.isLoading;
        return (
            <div className="container">
                <TitleComponent title="IQPC Billing Admin Login "></TitleComponent>
                <div className="card card-login mx-auto mt-5">
                    <div className="card-header bg-primary text-light">Login</div>
                   {/*
                     <div className="text-center">
                        <span>IP : <b>{this.state.location.ip}</b></span>, &nbsp;
                        <span>Country : <b>{this.state.location.country_name}</b></span>, &nbsp;
                        <span>Region : <b>{this.state.location.region_name}</b></span>, &nbsp;
                        <span>City : <b>{this.state.location.city}</b></span>, &nbsp;
                        <span>PIN : <b>{this.state.location.zip_code}</b></span>, &nbsp;
                        <span>Zone : <b>{this.state.location.time_zone}</b></span>
                    </div>
                     */}
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <div className="form-label-group">
                                    <input className={"form-control " + (this.state.authError ? 'is-invalid' : '')} id="inputEmail" placeholder="Email address" type="text" name="email" onChange={this.handleEmailChange} autoFocus required/>
                                    <label htmlFor="inputEmail">Email</label>
                                    <div className="invalid-feedback">
                                        Please provide a valid Email.
                                    </div>
                                </div>
                            </div>
                           <div className="form-group">
                                <div className="form-label-group">
                                    <input type="password" className={"form-control " + (this.state.authError ? 'is-invalid' : '')} id="inputPassword" placeholder="******" name="password" onChange={this.handlePwdChange} required/>
                                    <label htmlFor="inputPassword">Password</label>
                                    <div className="invalid-feedback">
                                        Please provide a valid Password.
                                    </div>
                                </div>
                            </div>
                            {/* <div className="form-group">
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" value="remember-me"/>Remember Password
                                    </label>
                                </div>
                            </div> */}
                            <div className="form-group">
                                <button className="btn btn-primary btn-block" type="submit" disabled={this.state.isLoading ? true : false}>Login &nbsp;&nbsp;&nbsp;
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <span></span>
                                    )}
                                </button>
                            </div>
                           {/*
                               <div className="form-group">
                                <div className="form-group">
                                    <b>email:</b> gowthaman.nkl1@gmail.com
                                </div>
                                <div className="form-group">
                                    <b>password :</b> password
                                </div>
                            </div> */} 
                        </form>
                        <div className="text-center">
                            {/* <Link className="d-block small mt-3" to={'register'}>Register an Account</Link> */}
                           {/* <a className="d-block small" href="forgot-password.html">Forgot Password?</a> */} 
                        </div>
                    </div>
                </div>
                {this.renderRedirect()}
            </div>
        );
    }
}


