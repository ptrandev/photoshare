import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { SnackbarProvider } from 'notistack';
import { TokenProvider } from 'contexts/TokenContext';

import App from './App';
import reportWebVitals from './reportWebVitals';

import 'normalize.css';

ReactDOM.render(
  <React.StrictMode>
    <TokenProvider>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </TokenProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
