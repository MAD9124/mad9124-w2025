const axios = require("axios");

const goodResponse = (data, status) => {
  expect(status).toBe(200);
  expect(data).toHaveProperty("data");
};

const badRequestResponse = (data, status) => {
  expect(status).toBe(400);
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

const notFoundResponse = (data, status) => {
  expect(status).toBe(404);
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
    await new Promise((res) => process.nextTick(res));
    const { data, status } = await axios.request({
      url: `http://localhost:${PORT}${path}${url}`,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `access_token=${token}`,
      },
      data: body,
      timeout: 300,
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
    console.log("e", err);
    return { status: 500, data: "something went wrong" };
  }
};

module.exports = {
  goodResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  convertJSON,
  requestFactory,
};
