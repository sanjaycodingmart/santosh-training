import React from "react";
import { UserConsumer } from "../context/context";

export default function GetInfo() {
  return (
    <React.Fragment>
      <h2>Your Info : </h2>
      <UserConsumer>
        {(user) => {
          return (
            <div className="get-info">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.role}</p>
            </div>
          );
        }}
      </UserConsumer>
    </React.Fragment>
  );
}
