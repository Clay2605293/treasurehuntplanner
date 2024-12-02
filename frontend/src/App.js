import React, { useState } from "react";
import Form from "./components/Form";
import DownloadLinks from "./components/DownloadLinks";
import "./styles.css"; // Importa los estilos CSS

const App = () => {
  const [equipos, setEquipos] = useState([]);

  return (
    <div>
      <h1>Treasure Hunt</h1>
      <Form setEquipos={setEquipos} />
      {equipos.length > 0 ? (
        <DownloadLinks equipos={equipos} />
      ) : (
        <p className="placeholder">
          Ingresa un número de equipos y presiona "Generar Caminos".
        </p>
      )}
    </div>
  );
};

export default App;
