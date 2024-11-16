import React from "react";

const DownloadLinks = ({ equipos }) => {
  return (
    <div>
      <h3>Resultados:</h3>
      <ul>
        {equipos.map((equipo, index) => (
          <li key={index}>
            <strong>Equipo {equipo.equipo}</strong>:
            <ul>
              {equipo.camino.map((lugar, idx) => (
                <li key={idx}>{lugar}</li>
              ))}
            </ul>
              Pistas: {equipo.pistas.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DownloadLinks;
