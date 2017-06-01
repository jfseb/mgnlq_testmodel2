
import * as mongoose from 'mongoose';
import * as mongoose_record_replay from 'mongoose_record_replay';
import * as process from 'process';
import * as Constants from './constants';
import { Model as Model, IFModel as IFModel } from 'mgnlq_model';

var mode = 'REPLAY';
// MGNLQ_TESTMODEL2_REPLAY
if (process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY] === "RECORD") {
  mode = 'RECORD';
}
if (process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY] === "OFF") {
  mode = undefined;
}

var mypath = Constants.MONGOOSE_RECORD_REPLAY_FOLDER; // require().resolve('mgnlq_testmodel_replay');

var mongooseMock = mongoose_record_replay.instrumentMongoose(mongoose,
  mypath, // 'node_modules/mgnlq_testmodel_replay/mgrecrep/',
  mode);

var aPromise = undefined;

/**
 * Obtain a model instance,
 *
 * note: the model must be closed via
 * Model.releaseModel(theModelInstance)
 */
export function getTestModel(): Promise<IFModel.IModels> {
  if (mode === 'REPLAY') {
    // determine mode
    // in replax mode, using a singleton is sufficient
    aPromise = aPromise || Model.loadModelsOpeningConnection(mongooseMock,
      Constants.MONGO_DBURL, Constants.MONGOOSE_RECORD_REPLAY_FOLDER);
    return aPromise;
  }
  return Model.loadModelsOpeningConnection(mongooseMock, Constants.MONGO_DBURL, Constants.MODEL_PATH);
}