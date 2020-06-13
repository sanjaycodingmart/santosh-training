import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Containers/Auth/Login";
import Signup from "./Containers/Auth/signup";
import Pendingapprovel from "./Containers/Home/PendingApprovel";
import AdminHome from "./Containers/Home/AdminHome";
import UserHome from "./Containers/Home/UserHome";
import SellerHome from "./Containers/Home/SellerHome";
import ProtectRoute from "./Containers/Router/ProtectRoute";
import  ViewProduct from './component/ViewProduct';
import Context from './Containers/Context/Context';

const NoMatch = () => {
  return <div>404</div>;
};

export default function App() {
  return (
    <Context>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />

        <ProtectRoute
          exact
          path="/admin"
          roles={["admin"]}
          component={AdminHome}
        />
        <ProtectRoute
          exact
          path="/user"
          roles={["user"]}
          component={UserHome}
        />
        <ProtectRoute
          exact
          path="/seller"
          roles={["seller"]}
          component={SellerHome}
        />
        <Route exact path="/pendingapprovel" component={Pendingapprovel} />
        <Route exact path="/product" component={ViewProduct}/>
        <Route component={NoMatch} />
      </Switch>
    </Context>
  );
}
