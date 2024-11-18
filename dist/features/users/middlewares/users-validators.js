"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegistrationValidators = exports.userEmailValidator = exports.userPasswordValidator = exports.userLoginValidator = void 0;
const express_validator_1 = require("express-validator");
const input_Check_Errors_Middleware_1 = require("../../../global-middlewares/input-Check-Errors-Middleware");
// login: string, maxLength: 10 minLength: 3 pattern: ^[a-zA-Z0-9_-]*$ must be unique
// password: string, //maxLength: 20 minLength: 6
// email: string, // pattern: string, //^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ // example: string, // example@example.com must be unique
exports.userLoginValidator = (0, express_validator_1.body)('login')
    .isString().withMessage('not string');
exports.userPasswordValidator = (0, express_validator_1.body)('password')
    .isString().withMessage('not string')
    .trim().isLength({ min: 3, max: 10 }).withMessage('more then 10 or 3');
exports.userEmailValidator = (0, express_validator_1.body)('email')
    .isString().withMessage('not string')
    .trim().isEmail().withMessage('not email');
exports.userRegistrationValidators = [
    //userLoginValidator,
    //userPasswordValidator,
    //userEmailValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];
