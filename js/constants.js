"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_NAME_MONGO_RECORD_REPLAY = exports.MODEL_PATH = exports.RAW_MODEL_PATH = exports.MONGOOSE_RECORD_REPLAY_FOLDER = exports.MONGO_DBURL = void 0;
const path = require('path');
exports.MONGO_DBURL = 'mongodb://localhost/testdb2';
exports.MONGOOSE_RECORD_REPLAY_FOLDER = './test/data/mongoose_record_replay/testmodel2/';
exports.RAW_MODEL_PATH = path.normalize(__dirname + '/../testmodel2');
exports.MODEL_PATH = path.normalize(__dirname + '/../testmodel2');
exports.ENV_NAME_MONGO_RECORD_REPLAY = 'MGNLQ_TESTMODEL2_REPLAY';

//# sourceMappingURL=constants.js.map
