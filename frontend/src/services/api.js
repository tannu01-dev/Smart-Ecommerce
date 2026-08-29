import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-ecommerce-site.onrender.com/api/api",
});

export default API;