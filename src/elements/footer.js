import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import TitleComponent from "../pages/title";


export default class Footer extends Component {

    constructor(props) {
        super(props);
        this.handleClickLogout = this.handleClickLogout.bind(this)
    }

    state = {
        toDashboard: false,
    };

    handleClickLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.setItem('isLoggedIn', false);
        this.setState({ toDashboard: true });
    }

    render() {
        if (this.state.toDashboard === true) {
            return <Redirect to='/' />
        }
        return (
            <footer className="sticky-footer">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright © Your Website <div>{(new Date().getFullYear())}</div></span>
                    </div>
                </div>
            </footer>
        );
    }
}
