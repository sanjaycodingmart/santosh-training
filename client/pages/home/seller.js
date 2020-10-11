import React, { useEffect, useState, useContext } from "react";
import Context, { UserContext } from "../context/context";
import Link from "next/link";
import { useRouter } from "next/router";
import AddProduct from "../component/product/seller/addProduct";
import AllProduct from "../component/product/allProduct";
import Auth from "../auth";
import Info from "../component/getInfo";

export default function SellerHome() {
  const router = useRouter();
  const [render, setRender] = useState("");
  const { role, loginStatus } = useContext(UserContext);
  const handleClick = (compName) => {
    setRender(compName);
  };

  const renderComp = () => {
    switch (render) {
      //  case "product":
      //    return <UserProduct />;
      case "Add Product":
        return <AddProduct />;
      case "getinfo":
        return <Info />;
      default:
        return <AllProduct />;
    }
  };

  const logout = () => {
    // console.log("logout");
    Auth.logout(() => {
      router.push("/login");
    });
  };

  return (
    <>
      <div className="header">
        <h3>Shoppy</h3>
        {role == "Seller" ? (
          <React.Fragment>
            <div className="right">
              <a
                onClick={() => {
                  handleClick("product");
                }}
              >
                Product
              </a>
              <a
                onClick={() => {
                  handleClick("getinfo");
                }}
              >
                Get Info
              </a>
              <a
                onClick={() => {
                  handleClick("Add Product");
                }}
              >
                Add Product
              </a>

              <a className="logout-btn" onClick={logout}>
                Logout
              </a>
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
      {role == "Seller" ? <div className="body">{renderComp()}</div> : ""}
    </>
  );
}
