"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL_PATH = exports.RAW_MODEL_PATH = exports.ENV_NAME_MONGO_RECORD_REPLAY = exports.MONGOOSE_RECORD_REPLAY_FOLDER = exports.MONGO_DBURL = void 0;
const path = require('path');
exports.MONGO_DBURL = 'mongodb://localhost/testdb';
// relative for current project!
exports.MONGOOSE_RECORD_REPLAY_FOLDER = './test/data/mongoose_record_replay/testmodel/'; // path.normalize(__dirname + '/../mgrecrep/');
exports.ENV_NAME_MONGO_RECORD_REPLAY = 'MGNLQ_TESTMODEL_REPLAY';
// this determines where the cache is written and read from!
// we also use a local path now
exports.RAW_MODEL_PATH = path.normalize('./testmodel');
exports.MODEL_PATH = exports.RAW_MODEL_PATH;
// path.normalize(__dirname + '/../testmodel');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzMS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zdGFudHMxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVoQixRQUFBLFdBQVcsR0FBSSw0QkFBNEIsQ0FBQztBQUV6RCxnQ0FBZ0M7QUFDbkIsUUFBQSw2QkFBNkIsR0FBRywrQ0FBK0MsQ0FBQyxDQUFDLCtDQUErQztBQUNoSSxRQUFBLDRCQUE0QixHQUFHLHdCQUF3QixDQUFDO0FBRXJFLDREQUE0RDtBQUM1RCwrQkFBK0I7QUFDbEIsUUFBQSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMvQyxRQUFBLFVBQVUsR0FBRyxzQkFBYyxDQUFDO0FBQ3pDLCtDQUErQyJ9