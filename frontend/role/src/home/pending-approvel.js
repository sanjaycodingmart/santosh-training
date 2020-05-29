import React from "react";
import "../assets/css/pending-approvel.css";

class PendingApprovel extends React.Component {
  constructor() {
    super();
  }
  // componentWillMount() {
  //   if (localStorage.count == 1) {
  //     window.location.reload();
  //   }
  //   localStorage.setItem("count", 2);
  // }
  render() {
    return (
      <div className="section">
        <div className="content">
          <h1>PendingApprovel</h1>
          <p>
            We are waiting on ours admin to let you into the portal.you can
            access the portal once approved
          </p>
          <br />
          <span>
            Support email :{" "}
            <a
              href="mailto:ceo@codingmart.com?subject=PendingApprovel&body=We are waiting on ours admin to let you into the portal.you can
            access the portal once approved"
            >
              ceo@codingmart.com
            </a>
          </span>
        </div>
      </div>
    );
  }
}

export default PendingApprovel;
