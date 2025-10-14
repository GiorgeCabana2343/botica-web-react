import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // tu backend Node corre aquí
});

export default API;