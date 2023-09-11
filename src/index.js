import './assets/vendor/fontawesome-free/css/all.min.css'
import './assets/css/sb-admin.css'
import './assets/css/dev.css'
// import './assets/vendor/jquery/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min';
// import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.min.css';

import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { BrowserRouter as Router,Routes,  Route, Switch } from 'react-router-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';
import AppRouter from "./AppRouter";




if (document.getElementById('app')) {
  console.log("hey")
    ReactDOM.render(<AppRouter />, document.getElementById('app'));
}

serviceWorker.unregister();
