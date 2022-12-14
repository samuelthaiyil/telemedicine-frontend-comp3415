import axios from "axios";
import { Navigate } from "react-router-dom";
import userService from "./userService";

const API_URL = "http://localhost:8080/api/";

//Auth service class for various authoization functions
class AuthService {
  login(email, password) {
    return axios
      .post(
        API_URL + "login",
        new URLSearchParams({
          email,
          password,
        })
      )
      .then((response) => {
        let token = response.data.access_token;
        localStorage.setItem("SavedToken", "Bearer " + token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        this.setUser();
      });
  }

  setUser = async () => {
    const result = await userService.getUser();
    console.log(result);
    localStorage.setItem("user", JSON.stringify(result.data));
    window.location.reload();
  };

  logout() {
    localStorage.clear();
    Navigate("/");
  }

  registerPatient(name, email, address, dob, phoneNumber, password) {
    return axios.post(API_URL + "patient", {
      name,
      email,
      address,
      dob,
      phoneNumber,
      password,
    });
  }

  registerHospital(name, email, address, phoneNumber, password) {
    return axios.post(API_URL + "hospital", {
      name,
      email,
      address,
      phoneNumber,
      password,
    });
  }

  getCurrentUser() {
    return localStorage.getItem("user");
  }
}

export default new AuthService();
