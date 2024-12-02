import axios from "axios";

export const generatePDFs = async (numEquipos) => {
  try {
    const response = await axios.post("http://localhost:5001/api/pdf/generate", {
      numEquipos: Number(numEquipos),
    });

    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      console.error("Respuesta inesperada del servidor:", response);
      throw new Error("Respuesta inesperada del servidor.");
    }
  } catch (error) {
    console.error("Error al llamar al backend:", error);
    throw error;
  }
};
