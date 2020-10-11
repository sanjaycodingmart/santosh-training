import React from "react";

export default function PendingApprovel() {
  return (
    <div className="section">
      <div className="content">
        <h1>PendingApprovel</h1>
        <p>
          We are waiting on ours admin to let you into the portal.you can access
          the portal once approved
        </p>
        <br />
        <span>
          Support email :{" "}
          <a
            className="mail"
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
