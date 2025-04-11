const axios = require("axios").default;

const goodResponse = (data, status) => {
  expect(status).toBe(200);
  expect(data).toHaveProperty("data");
};

const badRequestResponse = (data, status) => {
  expect(status).toBe(400);
  expect(data).toHaveProperty("error");
};

const notFoundResponse = (data, status) => {
  expect(status).toBe(404);
  expect(data).toHaveProperty("error");
};

const unauthorizedResponse = (data, status) => {
  expect(status).toBe(401);
  expect(data).toHaveProperty("error");
};

const forbiddenResponse = (data, status) => {
  expect(status).toBe(403);
  expect(data).toHaveProperty("error");
};

const convertJSON = (d) => {
  // I am not going to be strict about timestamps for this assingment
  // Plus they make the tests more complicated
  const { updatedAt, createdAt, __v, ...converted } = JSON.parse(
    JSON.stringify(d),
  );
  return converted;
};

const PORT = process.env.PORT || 4000;
const requestFactory = (path) => async (method, url, token, body) => {
  try {
    const { data, status } = await axios.request({
      url: `http://localhost:${PORT}${path}${url}`,
      method,
      data: body,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    // strip away the unwanted data
    if (data.data) {
      if (Array.isArray(data.data)) {
        data.data = data.data.map(convertJSON);
      } else {
        data.data = convertJSON(data.data);
      }
    }

    return { data, status };
  } catch (err) {
    if (err.response) {
      return {
        data: err.response.data,
        status: err.response.status,
      };
    }
  }
};

module.exports = {
  goodResponse,
  badRequestResponse,
  notFoundResponse,
  forbiddenResponse,
  unauthorizedResponse,
  convertJSON,
  requestFactory,
};
