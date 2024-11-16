import axios from "axios";

const API_URL = "http://localhost:5001/api/pdf";

export const generatePDFs = async (numEquipos) => {
  const response = await axios.post(`${API_URL}/generate`, { numEquipos });
  return response.data;
};
