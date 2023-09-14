import React, { Component } from 'react';
import ReactHtmlParser from "react-html-parser";
import Header from "../elements/header";
import Sidebar from "../elements/sidebar";
import * as Constants from '../config/constants';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import LoaderDiv from "../elements/LoaderDiv";
//import CsvUpload from "./CsvUpload";
import Alert from "../elements/Alert";
import Pagination from "react-js-pagination";
//require("bootstrap/less/bootstrap.less");

export default class UserManagement extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            toDashboard: false,
            isLoading: false,
            deleted: false,
            paginateData: {
                currentPage:1,
                itemsCountPerPage:50,
                totalItemsCount: 0
            },
            page: 1,
            users: [],
            modalStatus: false
        };
        //This binding removeTag is necessary to make `this` work in the callback
        //this.removeEmployee = this.removeClient.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this)
    }





    componentDidMount() {
        this.setState({paginateData:{...this.state.paginateData,currentPage:1}});
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
                "access-token": token
            }
        };


        const url = Constants.API_URL + "/users/?page=" + page + "&perPage="+this.state.paginateData.itemsCountPerPage;


        if (this.state.q != "") {
            this.setState({ isLoading: true });
            axios.get(url, config)
                .then(result => {

                    var res = result.data;
                    console.log(result);
                    if (res.status == 'success') {

                        this.setState({ isLoading: false, users: res.data.items, paginateData: {...this.state.paginateData, totalItemsCount:res.data.totalCount} });
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

    removeUser(user) {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "api-token": token
            }
        };
        var userId = user.user_id;
        this.setState({
            isLoading: true
        });



        const url = Constants.API_URL + "/user/delete/" + userId;
        axios.delete(url, config)
            .then(result => {

                var res = result.data;
                console.log(result);
                if (res.status == 'success') {

                    // var newEmps = this.state.emps.filter(function (item) {
                    //     return item.employee_id !== empId
                    // });


                    this.setState({ isLoading: false, deleted: true });
                    this.setData(1);
                    //alert("Employee has been deleted");

                } else {
                    this.setState({ redirect: false, authError: true });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ authError: true, isLoading: false });
            });

    }

    handlePageChange = (pageNumber) => {
        //alert(pageNumber);
        // console.log("triggered", pageNumber);
        this.setState({ deleted: false, paginateData:{...this.state.paginateData, currentPage:pageNumber} });
        this.setData(pageNumber);
    }

    render() {
        const isLoading = this.state.isLoading;
        const deleted = this.state.deleted;
        const users = this.state.users;
        const message = "User has been deleted";
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
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={'/dashboard'} >Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active">Users </li>
                            </ol>
                        </div>
                        <div className="container-fluid">

                            <div className="card mx-auto">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-3"><p>Total Results : {this.state.paginateData.totalItemsCount ? this.state.paginateData.totalItemsCount : 0}</p></div>
                                        <div className="col-md-9 float-right1" >
                                            <Link className="btn btn-primary float-right" to={'/users/create'} >Add New</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">

                                    <div className="table-responsive" style={{'max-height':'400px','overflow-x1':'scroll'}}>
                                        <table className="table table-bordered" id="dataTable" width="100%"
                                            cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>User Type</th>
                                                    <th>Created At</th>
                                                    
                                                    <th>Actions</th>
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
                                            <tbody style={{'overflow-y1':'scroll'}}>
                                                {
                                                    users && users.map((object, i) =>
                                                        <tr key={"tr-" + i}>
                                                            <td>{object.id}</td>
                                                            <td>{object.full_name}</td>
                                                            <td>{object.email}</td>
                                                            <td>{object.role}</td>
                                                            <td>{object.created_at}</td>
                                                            

                                                            <td>
                                                                <Link className="btn btn-danger btn-sm m-1"
                                                                    onClick={() => {
                                                                        this.removeUser(object); //can pass arguments this.btnTapped(foo, bar);          
                                                                    }} to={'#'}><i className="fa fa-trash"></i></Link>
                                                                
                                                                <Link className="btn btn-primary btn-sm m-1" to={'/users/edit/' + object.user_id}><i className="fa fa-edit"></i></Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                }

                                                {

                                                    users.length == 0 && <tr key="tr-1" ><td colSpan="4"><div key="div-1" align="center">No results found</div></td></tr>

                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="card-footer small text-muted">
                                    {this.state.paginateData.totalItemsCount ?
                                        (<div className="row">
                                            <div className="col-md-12" >
                                                <Pagination
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                    prevPageText="Prev"
                                                    firstPageText="First"
                                                    lastPageText="Last"
                                                    nextPageText="Next"
                                                    innerClass="pagination justify-content-end"
                                                    activePage={this.state.paginateData.currentPage}
                                                    itemsCountPerPage={this.state.paginateData.itemsCountPerPage}
                                                    totalItemsCount={this.state.paginateData.totalItemsCount}
                                                    pageRangeDisplayed={5}
                                                    onChange={this.handlePageChange.bind(this)}
                                                />
                                            </div>
                                        </div>) : null
                                    }
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
