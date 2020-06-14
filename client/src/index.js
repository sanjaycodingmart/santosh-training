import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import history from "./history";
import { Router } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import Context from "./Containers/Context/Context";


ReactDOM.render(
  <Context>
  <Router history={history}>
    <App />
    </Router>
  </Context>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();