"use strict";

const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");

const modelFactory = require("../db/models.js");
const camelCaseFactory = require("../utils/camelCase.js");
const replyFactory = require("../utils/reply.js");

const SERVER_CONFIG = "config/serverConfig.json";

/**
 * @apiIgnore API explanation.
 * 
 * Survey API
 * 
 * This function contains all the logic for the Survey API. 
 * A few things to note though:
 * 
 * - The pagination could be improved by adding Linked Headers
 * - Having better and more descriptive errors
 * 
 * @see {@link http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api}
 * @see {@link http://keyvanfatehi.com/2016/07/27/Implementing-Link-Header-Pagination-on-the-Node-js-Server/}
 * 
 */
module.exports = (function() {
    const {
        Survey,
        Country
    } = modelFactory.getModels();

    const {
        pagination
    } = JSON.parse(fs.readFileSync(SERVER_CONFIG, "utf8"));

    const api = express.Router();
    const camelUtils = camelCaseFactory();

    // support json encoded bodies
    api.use(bodyParser.json());

    /*
     * Redirects to documentation page.
     */
    api.get("/", (req, res) => {
        res.redirect("/makert-surveys-api/docs/api/index.html");
    });

    api.post("/Countries/", (req, res) => {
        const countryJSON = req.body;
        const sender = replyFactory(res);

        const saveNew = async function() {
            const country = await Country.findOne({
                "isoCodes.alpha2": countryJSON.isoCodes.alpha2
            });

            if (country !== null) {
                sender.replyConflict("Cannot save new Country. Country already exists.");
                return;
            }

            try {
                await new Country(countryJSON).save();
                sender.replyCreated("Country added successfuly!");
            }
            catch (error) {
                sender.replyBadRequest(`Country validation or storage failed: ${error}`);
            }
        };

        saveNew()
            .catch(sender.replyInternalServerError);
    });

    /**
     *  @api {post} /Surveys Posta new Survey
     *  @apiVersion 1.0.0
     *  @apiName PostSurveys
     *  @apiGroup Surveys
     *  @apiExample {js} Example usage:
     *              URL: /api/v1/Surveys
     *              BODY:
     *                  {
     *                      "subject":"New age Products",
     *                      "country":"FR",
     *                      "provider":{
     *                          "id":"NA",
     *                          "name":"New Age"
     *                      },
     *                      "target":{
     *                          "gender": "F",
     *                          "age":{
     *                              "min": 16,
     *                              "max": 35
     *                          },
     *                          "income":{
     *                              "currency": "EUR",
     *                              "range":{
     *                                  "min": 12000,
     *                                  "max": 35000
     *                              }
     *                          }
     *                      }
     *                  }
     * 
     *  @apiDescription
     *  Posts new Surveys to the system.
     *  
     *  The body of the request has the JSON survey object to be added. This 
     *  survey object must have the following fields:
     *  
     *  - subject
     *  - provider.name
     *  - provider.id
     * 
     *  All other fields are optional. 
     *  
     *  @apiSuccess {Number}    statusCode  HTTP status code of the request.
     *  @apiSuccess {String}    message     Confirmation message.
     *  @apiSuccessExample  Success-Response
     *      HTTP/1.1 200 OK
     *      {
     *          "statusCode": 200,
     *          "message": "Object saved with success!"
     *      }    
     * 
     * @apiError    InvalidSurvey   
     *              The survey object sent is not valid. It won't be valid if:
     *              
     *              - It is missing a mandatory field 
     *              - It has field type which is incorrect, like a String 
     *              instead of a number
     *              - A range value makes no sense, like having a MAX value < 
     *              MIN, or vice-versa. 
     * @apiErrorExample InvalidSurvey-Example-Response:
     *      HTTP/1.1 400 Bad Request
     *      {
     *          "statusCode": 400,
     *          "message": {
     *              "errors": {
     *                  "subject": {
     *                      "message": "Path `subject` is required.",
     *                      "name": "ValidatorError",
     *                      "properties": {
     *                          "type": "required",
     *                          "message": "Path `{PATH}` is required.",
     *                          "path": "subject"
     *                      },
     *                      "kind": "required",
     *                      "path": "subject"
     *                  }
     *              },
     *              "message": "Survey validation failed",
     *              "name": "ValidationError"
     *          }
     *      }
     * 
     * @apiError    ConflictingSurvey   
     *              The Survey object you are trying to insert is already in the
     *              DB. You are likely trying to update it, so you should use 
     *              HTTP PUT verb instead.
     * @apiErrorExample ConflictingSurvey-Example-Response:
     *      HTTP/1.1 409 Conflict
     *      {
     *          "statusCode": 409,
     *          "message": "Cannot save new Survey. Survey already exists."
     *      }
     */
    api.post("/Surveys/", (req, res) => {
        const surveyJSON = req.body;
        const sender = replyFactory(res);

        const saveNew = async function() {
            const survey = await Survey.findOne({
                _id: surveyJSON.id
            });

            if (survey !== null) {
                sender.replyConflict("Cannot save new Survey. Survey already exists.");
                return;
            }

            try {
                await new Survey(surveyJSON).save();
                sender.replyCreated("Object saved with success!");
            }
            catch (error) {
                sender.replyBadRequest(`Object validation or storage failed: ${error}`);
            }
        };

        saveNew()
            .catch(sender.replyInternalServerError);
    });

    /**
     *  @api {get} /Surveys Request Survey information
     *  @apiVersion 1.0.0
     *  @apiName GetSurveys
     *  @apiGroup Surveys
     *  @apiExample {js} Example usage:
     *              /api/v1/Surveys?itemsPerPage=2&metadata=true&providerId=INE
     *
     *  @apiParam   (survey)    {String}                            [id]                    
     *              Survey's unique id.
     *  @apiParam   (survey)    {String}                            [subject]               
     *              The Survey's subject.
     *  @apiParam   (survey)    {String="ES","PT","US","UK","FR"}   [country]               
     *              The ISO code of the country where the Survey was made. 
     * 
     *  @apiParam   (provider)  {String}    [providerId]            
     *              The unique ID of the provider of the Survey (i.e., the 
     *              company who made it).
     *  @apiParam   (provider)  {String}    [providerName]          
     *              The name of the provider of the Survey (i.e., the company 
     *              who made it).
     * 
     *  @apiParam   (target)    {String="M","F"}    [targetGender] 
     *              The gender of the targeted audience.
     *  @apiParam   (target)    {Number}            [targetAgeMin] 
     *              The minimum age of the target audience. 
     *  @apiParam   (target)    {Number}            [targetAgeMax] 
     *              The maximum age of the target audience. 
     *  
     *  @apiParam   (target)    {String="EUR","USD"}[targetIncomeCurrency]  
     *              The currency of the target audience.
     *  @apiParam   (target)    {Number}            [targetIncomeRangeMin]  
     *              The amount of minimum earnings, per year without taxes 
     *              applied, that the targeted audience has. 
     *  @apiParam   (target)    {Number}            [targetIncomeRangeMax]  
     *              The amount of maximum earnings, per year without taxes 
     *              applied, that the targeted audience has. 
     *  
     *  @apiParam   (pagination)    {Number}    [page=1]                  
     *              The number of the page you wish to see. 
     *              If metadata=true it will be presented as header with the 
     *              same name. Must be >= 0.
     *  @apiParam   (pagination)    {Number}    [itemsPerPage=3]          
     *              The amount of items per page. If metadata=true it will be 
     *              presented as header with the name "page_num". Must be > 0.
     *  
     *  @apiParam   (metadata)  {Boolean}   [metadata=false]   
     *              If true, the result object will have the page and request 
     *              information on it. If false, page and request information 
     *              will be on the response headers. It will additionally add a 
     *              "query_total_count" header with the total amount of elements 
     *              the query returned. Error messages always include metadata.
     * 
     *  @apiSuccess {Survey[]}  -    
     *              Array containing the results of the query.
     *  
     *  @apiSuccessExample  Success-Response-Without-Metadata:
     *      HTTP/1.1 200 OK
     *      [
     *          {
     *              "subject": "People who like bananas",
     *              "country": "US",
     *              "target": {
     *                  "gender": "M",
     *                  "age": {
     *                      "min": 3,
     *                      "range": null
     *                  }
     *              },
     *              "provider": {
     *                  "id": "TAP",
     *                  "name": "Transportes Aereos de Portugal"
     *              },
     *              "id": "58dd23d4476664e33eec4b8d"
     *          }
     *      ]
     *
     *  @apiSuccessExample  Success-Response-With-Metadata:
     *      HTTP/1.1 200 OK
     *      {
     *          "statusCode": 200,
     *          "page": 0,
     *          "itemsPerPage": 2,
     *          "queryTotalCount": 2,
     *          "data": [
     *              {
     *                  "subject": "People who like oranges",
     *                  "country": "PT",
     *                  "target": {
     *                      "age": {
     *                          "min": 8,
     *                          "max": 65,
     *                          "range": 57
     *                      }
     *                  },
     *                  "provider": {
     *                      "id": "INE",
     *                      "name": "Instituto Nacional de Estatistica"
     *                  },
     *                  "id": "58dd240e476664e33eec4b8e"
     *              },
     *              {
     *                  "subject": "Poor Populations",
     *                  "country": "ES",
     *                  "target": {
     *                      "income": {
     *                          "currency": "EUR",
     *                          "range": {
     *                              "max": 18000
     *                          }
     *                      },
     *                      "age": {
     *                          "range": null
     *                      }
     *                  },
     *                  "provider": {
     *                      "id": "INE",
     *                      "name": "Instituto Nacional de Estatistica"
     *                  },
     *                  "id": "58dd25f9476664e33eec4b92"
     *              }
     *          ]
     *      }
     * 
     *  @apiError    BadPage The page parameter is < 1.
     *  @apiErrorExample BadPage-Response:
     *      HTTP/1.1 400 Bad Request
     *      {
     *          "statusCode": 400,
     *          "message": "The pagination parameter 'page' must be > 0"
     *      }
     * 
     *  @apiError BadItemsPerPage    The itemsPerPage parameter is < 1.
     *  @apiErrorExample BadItemsPerPage-Response:
     *      HTTP/1.1 400 Bad Request
     *      {
     *          "statusCode": 400,
     *          "message": "The pagination parameter 'itemsPerPage' must be > 0"
     *      }
     * 
     *  @apiError InvalidId    When the id field passed to the query is invalid.
     *  @apiErrorExample InvalidId-Response:
     *      HTTP/1.1 400 Bad Request
     *      {
     *          "statusCode": 400,
     *          "message": {
     *              "message": "Cast to ObjectId failed for value \"InvalidIdExample\" at path \"_id\" for model \"Survey\"",
     *              "name": "CastError",
     *              "stringValue": "\"InvalidIdExample\"",
     *              "kind": "ObjectId",
     *              "value": "InvalidIdExample",
     *              "path": "_id"
     *          }
     *      }
     * 
     *  @apiError SurveysNotFound    When the query performed returns no results.
     *  @apiErrorExample SurveysNotFound-Response:
     *      HTTP/1.1 404 Bad Request
     *      {
     *          "statusCode": 404,
     *          "message": "There are no results matching your query."
     *      }
     * 
     *  @apiError InvalidDataType    When the query performed expects a given 
     *                              value type, but gets a different one. The
     *                              server will always try to convert and cast, 
     *                              but if the value types are not compatible, 
     *                              it will throw this error. Often happens
     *                              when trying to convert a String to a Number.
     *  @apiErrorExample InvalidDataType-Response:
     *      HTTP/1.1 400 Bad Request
     *      {
     *          "statusCode": 400,
     *          "message": {
     *              "message": "Cast to number failed for value \"NaN\" at path \"target.age.min\" for model \"Survey\"",
     *              "name": "CastError",
     *              "stringValue": "\"NaN\"",
     *              "kind": "number",
     *              "value": null,
     *              "path": "target.age.min"
     *          }
     *      }
     * 
     */
    api.get("/Surveys/", (req, res) => {

        const pageNum = +(req.query.page || 1);
        const itemsPerPage = +(req.query.itemsPerPage || pagination.itemsPerPage);
        const sender = replyFactory(res);

        if (itemsPerPage < 1) {
            sender.replyBadRequest("The pagination parameter 'itemsPerPage' must be > 0");
            return;
        }

        if (pageNum < 1) {
            sender.replyBadRequest("The pagination parameter 'page' must be > 0");
            return;
        }

        const queryObj = Object.keys(req.query)
            .filter(key => key !== "page" &&
                key !== "itemsPerPage" &&
                key !== "metadata")
            .reduce((searchQuery, param) => {

                if (!camelUtils.isCamelCase(param))
                    searchQuery[param] = req.query[param];
                else {
                    const camelcaseParam = camelUtils.splitCamelCalse(param, ".");

                    if (camelcaseParam.includes("max")) {
                        searchQuery[camelcaseParam] = {
                            $lte: +req.query[param]
                        };
                    }
                    else if (camelcaseParam.includes("min")) {
                        searchQuery[camelcaseParam] = {
                            $gte: +req.query[param]
                        };
                    }
                    else {
                        searchQuery[camelcaseParam] = req.query[param];
                    }
                }

                if (param === "id")
                    searchQuery._id = req.query.id;

                return searchQuery;
            }, {});

        const query = async function() {
            const surveys = await Survey.paginate(queryObj, {
                page: pageNum,
                limit: itemsPerPage
            });

            if (surveys.length === 0)
                sender.replyNotFound("There are no results matching your query.");
            else
                sender.replyResult(surveys.docs, surveys.total, pageNum, itemsPerPage, req.query.metadata);
        };

        query()
            .catch(error => sender.replyInternalServerError(`There was an error processing your query: ${error}`));
    });

    return api;
})();