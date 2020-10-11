class Auth {
  constructor() {
    this.authenticateStatus = false;
    this.pendingStatus = false;
    this.role = null;
    this.name = "";
    this.userEmail = "";
    this.userPassword = "";
  }

  async login(cb) {
    // localStorage.clear();
    const [email, password] = [this.userEmail, this.userPassword];
    const response = await fetch(process.env.DOMAIN + "user/login", {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const body = await response.json();
    if (body.message === "success" && body.role === "User") {
      // localStorage.setItem("token", body.token);
      this.role = "user";
      //   history.push("/user");
      cb();
    } else if (body.message === "success" && body.role === "Admin") {
      // localStorage.setItem("token", body.token);
      this.role = "admin";
      //   history.push("/admin");
      cb();
    } else if (body.message === "success" && body.role === "Seller") {
      // localStorage.setItem("token", body.token);
      this.role = "seller";
      //   history.push("/seller");
      cb();
    } else if (
      body.message === "Approvel pending" &&
      body.status !== "reject"
    ) {
      // localStorage.setItem("redirect", "pendingapprovel");
      this.role = "pendingapprovel";
      this.pendingStatus = true;
      //   history.push("/pendingapprovel")
      cb();
    } else if (
      body.message === "Approvel pending" &&
      body.status === "reject"
    ) {
      alert("You're rejected by Admin!!!");
      this.role = "reject";
    } else {
      alert(body.message);
    }
  }

  async logout(cb) {
    // this.authenticateStatus = false;
    const response = await fetch(process.env.DOMAIN + "user/logout", {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const body = await response.json();
    if (body.status) {
      // alert(body.status);
      cb();
    } else {
      alert("logout failed");
    }
  }

  async authuser() {
    const response = await fetch(process.env.DOMAIN + "user/getinfo", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    // console.log(body);
    if (body.email) {
      this.name = body.name;
      this.authenticateStatus = true;
    }
    this.role = body.role.toLowerCase();
    return body;
  }
  isAuthenticate() {
    return this.authenticateStatus;
  }
}

export default new Auth();
