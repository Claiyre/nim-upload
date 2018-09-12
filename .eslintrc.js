module.exports = {
  root: true,
  extends: [
      "standard"
  ],
  parserOptions: {
    "ecmaVersion": 2017
  },
  parser: "babel-eslint",
  globals: {
    "FileReader": true
  },
  rules: {
    "strict": 0
  }
};
