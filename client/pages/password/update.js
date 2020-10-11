import { useState } from "react";
import { useRouter } from "next/router";

export default function updatepassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleChangePass = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const getPath = router.asPath;
    const hash = getPath.split("=")[1];
    const response = await fetch(process.env.DOMAIN + "user/updatepassword", {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
        hashValue: hash,
      }),
    });
    const body = await response.json();
    alert(body.message);
  };

  return (
    <div className="section">
      <div className="form">
        <form onSubmit={(event) => handleSubmit(event)}>
          <h1>Password reset</h1>

          <input
            className="box"
            type="password"
            name="password"
            placeholder="password"
            required
            onChange={(e) => handleChangePass(e)}
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
