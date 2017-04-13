"use strict";

const HTTPStatus = require('http-status');

const replyFactory = function(response) {
    const res = response;

    const reply = function(data) {
        if (data.statusCode !== undefined)
            res.status(data.statusCode);

        res.json(data);
    };

    const replyCreated = function(message) {
        reply({
            statusCode: HTTPStatus.CREATED,
            statusMeaning: HTTPStatus[HTTPStatus.CREATED],
            message
        });
    };

    const replyConflict = function(message) {
        reply({
            statusCode: HTTPStatus.CONFLICT,
            statusMeaning: HTTPStatus[HTTPStatus.CONFLICT],
            message
        });
    };

    const replyBadRequest = function(message) {
        reply({
            statusCode: HTTPStatus.BAD_REQUEST,
            statusMeaning: HTTPStatus[HTTPStatus.BAD_REQUEST],
            message
        });
    };

    const replyForbidden = function(message) {
        reply({
            statusCode: HTTPStatus.FORBIDDEN,
            statusMeaning: HTTPStatus[HTTPStatus.FORBIDDEN],
            message
        });
    };

    const replyNotFound = function(message) {
        reply({
            statusCode: HTTPStatus.NOT_FOUND,
            statusMeaning: HTTPStatus[HTTPStatus.NOT_FOUND],
            message
        });
    };

    const replyInternalServerError = function(message) {
        reply({
            statusCode: HTTPStatus.INTERNAL_SERVER_ERROR,
            statusMeaning: HTTPStatus[HTTPStatus.INTERNAL_SERVER_ERROR],
            message
        });
    };

    const replySuccess = function(message) {
        reply({
            statusCode: HTTPStatus.OK,
            statusMeaning: HTTPStatus[HTTPStatus.OK],
            message
        });
    };

    const replyResult = function(results, totalQueryLength, pageNum, itemsPerPage, metadata) {
        res.set("query_total_count", totalQueryLength);
        res.set("page", pageNum);
        res.set("per_page", itemsPerPage);

        if (metadata === "true")
            reply({
                statusCode: HTTPStatus.OK,
                statusMeaning: HTTPStatus[HTTPStatus.OK],
                page: pageNum,
                itemsPerPage,
                queryTotalCount: totalQueryLength,
                data: results
            });
        else
            reply(results);
    };

    return Object.freeze({
        replyBadRequest,
        replyForbidden,
        replyNotFound,
        replyInternalServerError,
        replySuccess,
        replyResult,
        replyConflict,
        replyCreated
    });
};

module.exports = replyFactory;