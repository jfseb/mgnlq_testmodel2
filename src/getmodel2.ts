
import * as mongoose from 'mongoose';
import * as mongoose_record_replay from 'mongoose_record_replay';
import * as process from 'process';
import * as Constants from './constants2';
import { Model as Model, IFModel as IFModel } from 'mgnlq_model';

var mode = 'REPLAY';
if (process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY] === "RECORD") {
  mode = 'RECORD';
} else if (process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY] === "OFF") {
  mode = undefined;
} else if ( !process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY]
 || process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY] === "REPLAY") {
  mode = 'REPLAY';
} else  {
  throw new Error(`illegal value ${process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY]}  for ${ Constants.ENV_NAME_MONGO_RECORD_REPLAY }, epxected one of "REPLAY", "RECORD", "OFF" or not set`);
}

var mypath = Constants.MONGOOSE_RECORD_REPLAY_FOLDER; // require().resolve('mgnlq_testmodel_replay');

var mongooseMock = mongoose_record_replay.instrumentMongoose(mongoose,
  mypath, // 'node_modules/mgnlq_testmodel_replay/mgrecrep/',
  mode);

var aPromise = undefined;

var aPromise = undefined;

function loadModel() {
  return Model.loadModelsOpeningConnection(mongooseMock, Constants.MONGO_DBURL, Constants.MODEL_PATH);
}

/**
 * Obtain a model instance,
 *
 * note: the model must be closed via
 * Model.releaseModel(theModelInstance)
 */
export function getTestModel(): Promise<void | IFModel.IModels> {
  if (mode === 'REPLAY') {
    // determine mode
    // in replax mode, using a singleton is sufficient
    aPromise = aPromise || loadModel();
    return aPromise;
  }
  return loadModel();
}