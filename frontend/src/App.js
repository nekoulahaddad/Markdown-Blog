import axios from "axios";
import React, { useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarMenu from "./components/NavbarMenu";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import Article from "./components/Article";
import UpdateArticle from "./components/UpdateArticle";
import AddArticle from "./components/AddArticle";
import { tokenCheck, returnErrors } from "./components/actions";
import { useStateValue } from "./components/StateProvider";
import { USER_LOADING, USER_LOADED, AUTH_ERROR } from "./components/types";

function App() {
  const [, dispatch] = useStateValue();

  const loadUser = () => {
    dispatch({ type: USER_LOADING });
    axios
      .get("/auth/user", tokenCheck())
      .then((res) => {
        dispatch({
          type: USER_LOADED,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: AUTH_ERROR,
        });
      });
  };

  useEffect(() => {
    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Router>
      <div className="App">
        <NavbarMenu />
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/article/:slug" exact component={Article} />
          <Route path="/signin" exact component={SignIn} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/AddArticle" exact component={AddArticle} />
          <Route path="/updateArticle/:slug" exact component={UpdateArticle} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
