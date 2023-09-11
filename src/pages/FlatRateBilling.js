import React, { Component } from 'react';
import ReactHtmlParser from "react-html-parser";
import Header from "../elements/header";
import Sidebar from "../elements/sidebar";
import * as Constants from '../config/constants';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import LoaderDiv from "../elements/LoaderDiv";
// import CsvUpload from "./CsvUpload";
import Alert from "../elements/Alert";
import Pagination from "react-js-pagination";
//require("bootstrap/less/bootstrap.less");

export default class FlatrateBilling extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            toDashboard: false,
            isLoading: false,
            deleted: false,
            paginateData: [],
            page: 1,
            data: [],
            expLoading: false
        };
        //This binding removeTag is necessary to make `this` work in the callback
        //this.removeEmployee = this.removeClient.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this)
    }





    componentDidMount() {

        this.setData(1);

    }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.setData(1);
    }

    setData = (page) => {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "api-token": token
            }
        };


        const url = Constants.API_URL + "/billing/fetch-flatrate-billing-data?page=" + page;


        if (this.state.q != "") {
            this.setState({ isLoading: true });
            axios.get(url, config)
                .then(result => {

                    var res = result.data;
                    console.log(result);
                    if (res.status == 'success') {

                        this.setState({ isLoading: false, data: res.data, paginateData: res.paginateData });
                        // console.log("paginate", this.state.paginateData);


                    } else {
                        this.setState({ redirect: false, authError: true });
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ authError: true, isLoading: false });
                });
        }
    };



    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/job/postings' />
        }
    };



    handlePageChange = (pageNumber) => {
        console.log("triggered", pageNumber);
        this.setState({ deleted: false });
        this.setData(pageNumber);
    }

    exportData = () => {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "api-token": token
            }
        };


        const url = Constants.API_URL + "/billing/export-billing-data?billing_type=flatrate_billing";


        // if (this.state.q != "") {
        this.setState({ expLoading: true });
        axios.get(url, config)
            .then(result => {

                var res = result.data;
                console.log(result);
                if (res.status == 'success') {
                    //alert(res.data.file_url);

                    window.location.assign(res.data.file_url);
                    this.setState({ expLoading: false });

                    //this.setState({ isLoading: false, data: res.data, paginateData: res.paginateData });
                    // console.log("paginate", this.state.paginateData);


                } else {
                    this.setState({ redirect: false, authError: true });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ authError: true, isLoading: false });
            });
        // }
    }

    render() {
        const isLoading = this.state.isLoading;
        const deleted = this.state.deleted;
        const data = this.state.data;
        const message = " has been deleted";
        const expLoading = this.state.expLoading;
        //console.log("deleted", deleted);

        return (
            <div>



                <Alert
                    alertData={
                        {
                            "show": deleted,
                            "message": message,
                            "title": "Deleted",
                        }
                    } />



                <Header />
                <div id="wrapper">
                    {isLoading ? <LoaderDiv /> : null}

                    <Sidebar></Sidebar>
                    <div id="content-wrapper">
                        <div className="container-fluid">
                            <ol className="breadcrumb box-shadow">
                                <li className="breadcrumb-item">
                                    <Link to={'/dashboard'} >Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active">Flat Rate Billing </li>
                            </ol>
                        </div>
                        <div className="container-fluid">

                            <div className="card mx-auto">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-3"><h5>View Data</h5></div>
                                        <div className="col-md-9 float-right1" >
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">

                                    <div className="table-responsive">
                                        <table className="table table-bordered" id="dataTable" width="100%"
                                            cellSpacing="0">
                                            <thead>

                                            </thead>

                                            <tbody>
                                                <tr>
                                                    <th>Monthly Data Prep Macro</th>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <Link to={"/billing/flat-rate-billing/monthly-data-prep-macro/#suspect-event-setup-requests"} class="btn btn-outline-primary m-2">Suspect Event Setup Requests</Link>
                                                    <Link to={"/billing/flat-rate-billing/monthly-data-prep-macro/#pending-awards-splashpage-billing-review"} class="btn btn-outline-primary m-2">Pending Awards Splashpage Billing Review</Link>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-bordered" id="dataTable" width="100%"
                                            cellSpacing="0">
                                            <thead>

                                            </thead>

                                            <tbody>
                                                <tr>
                                                    <th>Update Flatrate Billing Macro</th>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <Link to={"/billing/flat-rate-billing/update-flatrate-billing-macro#health-check"} class="btn btn-outline-primary m-2">Health Check</Link>
                                                    <Link to={"/billing/flat-rate-billing/update-flatrate-billing-macro#raw-events-dropped-check"} class="btn btn-outline-primary m-2">Raw Events Dropped Check</Link>
                                                    <Link to={"/billing/flat-rate-billing/update-flatrate-billing-macro#dropped-from-final-billing-check"} class="btn btn-outline-primary m-2">Dropped From Final Billing Check</Link>
                                                    <Link to={"/billing/flat-rate-billing/update-flatrate-billing-macro#exception-test"} class="btn btn-outline-primary m-2">Exception Test</Link>
                                                    <Link to={"/billing/flat-rate-billing/update-flatrate-billing-macro#flatrate-billing-view"} class="btn btn-outline-primary m-2">Flatrate Billing View</Link>
                                                    
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-bordered" id="dataTable" width="100%"
                                            cellSpacing="0">
                                            <thead>

                                            </thead>

                                            <tbody>
                                                <tr>
                                                    <th>Flatrate Billing Complete Macro</th>
                                                </tr>
                                                <tr>
                                                    <td>
                                                    <Link to={"/billing/flat-rate-billing/flatrate-billing-complete-macro"} class="btn btn-outline-primary m-2">Executive Monthly Summary Output</Link>
                                                                                                        
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                                <div className="card-footer small text-muted">
                                    
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
