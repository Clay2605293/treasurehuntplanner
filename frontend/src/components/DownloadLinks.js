import React from "react";

const DownloadLinks = ({ equipos }) => {
  return (
    <div className="download-links">
      <h3>Descarga los PDFs generados:</h3>
      <ul>
        {equipos.map((equipo, index) => (
          <li key={index} className="download-item">
            {equipo.equipo === "Control" ? (
              <>
                <strong>Archivo de Control:</strong>{" "}
                <a
                  href={`http://localhost:5001${equipo.path}`}
                  download="Control.pdf"
                  className="download-link"
                >
                  Descargar PDF
                </a>
              </>
            ) : (
              <>
                <strong>Equipo {equipo.equipo}:</strong>{" "}
                <a
                  href={`http://localhost:5001${equipo.path}`}
                  download={`Equipo_${equipo.equipo}.pdf`}
                  className="download-link"
                >
                  Descargar PDF
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DownloadLinks;
