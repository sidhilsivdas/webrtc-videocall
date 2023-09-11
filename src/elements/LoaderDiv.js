import React, { Component } from 'react';

export default class LoaderDiv extends Component {

    state = {
        isLoading: false
    };





    render() {
        //const isLoading = this.state.isLoading;
        return (

            <div className="loader">
                <div className="center-div">
                    <div className="loader-wheel"></div>
                    <div className="loader-text"></div>
                </div>
            </div>


        );
    }
}


