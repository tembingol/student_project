"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidators = exports.passwordValidator = exports.loginOrEmailValidator = void 0;
const express_validator_1 = require("express-validator");
const input_Check_Errors_Middleware_1 = require("../../../global-middlewares/input-Check-Errors-Middleware");
exports.loginOrEmailValidator = (0, express_validator_1.body)('loginOrEmail')
    .isString().withMessage('not string');
exports.passwordValidator = (0, express_validator_1.body)('password')
    .isString().withMessage('not string');
exports.authValidators = [
    exports.loginOrEmailValidator,
    exports.passwordValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];
