"use strict";

const mongoose = require("mongoose");

/**
 *  Module responsible for initializing the Models.   
 */

module.exports = (function() {
    let models;

    const initialize = () => {

        //Connect to DB
        mongoose.connect(require("../config/dbConfig.json").dbConnectionURL);
        mongoose.Promise = global.Promise;

        //Build Models Object
        models = {
            Country: mongoose.model('Country', require("./countrySchema.js")),
            Survey: mongoose.model('Survey', require("./surveySchema.js"))
        };

    };

    const getModels = () => {
        if (models === undefined)
            initialize();

        return models;
    };

    return Object.freeze({
        getModels
    });
}());