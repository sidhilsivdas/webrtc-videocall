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

export default class UpdateFlatrateBillingMacroView extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            toDashboard: false,
            isLoading: false,
            deleted: false,
            paginateData: [],
            page: 1,
            data: {
                "health_check_data": [],
                "raw_events_dropped_check_data": [],
                "dropped_from_final_billing_check_data": [],
                "exception_test_data": [],
                "flatrate_billing_view_data": []
            },
            expLoading: false
        };
        //This binding removeTag is necessary to make `this` work in the callback
        //this.removeEmployee = this.removeClient.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this)
    }





    componentDidMount() {

        this.setData(1);




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


        const url = Constants.API_URL + "/billing/update-flatrate-billing-macro";


        if (this.state.q != "") {
            this.setState({ isLoading: true });
            axios.get(url, config)
                .then(result => {

                    var res = result.data;
                    //console.log(result);
                    if (res.status == 'success') {

                        this.setState({ isLoading: false, data: res.data });
                        // console.log("paginate", this.state.paginateData);
                        let id = window.location.hash;
                        if (id) {
                            id = id.replace("#", "")
                            //this.goToViolation(id)
                            //alert(id+"-tab")
                            // $(function(){
                            //     $('#myTab #'+id+"-tab").tab('show');
                            // });
                            
                        }


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
                                <li className="breadcrumb-item active">Flat Rate Billing / Update Flatrate Billing</li>
                            </ol>
                        </div>
                        <div className="container-fluid mt-5">
                            
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="health-check-tab" data-toggle="tab" href="#health-check" role="tab" aria-controls="health-check" aria-selected="true">Health Check</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="raw-events-dropped-check-tab" data-toggle="tab" href="#raw-events-dropped-check" role="tab" aria-controls="raw-events-dropped-check" aria-selected="false">Raw Events Dropped Check</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="dropped-from-final-billing-check-tab" data-toggle="tab" href="#dropped-from-final-billing-check" role="tab" aria-controls="dropped-from-final-billing-check" aria-selected="false">Dropped From Final Billing Check</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="exception-test-tab" data-toggle="tab" href="#exception-test" role="tab" aria-controls="exception-test" aria-selected="false">Exception Test</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="flatrate-billing-view-tab" data-toggle="tab" href="#flatrate-billing-view" role="tab" aria-controls="flatrate-billing-view" aria-selected="false">Flatrate Billing View</a>
                            </li>
                        </ul>

                        </div>
                        
                        <div className="tab-content mt-1" id="myTabContent">
                            <div className="container-fluid tab-pane fade show active" id="health-check" role="tabpanel" aria-labelledby="health-check-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Health Check</h5></div>
                                            <div className="col-md-6 float-right1" >

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">



                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%"
                                                cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Raw Events</th>
                                                        <th>Conv Events</th>
                                                        <th>Billed Events</th>
                                                        <th>Awards Sites Billed</th>

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
                                                        data.health_check_data && data.health_check_data.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.raw_events}</td>
                                                                <td>{object.conv_events}</td>
                                                                <td>{object.events_billed}</td>
                                                                <td>{object.awards_sites_billed}</td>




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

                                                        data.health_check_data.length == 0 && <tr key="tr-1" ><td colSpan="4"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="raw-events-dropped-check" role="tabpanel" aria-labelledby="raw-events-dropped-check-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Raw Events Dropped Check</h5></div>
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
                                                        <th>Company Office</th>
                                                        <th>Event Number</th>
                                                        <th>Event Name</th>
                                                        <th>Website Template</th>
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
                                                        data.raw_events_dropped_check_data && data.raw_events_dropped_check_data.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.rec_id}</td>
                                                                <td>{object.company_office}</td>
                                                                <td>{object.event_number}</td>
                                                                <td>{object.event_name}</td>
                                                                <td>{object.website_template}</td>



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

                                                        data.raw_events_dropped_check_data.length == 0 && <tr key="tr-1" ><td colSpan="5"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="dropped-from-final-billing-check" role="tabpanel" aria-labelledby="dropped-from-final-billing-check-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Dropped From Final Billing Check</h5></div>
                                            <div className="col-md-6 float-right1" >

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
                                                        <th>Office</th>
                                                        <th>Event Number</th>
                                                        <th>Event Name</th>
                                                        <th>Event Start Date</th>
                                                        <th>Request Date</th>
                                                        <th>Billing Year</th>
                                                        <th>Package</th>
                                                        <th>Package Hours</th>
                                                        <th>Package Price</th>
                                                        <th>Event Plan Type</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        data.dropped_from_final_billing_check_data && data.dropped_from_final_billing_check_data.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.company_office}</td>
                                                                <td>{object.office}</td>
                                                                <td>{object.event_number}</td>
                                                                <td>{object.event_name}</td>
                                                                <td>{object.event_start_date}</td>
                                                                <td>{object.request_date}</td>
                                                                <td>{object.billing_year}</td>
                                                                <td>{object.package}</td>
                                                                <td>{object.package_hours}</td>
                                                                <td>{object.package_price}</td>
                                                                <td>{object.event_plan_type}</td>




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

                                                        data.dropped_from_final_billing_check_data.length == 0 && <tr key="tr-1" ><td colSpan="11"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid tab-pane fade" id="exception-test" role="tabpanel" aria-labelledby="exception-test-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Exception Test</h5></div>
                                            <div className="col-md-6 float-right1" >

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
                                                        <th>Package</th>
                                                        <th>Event Plan Type</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        data.exception_test_data && data.exception_test_data.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.company_office}</td>

                                                                <td>{object.event_number}</td>
                                                                <td>{object.event_name}</td>

                                                                <td>{object.package}</td>

                                                                <td>{object.event_plan_type}</td>





                                                            </tr>
                                                        )
                                                    }

                                                    {

                                                        data.exception_test_data.length == 0 && <tr key="tr-1" ><td colSpan="5"><div key="div-1" align="center">No results found</div></td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="card-footer small text-muted">

                                    </div>
                                </div>
                            </div>


                            <div className="container-fluid tab-pane fade" id="flatrate-billing-view" role="tabpanel" aria-labelledby="flatrate-billing-view-tab">

                                <div className="card mx-auto">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6"><h5>Flatrate Billing View</h5></div>
                                            <div className="col-md-6 float-right1" >

                                                <button className="btn btn-warning float-right" onClick={() => {
                                                    this.exportData(); //can pass arguments this.btnTapped(foo, bar);          
                                                }} >
                                                    {expLoading ? (
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
                                                        <th>Company Office</th>
                                                        <th>Office</th>
                                                        <th>Event Number</th>
                                                        <th>Event Name</th>
                                                        <th>Event Start Date</th>

                                                        <th>Billing Year</th>
                                                        <th>Package</th>

                                                        <th>Date Added</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        data.flatrate_billing_view_data && data.flatrate_billing_view_data.map((object, i) =>
                                                            <tr key={"tr-" + i}>
                                                                <td>{object.company_office}</td>
                                                                <td>{object.office}</td>
                                                                <td>{object.event_number}</td>
                                                                <td>{object.event_name}</td>
                                                                <td>{object.event_start_date}</td>

                                                                <td>{object.billing_year}</td>
                                                                <td>{object.package}</td>

                                                                <td>{object.date_added}</td>





                                                            </tr>
                                                        )
                                                    }

                                                    {

                                                        data.flatrate_billing_view_data.length == 0 && <tr key="tr-1" ><td colSpan="8"><div key="div-1" align="center">No results found</div></td></tr>

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
