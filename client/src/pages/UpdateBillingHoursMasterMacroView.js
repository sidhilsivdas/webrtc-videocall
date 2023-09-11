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

export default class UpdateBillingHoursMasterMacroView extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            toDashboard: false,
            isLoading: false,
            deleted: false,
            paginateData: [],
            page: 1,
            data: { "hourly_summary_report": [], "record_count_safety_check": [], "summary_output": [], "monthly_event_billing_hours_output": [], "iqpc_corporate_billing_output": [], "shale_usa_corporate_billing_output": [], "alpha_events_corporate_billing_output": [], "fintech_corporate_billing_output": [], "innovation_billing_output": [], "wbr_billing_output": [] },
            expLoading: {
                "summary_output": false,
                "monthly_event_billing_hours_output": false,
                "event_detail_billing": false,
                "corporate_billing": false,
                "innovation_billing": false,
                "wbr_billing": false
            }
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


        const url = Constants.API_URL + "/billing/fetch-edb-macro3-update-billing-hour-master";


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

    exportData = (type) => {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "api-token": token
            }
        };


        const url = Constants.API_URL + "/billing/export-billing-data?billing_type=" + type;

        var types = this.state.expLoading
        types[type] = true

        // if (this.state.q != "") {
        this.setState({ expLoading: types });
        axios.get(url, config)
            .then(result => {

                var res = result.data;
                console.log(result);
                if (res.status == 'success') {
                    //alert(res.data.file_url);

                    window.location.assign(res.data.file_url);
                    var types = this.state.expLoading
                    types[type] = false

                    // if (this.state.q != "") {
                    this.setState({ expLoading: types });


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
                                <li className="breadcrumb-item active">Monthly Detail Billing / Update Billing Hours Master</li>
                            </ol>
                        </div>

                        <div className="container-fluid mt-5">

                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="hourly-summary-report-tab" data-toggle="tab" href="#hourly-summary-report" role="tab" aria-controls="hourly-summary-report" aria-selected="true">Hourly Summary Report</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="record-count-safety-check-tab" data-toggle="tab" href="#record-count-safety-check" role="tab" aria-controls="record-count-safety-check" aria-selected="false">Record Count Safety Check</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="summary-output-tab" data-toggle="tab" href="#summary-output" role="tab" aria-controls="summary-output" aria-selected="false">Summary</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="monthly-event-billing-hours-output-tab" data-toggle="tab" href="#monthly-event-billing-hours-output" role="tab" aria-controls="monthly-event-billing-hours-output" aria-selected="false">Monthly Event Billing Hours </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="iqpc-corporate-billing-output-tab" data-toggle="tab" href="#iqpc-corporate-billing-output" role="tab" aria-controls="iqpc-corporate-billing-output" aria-selected="false">IQPC Corporate Billing</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="shale-usa-corporate-billing-output-tab" data-toggle="tab" href="#shale-usa-corporate-billing-output" role="tab" aria-controls="shale-usa-corporate-billing-output" aria-selected="false">Shale USA Corporate Billing</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="alpha-events-corporate-billing-output-tab" data-toggle="tab" href="#alpha-events-corporate-billing-output" role="tab" aria-controls="alpha-events-corporate-billing-output" aria-selected="false">Alpha Events Corporate Billing</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="fintech-corporate-billing-output-tab" data-toggle="tab" href="#fintech-corporate-billing-output" role="tab" aria-controls="fintech-corporate-billing-output" aria-selected="false">Fintech Corporate Billing</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="innovation-billing-output-tab" data-toggle="tab" href="#innovation-billing-output" role="tab" aria-controls="innovation-billing-output" aria-selected="false">Innovation Billing</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="wbr-billing-output-tab" data-toggle="tab" href="#wbr-billing-output" role="tab" aria-controls="wbr-billing-output" aria-selected="false">WBR Billing</a>
                                </li>

                            </ul>

                        </div>
                        <div className="tab-content mt-1" id="myTabContent">
                            <div className="container-fluid tab-pane fade show active" id="hourly-summary-report" role="tabpanel" aria-labelledby="hourly-summary-report-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Hourly Summary Report</h5></div>
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
                                                        <th>Category</th>
                                                        <th>Import Hours</th>
                                                        <th>Output Hours</th>
                                                        <th>Difference</th>
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
                                                        data.hourly_summary_report && data.hourly_summary_report.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.category}</td>
                                                                <td>{object.import_hours}</td>
                                                                <td>{object.output_hours}</td>
                                                                <td>{object.difference}</td>



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

                                                        data.hourly_summary_report.length == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="record-count-safety-check" role="tabpanel" aria-labelledby="record-count-safety-check-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Record Count Safety Check</h5></div>
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
                                                        <th>Raw Jira Issue Import Rec Count</th>
                                                        <th>Jira Issue Details Record Count</th>
                                                        <th>Billing Hour Master Record Count</th>

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
                                                        data.record_count_safety_check && data.record_count_safety_check.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.raw_jira_issue_import_rec_count}</td>
                                                                <td>{object.jira_issue_details_record_count}</td>
                                                                <td>{object.billing_hour_master_record_count}</td>




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

                                                        data.record_count_safety_check.length == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid tab-pane fade" id="summary-output" role="tabpanel" aria-labelledby="summary-output-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Summary Output</h5></div>
                                            <div className="col-md-6 float-right1" >
                                                <button className="btn btn-warning float-right" onClick={() => {
                                                    this.exportData("summary_output"); //can pass arguments this.btnTapped(foo, bar);          
                                                }} >
                                                    {expLoading['summary_output'] ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                    <i className="fas fa-fw fa-download"></i>

                                                    Export

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">

                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%"
                                                cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Office</th>
                                                        <th>Organization</th>
                                                        <th>Event Code</th>
                                                        <th>Event Plan Name</th>
                                                        <th>Date Created</th>
                                                        <th>Package</th>
                                                        <th>Month Flat Rate Billed</th>
                                                        <th>Package Hours</th>
                                                        <th>Hours Previously Billed</th>
                                                        <th>Current Monthly Hours To Be Billed</th>
                                                        <th>Hours Applied To Package</th>
                                                        <th>Package Hours Remaining</th>
                                                        <th>Hours Charged Above Package</th>
                                                        <th>Hours To Be Billed</th>


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
                                                        data.summary_output && data.summary_output.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.office}</td>
                                                                <td>{object.organization}</td>
                                                                <td>{object.event_code}</td>
                                                                <td>{object.event_plan_name}</td>
                                                                <td>{object.date_created}</td>
                                                                <td>{object.package}</td>
                                                                <td>{object.month_flat_rate_billed}</td>
                                                                <td>{object.package_hours}</td>
                                                                <td>{object.hours_previously_billed}</td>
                                                                <td>{object.current_monthly_hours_to_be_billed}</td>
                                                                <td>{object.hrs_applied_to_pkg}</td>
                                                                <td>{object.package_hours_remaining}</td>
                                                                <td>{object.hrs_charged_above_pkg}</td>
                                                                <td>{object.hrs_to_be_billed}</td>





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

                                                        data.summary_output.length == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="monthly-event-billing-hours-output" role="tabpanel" aria-labelledby="monthly-event-billing-hours-output-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-4"><h5>Monthly Event Billing Hours Output</h5></div>
                                            <div className="col-md-4 float-right1" >
                                                <button className="btn btn-warning float-right" onClick={() => {
                                                    this.exportData("monthly_event_billing_hours_output"); //can pass arguments this.btnTapped(foo, bar);          
                                                }} >
                                                    {expLoading["monthly_event_billing_hours_output"] ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                    <i className="fas fa-fw fa-download"></i>

                                                    Export

                                                </button>
                                            </div>
                                            <div className="col-md-4 float-right1" >
                                                <button className="btn btn-warning float-right" onClick={() => {
                                                    this.exportData("event_detail_billing"); //can pass arguments this.btnTapped(foo, bar);          
                                                }} >
                                                    {expLoading["event_detail_billing"] ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                    <i className="fas fa-fw fa-download"></i>

                                                    Generate Event Detail Billing Data

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">

                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%"
                                                cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Office</th>
                                                        <th>Event Code</th>
                                                        <th>Event Plan Name</th>
                                                        <th>Date Created</th>
                                                        <th>Package</th>
                                                        <th>Package Hours</th>
                                                        <th>Month Flat Rate Billed</th>
                                                        <th>Hours Previously Billed</th>
                                                        <th>Current Monthly Hours To Be Billed</th>
                                                        <th>Total Hours Accrued</th>
                                                        <th>Hours Applied To Package</th>
                                                        <th>Package Hours Remaining</th>
                                                        <th>Hours Charged Above Package</th>
                                                        <th>Hours To Be Billed</th>
                                                        <th>User Story ID</th>
                                                        <th>Task ID</th>
                                                        <th>Task Name</th>
                                                        <th>Category Of Work</th>
                                                        <th>Task Hours</th>
                                                        <th>Creation Date</th>
                                                        <th>Task Owner</th>


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
                                                        data.monthly_event_billing_hours_output && data.monthly_event_billing_hours_output.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.office}</td>
                                                                <td>{object.event_code}</td>
                                                                <td>{object.event_plan_name}</td>
                                                                <td>{object.date_created}</td>
                                                                <td>{object.package}</td>
                                                                <td>{object.package_hours}</td>
                                                                <td>{object.month_flat_rate_billed}</td>
                                                                <td>{object.hours_previously_billed}</td>
                                                                <td>{object.current_monthly_hours_to_be_billed}</td>
                                                                <td>{object.total_hours_accrued}</td>
                                                                <td>{object.hrs_applied_to_pkg}</td>
                                                                <td>{object.package_hours_remaining}</td>
                                                                <td>{object.hrs_charged_above_pkg}</td>
                                                                <td>{object.hrs_to_be_billed}</td>
                                                                <td>{object.user_story_id}</td>
                                                                <td>{object.task_id}</td>
                                                                <td>{object.task_name}</td>
                                                                <td>{object.category_of_work}</td>
                                                                <td>{object.task_hours}</td>
                                                                <td>{object.creation_date}</td>
                                                                <td>{object.task_owner}</td>






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

                                                        data.monthly_event_billing_hours_output.length == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid tab-pane fade" id="iqpc-corporate-billing-output" role="tabpanel" aria-labelledby="iqpc-corporate-billing-output-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>IQPC Corporate Billing Output</h5></div>
                                            <div className="col-md-6 float-right1" >
                                                <button className="btn btn-warning float-right" onClick={() => {
                                                    this.exportData("corporate_billing"); //can pass arguments this.btnTapped(foo, bar);          
                                                }} >
                                                    {expLoading["corporate_billing"] ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                    <i className="fas fa-fw fa-download"></i>

                                                    Export

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">

                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%"
                                                cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Sort</th>
                                                        <th>Type</th>
                                                        <th>Billing Cat</th>
                                                        <th>Company IQ</th>
                                                        <th>ID</th>
                                                        <th>Summary</th>
                                                        <th>Description</th>
                                                        <th>Hours</th>
                                                        <th>Creation Date</th>
                                                        <th>Owner</th>



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
                                                        data.iqpc_corporate_billing_output && data.iqpc_corporate_billing_output.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.sort}</td>
                                                                <td>{object.type}</td>
                                                                <td>{object.billing_cat}</td>
                                                                <td>{object.company_iq}</td>
                                                                <td>{object.id}</td>
                                                                <td>{object.summary}</td>
                                                                <td>{object.description}</td>
                                                                <td>{object.hours}</td>
                                                                <td>{object.creation_date}</td>
                                                                <td>{object.owner}</td>







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

                                                        data.iqpc_corporate_billing_output.length == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid tab-pane fade" id="shale-usa-corporate-billing-output" role="tabpanel" aria-labelledby="shale-usa-corporate-billing-output-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Shale USA Corporate Billing Output</h5></div>
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
                                                        data.shale_usa_corporate_billing_output && data.shale_usa_corporate_billing_output.map((object, i) =>
                                                            <tr key={"tr-" + i}>








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

                                                        data.shale_usa_corporate_billing_output.length == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="alpha-events-corporate-billing-output" role="tabpanel" aria-labelledby="alpha-events-corporate-billing-output-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Alpha Events Corporate Billing Output</h5></div>
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
                                                        data.alpha_events_corporate_billing_output && data.alpha_events_corporate_billing_output.map((object, i) =>
                                                            <tr key={"tr-" + i}>








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

                                                        data.alpha_events_corporate_billing_output.length == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="fintech-corporate-billing-output" role="tabpanel" aria-labelledby="fintech-corporate-billing-output-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Fintech Corporate Billing Output</h5></div>
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
                                                        data.fintech_corporate_billing_output && data.fintech_corporate_billing_output.map((object, i) =>
                                                            <tr key={"tr-" + i}>








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

                                                        data.fintech_corporate_billing_output == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="innovation-billing-output" role="tabpanel" aria-labelledby="innovation-billing-output-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Innovation Billing Output</h5></div>
                                            <div className="col-md-6 float-right1" >
                                                <button className="btn btn-warning float-right" onClick={() => {
                                                    this.exportData("innovation_billing"); //can pass arguments this.btnTapped(foo, bar);          
                                                }} >
                                                    {expLoading['innovation_billing'] ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                    <i className="fas fa-fw fa-download"></i>

                                                    Export

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">

                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%"
                                                cellSpacing="0">
                                                <thead>
                                                    <tr>




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
                                                        data.innovation_billing_output && data.innovation_billing_output.map((object, i) =>
                                                            <tr key={"tr-" + i}>








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

                                                        data.innovation_billing_output == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="wbr-billing-output" role="tabpanel" aria-labelledby="wbr-billing-output-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>WBR Billing Output</h5></div>
                                            <div className="col-md-6 float-right1" >
                                                <button className="btn btn-warning float-right" onClick={() => {
                                                    this.exportData("wbr_billing"); //can pass arguments this.btnTapped(foo, bar);          
                                                }} >
                                                    {expLoading['wbr_billing'] ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                    <i className="fas fa-fw fa-download"></i>

                                                    Export

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">

                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%"
                                                cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Sort</th>
                                                        <th>Type</th>
                                                        <th>Billing Cat</th>
                                                        <th>Office</th>
                                                        <th>ID</th>
                                                        <th>Summary</th>
                                                        <th>Description</th>
                                                        <th>Hours</th>
                                                        <th>Creation Date</th>
                                                        <th>Owner</th>



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
                                                        data.wbr_billing_output && data.wbr_billing_output.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.sort}</td>
                                                                <td>{object.type}</td>
                                                                <td>{object.billing_cat}</td>
                                                                <td>{object.office}</td>
                                                                <td>{object.id}</td>
                                                                <td>{object.summary}</td>
                                                                <td>{object.description}</td>
                                                                <td>{object.hours}</td>
                                                                <td>{object.creation_date}</td>
                                                                <td>{object.owner}</td>









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

                                                        data.wbr_billing_output == 0 && <tr key="tr-1" ><td colSpan="7pr"><div key="div-1" align="center">No results found</div></td></tr>

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
