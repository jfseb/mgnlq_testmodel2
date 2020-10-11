"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestModel2 = void 0;
const mongoose = require("mongoose");
const mongoose_record_replay = require("mongoose_record_replay");
const process = require("process");
const Constants = require("./constants2");
const mgnlq_model_1 = require("mgnlq_model");
var mode = 'REPLAY';
if (process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY] === "RECORD") {
    mode = 'RECORD';
}
else if (process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY] === "OFF") {
    mode = undefined;
}
else if (!process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY]
    || process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY] === "REPLAY") {
    mode = 'REPLAY';
}
else {
    throw new Error(`illegal value ${process.env[Constants.ENV_NAME_MONGO_RECORD_REPLAY]}  for ${Constants.ENV_NAME_MONGO_RECORD_REPLAY}, epxected one of "REPLAY", "RECORD", "OFF" or not set`);
}
var mypath = Constants.MONGOOSE_RECORD_REPLAY_FOLDER; // require().resolve('mgnlq_testmodel_replay');
console.log(' instrumenting during load of getModel2' + __dirname + " " + mypath + " " + mode);
var mongooseMock = mongoose_record_replay.instrumentMongoose(mongoose, mypath, // 'node_modules/mgnlq_testmodel_replay/mgrecrep/',
mode);
var aPromise = undefined;
var aPromise = undefined;
function loadModel() {
    return mgnlq_model_1.Model.loadModelsOpeningConnection(mongooseMock, Constants.MONGO_DBURL, Constants.MODEL_PATH);
}
/**
 * Obtain a model instance,
 *
 * note: the model must be closed via
 * Model.releaseModel(theModelInstance)
 */
function getTestModel2() {
    console.log(' now mode at getTestModel2 ' + mode);
    if (mode === 'REPLAY') {
        // determine mode
        // in replax mode, using a singleton is sufficient
        aPromise = aPromise || loadModel();
        return aPromise;
    }
    return loadModel();
}
exports.getTestModel2 = getTestModel2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0bW9kZWwyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2dldG1vZGVsMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBcUM7QUFDckMsaUVBQWlFO0FBQ2pFLG1DQUFtQztBQUNuQywwQ0FBMEM7QUFDMUMsNkNBQWlFO0FBRWpFLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQztBQUNwQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEtBQUssUUFBUSxFQUFFO0lBQ3BFLElBQUksR0FBRyxRQUFRLENBQUM7Q0FDakI7S0FBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEtBQUssS0FBSyxFQUFFO0lBQ3hFLElBQUksR0FBRyxTQUFTLENBQUM7Q0FDbEI7S0FBTSxJQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUM7T0FDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsS0FBSyxRQUFRLEVBQUU7SUFDcEUsSUFBSSxHQUFHLFFBQVEsQ0FBQztDQUNqQjtLQUFPO0lBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsU0FBVSxTQUFTLENBQUMsNEJBQTZCLHdEQUF3RCxDQUFDLENBQUM7Q0FDaE07QUFFRCxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQywrQ0FBK0M7QUFDckcsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDL0YsSUFBSSxZQUFZLEdBQUcsc0JBQXNCLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUNuRSxNQUFNLEVBQUUsbURBQW1EO0FBQzNELElBQUksQ0FBQyxDQUFDO0FBRVIsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBRXpCLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUV6QixTQUFTLFNBQVM7SUFDaEIsT0FBTyxtQkFBSyxDQUFDLDJCQUEyQixDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN0RyxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixhQUFhO0lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFFLENBQUM7SUFDbkQsSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQ3JCLGlCQUFpQjtRQUNqQixrREFBa0Q7UUFDbEQsUUFBUSxHQUFHLFFBQVEsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNuQyxPQUFPLFFBQVEsQ0FBQztLQUNqQjtJQUNELE9BQU8sU0FBUyxFQUFFLENBQUM7QUFDckIsQ0FBQztBQVRELHNDQVNDIn0=