import React, { useState, useEffect } from "react";
import "./Sign.css";
import { Alert } from "react-bootstrap";
import { clearErrors, returnErrors } from "./actions";
import { useStateValue } from "./StateProvider";
import axios from "axios";
import queryString from "query-string";
import { LOGIN_SUCCESS, LOGIN_FAIL } from "./types";
import { useLocation } from "react-router-dom";

export default function SignIn(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [state, dispatch] = useStateValue();
  const { error_msg, error_id, isAuthenticated } = state;
  let location = useLocation();
  let { redirectTo } = queryString.parse(location.search);

  useEffect(() => {
    if (error_id && error_id === "LOGIN_FAIL") {
      setMsg(error_msg.msg);
    } else {
      setMsg(null);
    }
    if (isAuthenticated) {
      props.history.push(redirectTo == null ? "/" : redirectTo);
    }
  }, [error_id, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = ({ email, password }) => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });

    axios
      .post("/auth/signin", body, config)
      .then((res) => {
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch(
          returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
        );
        dispatch({ type: LOGIN_FAIL });
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const User = {
      email,
      password,
    };
    login(User);
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
            <h1>Sign In</h1>
          </div>

          <label>
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="light_blue" type="button" onClick={onSubmit}>
            <i className="icon ion-md-lock"></i> Log in
          </button>
        </form>
      </div>
    </div>
  );
}
