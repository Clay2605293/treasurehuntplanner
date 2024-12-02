const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const pdfRoutes = require("./routes/pdfRoutes");
app.use("/api/pdf", pdfRoutes);
app.use("/temp", express.static(path.join(__dirname, "../temp"))); // Ajusta esta ruta si es necesario

// Servidor
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
