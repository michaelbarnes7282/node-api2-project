const express = require('express');

const server = express();

const dbRouter = require('./data/db-router')

server.use(express.json());

server.get('/', (req, res) => {
    res.json({ query: req.query, params: req.params, headers: req.headers });
});

server.use("/api/posts", dbRouter);

server.listen(8000, () => {
    console.log("\nServer Running on Port 8000\n");
});