import React, { useEffect, useState } from "react";
import Auth from "../Auth/Auth";

export const UserContext = React.createContext();
const UserProvider = UserContext.Provider;
const UserConsumer = UserContext.Consumer;

export { UserConsumer, UserProvider };

export default (props) => {
  const [currentUserName, setName] = useState(null);
  const [currentUserEmail, setEmail] = useState(null);
  const [currentUserRole, setRole] = useState(null);
  const [isLogged, setLogged] = useState(false);

  useEffect(() => {
    Auth.authuser().then((body) => {
      setName(body.name);
      setEmail(body.email);
      setRole(body.role);
      setLogged(true);
    });
  }, []);
  return (
    <div>
      <UserProvider
        value={{
          name: currentUserName,
          email: currentUserEmail,
          role: currentUserRole,
          loginStatus: isLogged,
        }}
      >
        {props.children}
      </UserProvider>
    </div>
  );
};
