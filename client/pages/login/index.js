import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Auth from "../auth";

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePass = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Auth.userEmail = email;
    Auth.userPassword = password;
    Auth.login(() => {
      if (Auth.pendingStatus) router.push("/pendingApprovel");
      else router.push("home/" + Auth.role);
    });
  };

  return (
    <div className="section">
      <div className="form">
        <form onSubmit={(e) => handleSubmit(e)}>
          <h1>LOG IN</h1>
          <input
            className="box"
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            required
            onChange={(e) => handleChangeEmail(e)}
          />
          <br />

          <input
            className="box"
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            required
            onChange={(e) => handleChangePass(e)}
          />
          <br />
          <Link href="/password/forgot">
            <a className="right">forgotpassword</a>
          </Link>
          <br />
          <input
            type="submit"
            id="submitDetails"
            name="submitDetails"
            value="Submit"
          />
          <br />
          <p>Have not account yet?</p>
          <Link href="/signup">
            <a>Sign up</a>
          </Link>
        </form>
      </div>
    </div>
  );
}
