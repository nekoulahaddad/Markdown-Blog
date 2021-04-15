import React, { useState } from "react";
import axios from "axios";
import Progress from "./Progress";
import { useStateValue } from "./StateProvider";
import { Col, Row, Form, FormGroup, Alert } from "react-bootstrap";
import { tokenConfig, returnErrors } from "./actions";

export default function AddArticle() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [selectedFile, setSelectedFile] = useState(0);
  const [images, setImages] = useState([]);
  const [markdown, setMarkdown] = useState("");
  const [category, setCategory] = useState("Programming");

  const [state, dispatch] = useStateValue();

  const { isAuthenticated, user } = state;

  const onChangeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    document.getElementById("image-preview").src = window.URL.createObjectURL(
      event.target.files[0]
    );
  };

  const onClickHandler = () => {
    const data = new FormData();
    data.append("profileImage", selectedFile, selectedFile.name);
    const config = {
      headers: {
        accept: "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
        // Clear percentage
        setTimeout(() => setUploadPercentage(0), 10000);
      },
    };
    axios
      .post("/articles/profile-img-upload", data, config)
      .then((response) => {
        if (response.data.success) {
          setImages([...images, response.data.image]);
        }
      });
  };

  const AddPost = (article) => {
    axios
      .post("/articles/uploadPost", article, tokenConfig())
      .then((res) => console.log(res.data))
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const newArticle = {
      images: images,
      title: title,
      category: category,
      description: description,
      markdown: markdown,
    };

    // Add item via addItem action
    AddPost(newArticle);

    document.getElementById("create-item-form").reset();
    document.getElementById("image-preview").src =
      "https://via.placeholder.com/300x300";
    setSelectedFile(null);
    setImages([]);
  };

  //toString()

  return (
    <div>
      <div>
        {isAuthenticated && user.admin ? (
          <Form
            className="Add-article-form"
            onSubmit={onSubmit}
            id="create-item-form"
          >
            <FormGroup>
              <Col md="6" sm="12">
                <input
                  className="mb-2"
                  type="file"
                  name="file"
                  onChange={onChangeHandler}
                  id="create-file-form"
                />
              </Col>
              <Col md="6" sm="12" className="mb-2">
                <Progress percentage={uploadPercentage} />
              </Col>
              <Col md="6" sm="12">
                <img
                  alt="item"
                  className="img-fluid"
                  src="https://via.placeholder.com/300x300"
                  id="image-preview"
                />
              </Col>
              <br />
              <button
                type="button"
                className="mr-3 ml-3"
                onClick={onClickHandler}
              >
                Upload Image
              </button>
            </FormGroup>
            <Row>
              <Col>
                <FormGroup className="mr-3 ml-3">
                  <label className="mr-sm-2 mb-2">Article title</label>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    type="text"
                    name="name"
                    id="name"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3" className="mr-3 ml-3">
                <label className="mb-2">Category</label>
                <select
                  onChange={(e) => setCategory(e.target.value)}
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
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  type="textarea"
                  name="description"
                />
              </Col>
            </Row>
            <Row>
              <Col md="11" sm="4" className="ml-3 mr-3">
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label className="mb-2">Example textarea</Form.Label>
                  <Form.Control
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="Add-article-textarea"
                    as="textarea"
                    rows={20}
                  />
                </Form.Group>
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
