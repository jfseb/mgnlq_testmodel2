
import * as mongoose from 'mongoose';
import * as mongoose_record_replay from 'mongoose_record_replay';
import * as process from 'process';
import * as Constants from './constants1';
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

var mypath = Constants.MONGOOSE_RECORD_REPLAY_FOLDER;
console.log(' instrumenting during load of getModel1' + __dirname + " " + mypath + " " + mode);
var mongooseMock = mongoose_record_replay.instrumentMongoose(mongoose,
  mypath, // 'node_modules/mgnlq_testmodel_replay/mgrecrep/',
  mode);
  console.log(' instrumented ' + mongooseMock.recordPath); 
var aPromise = undefined;

function loadModel() : Promise<IFModel.IModels> {
  console.log(' open model getModel1 ');
  return Model.loadModelsOpeningConnection(mongooseMock, Constants.MONGO_DBURL, Constants.MODEL_PATH);
}
/**
 * Obtain a model instance,
 *
 * note: the model must be closed via
 * Model.releaseModel(theModelInstance)
 */
export function getTestModel1(): Promise<IFModel.IModels> {
  console.log(' now mode at getTestModel1 ' + mode );
  if (mode === 'REPLAY') {
    // determine mode
    // in replax mode, using a singleton is sufficient
    aPromise = aPromise || loadModel();
    return aPromise;
  }
  return loadModel();
}