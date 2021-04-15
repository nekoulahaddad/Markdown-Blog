import axios from "axios";
import { LOGOUT_SUCCESS, GET_ERRORS, CLEAR_ERRORS } from "./types";

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const returnErrors = (error_msg, error_status, error_id = null) => {
  return {
    type: GET_ERRORS,
    payload: { error_msg, error_status, error_id },
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

export const tokenConfig = () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  }
  return config;
};

export const tokenCheck = () => {
  const token = localStorage.getItem("token");

  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  }
};
