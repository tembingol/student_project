"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_AUTH = void 0;
exports.ADMIN_AUTH = 'admin:qwerty'; // get from SETTINGS
const authMiddleware = (req, res, next) => {
    const auth = req.headers['authorisation']; // 'Basic xxxx'
    console.log(auth);
    if (!auth) {
        res
            .status(401)
            .json({});
        return;
    }
    const buff = Buffer.from(auth.slice(6), 'base64');
    const decodedAuth = buff.toString('utf8');
    const buff2 = Buffer.from(exports.ADMIN_AUTH, 'utf8');
    const codedAuth = buff2.toString('base64');
    // if (decodedAuth === ADMIN_AUTH || auth.slice(0, 5) !== 'Basic ') {
    if (auth.slice(6) !== codedAuth || auth.slice(0, 5) !== 'Basic ') {
        res
            .status(401)
            .json({});
        return;
    }
    next();
};
