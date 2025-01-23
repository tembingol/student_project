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
const settings_1 = require("./settings");
const db_1 = require("./db/db");
const app = (0, app_1.initApp)();
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const bdConneted = yield db_1.db.run(settings_1.SETTINGS.MONGO_URL);
    if (!bdConneted) {
        console.log('App not started... ');
        (0, process_1.exit)();
    }
    app.listen(settings_1.SETTINGS.PORT, () => {
        console.log(`Example app listening on port ${settings_1.SETTINGS.PORT}`);
    });
    return app;
});
startApp();
