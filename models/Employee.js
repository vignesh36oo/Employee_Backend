const mongoose = require('mongoose');
const validator = require('validator')
const AutoIncrement = require('mongoose-sequence')(mongoose);


const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        // validate: {
        //     validator: validator.isEmail,
        //     message: 'Not A Valid Email'
        // },
        lowercase: true,
        unique: true,
        required: true
    }, department: { type: String, required: true },
    // salary: { type: Number, required: true },
    salary: { 
        type: mongoose.Schema.Types.Decimal128, 
        required: true
     }

}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
