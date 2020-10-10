const path = require('path');

export const MONGO_DBURL =  'mongodb://localhost/testdb2';

// relative to current project!
export const MONGOOSE_RECORD_REPLAY_FOLDER = './test/data/mongoose_record_replay/testmodel2/';
export const ENV_NAME_MONGO_RECORD_REPLAY = 'MGNLQ_TESTMODEL2_REPLAY';
// not in use for record/replay
// used to load data into model
export const RAW_MODEL_PATH = path.normalize(__dirname + '/../testmodel2');
export const MODEL_PATH = RAW_MODEL_PATH;
