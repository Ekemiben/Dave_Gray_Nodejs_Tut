const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController')


router.route('/')
.get(employeesController.getAllEmployees)
.post(employeesController.createNewEmployee)
.put(employeesController.updateEmplyee)
.delete(employeesController.deleteEmployee)
router.route(':/id')
.get(employeesController.getEmployee)


module.exports = router;