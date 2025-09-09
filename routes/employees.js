const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const validate = require('../middlewares/validate');
const {
    createEmployeeValidator,
    updateEmployeeValidator,
    idValidator
} = require('../validators/employeeValidator');


router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { name = '', email = '', department = '', salary = '' } = req.query;
        console.log(salary, "salarysalary");

        const filter = {};
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (email) filter.email = { $regex: email, $options: 'i' };
        if (department) filter.department = { $regex: department, $options: 'i' };
        if (salary) {
            const salaryNum = Number(salary);
            if (!isNaN(salaryNum)) {
                filter.salary = salaryNum;
            }
        }


        const [employees, total] = await Promise.all([
            Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Employee.countDocuments(filter)
        ]);

        res.json({
            success: true,
            result: employees,
            total,
            page,
            pages: Math.ceil(total / limit),
            message: "Employees retrieved successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, result: null, message: err.message });
    }
});



// GET single employee
router.get('/:id', idValidator, validate, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ success: false, result: null, message: "Employee not found" });
        res.json({ success: true, result: employee, message: "Employee retrieved successfully" });
    } catch (err) {
        res.status(500).json({ success: false, result: null, message: err.message });
    }
});

// POST create employee
router.post('/', createEmployeeValidator, validate, async (req, res) => {
    try {

        const isEmailExist = await Employee.findOne({ email: req.body.email });

        if (isEmailExist) {
            return res.status(400).json({ success: false, result: null, message: "Email already exists" });
        }

        let employeeData ={
            ...req.body,
            salary: mongoose.Types.Decimal128.fromString(req.body.salary.toString())
        }

        const newEmployee = new Employee(employeeData);
        await newEmployee.save();
        res.status(200).json({ success: true, result: newEmployee, message: "Employee created successfully" });
    } catch (err) {
        res.status(400).json({ success: false, result: null, message: err.message });
    }
});

// PUT update employee
router.put('/', updateEmployeeValidator, validate, async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.body._id,
            req.body,
            { new: true }
        );
        if (!updatedEmployee) return res.status(404).json({ success: false, result: null, message: "Employee not found" });
        res.json({ success: true, result: updatedEmployee, message: "Employee updated successfully" });
    } catch (err) {
        res.status(400).json({ success: false, result: null, message: err.message });
    }
});

// DELETE employee
router.delete('/:id', idValidator, validate, async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });
        res.json({ success: true, result: null, message: "Employee deleted" });
    } catch (err) {
        res.status(500).json({ success: false, result: null, message: err.message });
    }
});

module.exports = router;
