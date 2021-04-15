import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStateValue } from "./StateProvider";
import { Col, Row, Form, FormGroup, Alert } from "react-bootstrap";
import { tokenConfig, returnErrors } from "./actions";
import { useParams } from "react-router-dom";

export default function UpdateArticle() {
  const [article, setArticle] = useState(null);

  const [state, dispatch] = useStateValue();

  const { isAuthenticated, user } = state;
  let { slug } = useParams();

  useEffect(() => {
    getArticle(slug);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getArticle = (slug) => {
    axios
      .get(`/articles/${slug}`)
      .then((res) => setArticle(res.data))
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const newArticle = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      markdown: document.getElementById("markdown").value,
      id: article._id,
    };
    updateUser(newArticle);
  };

  const updateUser = ({ title, description, markdown, id }) => {
    const body = JSON.stringify({ title, description, markdown });
    axios
      .put(`/articles/editPost/${id}`, body, tokenConfig())
      .then((res) => console.log(res.data))
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

  return (
    <div>
      <div>
        {isAuthenticated && user.admin && article ? (
          <Form
            className="Add-article-form"
            onSubmit={onSubmit}
            id="create-item-form"
          >
            <Row>
              <Col>
                <FormGroup className="mr-3 ml-3">
                  <label className="mr-sm-2 mb-2">Article title</label>
                  <input
                    required
                    defaultValue={article.title}
                    type="text"
                    name="name"
                    id="title"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3" className="mr-3 ml-3">
                <label className="mb-2">Category</label>
                <select
                  className="mt-3 mb-3"
                  required
                  type="select"
                  name="category"
                >
                  <option>Python</option>
                  <option>Java Script</option>
                  <option>Frontend Development</option>
                  <option>Machine Learning</option>
                  <option>Web Developing</option>
                  <option>Backend Development</option>
                  <option>Bio Informatics</option>
                </select>
              </Col>
              <Col md="8" className="mr-3 ml-3">
                <label className="mb-2">Description</label>
                <input
                  required
                  defaultValue={article.description}
                  type="textarea"
                  name="description"
                  id="description"
                />
              </Col>
            </Row>
            <Row>
              <Col md="11" sm="4" className="ml-3 mr-3">
                <label className="mb-2">Article Content</label>
                <Form.Control
                  className="Add-article-textarea"
                  defaultValue={article.markdown}
                  id="markdown"
                  as="textarea"
                  rows={20}
                />
              </Col>
            </Row>
            <button className="mt-2 mr-3 ml-3">Submit</button>
          </Form>
        ) : (
          <div className="mt-3 text-center">
            <Alert variant="info">
              Sorry! you are not the admin to post an article
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
