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
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router';


const ManageModal = (props) => {

    let initialFormData = {
        //stockId:props.data.stockData.id,
        quantity_start: props.data.formData.quantity_start || "",
        quantity_end: props.data.formData.quantity_end || "",
        price: props.data.formData.price || 0
    }

    const [formData, setFormData] = useState(initialFormData);
    const [errorData, setErrorData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formAction, setFormAction] = useState("create");

    const [testdata, setTestData] = useState(false);

    const validateForm = () => {
        const formClone = { ...formData };
        let errorDetails = {};

        for (const [key, value] of Object.entries(formClone)) {

           

            if (!value) {
                errorDetails[key] = true
            }
        };

        if (Object.keys(errorDetails).length != 0) {
            setErrorData({ ...errorDetails });
            return false;
        }
        //console.log(errorDetails);
        return true;
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');

        const headers = {
            "access-token": token
        }

        let method;
        let url;
        if (props.data.formFrom == "create") {
            url = Constants.API_URL + "/stocks/add-price-range-details";
            method = "POST";
        } else {
            url = Constants.API_URL + "/stocks/" + props.data.formFrom;
            method = "PUT";
        }

        let formObj = {...formData, stock_id:props.data.stockData.id}

        if (validateForm()) {
            //console.log("jjjjjjj")
            axios({
                method: method,
                url: url,
                data: formObj,
                headers
            }).then(result => {
                setErrorData({});
                setIsLoading(false);
                if (result.data.status) {
                    //setIsLoading(false);
                    props.setModalStatus();
                    alert("Record Saved Successfully");
                    //this.connectParent();

                }
            })
                .catch(error => {
                    if (error.response) {
                        //props.setModalStatus();
                        setIsLoading(false);
                        alert(error.response.data.message ? error.response.data.message : 'Server error');
                        //console.log(error.response.headers);
                    }
                });

        } else {
            setIsLoading(false);
        }



    }

    return (
        <div>


            <Modal show={true} size="lg">
                <Modal.Header closeButton onClick={props.setModalStatus}>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="form-row">
                                <div className="col-md-12">
                                    <div className="form-label-group">
                                        <input name="quantity_start" value={formData.quantity_start} onChange={handleInputChange} type="number" className={"form-control " + (errorData.quantity_start ? 'is-invalid' : '')} autoFocus="autofocus" />
                                        <label htmlFor="quantity_start">Enter Quantity Start</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-row">
                                <div className="col-md-12">
                                    <div className="form-label-group">
                                        <input name="quantity_end" value={formData.quantity_end} onChange={handleInputChange} type="number" className={"form-control " + (errorData.quantity_end ? 'is-invalid' : '')} autoFocus="autofocus" />
                                        <label htmlFor="quantity_end">Enter Quantity End</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-row">
                                <div className="col-md-12">
                                    <div className="form-label-group">
                                        <input name="price" value={formData.price} onChange={handleInputChange} type="number" className={"form-control " + (errorData.price ? 'is-invalid' : '')} autoFocus="autofocus" />
                                        <label htmlFor="price">Enter Price</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-block" type="submit" disabled={isLoading ? true : false}>Save &nbsp;&nbsp;&nbsp;
                            {isLoading ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                <span></span>
                            )}
                        </button>

                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.setModalStatus}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>

        </div>
    )
}


export default class PriceManagement extends Component {
    constructor(props) {
        
        super(props);
        this.state = {
            redirect: false,
            toDashboard: false,
            isLoading: false,
            deleted: false,
            paginateData: {
                currentPage: 1,
                itemsCountPerPage: 50,
                totalItemsCount: 0
            },
            page: 1,
            users: [],
            modalStatus: false,
            formFrom: "create",
            formData: {},
            stockId:this.props.match.params.stockId,
            stockData:{}
        };
        //This binding removeTag is necessary to make `this` work in the callback
        //this.removeEmployee = this.removeClient.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    createData() {
        this.setState({ modalStatus: true, formFrom: "create", formData:{} });

    }

    updateData(obj) {
        let newObj = { ...obj };
        delete newObj.id;
        delete newObj.created_at;
        this.setState({ modalStatus: true, formFrom: obj.id, formData: { ...newObj } });

    }





    async componentDidMount() {

        try {
            const token = localStorage.getItem('token');
            var config = {
                headers: {
                    "access-token": token
                }
            };
            const url = Constants.API_URL + `/stocks/${this.state.stockId}`;
            let resData = await axios.get(url, config);

            this.setState({stockData:{...resData.data.data}});



        } catch (err) {

        }


        this.setState({ paginateData: { ...this.state.paginateData, currentPage: 1 } });
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


        const url = Constants.API_URL + "/stocks/get-price-range-details/"+this.state.stockId+"?page=" + page + "&perPage=" + this.state.paginateData.itemsCountPerPage;


        if (this.state.q != "") {
            this.setState({ isLoading: true });
            axios.get(url, config)
                .then(result => {

                    var res = result.data;
                    //console.log(result);
                    if (res.status == 'success') {

                        this.setState({ isLoading: false, users: res.data.items, paginateData: { ...this.state.paginateData, totalItemsCount: res.data.totalCount } });
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

    removeData(obj) {
        if (window.confirm("Are you sure? There is no redo!")) {
            const token = localStorage.getItem('token');
            var config = {
                headers: {
                    "access-token": token
                }
            };

            var id = obj.id;
            this.setState({
                isLoading: true
            });



            const url = Constants.API_URL + "/users/" + id;
            axios.delete(url, config)
                .then(result => {

                    var res = result.data;
                    //console.log(result);
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

    }

    handlePageChange = (pageNumber) => {
        //alert(pageNumber);
        // console.log("triggered", pageNumber);
        this.setState({ deleted: false, paginateData: { ...this.state.paginateData, currentPage: pageNumber } });
        this.setData(pageNumber);
    }

    setModalStatus = () => {
        this.setState({ modalStatus: false, paginateData: { ...this.state.paginateData, currentPage: 1 } });
        this.setData(1);
    }

    render() {
        const isLoading = this.state.isLoading;
        const deleted = this.state.deleted;
        const users = this.state.users;
        const modalStatus = this.state.modalStatus;
        const message = "User has been deleted";
        //console.log("deleted", deleted);

        return (
            <div>
                {modalStatus && <ManageModal data={{ 'formFrom': this.state.formFrom, 'formData': this.state.formData,stockData:this.state.stockData }} setModalStatus={this.setModalStatus}></ManageModal>}


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
                                <li className="breadcrumb-item active">Price </li>
                            </ol>
                        </div>
                        <div className="container-fluid">

                            <div className="card mx-auto">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-3"><p>Total Results : {this.state.paginateData.totalItemsCount ? this.state.paginateData.totalItemsCount : 0}</p></div>
                                        <div className='col-md-6'>
                                            {`${this.state.stockData.product ?this.state.stockData.product.product_name:""} 
                                            | ${this.state.stockData.color?this.state.stockData.color.color_name:""} 
                                            | ${this.state.stockData.quantity?this.state.stockData.quantity:0}`}
                                        </div>

                                        <div className="col-md-3 float-right1" >
                                            <button className="btn btn-primary float-right" onClick={() => { this.createData() }}>Add New</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">

                                    <div className="table-responsive sticky-scroll-table">
                                        <table className="table table-bordered" id="dataTable" width="100%"
                                            cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Quantity From</th>
                                                    <th>Quantity To</th>
                                                    <th>Price</th>
                                                   
                                                    <th>Created At</th>

                                                    
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
                                                    users && users.map((object, i) =>
                                                        <tr key={"tr-" + i}>
                                                            <td>{object.id}</td>
                                                            <td>{object.quantity_start}</td>
                                                            <td>{object.quantity_start}</td>
                                                            <td>{object.price}</td>
                                                            
                                                            <td>{moment(object.created_at, "YYYY-MM-DD HH:mm:ss").format('Do MMM YYYY, h:mm A')}</td>


                                                            
                                                        </tr>
                                                    )
                                                }

                                                {

                                                    users.length == 0 && <tr key="tr-1" ><td colSpan="25"><div key="div-1" align="center">No results found</div></td></tr>

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
