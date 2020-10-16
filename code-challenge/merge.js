const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);

const csvParse = require('csv-parse');
const csvStringify = require('csv-stringify');
const { createReadStream, createWriteStream, existsSync } = require('fs');
const createFetchStream = require('./fetcher');

async function merge({ inputFile, outputFile }) {
  try {
    if (!inputFile) {
      throw new Error('Please provide input file!');
    }

    if (!outputFile) {
      throw new Error('Please provide output file!');
    }

    if (!existsSync(inputFile)) {
      throw new Error(`Input file ${inputFile} does not exist`);
    }

    await pipelineAsync(
      createReadStream(inputFile),
      csvParse({ columns: true }),
      createFetchStream({ host: 'http://interview.wpengine.io/v1' }),
      csvStringify({
        header: true,
        columns: ['Account ID', 'First Name', 'Created On', 'Status', 'Status Set On'],
      }),
      createWriteStream(outputFile)
    );

    if (process.env.NODE_ENV !== 'test') {
      console.log('Merging is completed!');
    }
  } catch (err) {
    throw err;
  }
}

module.exports = merge;
