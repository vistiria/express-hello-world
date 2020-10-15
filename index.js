const express = require('express');
const server = express();

server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(3000, () => {
  console.log('Server listening at https://hdhanbo0rbquqrycpaphd.js.wpenginepoweredstaging.com');
});