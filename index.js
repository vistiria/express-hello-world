const express = require('express');
const server = express();
const port = process.env.PORT || 8080;

const fs = require('fs');
const path = require('path');
const merge = require('./code-challenge/merge');

server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.get('/code-challenge', async (req, res) => {
  try {
    const outputFile = path.resolve(process.cwd(), './code-challenge/output.csv');

    await merge({
      outputFile,
      inputFile: path.resolve(process.cwd(), './code-challenge/input.csv'),
    });

    const fileContent = fs.readFileSync(outputFile).toString();
    res.send(fileContent);
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
});

server.listen(port, () => {
  console.log(`Server listening at http://hdhanbo0rbquqrycpaphd.js.wpenginepoweredstaging.com (port: ${port})`);
});