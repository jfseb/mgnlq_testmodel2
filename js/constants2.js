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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zdGFudHMyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVoQixRQUFBLFdBQVcsR0FBSSw2QkFBNkIsQ0FBQztBQUUxRCwrQkFBK0I7QUFDbEIsUUFBQSw2QkFBNkIsR0FBRyxnREFBZ0QsQ0FBQztBQUNqRixRQUFBLDRCQUE0QixHQUFHLHlCQUF5QixDQUFDO0FBQ3RFLCtCQUErQjtBQUMvQiwrQkFBK0I7QUFDbEIsUUFBQSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQztBQUM5RCxRQUFBLFVBQVUsR0FBRyxzQkFBYyxDQUFDIiwiZmlsZSI6ImNvbnN0YW50czIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xyXG5cclxuZXhwb3J0IGNvbnN0IE1PTkdPX0RCVVJMID0gICdtb25nb2RiOi8vbG9jYWxob3N0L3Rlc3RkYjInO1xyXG5cclxuLy8gcmVsYXRpdmUgdG8gY3VycmVudCBwcm9qZWN0IVxyXG5leHBvcnQgY29uc3QgTU9OR09PU0VfUkVDT1JEX1JFUExBWV9GT0xERVIgPSAnLi90ZXN0L2RhdGEvbW9uZ29vc2VfcmVjb3JkX3JlcGxheS90ZXN0bW9kZWwyLyc7XHJcbmV4cG9ydCBjb25zdCBFTlZfTkFNRV9NT05HT19SRUNPUkRfUkVQTEFZID0gJ01HTkxRX1RFU1RNT0RFTDJfUkVQTEFZJztcclxuLy8gbm90IGluIHVzZSBmb3IgcmVjb3JkL3JlcGxheVxyXG4vLyB1c2VkIHRvIGxvYWQgZGF0YSBpbnRvIG1vZGVsXHJcbmV4cG9ydCBjb25zdCBSQVdfTU9ERUxfUEFUSCA9IHBhdGgubm9ybWFsaXplKF9fZGlybmFtZSArICcvLi4vdGVzdG1vZGVsMicpO1xyXG5leHBvcnQgY29uc3QgTU9ERUxfUEFUSCA9IFJBV19NT0RFTF9QQVRIO1xyXG4iXX0=
