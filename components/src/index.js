import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//const root = ReactDOM.createRoot(document.getElementById('root'));
//const rootElement = document.getElementById('root');
//const page = rootElement.getAttribute('data-page');
//const rootElement = document.querySelector('[data-page]');


const rootElement = document.getElementById('root-prestations') || document.getElementById('root-test') || document.querySelector('[data-page]');
const root = ReactDOM.createRoot(rootElement);

const page = rootElement.getAttribute('data-page');
console.log(page);
console.log(rootElement);
/*
root.render(
  <React.StrictMode>
    <App page={page}>{page}</App>
  </React.StrictMode>
);
*/
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    const page = rootElement.getAttribute('data-page');
    console.log(page);
    console.log(rootElement);

    root.render(
        <React.StrictMode>
            <App page={page}>{page}</App>
        </React.StrictMode>
    );
} else {
    console.error('Root element not found');
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
