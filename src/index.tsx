import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import axios from 'axios';
import { SnackbarProvider } from 'notistack';

import App from './App';
import reportWebVitals from './reportWebVitals';

import 'normalize.css';

axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </LocalizationProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
