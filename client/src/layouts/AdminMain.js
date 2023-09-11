import React, { Component } from 'react';
import Header from "../elements/header";
import Sidebar from "../elements/sidebar";
import Footer from "../elements/footer";

const AdminMain = ({ children }) => {
    return (
        <React.Fragment>
            <Header />
            <div id="wrapper">
              <Sidebar />
            
              <main className="container-fluid">{children}</main>
            </div>
            <Footer />
        </React.Fragment>
    );
};
export default AdminMain;