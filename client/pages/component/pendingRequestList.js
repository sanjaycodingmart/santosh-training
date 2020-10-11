import React, { useEffect, useState } from "react";

export default function PendingRequstList() {
  const [listUser, setUser] = useState([]);
  const getList = async () => {
    try {
      const response = await fetch(
        process.env.DOMAIN + "user/pendingapprovel",
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const arr = [];
      for (var i = 0; i < data.emaillist.length; i++) {
        arr.push(data.emaillist[i].email);
      }
      setUser(arr);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  const acceptreject = async (email, status) => {
    try {
      const response = await fetch(process.env.DOMAIN + "user/acceptreject", {
        method: "post",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          status: status,
        }),
      });
      const data = await response.json();
      if (data.status) {
        alert(data.status);
        setUser(listUser.filter((item) => item != email));
      } else {
        alert("Try again");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="PendingRequstList">
      <p>PendingRequstList</p>
      <div className="table">
        <table>
          <thead>
            <tr key="thead">
              <th>User Mail</th>
              <th>Accept</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody key="tbody">
            {listUser.map((item) => (
              <tr key={item}>
                <td>{item}</td>
                <td>
                  <a onClick={() => acceptreject(item, "Accept")}>Accept</a>
                </td>
                <td>
                  <a onClick={() => acceptreject(item, "reject")}>Reject</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
