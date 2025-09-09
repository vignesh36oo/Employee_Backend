const { body, param } = require('express-validator');

exports.createEmployeeValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('salary')
        .isNumeric().withMessage('Salary must be a number')
        .custom(value => value > 0).withMessage('Salary must be greater than 0'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid'),
];

exports.updateEmployeeValidator = [
    body('_id').isMongoId().withMessage('Invalid employee ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('department').optional().notEmpty().withMessage('Department cannot be empty'),
    body('salary')
        .optional()
        .isNumeric().withMessage('Salary must be a number')
        .custom(value => value > 0).withMessage('Salary must be greater than 0'),
];

exports.idValidator = [
    param('id').isMongoId().withMessage('Invalid employee ID'),
];
