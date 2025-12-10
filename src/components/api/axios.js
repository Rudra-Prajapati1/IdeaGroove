import axios from "axios";

const api = axios.create({
  baseURL: "https://api.mockman.online",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
