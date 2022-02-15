import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import { db } from "../firebase";
import moment from "moment";
import "moment/locale/es";

const Firestore = ({ user }) => {
  const [tareas, setTareas] = React.useState([]);
  const [tarea, setTarea] = React.useState("");
  const [modoEdicion, setModoEdicion] = React.useState(false);
  const [id, setId] = React.useState("");
  const [ultimo, setUltimo] = React.useState(null);
  const [desactivar, setDesactivar] = React.useState(false);

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setDesactivar(true);
        const q = query(collection(db, user.uid), limit(2), orderBy("fecha"));
        const data = await getDocs(q);
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUltimo(data.docs[data.docs.length - 1]);

        console.log(arrayData);
        setTareas(arrayData);

        const q2 = query(
          collection(db, user.uid),
          limit(2),
          orderBy("fecha"),
          startAfter(data.docs[data.docs.length - 1])
        );
        const data2 = await getDocs(q2);
        if (data2.empty) {
          console.log("no hay mas documentos");
          setDesactivar(true);
        } else {
          setDesactivar(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    obtenerDatos();
  }, [user.uid]);

  const siguiente = async () => {
    try {
      const q = query(
        collection(db, user.uid),
        limit(2),
        orderBy("fecha"),
        startAfter(ultimo)
      );
      const data = await getDocs(q);
      const arrayData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTareas([...tareas, ...arrayData]);
      setUltimo(data.docs[data.docs.length - 1]);

      const q2 = query(
        collection(db, user.uid),
        limit(2),
        orderBy("fecha"),
        startAfter(data.docs[data.docs.length - 1])
      );
      const data2 = await getDocs(q2);
      if (data2.empty) {
        console.log("no hay mas documentos");
        setDesactivar(true);
      } else {
        setDesactivar(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const agregar = async (e) => {
    e.preventDefault();

    if (!tarea.trim()) {
      console.log("está vacio");
      return;
    }

    try {
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      };
      const data = await addDoc(collection(db, user.uid), nuevaTarea);

      setTareas([...tareas, { ...nuevaTarea, id: data.id }]);

      setTarea("");
    } catch (error) {
      console.log(error);
    }

    console.log(tarea);
  };

  const eliminar = async (id) => {
    try {
      await deleteDoc(doc(db, user.uid, id));

      const arrayFiltrado = tareas.filter((item) => item.id !== id);
      setTareas(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };

  const activarEdicion = (item) => {
    setModoEdicion(true);
    setTarea(item.name);
    setId(item.id);
  };

  const editar = async (e) => {
    e.preventDefault();
    if (!tarea.trim()) {
      console.log("vacio");
      return;
    }
    try {
      await updateDoc(doc(db, user.uid, id), {
        name: tarea,
      });

      const arrayEditado = tareas.map((item) =>
        item.id === id ? { id: item.id, fecha: item.fecha, name: tarea } : item
      );
      setTareas(arrayEditado);
      setModoEdicion(false);
      setTarea("");
      setId("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <h3>Lista de tareas</h3>
          <ul className="list-group">
            {tareas.map((item) => (
              <li className="list-group-item" key={item.id}>
                {item.name} - {moment(item.fecha).format("LLL")}
                <button
                  className="btn btn-danger btn-sm float-end"
                  onClick={() => eliminar(item.id)}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-warning btn-sm float-end mx-2"
                  onClick={() => activarEdicion(item)}
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
          <div className="d-grid gap-2">
            <button
              className="btn btn-info mt-2 btn-sm"
              onClick={() => siguiente()}
              disabled={desactivar}
            >
              Siguiente
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <h3>{modoEdicion ? "Editar Tarea" : "Agregar Tarea"}</h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
            <input
              type="text"
              placeholder="Ingrese tarea"
              className="form-control mb-2"
              onChange={(e) => setTarea(e.target.value)}
              value={tarea}
            />
            <button
              className={
                modoEdicion
                  ? "btn btn-warning btn-block"
                  : "btn btn-dark btn-block"
              }
              type="submit"
            >
              {modoEdicion ? "Editar" : "Agregar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Firestore;
