import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import Inicio from "./components/Inicio";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { auth } from "./firebase";

function App() {
  const [firebaseUser, setFirebaseUser] = React.useState(false);
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
    });
  }, []);
  return firebaseUser !== false ? (
    <Router>
      <div className="container">
        <Navbar firebaseUser={firebaseUser} />
        <Routes>
          <Route path="/" element={<Inicio />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
        </Routes>
      </div>
    </Router>
  ) : (
    <div className="container">
      <p>Cargando...</p>
    </div>
  );
}

export default App;
