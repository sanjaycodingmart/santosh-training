import React, { useContext, useState } from "react";
import Context, { UserContext } from "../context/context";
import Link from "next/link";
import { useRouter } from "next/router";
import AllProduct from "../component/product/allProduct";
import PendingRequstList from "../component/pendingRequestList";
import AddAdmin from "../component/admin/addAdmin";
import Auth from "../auth";
import Info from "../component/getInfo";

export default function AdminHome() {
  const router = useRouter();
  const [render, setRender] = useState("");
  const { role, loginStatus } = useContext(UserContext);
  const handleClick = (compName) => {
    setRender(compName);
  };

  const renderComp = () => {
    switch (render) {
      case "pendingUser":
        return <PendingRequstList />;
      case "addAdmin":
        return <AddAdmin />;
      case "getinfo":
        return <Info />;
      case "product":
        return <AllProduct />;
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
        <h3>Shoppy {loginStatus}</h3>
        {role == "Admin" ? (
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
                  handleClick("addAdmin");
                }}
              >
                Add Admin
              </a>
              <a
                onClick={() => {
                  handleClick("pendingUser");
                }}
              >
                Pending user
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
      {role == "Admin" ? <div className="body">{renderComp()}</div> : ""}
    </>
  );
}
