import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  let navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState(null);
  const procesarDatos = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Ingrese email");
      return;
    }

    setError(null);
    recuperar();
  };

  const recuperar = React.useCallback(async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  }, [email]);

  return (
    <div className="mt-5">
      <h3 className="text-center">Reiniciar contraseña</h3>
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

            <div className="d-grid gap-2">
              <button className="btn btn-dark btn-lg" type="submit">
                Reiniciar contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
