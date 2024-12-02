import React, { useState } from "react";
import { generatePDFs } from "../utils/api";

const Form = ({ setEquipos }) => {
  const [numEquipos, setNumEquipos] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await generatePDFs(numEquipos);

      if (data && data.pdfPaths && data.pdfPaths.length > 0) {
        setEquipos(data.pdfPaths); // Actualiza el estado con las rutas de los PDFs
      } else {
        console.error("La respuesta del servidor no contiene pdfPaths:", data);
        alert("Hubo un problema al generar los caminos. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al generar los PDFs:", error);
      alert("No se pudo conectar con el servidor. Revisa tu conexión.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="numEquipos">Número de Equipos:</label>
      <input
        type="number"
        id="numEquipos"
        value={numEquipos}
        onChange={(e) => setNumEquipos(e.target.value)}
        required
        min="1"
      />
      <button type="submit">Generar Caminos</button>
    </form>
  );
};

export default Form;
