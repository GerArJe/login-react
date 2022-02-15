import React from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [esRegistro, setEsRegistro] = React.useState(false);

  const procesarDatos = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Ingrese email");
      return;
    }

    if (!password.trim()) {
      setError("Ingrese password");
      return;
    }
    if (password.length < 6) {
      setError("Password de 6 caracteres o mas");
      return;
    }
    console.log("pasando todas las validaciones");
    setError(null);

    if (esRegistro) {
      registrar();
    } else {
      login();
    }
  };

  const login = React.useCallback(async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setError(null);
      navigate("/admin");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        setError("Usuario no encontrado");
      }
      if (error.code === "auth/wrong-password") {
        setError("Contraseña incorrecta");
      }
    }
  }, [email, password, navigate]);

  const registrar = React.useCallback(async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "usuarios", res.user.email), {
        email: res.user.email,
        uid: res.user.uid,
      });
      await await addDoc(collection(db, res.user.uid), {
        name: "Tarea de ejemplo",
        fecha: Date.now(),
      });
      setEmail("");
      setPassword("");
      setError(null);
      navigate("/admin");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/invalid-email") {
        setError("Email no valido");
      }
      if (error.code === "auth/email-already-in-use") {
        setError("Email ya utilizado");
      }
    }
  }, [email, password, navigate]);

  return (
    <div className="mt-5">
      <h3 className="text-center">{esRegistro ? "Registro" : "Login "}</h3>
      <hr />
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-xl-4">
          <form onSubmit={procesarDatos}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Ingrese un email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Ingrese un password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div className="d-grid gap-2">
              <button className="btn btn-dark btn-lg" type="submit">
                {esRegistro ? "Registrarse" : "Acceder"}
              </button>
              <button
                className="btn btn-info btn-sm"
                onClick={() => setEsRegistro(!esRegistro)}
                type="button"
              >
                {esRegistro ? "Ya tienes cuenta?" : "No tienes cuenta?"}
              </button>

              {!esRegistro && (
                <button
                  className="btn btn-danger btn-lg btn-sm mt-2"
                  type="button"
                  onClick={() => navigate("/reset")}
                >
                  Recuperar contraseña
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
