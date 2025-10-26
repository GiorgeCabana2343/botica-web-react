import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-node-botica-production.up.railway.app/api",
});

export default API;