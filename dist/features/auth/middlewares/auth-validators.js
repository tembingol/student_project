"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHeaderValidator = exports.authRegistrationValidators = exports.authLoginValidators = exports.legistrationEmailValidator = exports.egistrationPasswordValidator = exports.registrationLoinValidator = exports.passwordValidator = exports.loginOrEmailValidator = void 0;
const express_validator_1 = require("express-validator");
const input_Check_Errors_Middleware_1 = require("../../../global-middlewares/input-Check-Errors-Middleware");
exports.loginOrEmailValidator = (0, express_validator_1.body)('loginOrEmail')
    .isString().withMessage('not string');
exports.passwordValidator = (0, express_validator_1.body)('password')
    .isString().withMessage('not string');
exports.registrationLoinValidator = (0, express_validator_1.body)('login')
    .isString().withMessage('not string')
    .isLength({ min: 3, max: 10 }).withMessage('more then 10 or less than 3');
exports.egistrationPasswordValidator = (0, express_validator_1.body)('password')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage('more then 20 or less than 6');
exports.legistrationEmailValidator = (0, express_validator_1.body)('email')
    .isString().withMessage('not string')
    .isEmail().withMessage('not valid email');
exports.authLoginValidators = [
    exports.loginOrEmailValidator,
    exports.passwordValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];
exports.authRegistrationValidators = [
    exports.registrationLoinValidator,
    exports.egistrationPasswordValidator,
    exports.legistrationEmailValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];
exports.authHeaderValidator = (0, express_validator_1.header)('Authorization'.toLowerCase())
    .isString().withMessage('not string');
