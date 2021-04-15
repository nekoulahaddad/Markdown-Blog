import React, { useState, useEffect } from "react";
import "./Sign.css";
import { Alert } from "react-bootstrap";
import { clearErrors, returnErrors } from "./actions";
import { useStateValue } from "./StateProvider";
import axios from "axios";
import { REGISTER_SUCCESS, REGISTER_FAIL } from "./types";

export default function SignUp(props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);

  const [state, dispatch] = useStateValue();

  const { error_msg, error_id, isAuthenticated } = state;

  useEffect(() => {
    if (error_id && error_id === "REGISTER_FAIL") {
      setMsg(error_msg.msg);
    } else {
      setMsg(null);
    }
    if (isAuthenticated) {
      props.history.push("/");
    }
  }, [error_id, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const register = ({ name, email, password }) => {
    //note : ({name,email,password}) mo (name,email,password) y3nee jbton k object mnshan heek t7t 7awalton l json

    const config = {
      //it always used when post a form,cuz in forms we use json/ and in the data base the data schema is a json
      headers: {
        "content-type": "application/json",
      },
    };
    const body = JSON.stringify({ name, email, password }); // 7awalet l json .. l2n 2na fo2 3amel {}

    axios
      .post("/auth/signup", body, config) // note : hon 2na jebet al config mo al tokenconfig
      .then((res) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(
          returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
        );
        dispatch({
          type: REGISTER_FAIL,
        });
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const User = {
      name,
      email,
      password,
    };
    register(User);
    dispatch(clearErrors());
  };

  return (
    <div>
      <div>
        {msg ? (
          <Alert className="text-center" variant="info">
            {msg}
          </Alert>
        ) : null}
      </div>
      <div className="login-box">
        <form>
          <div className="segment">
            <h1>Sign up</h1>
          </div>
          <label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </label>
          <label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
          </label>
          <label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </label>
          <button className="light_blue" onClick={onSubmit} type="button">
            <i className="icon ion-md-lock"></i> Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
