define({ "api": [
  {
    "type": "get",
    "url": "/Surveys",
    "title": "Request Survey information",
    "version": "1.0.0",
    "name": "GetSurveys",
    "group": "Surveys",
    "examples": [
      {
        "title": "Example usage:",
        "content": "/api/v1/Surveys?itemsPerPage=2&metadata=true&providerId=INE",
        "type": "js"
      }
    ],
    "parameter": {
      "fields": {
        "survey": [
          {
            "group": "survey",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>Survey's unique id.</p>"
          },
          {
            "group": "survey",
            "type": "String",
            "optional": true,
            "field": "subject",
            "description": "<p>The Survey's subject.</p>"
          },
          {
            "group": "survey",
            "type": "String",
            "allowedValues": [
              "\"ES\"",
              "\"PT\"",
              "\"US\"",
              "\"UK\"",
              "\"FR\""
            ],
            "optional": true,
            "field": "country",
            "description": "<p>The ISO code of the country where the Survey was made.</p>"
          }
        ],
        "provider": [
          {
            "group": "provider",
            "type": "String",
            "optional": true,
            "field": "providerId",
            "description": "<p>The unique ID of the provider of the Survey (i.e., the company who made it).</p>"
          },
          {
            "group": "provider",
            "type": "String",
            "optional": true,
            "field": "providerName",
            "description": "<p>The name of the provider of the Survey (i.e., the company who made it).</p>"
          }
        ],
        "target": [
          {
            "group": "target",
            "type": "String",
            "allowedValues": [
              "\"M\"",
              "\"F\""
            ],
            "optional": true,
            "field": "targetGender",
            "description": "<p>The gender of the targeted audience.</p>"
          },
          {
            "group": "target",
            "type": "Number",
            "optional": true,
            "field": "targetAgeMin",
            "description": "<p>The minimum age of the target audience.</p>"
          },
          {
            "group": "target",
            "type": "Number",
            "optional": true,
            "field": "targetAgeMax",
            "description": "<p>The maximum age of the target audience.</p>"
          },
          {
            "group": "target",
            "type": "String",
            "allowedValues": [
              "\"EUR\"",
              "\"USD\""
            ],
            "optional": true,
            "field": "targetIncomeCurrency",
            "description": "<p>The currency of the target audience.</p>"
          },
          {
            "group": "target",
            "type": "Number",
            "optional": true,
            "field": "targetIncomeRangeMin",
            "description": "<p>The amount of minimum earnings, per year without taxes applied, that the targeted audience has.</p>"
          },
          {
            "group": "target",
            "type": "Number",
            "optional": true,
            "field": "targetIncomeRangeMax",
            "description": "<p>The amount of maximum earnings, per year without taxes applied, that the targeted audience has.</p>"
          }
        ],
        "pagination": [
          {
            "group": "pagination",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>The number of the page you wish to see. If metadata=true it will be presented as header with the same name. Must be &gt;= 0.</p>"
          },
          {
            "group": "pagination",
            "type": "Number",
            "optional": true,
            "field": "itemsPerPage",
            "defaultValue": "3",
            "description": "<p>The amount of items per page. If metadata=true it will be presented as header with the name &quot;page_num&quot;. Must be &gt; 0.</p>"
          }
        ],
        "metadata": [
          {
            "group": "metadata",
            "type": "Boolean",
            "optional": true,
            "field": "metadata",
            "defaultValue": "false",
            "description": "<p>If true, the result object will have the page and request information on it. If false, page and request information will be on the response headers. It will additionally add a &quot;query_total_count&quot; header with the total amount of elements the query returned. Error messages always include metadata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Survey[]",
            "optional": false,
            "field": "-",
            "description": "<p>Array containing the results of the query.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Without-Metadata:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"subject\": \"People who like bananas\",\n        \"country\": \"US\",\n        \"target\": {\n            \"gender\": \"M\",\n            \"age\": {\n                \"min\": 3,\n                \"range\": null\n            }\n        },\n        \"provider\": {\n            \"id\": \"TAP\",\n            \"name\": \"Transportes Aereos de Portugal\"\n        },\n        \"id\": \"58dd23d4476664e33eec4b8d\"\n    }\n]",
          "type": "json"
        },
        {
          "title": "Success-Response-With-Metadata:",
          "content": "HTTP/1.1 200 OK\n{\n    \"statusCode\": 200,\n    \"page\": 0,\n    \"itemsPerPage\": 2,\n    \"queryTotalCount\": 2,\n    \"data\": [\n        {\n            \"subject\": \"People who like oranges\",\n            \"country\": \"PT\",\n            \"target\": {\n                \"age\": {\n                    \"min\": 8,\n                    \"max\": 65,\n                    \"range\": 57\n                }\n            },\n            \"provider\": {\n                \"id\": \"INE\",\n                \"name\": \"Instituto Nacional de Estatistica\"\n            },\n            \"id\": \"58dd240e476664e33eec4b8e\"\n        },\n        {\n            \"subject\": \"Poor Populations\",\n            \"country\": \"ES\",\n            \"target\": {\n                \"income\": {\n                    \"currency\": \"EUR\",\n                    \"range\": {\n                        \"max\": 18000\n                    }\n                },\n                \"age\": {\n                    \"range\": null\n                }\n            },\n            \"provider\": {\n                \"id\": \"INE\",\n                \"name\": \"Instituto Nacional de Estatistica\"\n            },\n            \"id\": \"58dd25f9476664e33eec4b92\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadPage",
            "description": "<p>The page parameter is &lt; 0.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadItemsPerPage",
            "description": "<p>The itemsPerPage parameter is &lt;= 0.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidId",
            "description": "<p>When the id field passed to the query is invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SurveysNotFound",
            "description": "<p>When the query performed returns no results.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidDataType",
            "description": "<p>When the query performed expects a given value type, but gets a different one. The server will always try to convert and cast, but if the value types are not compatible, it will throw this error. Often happens when trying to convert a String to a Number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "BadPage-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"statusCode\": 400,\n    \"message\": \"The pagination parameter 'page' must be >= 0\"\n}",
          "type": "json"
        },
        {
          "title": "BadItemsPerPage-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"statusCode\": 400,\n    \"message\": \"The pagination parameter 'itemsPerPage' must be > 0\"\n}",
          "type": "json"
        },
        {
          "title": "InvalidId-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"statusCode\": 400,\n    \"message\": {\n        \"message\": \"Cast to ObjectId failed for value \\\"InvalidIdExample\\\" at path \\\"_id\\\" for model \\\"Survey\\\"\",\n        \"name\": \"CastError\",\n        \"stringValue\": \"\\\"InvalidIdExample\\\"\",\n        \"kind\": \"ObjectId\",\n        \"value\": \"InvalidIdExample\",\n        \"path\": \"_id\"\n    }\n}",
          "type": "json"
        },
        {
          "title": "SurveysNotFound-Response:",
          "content": "HTTP/1.1 404 Bad Request\n{\n    \"statusCode\": 404,\n    \"message\": \"There are no results matching your query.\"\n}",
          "type": "json"
        },
        {
          "title": "InvalidDataType-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"statusCode\": 400,\n    \"message\": {\n        \"message\": \"Cast to number failed for value \\\"NaN\\\" at path \\\"target.age.min\\\" for model \\\"Survey\\\"\",\n        \"name\": \"CastError\",\n        \"stringValue\": \"\\\"NaN\\\"\",\n        \"kind\": \"number\",\n        \"value\": null,\n        \"path\": \"target.age.min\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/api/api.js",
    "groupTitle": "Surveys"
  },
  {
    "type": "post",
    "url": "/Surveys",
    "title": "Posta new Survey",
    "version": "1.0.0",
    "name": "PostSurveys",
    "group": "Surveys",
    "examples": [
      {
        "title": "Example usage:",
        "content": "URL: /api/v1/Surveys\nBODY:\n    {\n        \"subject\":\"New age Products\",\n        \"country\":\"FR\",\n        \"provider\":{\n            \"id\":\"NA\",\n            \"name\":\"New Age\"\n        },\n        \"target\":{\n            \"gender\": \"F\",\n            \"age\":{\n                \"min\": 16,\n                \"max\": 35\n            },\n            \"income\":{\n                \"currency\": \"EUR\",\n                \"range\":{\n                    \"min\": 12000,\n                    \"max\": 35000\n                }\n            }\n        }\n    }",
        "type": "js"
      }
    ],
    "description": "<p>Posts new Surveys to the system.</p> <p>The body of the request has the JSON survey object to be added. This survey object must have the following fields:</p> <ul> <li>subject</li> <li>provider.name</li> <li>provider.id</li> </ul> <p>All other fields are optional.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "statusCode",
            "description": "<p>HTTP status code of the request.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Confirmation message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"statusCode\": 200,\n    \"message\": \"Object saved with success!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidSurvey",
            "description": "<p>The survey object sent is not valid. It won't be valid if:</p> <ul> <li>It is missing a mandatory field</li> <li>It has field type which is incorrect, like a String instead of a number</li> <li>A range value makes no sense, like having a MAX value &lt; MIN, or vice-versa.</li> </ul>"
          }
        ]
      },
      "examples": [
        {
          "title": "InvalidSurvey-Example-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"statusCode\": 500,\n    \"message\": {\n        \"errors\": {\n            \"subject\": {\n                \"message\": \"Path `subject` is required.\",\n                \"name\": \"ValidatorError\",\n                \"properties\": {\n                    \"type\": \"required\",\n                    \"message\": \"Path `{PATH}` is required.\",\n                    \"path\": \"subject\"\n                },\n                \"kind\": \"required\",\n                \"path\": \"subject\"\n            }\n        },\n        \"message\": \"Survey validation failed\",\n        \"name\": \"ValidationError\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/api/api.js",
    "groupTitle": "Surveys"
  }
] });
