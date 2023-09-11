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

export default class MonthlyDataPrepMacroView extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            toDashboard: false,
            isLoading: false,
            deleted: false,
            paginateData: [],
            page: 1,
            data: { "suspect_data": [], "award_spalashpage_data": [] },
            expLoading: false
        };
        //This binding removeTag is necessary to make `this` work in the callback
        //this.removeEmployee = this.removeClient.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this)
    }





    componentDidMount() {

        this.setData(1);
        let id = window.location.hash;
        if (id) {
            id = id.replace("#", "")
            this.goToViolation(id)
        }



    }

    goToViolation = (id) => {
        const violation = document.getElementById(id);
        if (violation) {
            window.scrollTo({
                top: violation.offsetTop,
                behavior: "smooth"
            });
        }

    };

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


        const url = Constants.API_URL + "/billing/monthly-data-prep-macro";


        if (this.state.q != "") {
            this.setState({ isLoading: true });
            axios.get(url, config)
                .then(result => {

                    var res = result.data;
                    //console.log(result);
                    if (res.status == 'success') {

                        this.setState({ isLoading: false, data: res.data });
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
                                <li className="breadcrumb-item active">Flat Rate Billing / Monthly Data Prep</li>
                            </ol>
                        </div>

                        <div className="container-fluid mt-5">

                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="suspect-event-setup-requests-tab" data-toggle="tab" href="#suspect-event-setup-requests" role="tab" aria-controls="suspect-event-setup-requests" aria-selected="true">Suspect Event Setup Requests</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="pending-awards-splashpage-billing-review-tab" data-toggle="tab" href="#pending-awards-splashpage-billing-review" role="tab" aria-controls="pending-awards-splashpage-billing-review" aria-selected="false">Pending Awards Splashpage Billing Review</a>
                                </li>

                            </ul>

                        </div>
                        <div className="tab-content mt-1" id="myTabContent">
                            <div className="container-fluid tab-pane fade show active" id="suspect-event-setup-requests" role="tabpanel" aria-labelledby="suspect-event-setup-requests-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Suspect Event Setup Requests</h5></div>
                                            <div className="col-md-6 float-right1" >
                                                {/* <button className="btn btn-warning float-right" onClick={() => {
                                                this.exportData(); //can pass arguments this.btnTapped(foo, bar);          
                                            }} >
                                                {expLoading ? (
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <span></span>
                                                )}
                                                <i className="fas fa-fw fa-download"></i>
                                                
                                                Export

                                            </button> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">

                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%"
                                                cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Event Number</th>
                                                        <th>Event Name</th>
                                                        <th>Request Date</th>
                                                        <th>Event Start</th>
                                                        <th>Event End</th>
                                                        <th>Event Plan Code</th>
                                                    </tr>
                                                </thead>
                                                {/*<tfoot>
                                            <tr>
                                                <th>Job ID</th>
                                                <th>Title</th>
                                                <th>Skills</th>
                                                <th>Location</th>
                                                <th>Experience</th>
                                                <th>Action</th>
                                            </tr>
                                            </tfoot>*/}
                                                <tbody>
                                                    {
                                                        data.suspect_data && data.suspect_data.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.id}</td>
                                                                <td>{object.event_number}</td>
                                                                <td>{object.event_name}</td>
                                                                <td>{object.request_date}</td>
                                                                <td>{object.event_start}</td>
                                                                <td>{object.event_end}</td>
                                                                <td>{object.event_plan_code}</td>


                                                                {/* <td>
                                                                <Link className="btn btn-danger btn-sm m-1"
                                                                    onClick={() => {
                                                                        this.removeClient(object); //can pass arguments this.btnTapped(foo, bar);          
                                                                    }} to={'#'}><i className="fa fa-trash"></i></Link>
                                                                <Link className="btn btn-primary btn-sm m-1" to={'/clients/edit/' + object.client_id}><i className="fa fa-edit"></i></Link>
                                                            </td> */}
                                                            </tr>
                                                        )
                                                    }

                                                    {

                                                        data.suspect_data.length == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="pending-awards-splashpage-billing-review" role="tabpanel" aria-labelledby="pending-awards-splashpage-billing-review-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Pending Awards Splashpage Billing Review</h5></div>
                                            <div className="col-md-6 float-right1" >
                                                {/* <button className="btn btn-warning float-right" onClick={() => {
                                                this.exportData(); //can pass arguments this.btnTapped(foo, bar);          
                                            }} >
                                                {expLoading ? (
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <span></span>
                                                )}
                                                <i className="fas fa-fw fa-download"></i>
                                                
                                                Export

                                            </button> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">

                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%"
                                                cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Company Office</th>
                                                        <th>Event Number</th>
                                                        <th>Event Name</th>
                                                        <th>Event Start Date</th>
                                                        <th>Request Date</th>
                                                        <th>Event Plan Type</th>
                                                        <th>Site Type</th>
                                                        <th>Billing Year</th>
                                                        <th>Package</th>
                                                    </tr>
                                                </thead>
                                                {/*<tfoot>
                                            <tr>
                                                <th>Job ID</th>
                                                <th>Title</th>
                                                <th>Skills</th>
                                                <th>Location</th>
                                                <th>Experience</th>
                                                <th>Action</th>
                                            </tr>
                                            </tfoot>*/}
                                                <tbody>
                                                    {
                                                        data.award_spalashpage_data && data.award_spalashpage_data.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.company_office}</td>
                                                                <td>{object.event_number}</td>
                                                                <td>{object.event_name}</td>
                                                                <td>{object.event_start_date}</td>
                                                                <td>{object.request_date}</td>
                                                                <td>{object.event_plan_type}</td>
                                                                <td>{object.site_type}</td>
                                                                <td>{object.billing_year}</td>
                                                                <td>{object.package}</td>


                                                                {/* <td>
                                                                <Link className="btn btn-danger btn-sm m-1"
                                                                    onClick={() => {
                                                                        this.removeClient(object); //can pass arguments this.btnTapped(foo, bar);          
                                                                    }} to={'#'}><i className="fa fa-trash"></i></Link>
                                                                <Link className="btn btn-primary btn-sm m-1" to={'/clients/edit/' + object.client_id}><i className="fa fa-edit"></i></Link>
                                                            </td> */}
                                                            </tr>
                                                        )
                                                    }

                                                    {

                                                        data.suspect_data.length == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="card-footer small text-muted">

                                    </div>
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
