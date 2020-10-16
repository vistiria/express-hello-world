const path = require('path');
const axios = require('axios');
const StreamTransform = require('stream-transform');

const createFetchStream = ({ host }) => {
  const transform = async (record, _encoding, done) => {
    const newRecord = { ...record, Status: '[NOT FOUND]', 'Status Set On': '[NOT FOUND]' };

    try {
      if (!record['Account ID']) {
        throw new Error('`Account ID` is not defined');
      }

      const accountUrl = host + path.join('/accounts', record['Account ID']);
      const { data } = await axios.get(accountUrl);

      if (process.env.NODE_ENV !== 'test') {
        process.stdout.write('.');
      }

      newRecord.Status = data.status;
      newRecord['Status Set On'] = data.created_on;
      done(null, newRecord);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        process.stdout.write('x');
      }

      done(null, newRecord);
    }
  };

  return new StreamTransform({
    transform,

    flush: (done) => {
      if (process.env.NODE_ENV !== 'test') {
        process.stdout.write('\n');
      }

      done();
    },
  });
};

module.exports = createFetchStream;
