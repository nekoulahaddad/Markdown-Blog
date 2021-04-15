import React, { useState, useEffect } from "react";
import { Card, CardGroup, Nav } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { useStateValue } from "./StateProvider";
import { tokenConfig, returnErrors, tokenCheck } from "./actions";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";
import SearchFeature from "./SearchFeature";
import { USER_LOADING, USER_LOADED, AUTH_ERROR } from "./types";

export default function Landing() {
  const [articles, setArticles] = useState([]);
  const [Skip, setSkip] = useState(0);
  const Limit = 6;
  const [PostSize, setPostSize] = useState();
  const [state, dispatch] = useStateValue();

  const { user } = state;

  useEffect(() => {
    loadUser();
    const variables = {
      skip: Skip,
      limit: Limit,
    };

    getArticles(variables);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



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



  const deleteArticle = (id) => {
    axios
      .delete(`/articles/${id}`, tokenConfig())
      .then((res) => {
        setArticles(articles.filter((article) => article._id !== id));
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

  const onDeleteClick = (id) => {
    deleteArticle(id);
  };

  const getArticles = (variables) => {
    axios.post("/articles/getPosts", variables).then((response) => {
      if (response.data.success) {
        if (variables.loadMore) {
          setArticles([...articles, ...response.data.articles]);
        } else {
          setArticles(response.data.articles);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("Failed to fectch product datas");
      }
    });
  };

  const onLoadMore = () => {
    let skip = Skip + Limit;
    const variables = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    };
    getArticles(variables);
    setSkip(skip);
  };

  const updateSearchTerms = (newSearchTerm) => {
    const variables = {
      skip: 0,
      limit: Limit,
      searchTerm: newSearchTerm,
    };

    setSkip(0);
    getArticles(variables);
  };

  return (
    <div>
      <div className="m-3">
        <SearchFeature refreshFunction={updateSearchTerms} />
      </div>
      <CardGroup>
        {articles
          ? articles.map((article, index) => (
              <Col key={article._id} md="4" sm="12">
                <LinkContainer to={`article/${article.slug}`}>
                  <Nav.Link>
                    <Card.Img
                      className="card-image"
                      variant="top"
                      src={article.images[0]}
                    />
                  </Nav.Link>
                </LinkContainer>

                <Card.Body>
                  <LinkContainer to={`article/${article.slug}`}>
                    <Nav.Link>
                      <Card.Title className="text-info">
                        {article.title.slice(0, 50)}{" "}
                        {article.title.length > 50 ? <span>....</span> : null}
                      </Card.Title>
                    </Nav.Link>
                  </LinkContainer>

                  <Card.Text className="ml-3">
                    {article.description.slice(0, 100)} ...
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Last updated
                    {article.date ? (
                      <span className="ml-1">
                        <ReactTimeAgo date={article.date} locale="en" />
                      </span>
                    ) : null}
                    <i className="ml-3 fa fa-eye">
                      <span className="ml-1">{article.views}</span>
                    </i>
                  </small>
                  {user && user.admin ? (
                    <span>
                      <button
                        id="d-cart"
                        className="fa fa-trash ml-2 p-1"
                        onClick={() => onDeleteClick(article._id)}
                      ></button>

                      <Link to={`/updateArticle/${article.slug}`}>
                        <i className="ml-2 fa fa-edit text-dark d-inline-block"></i>
                      </Link>
                    </span>
                  ) : null}
                </Card.Footer>
              </Col>
            ))
          : null}
      </CardGroup>
      {PostSize >= Limit ? (
        <div className="text-center mt-5">
          <button className="loadmore-button" onClick={onLoadMore}>
            Load More Articles
          </button>
        </div>
      ) : null}
    </div>
  );
}
