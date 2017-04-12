"use strict";

const mongoose = require("mongoose");

const isUpperCase = val => val.match(/[A-Z]/) && val === val.toUpperCase();

const countrySchema = {
    name: { type: String, required: true },
    isoCodes:{
        alpha2: { 
            type: String, 
            maxlength: 2,
            minlength: 2,
            required: true,
            validate: {
                validator: val => isUpperCase(val),
                message: "Incorrect format for alpha-2 type ISO code."
            }
        },
        alpha3: { 
            type: String,
            maxlength: 3,
            minlength: 3,
            validate: {
                validator: val => isUpperCase(val),
                message: "Incorrect format for alpha-3 type ISO code."
            }           
        }
    }
};


module.exports = new mongoose.Schema(countrySchema);
module.exports.countrySchema = countrySchema;