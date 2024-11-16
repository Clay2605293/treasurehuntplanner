import React, { useState } from "react";
import { generatePDFs } from "../utils/api";

const Form = ({ setEquipos }) => {
  const [numEquipos, setNumEquipos] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await generatePDFs(numEquipos);
    setEquipos(data.equipos);
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
