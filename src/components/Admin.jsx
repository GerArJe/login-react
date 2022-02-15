import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Firestore from "./Firestore";

const Admin = () => {
  let navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      console.log("Existe usuario");
      setUser(user);
    } else {
      console.log("No Existe usuario");
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div className="mt-5">
      <h2 className="text-center">Ruta protegida</h2>
      {user && <Firestore user={user} />}
    </div>
  );
};

export default Admin;
