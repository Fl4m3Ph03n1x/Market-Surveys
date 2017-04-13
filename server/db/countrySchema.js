"use strict";

const mongoose = require("mongoose");

const NOT_UPPERCASE = "ISO alpha codes must be in Upper case letters.";
const isUpperCase = val => val.match(/[A-Z]/) && val === val.toUpperCase();

const countrySchema = {
    name: {
        type: String,
        required: [true, "Country must have a 'name' attriubute."]
    },
    isoCodes: {
        alpha2: {
            type: String,
            maxlength: [2, "ISO alpha-2 codes have a maximum of 2 characters."],
            minlength: [2, "ISO alpha-2 codes have a minimum of 2 characters."],
            required: [true, "Country must have an 'isoCodes.alpha2' attribute. Check ISO alpha-2 standard (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) to see which code belongs to your country."],
            validate: {
                validator: val => isUpperCase(val),
                message: NOT_UPPERCASE
            }
        },
        alpha3: {
            type: String,
            maxlength: [3, "ISO alpha-3 codes have a maximum of 3 characters."],
            minlength: [3, "ISO alpha-3 codes have a minimum of 3 characters."],
            required: [true, "Country must have an 'isoCodes.alpha3' attribute. Check ISO alpha-3 standard (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) to see which code belongs to your country."],
            validate: {
                validator: val => isUpperCase(val),
                message: NOT_UPPERCASE
            }
        }
    }
};

const schema = new mongoose.Schema(countrySchema);

schema.set('toObject', {
    virtuals: true
});

schema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


module.exports = schema;
module.exports.countrySchema = countrySchema;