const path = require('path');

export const MONGO_DBURL =  'mongodb://localhost/testdb';

// relative for current project!
export const MONGOOSE_RECORD_REPLAY_FOLDER = './test/data/mongoose_record_replay/testmodel/'; // path.normalize(__dirname + '/../mgrecrep/');
export const ENV_NAME_MONGO_RECORD_REPLAY = 'MGNLQ_TESTMODEL_REPLAY';

// this determines where the cache is written and read from!
// we also use a local path now
export const RAW_MODEL_PATH = path.normalize('./testmodel');
export const MODEL_PATH = RAW_MODEL_PATH; 
// path.normalize(__dirname + '/../testmodel');
