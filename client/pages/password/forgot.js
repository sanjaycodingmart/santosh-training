import { useState } from "react";

export default function forgotpassword() {
  const [email, setEmail] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(process.env.DOMAIN + "user/forgotpassword", {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    });
    const body = await response.json();
    alert(body.message);
  };

  return (
    <div className="section">
      <div className="form">
        <form onSubmit={(e) => handleSubmit(e)}>
          <h1>Forgot password</h1>

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
            type="submit"
            id="submitDetails"
            name="submitDetails"
            value="Submit"
          />
          <br />
        </form>
      </div>
    </div>
  );
}
