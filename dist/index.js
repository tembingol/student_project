"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const app_1 = require("./app");
const mongodb_1 = require("./db/mongodb");
const settings_1 = require("./settings");
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const mongoConneted = yield (0, mongodb_1.connectMongoDB)();
    if (mongoConneted) {
        app_1.app.listen(settings_1.SETTINGS.PORT, () => {
            console.log('...server started in port ' + settings_1.SETTINGS.PORT);
        });
    }
    else {
        console.log('App not started... ');
        (0, process_1.exit)();
    }
});
startApp();
