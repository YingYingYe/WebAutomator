const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));

app.use(`/api`, require('./api/cridb'));
app.use(`/db`, require('./api/db'));
app.use('/auth', require('./api/auth'));
app.use('/importexcel', require('./api/importexcel'));

// if (process.env.NODE_ENV === "production") {
//     console.log("production");
// }
app.use(express.static("client/build"));

server.listen(port, () => console.log(`Server is running on ${port}`));