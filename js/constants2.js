"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL_PATH = exports.RAW_MODEL_PATH = exports.ENV_NAME_MONGO_RECORD_REPLAY = exports.MONGOOSE_RECORD_REPLAY_FOLDER = exports.MONGO_DBURL = void 0;
const path = require('path');
exports.MONGO_DBURL = 'mongodb://localhost/testdb2';
// relative to current project!
exports.MONGOOSE_RECORD_REPLAY_FOLDER = './test/data/mongoose_record_replay/testmodel2/';
exports.ENV_NAME_MONGO_RECORD_REPLAY = 'MGNLQ_TESTMODEL2_REPLAY';
// not in use for record/replay
// used to load data into model
exports.RAW_MODEL_PATH = path.normalize(__dirname + '/../testmodel2');
exports.MODEL_PATH = exports.RAW_MODEL_PATH;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zdGFudHMyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVoQixRQUFBLFdBQVcsR0FBSSw2QkFBNkIsQ0FBQztBQUUxRCwrQkFBK0I7QUFDbEIsUUFBQSw2QkFBNkIsR0FBRyxnREFBZ0QsQ0FBQztBQUNqRixRQUFBLDRCQUE0QixHQUFHLHlCQUF5QixDQUFDO0FBQ3RFLCtCQUErQjtBQUMvQiwrQkFBK0I7QUFDbEIsUUFBQSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQztBQUM5RCxRQUFBLFVBQVUsR0FBRyxzQkFBYyxDQUFDIn0=