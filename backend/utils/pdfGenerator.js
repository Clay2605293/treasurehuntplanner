const path = require("path");
const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");

const generarCaminosYpistas = (numEquipos) => {
  const lugares = ["Cafetería", "Expreso Tec", "Biblioteca", "Cápsula del tiempo", "Residencias"];
  const tiposDePistas = ["Fotos", "Braile", "Coordenadas de GPS", "Frases"];

  const equipos = [];

  for (let i = 0; i < numEquipos; i++) {
    const camino = [...lugares].sort(() => Math.random() - 0.5); // Mezclar lugares

    // Garantizar al menos una pista de cada tipo
    let pistas = ["Fotos", "Braile", "Coordenadas de GPS", "Frases"];

    // Seleccionar una pista adicional al azar entre Braile, GPS o Frases
    const pistaExtraOpciones = ["Braile", "Coordenadas de GPS", "Frases"];
    const pistaExtra = pistaExtraOpciones[Math.floor(Math.random() * pistaExtraOpciones.length)];
    pistas.push(pistaExtra);

    // Mezclar las pistas, asegurando que "Fotos" no se repita
    pistas = pistas.sort(() => Math.random() - 0.5);

    // Agregar al equipo
    equipos.push({ equipo: i + 1, camino, pistas });
  }

  return equipos;
};

const formarPalabraBraille = async (palabra) => {
  const imagenes = [];
  const braillePath = path.join(__dirname, "../../frontend/src/pistas/braile");

  for (const letra of palabra.toLowerCase()) {
    const imgPath = path.join(braillePath, `${letra}.png`);
    if (fs.existsSync(imgPath)) {
      const img = fs.readFileSync(imgPath);
      imagenes.push(img);
    } else {
      console.error(`No se encontró la imagen para la letra: ${letra}`);
      throw new Error(`No se encontró la imagen para la letra: ${letra}`);
    }
  }

  return imagenes;
};

const nombreArchivos = {
  "Cafetería": "cafe",
  "Expreso Tec": "expreso",
  "Biblioteca": "biblio",
  "Cápsula del tiempo": "capsula",
  "Residencias": "resis",
};

const wrapText = (text, maxWidth, font, fontSize) => {
  const lines = [];
  let currentLine = "";

  text.split(" ").forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (textWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);

  return lines;
};

const generarPDF = async (equipo) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontPath = "/System/Library/Fonts/Supplemental/Arial.ttf";
  const fontBytes = fs.readFileSync(fontPath);
  const arialFont = await pdfDoc.embedFont(fontBytes);

  let page = pdfDoc.addPage([600, 800]);
  const margin = 50; // Márgenes superiores e inferiores
  let y = 750;

  console.log(`Generando PDF para el equipo ${equipo.equipo}`);
  page.drawText(`Equipo ${equipo.equipo}`, { x: margin, y, size: 20, font: arialFont, color: rgb(0, 0, 0) });
  y -= 50;

  for (let i = 0; i < equipo.camino.length; i++) {
    if (y < margin + 100) { // Comprobación ajustada para incluir margen inferior
      page = pdfDoc.addPage([600, 800]);
      y = 750;
    }

    const pistaNumero = `Pista ${i + 1}`;
    const lugar = equipo.camino[i];
    const pista = equipo.pistas[i];
    const nombreArchivo = nombreArchivos[lugar];

    page.drawText(`${pistaNumero}`, { x: margin, y, size: 14, font: arialFont });
    y -= 20;

    if (pista === "Braile") {
      const palabra = nombreArchivo;
      const imagenes = await formarPalabraBraille(palabra);

      let x = margin;
      for (const img of imagenes) {
        const pngImage = await pdfDoc.embedPng(img);
        const pngDims = pngImage.scale(0.3);
        if (x + pngDims.width > 550) {
          x = margin;
          y -= pngDims.height + 10;
        }
        page.drawImage(pngImage, { x, y: y - 30, width: pngDims.width, height: pngDims.height });
        x += pngDims.width + 10;
      }
      y -= 70;
    } else if (pista === "Fotos") {
      const imgPath = path.join(__dirname, `../../frontend/src/pistas/fotos/${nombreArchivo}.jpeg`);
      if (fs.existsSync(imgPath)) {
        const img = fs.readFileSync(imgPath);
        const jpegImage = await pdfDoc.embedJpg(img);
        const jpegDims = jpegImage.scale(0.15);
        page.drawImage(jpegImage, { x: margin, y: y - jpegDims.height - 10, width: jpegDims.width, height: jpegDims.height });
        y -= jpegDims.height + 40;
      } else {
        console.error(`No se encontró la imagen para: ${imgPath}`);
        y -= 20;
      }
    } else if (pista === "Frases" || pista === "Coordenadas de GPS") {
      const tipoArchivo = pista === "Frases" ? "frases" : "GPS";
      const archivoPath = path.join(__dirname, `../../frontend/src/pistas/${tipoArchivo}/${nombreArchivo}.txt`);
      if (fs.existsSync(archivoPath)) {
        const texto = fs.readFileSync(archivoPath, "utf-8");
        const wrappedText = wrapText(texto, 500, arialFont, 12);
        wrappedText.forEach((line, index) => {
          page.drawText(line, { x: margin, y: y - index * 14, size: 12, font: arialFont });
        });
        y -= wrappedText.length * 14 + 30;
      } else {
        console.error(`No se encontró el archivo de texto: ${archivoPath}`);
        y -= 20;
      }
    }
  }

  return await pdfDoc.save();
};

const generarControlPDF = async (equipos) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontPath = "/System/Library/Fonts/Supplemental/Arial.ttf";
  const fontBytes = fs.readFileSync(fontPath);
  const arialFont = await pdfDoc.embedFont(fontBytes);

  let page = pdfDoc.addPage([600, 800]);
  const margin = 50; // Márgenes superiores e inferiores
  let y = 750;

  page.drawText("Control de Equipos", { x: margin, y, size: 20, font: arialFont });
  y -= 50;

  for (const equipo of equipos) {
    if (y < margin + 50) { // Comprueba si hay suficiente espacio antes de añadir el siguiente equipo
      page = pdfDoc.addPage([600, 800]);
      y = 750; // Reinicia la posición en la nueva página
    }

    // Dibujar encabezado del equipo
    page.drawText(`Equipo ${equipo.equipo}`, { x: margin, y, size: 16, font: arialFont });
    y -= 30;

    equipo.camino.forEach((lugar, index) => {
      if (y < margin + 20) { // Comprueba si hay suficiente espacio antes de añadir la siguiente pista
        page = pdfDoc.addPage([600, 800]);
        y = 750;
      }
      // Dibujar las pistas
      page.drawText(`Pista ${index + 1}: ${lugar}`, { x: margin + 20, y, size: 14, font: arialFont });
      y -= 20;
    });

    y -= 30; // Espacio extra entre equipos
  }

  return await pdfDoc.save();
};


module.exports = { generarCaminosYpistas, generarPDF, generarControlPDF };
