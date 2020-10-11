import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ViewProduct(props) {
  const router = useRouter();
  const getPath = router.asPath;
  const hash = getPath.split("=")[1];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [invite, setInvite] = useState(false);

  const inviteCheck = async () => {
    try {
      const response = await fetch(process.env.DOMAIN + "user/invitecheck", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hash: hash,
        }),
      });
      const data = await response.json();
      if (data.status == "success") {
        setInvite(true);
        setEmail(data.email);
      } else {
        alert("Not valid!!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    inviteCheck();
  }, []);

  const handleChangePass = (e) => {
    setPassword(e.target.value);
  };
  const handleChangename = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/user/inviteaccept", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
      }),
    });
    const data = await response.json();
    if (data.status) {
      router.push("/");
    } else {
      alert("Try again");
    }
  };

  return (
    <React.Fragment>
      {invite ? (
        <React.Fragment>
          <div className="section">
            <div className="form">
              <form onSubmit={(e) => handleSubmit(e)}>
                <h1>Admin</h1>

                <input
                  className="box"
                  type="text"
                  name="name"
                  value={name}
                  placeholder="Name"
                  onChange={(e) => handleChangename(e)}
                  required
                />

                <br />

                <input
                  className="box"
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => handleChangePass(e)}
                />

                <br />
                <br />
                <input
                  type="submit"
                  id="submitDetails"
                  name="submitDetails"
                  value="Submit"
                />
                <br />
              </form>
            </div>
          </div>
        </React.Fragment>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}
