import axios from "axios";

const TOKEN_NAME = "bhc_token"
const USER="bhc_user"
const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

const getToken = () => {
  return localStorage.getItem(TOKEN_NAME);
};

const setToken = (token) => {
  localStorage.setItem(TOKEN_NAME, token);
};

const getUser=()=>{
  return localStorage.getItem(USER);
}

const setUser = (user)=> {
  localStorage.setItem(USER,user);
}
export default API;
export { getToken, setToken, getUser, setUser };
