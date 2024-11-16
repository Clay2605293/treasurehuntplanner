const { generarCaminosYpistas } = require("../utils/pdfGenerator");
const fs = require("fs");

const generarPDFs = async (req, res) => {
  try {
    const { numEquipos } = req.body;

    // Validar entrada
    if (!numEquipos || numEquipos <= 0) {
      return res.status(400).json({ message: "Número de equipos inválido" });
    }

    // Generar caminos y pistas
    const equipos = generarCaminosYpistas(numEquipos);

    // (Por ahora solo retornamos JSON para pruebas)
    return res.json({ equipos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al generar los PDFs" });
  }
};

module.exports = { generarPDFs };
