"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getVideosController_1 = require("./getVideosController");
//import {createVideoController} from './createVideoController'
//import {findVideoController} from './findVideoController'
//import {deleteVideoController} from './deleteVideoController'
const videosRouter = (0, express_1.Router)();
videosRouter.get('/', getVideosController_1.getVideosController);
//videosRouter.post('/', createVideoController)
//videosRouter.get('/:id', findVideoController)
//videosRouter.delete('/:id', deleteVideoController)
// ...
// не забудьте добавить роут в апп
