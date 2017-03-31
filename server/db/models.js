"use strict";

const mongoose = require("mongoose");
const fs = require("fs");

const DB_CONFIG = "./config/dbConfig.json";

/**
 *  Module responsible for initializing the Models.   
 */
module.exports = function() {
    const {
        dbConnectionURL
    } = JSON.parse(fs.readFileSync(DB_CONFIG, "utf8"));
    
    mongoose.connect(dbConnectionURL);
    mongoose.Promise = global.Promise;
    
    return {
        Survey: mongoose.model('Survey', require("./surveySchema.js"))
    };
};