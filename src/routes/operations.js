const express = require('express');

const router = express.Router();
const numberConverter = require('../middleware/NumConvert');

router.use(numberConverter);

router.get('/add', (req, res) => {
  res.json({
    addition_answer: operate(req, add),
  });
});

router.get('/multiply', (req, res) => {
  res.json({
    multiply_answer: operate(req, multiply),
  });
});

router.get('/subtract', (req, res) => {
  res.json({
    subtract_answer: operate(req, subtract),
  });
});

router.get('/divide', (req, res) => {
  res.json({
    divide_answer: operate(req, divide),
  });
});

function operate(req, operation) {
  const a = req.query.first;
  const b = req.query.second;

  return operation(a, b);
}

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const subtract = (a, b) => a - b;
const divide = (a, b) => {
  if (b === 0) {
    return 'The denominator must not be 0';
  }

  return a / b;
};

module.exports = router;
