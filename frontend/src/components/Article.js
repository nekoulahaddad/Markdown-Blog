import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { useStateValue } from "./StateProvider";
import { tokenConfig, returnErrors, tokenCheck } from "./actions";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import ReactMarkdown from "react-markdown";
import  gfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import avatar from "../assets/avatar.png";
import avatar2 from "../assets/avatar2.png";
import { useLocation, useParams } from "react-router-dom";
import { USER_LOADING, USER_LOADED, AUTH_ERROR } from "./types";

export default function Article(props) {
  const [article, setArticle] = useState(null);
  const [content, setContent] = useState("");
  const [Reply_content, setReply_content] = useState("");
  const adminImage =
    "https://sun9-75.userapi.com/impf/kYKjNGrZBKk6-X5KAYx4erQYbw1J_BNqHhcCfQ/cf0yNUPKNRc.jpg?size=937x1080&quality=96&sign=6f02b5702d8ad2d51a47559d6855b0cd&type=album";
  const adminId = "6069c612d417c7095023c7f3";
  const [state, dispatch] = useStateValue();

  const { isAuthenticated, user } = state;
  let location = useLocation();
  let { slug } = useParams();

  const renderers = {
    code: ({language, value}) => {
      return <SyntaxHighlighter style={dark} language={language} children={value} />
    }
  }


  useEffect(() => {
    loadUser();
    getArticle(slug);
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

  const addComment = (id, { content }) => {
    const body = JSON.stringify({ content });
    axios
      .post(`/articles/${id}/addComment`, body, tokenConfig())
      .then((res) => setArticle(res.data))
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

  const addReply = (id, _id, { Reply_content }) => {
    const body = JSON.stringify({ Reply_content });
    axios
      .post(`/articles/addReply/${id}?CommentId=${_id}`, body, tokenConfig())
      .then((res) => setArticle(res.data))
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

  const deleteComment = (id, _id) => {
    axios
      .delete(`/articles/deleteComment/${id}?CommentId=${_id}`, tokenConfig())
      .then((res) => setArticle(res.data))
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

  const getArticle = (slug) => {
    axios
      .get(`/articles/${slug}`)
      .then((res) => setArticle(res.data))
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

  const Comment = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      if (content) {
        addComment(article._id, { content });
        document.getElementById("comment").value = "";
        setContent("");
      }
    } else props.history.push(`/SignIn?redirectTo=${location.pathname}`);
  };

  const Reply = (id, _id) => {
    if (isAuthenticated) {
      if (Reply_content) {
        addReply(id, _id, { Reply_content });
        document.getElementById(_id + "123").value = "";
        setReply_content("");
      }
    } else props.history.push("/SignIn");
  };

  const DeleteComment = (id, _id) => {
    if (isAuthenticated) {
      deleteComment(id, _id);
    } else props.history.push("/SignIn");
  };

  return (
    <div className="container-fluid">
      {article ? (
        <div>
          <Row className="ml-2 mr-2 justify-content-md-center">
            <Col md="4" sm="12" className="align-self-center">
              {article.images.length > 0 ? (
                <img
                  className="card-image"
                  alt="article_image"
                  variant="top"
                  src={article.images[0]}
                />
              ) : null}
            </Col>

            <Col md="6" sm="12" className="align-self-center">
              <h4 className="text-info text-center">{article.title}</h4>
              <p>{article.description}</p>
              <div className="d-inline-block">
                <span className="blockquote-footer d-inline-block mr-2">
                  Last updated{" "}
                  {article.date ? (
                    <span>
                      <ReactTimeAgo date={article.date} locale="en" />
                    </span>
                  ) : null}
                  <i className="ml-3 fa fa-eye">
                    <span className="ml-1">{article.views}</span>
                  </i>
                </span>
                <span className="blockquote-footer mt-2">
                  {Math.ceil(article.markdown.length / 1000)} min read{" "}
                  <span className="category ml-1">{article.category}</span>{" "}
                </span>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col md="8" sm="12" className="mt-5">
              <div className="text-dark article-text">
                <ReactMarkdown renderers={renderers} plugins={[gfm]} children={article.markdown} />
              </div>
            </Col>
          </Row>
          <Row className="justify-content-md-center mt-4 mobile-author">
            <Col md="2" sm="4">
              <img
                className="my-image rounded-circle"
                alt="admin"
                variant="top"
                src={adminImage}
              />
            </Col>
            <Col md="4" sm="8" className="align-self-center">
              <p>WRITTEN BY</p>
              <h6 className="text-dark">NEKOULA HADDAD</h6>
              <p>Biotechnical engineer and full stack developer</p>
            </Col>
          </Row>
          <Row className="justify-content-md-center mt-3">
            <Col md="10" sm="12" className="comment-section mt-3 pt-5">
              <form onSubmit={(e) => Comment(e)} className="comment-form mb-2">
                <input
                  className="comment-input"
                  onChange={(e) => setContent(e.target.value)}
                  type="text"
                  id="comment"
                  placeholder="Add A Comment"
                />
                <button className="comment-button">
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
              </form>
            </Col>
          </Row>
          {article.comment.length > 0
            ? article.comment.map((comment) => (
                <div key={comment._id}>
                  <Row className="justify-content-md-center mt-2">
                    <Col md="10" sm="12">
                      <Row className="pl-3">
                        <p>
                          <img
                            alt="avatar"
                            className="image_comment"
                            src={avatar2}
                          />
                        </p>
                        <p className="d-inline-block comment-content">
                          <span className=" text-info ml-1 mr-1">
                            {comment.user}
                          </span>
                          {comment.content}
                        </p>
                      </Row>
                      <p className="time-comment">
                        {comment.date ? (
                          <span>
                            <ReactTimeAgo date={comment.date} locale="en" />
                          </span>
                        ) : null}{" "}
                        {(isAuthenticated && user.admin) ||
                        (isAuthenticated && user._id) === comment.authorId ? (
                          <span>
                            <button
                              onClick={() =>
                                DeleteComment(article._id, comment._id)
                              }
                              className="comment-button"
                            >
                              <i className="fa fa-trash mt-1"></i>
                            </button>
                          </span>
                        ) : null}
                      </p>
                    </Col>
                  </Row>
                  <Row className="justify-content-md-center">
                    <Col md="9" sm="4" className="ml-5">
                      {comment.replies.length > 0
                        ? comment.replies.map((reply, i) => (
                            <div key={i}>
                              <Row className="pl-3">
                                <p>
                                  {reply.authorId === adminId ? (
                                    <img
                                      alt="avatar"
                                      className="image_comment rounded-circle"
                                      src={adminImage}
                                    />
                                  ) : (
                                    <img
                                      alt="avatar"
                                      className="image_comment"
                                      src={avatar}
                                    />
                                  )}
                                </p>
                                <p className="d-inline-block comment-content ml-2">
                                  <span className=" text-info ml-1 mr-1">
                                    {reply.user}
                                  </span>
                                  {reply.content}
                                </p>
                              </Row>
                              <p className="time-comment ml-2">
                                {reply.date ? (
                                  <span>
                                    <ReactTimeAgo
                                      date={reply.date}
                                      locale="en"
                                    />
                                  </span>
                                ) : null}{" "}
                                {reply.authorId === adminId ? (
                                  <span className="category ml-1">
                                    {" "}
                                    Author{" "}
                                  </span>
                                ) : null}
                              </p>
                            </div>
                          ))
                        : null}
                      <div className="comment-form">
                        <img
                          alt="avatar"
                          className="image_comment"
                          src={avatar}
                        />
                        <input
                          className="comment-input"
                          onChange={(e) => setReply_content(e.target.value)}
                          type="text"
                          id={comment._id + "123"}
                          placeholder="Add A Reply"
                        />
                        <button
                          onClick={() => Reply(article._id, comment._id)}
                          className="comment-button"
                        >
                          <i
                            className="fa fa-paper-plane"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}
