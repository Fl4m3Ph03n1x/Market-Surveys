"use strict";

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');

const GENDERS = ["M", "F"];
const CURRENCIES = ["EUR", "USD"];

const isValidMin = (min, max) => {
    return (max !== undefined ? min <= max : true);
};
const isValidMax = (min, max) => {
    return (min !== undefined ? max >= min : true);
};

const modelFactory = require("./models.js");

const surveySchema = {
    subject: { type: String, required: true },
    country: {
        type: String,
        validate: {
            validator: function(val) {
                return modelFactory.getModels().Country
                    .findOne({
                        "isoCodes.alpha2": val
                    })
                    .then(res => {
                        return res !== null;
                    })
                    .catch(console.log);
            },
            message: "The country {VALUE} is not available in the DB at the moment."
        }
    },
    provider: {
        id: { type: "String", required: true },
        name: { type: "String", required: true }
    },
    target: {
        gender: { type: String, enum: GENDERS },
        age: {
            min: { 
                type: Number, min: 0,
                validate: {
                    validator: function(val){
                        return isValidMin(val, this.target.age.max);
                    },
                    message: "The MIN age with value {VALUE} must be <= than the max age!"
                }
            },
            max: {
                type: Number, min: 0,
                validate: {
                    validator: function(val) {
                        return isValidMax(this.target.age.min, val);
                    },
                    message: "The MAX age with value {VALUE} must be >= than the min age!"
                }
            }
        },
        income: {
            currency: { type: String, enum: CURRENCIES },
            range: {
                min: {
                    type: Number, min: 0,
                    validate: {
                        validator: function(val) {
                            return isValidMin(val, this.target.income.range.max);
                        },
                        message: "The MIN range with value {VALUE} must be <= than the max range!"
                    }
                },
                max: {
                    type: Number, min: 0,
                    validate: {
                        validator: function(val) {
                            return isValidMax(this.target.income.range.min, val);
                        },
                        message: "The MAX range with value {VALUE} must be >= than the min range!"
                    }
                }
            }
        }
    }
};

const schema = new mongoose.Schema(surveySchema);

schema.plugin(mongoosePaginate);
schema.virtual("target.age.range").get(
    function() {
        const minAge = this.target.age.min,
            maxAge = this.target.age.max;

        if (minAge !== undefined && maxAge !== undefined)
            return maxAge - minAge;
        else
            return NaN;
    });

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
module.exports.surveySchema = surveySchema;