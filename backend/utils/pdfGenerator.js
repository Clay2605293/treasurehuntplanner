const generarCaminosYpistas = (numEquipos) => {
    const lugares = ["Cafetería", "Expreso Tec", "Biblioteca", "Cápsula del tiempo", "Residencias"];
    const tiposDePistas = ["Frases", "Fotos", "Coordenadas de GPS", "Braile"];
    const equipos = [];
  
    for (let i = 0; i < numEquipos; i++) {
      const camino = [...lugares].sort(() => Math.random() - 0.5); // Mezclar lugares
  
      // Generar las pistas
      const pistasDisponibles = [...tiposDePistas, tiposDePistas[Math.floor(Math.random() * tiposDePistas.length)]]; // Añadir una repetida
      const pistas = pistasDisponibles.sort(() => Math.random() - 0.5); // Mezclar las pistas
  
      equipos.push({ equipo: i + 1, camino, pistas });
    }
  
    return equipos;
  };
  
  module.exports = { generarCaminosYpistas };
  