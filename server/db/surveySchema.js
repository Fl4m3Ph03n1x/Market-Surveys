"use strict";

const mongoose = require("mongoose");

const COUNTRIES = ["ES", "PT", "US", "FR", "UK"];
const GENDERS = ["M", "F"];
const CURRENCIES = ["EUR", "USD"];

const surveySchema = {
    subject: {
        type: String,
        required: true
    },
    country: {
        type: String,
        enum: COUNTRIES
    },
    provider: {
        id: {
            type: "String",
            required: true
        },
        name: {
            type: "String",
            required: true
        }
    },
    target: {
        gender: {
            type: String,
            enum: GENDERS
        },
        age: {
            min: {
                type: Number,
                min: 0,
                validate: {
                    validator: function(val) {
                        const currMax = this.target.age.max;
                        return (currMax !== undefined ? val <= currMax : true);
                    },
                    message: "The MIN age with value {VALUE} must be <= than the max age!"
                }
            },
            max: {
                type: Number,
                min: 0,
                validate: {
                    validator: function(val) {
                        const currMin = this.target.age.min;
                        return (currMin !== undefined ? val >= currMin : true);
                    },
                    message: "The MAX age with value {VALUE} must be >= than the min age!"
                }
            }
        },
        income: {
            currency: {
                type: String,
                enum: CURRENCIES
            },
            range: {
                min: {
                    type: Number,
                    min: 0,
                    validate: {
                        validator: function(val) {
                            const currMax = this.target.income.range.max;
                            return (currMax !== undefined ? val <= currMax : true);
                        },
                        message: "The MIN range with value {VALUE} must be <= than the max range!"
                    }
                },
                max: {
                    type: Number,
                    min: 0,
                    validate: {
                        validator: function(val) {
                            const currMin = this.target.income.range.min;
                            return (currMin !== undefined ? val >= currMin : true);
                        },
                        message: "The MAX range with value {VALUE} must be >= than the min range!"

                    }
                }
            }
        }
    }
};

const schema = new mongoose.Schema(surveySchema);

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
    }
});

module.exports = schema;
module.exports.modSchema = surveySchema;