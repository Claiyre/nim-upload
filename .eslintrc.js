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
    "File": true,
    "Blob": true,
    "localStorage": true
  },
  rules: {
    "strict": 0
  }
};
