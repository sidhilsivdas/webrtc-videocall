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
import RequestContainer from "../elements/RequestContainer";


export default class CreateRequest extends Component {
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
            requestItems: [],
            curRow: 1

        };
        //This binding removeTag is necessary to make `this` work in the callback
        //this.removeEmployee = this.removeClient.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    addItem() {
        let hCount = this.state.curRow;
        let item = { id:hCount,quantity: "", price: "" };
        let requestItemArr = [...this.state.requestItems];
        requestItemArr.unshift({ ...item });
       // this.setState({ requestItems: [...requestItemArr], curRow: hCount + 1 });

        this.setState(prevState => ({
            requestItems: [...requestItemArr],
            curRow:hCount+1

        }))

    }

    updateData(obj) {
        let newObj = { ...obj };
        delete newObj.id;
        delete newObj.created_at;
        this.setState({ modalStatus: true, formFrom: obj.id, formData: { ...newObj } });

    }

    removeData(obj) {
        
        

    }





    async componentDidMount() {






    }

    handleInputChange = (e, index) => {
        const { name, value } = e.target;
        let requestItemsArr = this.state.requestItems;
        requestItemsArr[index][name] = value;
        //console.log(requestItemsArr);
        this.setState(prevState => ({
            requestItems: [...requestItemsArr]
        }))
    }



    render() {
        const isLoading = this.state.isLoading;
        let requestItems = this.state.requestItems;
        return (
            <div>







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
                                <li className="breadcrumb-item active">Create Request </li>
                            </ol>
                        </div>
                        <div className="container-fluid">

                            <div className="card mx-auto">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-3"><p>Total Results : {this.state.paginateData.totalItemsCount ? this.state.paginateData.totalItemsCount : 0}</p></div>
                                        <div className='col-md-6'>

                                        </div>

                                        <div className="col-md-3 float-right1" >
                                            <Link className="btn btn-success float-right" to="#" onClick={
                                                () => this.addItem()
                                            }>+</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">

                                    <div className="table-responsive">
                                        <table className="table table-bordered" id="dataTable" width="100%"
                                            cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Stock</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>X</th>



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
                                                    requestItems && [...requestItems].map((item, index) => {
                                                        //return <RequestContainer key={`re-cont-${index}`} data={{item:{...item}}}/>
                                                        return (<tr key={`req-cont-tr1-${index}`}>
                                                            <td>
                                                                {item.id}
                                                            </td>
                                                            <td>
                                                               
                                                            </td>
                                                            <td className='request-cont-td'>
                                                                <input name="quantity" value={this.state.requestItems[index].quantity} onChange={(e)=> {this.handleInputChange(e, index)}} type="number" className={"form-control"} />
                                                            </td>

                                                            <td className='request-cont-td'>
                                                                <input onKeyUp={(e) => {
                                                                    if(e.key === 'Enter'){
                                                                      this.addItem()
                                                                    }
                                                                }} name="price" value={this.state.requestItems[index].price} onChange={(e)=> {this.handleInputChange(e, index)}} type="number" className={"form-control"} />
                                                            </td>

                                                            <td className='request-cont-td'>
                                                                <Link to={"#"} className={`btn btn-sm btn-danger`} onClick={() => {

                                                                }}>X</Link>
                                                            </td>

                                                        </tr>)

                                                    })
                                                }


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
