import "../styles/index.css";
import "../styles/home.css";
import "../styles/product.css";
import "../styles/pending-approvel.css";
import Context from "./context/context";
import Auth from "./auth";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/context";
import ProtectRouter from "./router/protectRouter";

function MyApp({ Component, pageProps }) {
  // const { role, loginStatus } = useContext(UserContext);
  // console.log(loginStatus);
  // useEffect(() => {
  // })
  // console.log(pageProps);
  return (
    <Context>
      <ProtectRouter component={Component} pageProps={pageProps} />
      
    </Context>
  );
}

export default MyApp;
