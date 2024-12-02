const { generarCaminosYpistas, generarPDF, generarControlPDF } = require("../utils/pdfGenerator");
const fs = require("fs");
const path = require("path");

const generarPDFs = async (req, res) => {
  try {
    const { numEquipos } = req.body;

    if (!numEquipos || isNaN(numEquipos) || numEquipos <= 0) {
      return res.status(400).json({ message: "Número de equipos inválido" });
    }

    const equipos = generarCaminosYpistas(numEquipos);

    // Verificar y crear la carpeta 'temp' si no existe
    const tempDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const pdfPaths = [];

    // Generar PDFs individuales para cada equipo
    for (const equipo of equipos) {
      const pdfBytes = await generarPDF(equipo);
      const filePath = path.join(tempDir, `Equipo_${equipo.equipo}.pdf`);

      // Guardar PDF como archivo
      fs.writeFileSync(filePath, pdfBytes);

      // Agregar la ruta del archivo a la respuesta
      pdfPaths.push({ equipo: equipo.equipo, path: `/temp/Equipo_${equipo.equipo}.pdf` });
    }

    // Generar el archivo de control
    const controlPDFBytes = await generarControlPDF(equipos);
    const controlFilePath = path.join(tempDir, "Control.pdf");

    // Guardar el archivo de control como archivo
    fs.writeFileSync(controlFilePath, controlPDFBytes);

    // Agregar el archivo de control a la respuesta
    pdfPaths.push({ equipo: "Control", path: "/temp/Control.pdf" });

    console.log("Respuesta del backend:", { equipos, pdfPaths });

    res.json({ equipos, pdfPaths }); // Devuelve un JSON con las rutas de los PDFs
  } catch (error) {
    console.error("Error al generar PDFs:", error);
    res.status(500).json({ message: "Error al generar los PDFs" });
  }
};

module.exports = { generarPDFs };
