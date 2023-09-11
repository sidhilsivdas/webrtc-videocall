import React, { Component } from 'react';
import Header from "../elements/header";
import Sidebar from "../elements/sidebar";
import { Link, Redirect } from "react-router-dom";
import * as Constants from '../config/constants';
import axios from 'axios';
import MultiSkillSelect from "../elements/MultiSkillSelect";
import CommonHelper from "../helpers/CommonHelper";
import isEmpty from "is-empty";

export default class EditUser extends Component {

    state = {
        redirect: false,
        toDashboard: false,
        isLoading: false,
        fields: {
            name: "",
            address: "",
            phone: "",
            email: "",
            password: "",
            user_type: ""
        },
        errors: {}
    };

    componentDidMount() {
        
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "api-token": token
            }
        };
        const userId = this.props.match.params.userId;
        

        //fetch skill data
        var url = Constants.API_URL + "/user/findOne/" + userId;
        this.setState({ isLoading: true });
        axios.get(url, config)
            .then(result => {

                var res = result.data;
                //console.log(res.data.skills);
                if (res.status == 'success') {
                    let fields = [];
                    fields['name'] = res.data.name;
                    fields['address'] = res.data.address;
                    fields['phone'] = res.data.phone;
                    fields['email'] = res.data.email;
                    fields['user_type'] = res.data.user_type;

                    this.setState({
                        isLoading: false,
                        fields: fields
                    });


                } else {
                    this.setState({ redirect: false, authError: true });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ authError: true, isLoading: false });
            });
       
    }

    handleInputChange = e => {
        var fields = this.state.fields;
        var errors = this.state.errors;
        fields[e.target.name] = e.target.value;
        errors[e.target.name] = e.target.value == "" ? true : false;
        this.setState({ fields: fields, errors: errors });

    };

    validateForm = () => {
        let formData = this.state.fields;
        let errors = {};
        for (var field in formData) {
            var value = formData[field];
            if (CommonHelper.isEmptyValue(value)) {
                errors[field] = true;
            }
        }
        return errors;
    }

    handleSubmit = event => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "api-token": token
            }
        };

        const userId = this.props.match.params.userId;
        const url = Constants.API_URL + "/user/update/"+userId;

        let errors = this.validateForm();
        //console.log("eeeerrr",errors);
        if (isEmpty(errors)) {
            //console.log("no error",errors);
            this.setState({ isLoading: true });
            let bodyFormData = {
                "data": {
                    "name": this.state.fields['name'],
                    "address": this.state.fields['address'],
                    "phone": this.state.fields['phone'],
                    "email": this.state.fields['email'],
                    "password": this.state.fields['password'],
                    "user_type": this.state.fields['user_type']
                }
            };

            axios.put(url, bodyFormData, config)
                .then(result => {
                    this.setState({ isLoading: false });
                    if (result.data.status) {
                        alert("User Updated Successfully");
                        this.setState({ redirect: true, isLoading: false })
                    }
                })
                .catch(error => {
                    if (error.response) {
                        alert(error.response.data.message);
                        this.setState({ isLoading: false })
                        //console.log(error.response.status);
                        //console.log(error.response.headers);
                      }
                });
        } else {
            console.log("has error", typeof errors);
            this.setState({ errors: errors });
        }
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/users/all' />
        }
    };

    render() {
        const isLoading = this.state.isLoading;
        if (this.state.toDashboard === true) {
            return <Redirect to='/' />
        }
        return (
            <div>
                <Header />
                <div id="wrapper">
                    <Sidebar></Sidebar>
                    <div id="content-wrapper">
                        <div className="container-fluid">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={'/dashboard'} >Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active">Create User</li>

                            </ol>

                        </div>
                        <div className="container-fluid">
                            <div className="card mx-auto">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-10"><p>Create User</p></div>
                                        <div className="col-md-2"><Link className="btn btn-primary float-right" to={'/users/all'} >Back</Link></div>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <div className="form-row">
                                                <div className="col-md-6">
                                                    <div className="form-label-group">
                                                        <input name="name" value={this.state.fields['name']} onChange={this.handleInputChange} type="text" id="name" className={"form-control " + (this.state.errors['name'] ? 'is-invalid' : '')} placeholder="Enter Name" autoFocus="autofocus" />
                                                        <label htmlFor="name">Enter Name</label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-label-group">
                                                        <input name="address" value={this.state.fields['address']} onChange={this.handleInputChange} type="text" id="address" className={"form-control " + (this.state.errors['address'] ? 'is-invalid' : '')} placeholder="Enter Address" autoFocus="autofocus" />
                                                        <label htmlFor="address">Enter Address</label>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>


                                        <div className="form-group">
                                            <div className="form-row">
                                                <div className="col-md-6">
                                                    <div className="form-label-group">
                                                        <input name="phone" value={this.state.fields['phone']} onChange={this.handleInputChange} type="text" id="phone" className={"form-control " + (this.state.errors['phone'] ? 'is-invalid' : '')} placeholder="Enter Phone" autoFocus="autofocus" />
                                                        <label htmlFor="phone">Enter Phone</label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-label-group">
                                                        <input name="email" value={this.state.fields['email']} onChange={this.handleInputChange} type="email" id="email" className={"form-control " + (this.state.errors['email'] ? 'is-invalid' : '')} placeholder="Enter Email" autoFocus="autofocus" />
                                                        <label htmlFor="email">Enter Email</label>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>


                                        <div className="form-group">
                                            <div className="form-row">
                                                <div className="col-md-6">
                                                    <div className="form-label-group">
                                                        <input name="password" value={this.state.fields['password']} onChange={this.handleInputChange} type="password" id="password" className={"form-control " + (this.state.errors['password'] ? 'is-invalid' : '')} placeholder="Enter Password" autoFocus="autofocus" />
                                                        <label htmlFor="password">Enter Password</label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-label-group">
                                                        <input name="user_type" value={this.state.fields['user_type']} onChange={this.handleInputChange} type="text" id="user_type" className={"form-control " + (this.state.errors['user_type'] ? 'is-invalid' : '')} placeholder="Enter User Type" autoFocus="autofocus" />
                                                        <label htmlFor="user_type">Enter User Type</label>
                                                    </div>
                                                </div>


                                            </div>


                                        </div>




                                        <button className="btn btn-primary btn-block" type="submit" disabled={this.state.isLoading ? true : false}>Update User &nbsp;&nbsp;&nbsp;
                                            {isLoading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                <span></span>
                                            )}
                                        </button>
                                    </form>
                                    {this.renderRedirect()}
                                </div>
                            </div>
                        </div>

                        <footer className="sticky-footer">
                            <div className="container my-auto">
                                <div className="copyright text-center my-auto">
                                    <span>Copyright © Your Website <div>{(new Date().getFullYear())}</div></span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}
