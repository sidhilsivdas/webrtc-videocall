import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import * as Constants from '../config/constants';
import axios from 'axios';
import MultiSkillSelect from "../elements/MultiSkillSelect";
import CommonHelper from "../helpers/CommonHelper";
import isEmpty from "is-empty";
import AdminMain from '../layouts/AdminMain';

export default class GenerateBilling extends Component {



    state = {
        redirect: false,
        toDashboard: false,
        isLoading: false,
        fields: {
            billing_type: "",
            billing_sub_type: ""
        },
        errors: {},
        success_generation: false,
        billing_types: [],
        selected_billing_data_url: "/#",
        selected_billing_has_data: 1
    };



    componentDidMount() {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "api-token": token
            }
        };
        let billing_type_data = [
            { 'id': 1, 'type': 'Flatrate Billing', 'data_url': '/billing/flat-rate-billing', 'parent': 0, 'hasData': 0 },
            { 'id': 2, 'type': 'Monthly Detail Billing', 'data_url': '/billing/monthly-detail-billing', 'parent': 0, 'hasData': 0 },
            // { 'id': 3, 'type': 'IQ Billing', 'data_url': '/billing/IQ-billing', 'parent': 0 },
            { 'id': 4, 'type': 'Run Mnthly Data Prep Macro', 'data_url': '/billing/flat-rate-billing/monthly-data-prep-macro', 'parent': 1, 'hasData': 1 },
            { 'id': 5, 'type': 'Run Update FlatRate Billing Macro', 'data_url': '/billing/flat-rate-billing/update-flatrate-billing-macro', 'parent': 1, 'hasData': 1 },
            { 'id': 6, 'type': 'Run Flatrate Billing Complete Macro', 'data_url': '/billing/flat-rate-billing/flatrate-billing-complete-macro', 'parent': 1, 'hasData': 1 },
            //monthly detail billing
            { 'id': 7, 'type': 'Run Prep For Data Import Macro', 'data_url': '/billing/monthly-detail-billing/prep-for-data-import-macro', 'parent': 2, 'hasData': 0 },
            { 'id': 8, 'type': 'Run Task Data Update Macro', 'data_url': '/billing/monthly-detail-billing/task-data-update-macro', 'parent': 2, 'hasData': 1 },
            { 'id': 9, 'type': 'Run Update Billing Hours Master Macro', 'data_url': '/billing/monthly-detail-billing/update-billing-hours-master-macro', 'parent': 2, 'hasData': 1 },
            { 'id': 10, 'type': 'Run Update IQ Data Macro', 'data_url': '/billing/monthly-detail-billing/update-iq-data-macro', 'parent': 2, 'hasData': 1 }
        ];



        this.setState({ billing_types: billing_type_data });

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

            if (field == "billing_type" && CommonHelper.isEmptyValue(value)) {
                errors[field] = true;
            }

            if (field == "billing_sub_type" && !CommonHelper.isEmptyValue(formData["billing_type"]) && CommonHelper.isEmptyValue(value)) {
                errors[field] = true;
            }
        }
        return errors;
    }

    handleSubmit = event => {
        event.preventDefault();

        var selectedId = this.state.fields['billing_sub_type'];
        let selected_billing_type = this.getSelectedBillingTypeData(selectedId);
        //console.log("kkk", selected_billing_type)
        if (selected_billing_type) {
            this.setState({ selected_billing_data_url: selected_billing_type.data_url });
            this.setState({ selected_billing_has_data: selected_billing_type.hasData });
            
        }

        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "api-token": token
            }
        };


        const url = Constants.API_URL + "/billing/generate-billing";

        let errors = this.validateForm();
        //console.log("eeeerrr",errors);
        if (isEmpty(errors)) {
            //console.log("no error",errors);
            this.setState({ isLoading: true });
            let bodyFormData = {
                "data": {
                    "billing_type": this.state.fields['billing_type'],
                    "billing_sub_type": this.state.fields['billing_sub_type']
                }
            };

            axios.post(url, bodyFormData, config)
                .then(result => {
                    this.setState({ isLoading: false });
                    if (result.data.status) {
                        alert("Billing Generated Successfully");
                        this.setState({ redirect: false, success_generation: true, isLoading: false })
                    }
                })
                .catch(error => {
                    //this.setState({ toDashboard: true });
                    alert("Error in data generation.Please check App Log");
                });
        } else {
            console.log("has error", typeof errors);
            this.setState({ errors: errors });
        }
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/skills/all' />
        }
    };

    getSelectedBillingTypeData = (id) => {
        return this.state.billing_types.find((element) => {
            return element.id == id;
        })
    }



    render() {
        const isLoading = this.state.isLoading;
        let billing_types = this.state.billing_types;
        let success_generation = this.state.success_generation;
        let selected_billing_data_url = this.state.selected_billing_data_url;
        let selected_billing_has_data = this.state.selected_billing_has_data;
        let billing_type = this.state.fields["billing_type"];
        let billing_type_opts = billing_types.map((item, i) => {
            if (item.parent == 0) {
                return (
                    <option key={"billing-type-" + item.id} value={item.id}>
                        {item.type}
                    </option>
                );
            }
        });

        let flatrate_billing_type_opts = billing_types.map((item, i) => {
            if (item.parent == 1) {
                return (
                    <option key={"flrate-billing-type-" + item.id} value={item.id}>
                        {item.type}
                    </option>
                );
            }
        });

        let monthly_detail_billing_type_opts = billing_types.map((item, i) => {
            if (item.parent == 2) {
                return (
                    <option key={"monthly-billing-type-" + item.id} value={item.id}>
                        {item.type}
                    </option>
                );
            }
        });

        if (this.state.toDashboard === true) {
            return <Redirect to='/' />
        }
        return (
            <AdminMain>
                <div>


                    <div id="content-wrapper">
                        <div className="container-fluid">
                            <ol className="breadcrumb box-shadow">
                                <li className="breadcrumb-item">
                                    <Link to={'/dashboard'} >Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active">Generate Billing</li>

                            </ol>

                        </div>
                        <div className="container-fluid">
                            <div className="card mx-auto card-primary">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-10"><p>Generate Billing</p></div>
                                        <div className="col-md-2"><Link className="btn btn-primary float-right" to={'/dashboard'} >Back</Link></div>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <div className="form-row">
                                                <div className="col-md-12">
                                                    {
                                                        success_generation && <div className="alert alert-success" role="alert">
                                                            Billing Data Has Been Generated Successfully,  {selected_billing_has_data != 0 && <label><Link to={selected_billing_data_url} className="text-info">Click here</Link> to view data </label>}
                                                        </div>
                                                    }
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-label-group">

                                                        <select name="billing_type" value={this.state.fields['billing_type']} onChange={this.handleInputChange} id="billing_type" className="form-control" className={"form-control " + (this.state.errors['billing_type'] ? 'is-invalid' : '')} >
                                                            <option value="">Select Billing Type</option>
                                                            {billing_type_opts}

                                                        </select>
                                                        {/* <label htmlFor="billing_type">Select Billing Type</label> */}
                                                    </div>
                                                </div>

                                                {(billing_type == 1) && <div className="col-md-12 mt-3">
                                                    <div className="form-label-group">

                                                        <select name="billing_sub_type" value={this.state.fields['billing_sub_type']} onChange={this.handleInputChange} id="billing_sub_type" className="form-control" className={"form-control " + (this.state.errors['billing_sub_type'] ? 'is-invalid' : '')} >
                                                            <option value="">Select Macro</option>
                                                            {flatrate_billing_type_opts}

                                                        </select>
                                                        {/* <label htmlFor="billing_type">Select Billing Type</label> */}
                                                    </div>
                                                </div>
                                                }

                                                {(billing_type == 2) && <div className="col-md-12 mt-3">
                                                    <div className="form-label-group">

                                                        <select name="billing_sub_type" value={this.state.fields['billing_sub_type']} onChange={this.handleInputChange} id="billing_sub_type" className="form-control" className={"form-control " + (this.state.errors['billing_sub_type'] ? 'is-invalid' : '')} >
                                                            <option value="">Select Macro</option>
                                                            {monthly_detail_billing_type_opts}

                                                        </select>
                                                        {/* <label htmlFor="billing_type">Select Billing Type</label> */}
                                                    </div>
                                                </div>
                                                }


                                            </div>
                                        </div>




                                        <button className="btn btn-primary btn-block" type="submit" disabled={this.state.isLoading ? true : false}>Submit &nbsp;&nbsp;&nbsp;
                                            {isLoading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                <span></span>
                                            )}
                                        </button>
                                    </form>
                                    {/* {this.renderRedirect()} */}
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
            </AdminMain>
        );
    }
}
