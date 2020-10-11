import React, { useEffect, useState, useContext } from "react";
import Context, { UserContext } from "../context/context";
import { useRouter } from "next/router";
import Link from "next/link";
import Auth from "../auth";
import AllProduct from "../component/product/allProduct";
import Info from "../component/getInfo";
import Orders from "../component/userOrder";

export default function UserHome() {
  const router = useRouter();
  const [render, setRender] = useState("");
  const { role, loginStatus } = useContext(UserContext);

  const handleClick = (compName) => {
    setRender(compName);
  };

  const renderComp = () => {
    switch (render) {
      case "getinfo":
        return <Info />;
      case "product":
        return <AllProduct />;
      case "orders":
        return <Orders />;
      default:
        return <AllProduct />;
    }
  };
  const logout = () => {
    Auth.logout(() => {
      router.push("/login");
    });
  };
  return (
    <>
      <div className="header">
        <h3>Shoppy</h3>
        {role == "User" ? (
          <React.Fragment>
            <div className="right">
              <a
                onClick={() => {
                  handleClick("product");
                }}
              >
                Product
              </a>
              <div className="right">
                <a
                  onClick={() => {
                    handleClick("orders");
                  }}
                >
                  Orders
                </a>
                <a
                  onClick={() => {
                    handleClick("getinfo");
                  }}
                >
                  Get Info
                </a>
                <a className="logout-btn" onClick={logout}>
                  Logout
                </a>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="right">
              <Link href="/login">
                <a className="login-btn">Login</a>
              </Link>
            </div>
          </React.Fragment>
        )}
      </div>
      {role == "User" ? <div className="body">{renderComp()}</div> : ""}
    </>
  );
}
