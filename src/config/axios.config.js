import axios from "axios";
export const burl = 'http://localhost:5000/'
axios.defaults.baseURL = burl;

const instance = axios.create({
  baseURL: axios.defaults.baseURL,
  timeout: 0,
});

export default instance;