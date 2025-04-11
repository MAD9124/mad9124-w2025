# Testing Suite For MAD9124 w2024 Assignment 3

## Running the tests

- Copy `.env.example` into an `.env` file in the same directory.
- Ensure your API is running on the matching port
- Ensure your API is using the same `MONGO_URL` as the tests.
  - Format for YOU url is: `MONGO_URL=[TEST_MONGO_URL]/[TEST_DB_NAME]`
  - Feel free to change the name in the tests, just know all collections will be deleted at the end of the tests
- Run `npm i` to install dependencies
- Run `npm run test`. View the output of the tests.
