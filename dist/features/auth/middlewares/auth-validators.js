"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authNewPasswordValidators = exports.authRegistrationValidators = exports.authLoginValidators = exports.authHeaderValidator = exports.newPasswordValidator = exports.recoveryCodeValidator = exports.registrationEmailValidator = exports.registrationPasswordValidator = exports.registrationLoinValidator = exports.passwordValidator = exports.loginOrEmailValidator = void 0;
const express_validator_1 = require("express-validator");
const input_Check_Errors_Middleware_1 = require("../../../global-middlewares/input-Check-Errors-Middleware");
exports.loginOrEmailValidator = (0, express_validator_1.body)('loginOrEmail')
    .isString().withMessage('not string');
exports.passwordValidator = (0, express_validator_1.body)('password')
    .isString().withMessage('not string');
exports.registrationLoinValidator = (0, express_validator_1.body)('login')
    .isString().withMessage('not string')
    .isLength({ min: 3, max: 10 }).withMessage('more then 10 or less than 3');
exports.registrationPasswordValidator = (0, express_validator_1.body)('password')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage('more then 20 or less than 6');
exports.registrationEmailValidator = (0, express_validator_1.body)('email')
    .isString().withMessage('not string')
    .isEmail().withMessage('not valid email');
exports.recoveryCodeValidator = (0, express_validator_1.body)('recoveryCode')
    .isString().withMessage('not string');
exports.newPasswordValidator = (0, express_validator_1.body)('newPassword')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage('more then 20 or less than 6');
exports.authHeaderValidator = (0, express_validator_1.header)('Authorization'.toLowerCase())
    .isString().withMessage('not string');
exports.authLoginValidators = [
    exports.loginOrEmailValidator,
    exports.passwordValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];
exports.authRegistrationValidators = [
    exports.registrationLoinValidator,
    exports.registrationPasswordValidator,
    exports.registrationEmailValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];
exports.authNewPasswordValidators = [
    exports.newPasswordValidator,
    exports.recoveryCodeValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];
