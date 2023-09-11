import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import * as Constants from '../config/constants';
import axios from 'axios';
import MultiSkillSelect from "../elements/MultiSkillSelect";
import CommonHelper from "../helpers/CommonHelper";
import isEmpty from "is-empty";
import AdminMain from '../layouts/AdminMain';

export default class ImportData extends Component {



    state = {
        redirect: false,
        toDashboard: false,
        isLoading: false,
        fields: {
            billing_type: "",
            import_data_id: ""
        },
        errors: {},
        success_import: false,
        billing_types: [],
        selected_billing_data_url: "/#",
        selected_billing_has_data: 1,
        data : {
            "import_data" : [],
            "billing_type_data" : []
        }
    };



    componentDidMount() {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "api-token": token
            }
        };
        
        const url = Constants.API_URL + "/billing/fetch-import-data-configuration";

        let errors = this.validateForm();
        //console.log("eeeerrr",errors);
        if (true) {
            //console.log("no error",errors);
            this.setState({ isLoading: false });
            

            axios.get(url, config)
                .then(result => {
                    this.setState({ isLoading: false });
                    if (result.data.status) {
                        
                        this.setState({ redirect: false, data:result.data.data, isLoading: false })
                    }
                })
                .catch(error => {
                    //this.setState({ toDashboard: true });
                    console.log("Error in data fetch.Please check App Log");
                });
        } else {
            console.log("has error", typeof errors);
            this.setState({ errors: errors });
        }

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

            if (field == "import_data_id" && !CommonHelper.isEmptyValue(formData["billing_type"]) && CommonHelper.isEmptyValue(value)) {
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


        const url = Constants.API_URL + "/billing/generate-billing1";

        let errors = this.validateForm();
        //console.log("eeeerrr",errors);
        if (isEmpty(errors)) {
            //console.log("no error",errors);
            this.setState({ isLoading: true });
            let bodyFormData = {
                "data": {
                    "billing_type": this.state.fields['billing_type'],
                    "import_data_id": this.state.fields['import_data_id']
                }
            };

            axios.post(url, bodyFormData, config)
                .then(result => {
                    this.setState({ isLoading: false });
                    if (result.data.status) {
                        alert("Data Imported Successfully");
                        this.setState({ redirect: false, success_import: true, isLoading: false })
                    }
                })
                .catch(error => {
                    //this.setState({ toDashboard: true });
                    alert("Error in data import.Please check App Log");
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
        let billing_types = this.state.data['billing_type_data'];
        let import_data = this.state.data['import_data'];
        console.log("kk",this.state.data)

        let success_import = this.state.success_generation;
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

        let flatrate_import_data = import_data.map((item, i) => {
            if (item.billing_type == 1) {
                return (
                    <option key={"flrate-billing-type-" + item.import_billing_data_conf_id} value={item.id}>
                        {item.import_data_type}
                    </option>
                );
            }
        });

        let monthly_detail_billing_import_data = billing_types.map((item, i) => {
            if (item.billing_type == 2) {
                return (
                    <option key={"monthly-billing-type-" + item.import_billing_data_conf_id} value={item.id}>
                        {item.import_data_type}
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
                                <li className="breadcrumb-item active">Import Billing Data</li>

                            </ol>

                        </div>
                        <div className="container-fluid">
                            <div className="card mx-auto card-primary">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-10"><p>Import Billing Data</p></div>
                                        <div className="col-md-2"><Link className="btn btn-primary float-right" to={'/dashboard'} >Back</Link></div>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <div className="form-row">
                                                <div className="col-md-12">
                                                    {
                                                        success_import && <div className="alert alert-success" role="alert">
                                                            Billing Data Has Been Imported Successfully  
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

                                                        <select name="import_data_id" value={this.state.fields['import_data_id']} onChange={this.handleInputChange} id="import_data_id" className="form-control" className={"form-control " + (this.state.errors['import_data_id'] ? 'is-invalid' : '')} >
                                                            <option value="">Select Import Type</option>
                                                            {flatrate_import_data}

                                                        </select>
                                                        {/* <label htmlFor="billing_type">Select Billing Type</label> */}
                                                    </div>
                                                </div>
                                                }

                                                {(billing_type == 2) && <div className="col-md-12 mt-3">
                                                    <div className="form-label-group">

                                                        <select name="import_data_id" value={this.state.fields['import_data_id']} onChange={this.handleInputChange} id="import_data_id" className="form-control" className={"form-control " + (this.state.errors['import_data_id'] ? 'is-invalid' : '')} >
                                                            <option value="">Select Import Type</option>
                                                            {monthly_detail_billing_import_data}

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
