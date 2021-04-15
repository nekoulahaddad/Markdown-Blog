const express = require("express");
const mongoose = require("mongoose");
const articles = require("./routes/articles");
const auth = require("./routes/auth");
const path = require('path');
const cors = require('cors');
const PORT = require("./config/index").PORT

const app = express();

const db = require("./config/index").MONGO_URI
//`${MONGO_URI}/${MONGO_DB_NAME}`;

app.use(express.json());

mongoose
    .connect(db, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true})
    .then(() => console.log("the database is ready to use ..."))
    .catch((err) => console.log(err));

app.use("/articles", articles);
app.use("/auth", auth);
//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client

app.use(cors()) // hie mnshan ma yetla3 cors errors (7eyalla sha5es ye2der yfoot 3la al api)



if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}




const port = PORT || 5000;

app.listen(port, () => {
    console.log(`every thing is okk ...${port} ${process.env.NODE_ENV}`);
});