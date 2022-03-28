module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["prettier"],
  rules: {
    "linebreak-style": 0,
    "max-len": 0,
    quotes: 0,
    "no-console": 0,
    "consistent-return": 0,
    camelcase: 0,
    "no-use-before-define": 0,
    "no-unused-vars": 0,
    "no-await-in-loop": 0,
    "no-restricted-syntax": 0,
    "no-underscore-dangle": 0,
    "no-plusplus": 0,
  },
};
