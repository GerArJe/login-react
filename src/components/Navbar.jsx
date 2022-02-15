import React from "react";
import { Link, NavLink } from "react-router-dom";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Navbar = ({ firebaseUser }) => {
  let navigate = useNavigate();
  const cerrarSesion = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };
  return (
    <div className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        AUTH
      </Link>
      <div>
        <div className="d-flex">
          <NavLink className="btn btn-dark" to="/">
            Inicio
          </NavLink>

          {firebaseUser != null && (
            <NavLink className="btn btn-dark mx-2" to="/admin">
              Admin
            </NavLink>
          )}

          {firebaseUser != null ? (
            <button className="btn btn-dark" onClick={() => cerrarSesion()}>
              Cerrar sesión
            </button>
          ) : (
            <NavLink className="btn btn-dark" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
