const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const route = require('./routes');

app.use(express.static(path.join(__dirname + '/public')));

//templates ejs

app.set("view engine", "ejs");
app.set("views", "./src/resources/views");

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
