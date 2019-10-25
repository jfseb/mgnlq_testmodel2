

const path = require('path');

export const MONGO_DBURL =  'mongodb://localhost/testdb2_ng';
export const MONGOOSE_RECORD_REPLAY_FOLDER = path.normalize(__dirname + '/../mgrecrep2/');
export const RAW_MODEL_PATH = path.normalize(__dirname + '/../testmodel2');
export const MODEL_PATH = path.normalize(__dirname + '/../testmodel2');
export const ENV_NAME_MONGO_RECORD_REPLAY = 'MGNLQ_TESTMODEL2_REPLAY';