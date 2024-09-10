const express = require('express');

const router = express.Router();

const usercontroller = require('../controllers/expense');
const userauthentication = require('../middleware/auth')

router.post('/add-expense', userauthentication.authenticate, usercontroller.addExpense);

router.get('/get-expense/:page', userauthentication.authenticate, usercontroller.getExpense);

router.delete('/delete-expense/:id', userauthentication.authenticate, usercontroller.deleteExpense);

module.exports = router;