import React, { Component } from 'react';
import Toast from 'react-bootstrap/Toast';
//import { MDBNotification } from "mdbreact";

export default class Alert extends Component {

  state = {
    show: false,
    message: "",
    iconClassName: "",
    title: "",
    icon: "",


  };


  componentWillReceiveProps(nextProps) {
    console.log("recieved prop", nextProps.alertData);
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.alertData.show !== this.state.show) {
      console.log("status prop", nextProps.alertData.show);
      this.setState({ show: nextProps.alertData.show,title:nextProps.alertData.title,message:nextProps.alertData.message });
    }
  }

  closeAlert = () => {
    this.setState({ show:false});
  }

  render() {
    //const isLoading = this.state.isLoading;
    return (
      
        <Toast
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex:1000
          }}
          className="text-success"
          show={this.state.show}
          autohide
          delay={3000}
          onClose={this.closeAlert}
        >
          <Toast.Header className="text-success">
            <i className="fas fa-trash-alt mr-1"></i>
            <strong className="mr-auto">{this.state.title}</strong>
            <small></small>
          </Toast.Header>
          <Toast.Body>{this.state.message}</Toast.Body>
        </Toast>
     
    );
  }
}


