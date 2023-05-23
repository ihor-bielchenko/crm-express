const nodeFetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

/**
 * @param {Object} args
 * @return {Object}
 */
const fetch = async function (args) {
  const url = args.url;
  const body = args.body || {};
  const method = args.method;
  const headers = args.headers || {'Content-Type': 'application/json'};
  let response = null;
  try {
    response = await nodeFetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: headers
    });
  } catch (error) {
    return {
      status: 'error',
      body: response
    };
  }
  return {
    status: 'success',
    body: await response.json()
  };
};
module.exports = fetch;
