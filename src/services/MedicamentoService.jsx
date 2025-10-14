import API from "../api/api.js";

export const registrarMedicamento = async (data) => {
  try {
    const res = await API.post("/medicamentos", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al registrar medicamento" };
  }
};

export const listarMedicamentos = async () => {
  const res = await API.get("/medicamentos");
  return res.data;
};