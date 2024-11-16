const express = require("express");
const { generarPDFs } = require("../controllers/pdfController");

const router = express.Router();

// Ruta para generar PDFs
router.post("/generate", generarPDFs);

module.exports = router;
