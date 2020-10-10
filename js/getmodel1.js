"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestModel1 = void 0;
const mongoose = require("mongoose");
const mongoose_record_replay = require("mongoose_record_replay");
const process = require("process");
const Constants = require("./constants1");
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
var mypath = Constants.MONGOOSE_RECORD_REPLAY_FOLDER;
console.log(' instrumenting during load of getModel1' + __dirname + " " + mypath + " " + mode);
var mongooseMock = mongoose_record_replay.instrumentMongoose(mongoose, mypath, // 'node_modules/mgnlq_testmodel_replay/mgrecrep/',
mode);
console.log(' instrumented ' + mongooseMock.recordPath);
var aPromise = undefined;
function loadModel() {
    console.log(' open model getModel1 ');
    return mgnlq_model_1.Model.loadModelsOpeningConnection(mongooseMock, Constants.MONGO_DBURL, Constants.MODEL_PATH);
}
/**
 * Obtain a model instance,
 *
 * note: the model must be closed via
 * Model.releaseModel(theModelInstance)
 */
function getTestModel1() {
    console.log(' now mode at getTestModel1 ' + mode);
    if (mode === 'REPLAY') {
        // determine mode
        // in replax mode, using a singleton is sufficient
        aPromise = aPromise || loadModel();
        return aPromise;
    }
    return loadModel();
}
exports.getTestModel1 = getTestModel1;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXRtb2RlbDEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUNBQXFDO0FBQ3JDLGlFQUFpRTtBQUNqRSxtQ0FBbUM7QUFDbkMsMENBQTBDO0FBQzFDLDZDQUFpRTtBQUVqRSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7QUFDcEIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLFFBQVEsRUFBRTtJQUNwRSxJQUFJLEdBQUcsUUFBUSxDQUFDO0NBQ2pCO0tBQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLEtBQUssRUFBRTtJQUN4RSxJQUFJLEdBQUcsU0FBUyxDQUFDO0NBQ2xCO0tBQU0sSUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDO09BQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEtBQUssUUFBUSxFQUFFO0lBQ3BFLElBQUksR0FBRyxRQUFRLENBQUM7Q0FDakI7S0FBTztJQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLFNBQVUsU0FBUyxDQUFDLDRCQUE2Qix3REFBd0QsQ0FBQyxDQUFDO0NBQ2hNO0FBRUQsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLDZCQUE2QixDQUFDO0FBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLEdBQUcsU0FBUyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQy9GLElBQUksWUFBWSxHQUFHLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFDbkUsTUFBTSxFQUFFLG1EQUFtRDtBQUMzRCxJQUFJLENBQUMsQ0FBQztBQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFELElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUV6QixTQUFTLFNBQVM7SUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sbUJBQUssQ0FBQywyQkFBMkIsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEcsQ0FBQztBQUNEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsYUFBYTtJQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixHQUFHLElBQUksQ0FBRSxDQUFDO0lBQ25ELElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNyQixpQkFBaUI7UUFDakIsa0RBQWtEO1FBQ2xELFFBQVEsR0FBRyxRQUFRLElBQUksU0FBUyxFQUFFLENBQUM7UUFDbkMsT0FBTyxRQUFRLENBQUM7S0FDakI7SUFDRCxPQUFPLFNBQVMsRUFBRSxDQUFDO0FBQ3JCLENBQUM7QUFURCxzQ0FTQyIsImZpbGUiOiJnZXRtb2RlbDEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgKiBhcyBtb25nb29zZV9yZWNvcmRfcmVwbGF5IGZyb20gJ21vbmdvb3NlX3JlY29yZF9yZXBsYXknO1xyXG5pbXBvcnQgKiBhcyBwcm9jZXNzIGZyb20gJ3Byb2Nlc3MnO1xyXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMxJztcclxuaW1wb3J0IHsgTW9kZWwgYXMgTW9kZWwsIElGTW9kZWwgYXMgSUZNb2RlbCB9IGZyb20gJ21nbmxxX21vZGVsJztcclxuXHJcbnZhciBtb2RlID0gJ1JFUExBWSc7XHJcbmlmIChwcm9jZXNzLmVudltDb25zdGFudHMuRU5WX05BTUVfTU9OR09fUkVDT1JEX1JFUExBWV0gPT09IFwiUkVDT1JEXCIpIHtcclxuICBtb2RlID0gJ1JFQ09SRCc7XHJcbn0gZWxzZSBpZiAocHJvY2Vzcy5lbnZbQ29uc3RhbnRzLkVOVl9OQU1FX01PTkdPX1JFQ09SRF9SRVBMQVldID09PSBcIk9GRlwiKSB7XHJcbiAgbW9kZSA9IHVuZGVmaW5lZDtcclxufSBlbHNlIGlmICggIXByb2Nlc3MuZW52W0NvbnN0YW50cy5FTlZfTkFNRV9NT05HT19SRUNPUkRfUkVQTEFZXVxyXG4gfHwgcHJvY2Vzcy5lbnZbQ29uc3RhbnRzLkVOVl9OQU1FX01PTkdPX1JFQ09SRF9SRVBMQVldID09PSBcIlJFUExBWVwiKSB7XHJcbiAgbW9kZSA9ICdSRVBMQVknO1xyXG59IGVsc2UgIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoYGlsbGVnYWwgdmFsdWUgJHtwcm9jZXNzLmVudltDb25zdGFudHMuRU5WX05BTUVfTU9OR09fUkVDT1JEX1JFUExBWV19ICBmb3IgJHsgQ29uc3RhbnRzLkVOVl9OQU1FX01PTkdPX1JFQ09SRF9SRVBMQVkgfSwgZXB4ZWN0ZWQgb25lIG9mIFwiUkVQTEFZXCIsIFwiUkVDT1JEXCIsIFwiT0ZGXCIgb3Igbm90IHNldGApO1xyXG59XHJcblxyXG52YXIgbXlwYXRoID0gQ29uc3RhbnRzLk1PTkdPT1NFX1JFQ09SRF9SRVBMQVlfRk9MREVSO1xyXG5jb25zb2xlLmxvZygnIGluc3RydW1lbnRpbmcgZHVyaW5nIGxvYWQgb2YgZ2V0TW9kZWwxJyArIF9fZGlybmFtZSArIFwiIFwiICsgbXlwYXRoICsgXCIgXCIgKyBtb2RlKTtcclxudmFyIG1vbmdvb3NlTW9jayA9IG1vbmdvb3NlX3JlY29yZF9yZXBsYXkuaW5zdHJ1bWVudE1vbmdvb3NlKG1vbmdvb3NlLFxyXG4gIG15cGF0aCwgLy8gJ25vZGVfbW9kdWxlcy9tZ25scV90ZXN0bW9kZWxfcmVwbGF5L21ncmVjcmVwLycsXHJcbiAgbW9kZSk7XHJcbiAgY29uc29sZS5sb2coJyBpbnN0cnVtZW50ZWQgJyArIG1vbmdvb3NlTW9jay5yZWNvcmRQYXRoKTsgXHJcbnZhciBhUHJvbWlzZSA9IHVuZGVmaW5lZDtcclxuXHJcbmZ1bmN0aW9uIGxvYWRNb2RlbCgpIDogUHJvbWlzZTxJRk1vZGVsLklNb2RlbHM+IHtcclxuICBjb25zb2xlLmxvZygnIG9wZW4gbW9kZWwgZ2V0TW9kZWwxICcpO1xyXG4gIHJldHVybiBNb2RlbC5sb2FkTW9kZWxzT3BlbmluZ0Nvbm5lY3Rpb24obW9uZ29vc2VNb2NrLCBDb25zdGFudHMuTU9OR09fREJVUkwsIENvbnN0YW50cy5NT0RFTF9QQVRIKTtcclxufVxyXG4vKipcclxuICogT2J0YWluIGEgbW9kZWwgaW5zdGFuY2UsXHJcbiAqXHJcbiAqIG5vdGU6IHRoZSBtb2RlbCBtdXN0IGJlIGNsb3NlZCB2aWFcclxuICogTW9kZWwucmVsZWFzZU1vZGVsKHRoZU1vZGVsSW5zdGFuY2UpXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVzdE1vZGVsMSgpOiBQcm9taXNlPElGTW9kZWwuSU1vZGVscz4ge1xyXG4gIGNvbnNvbGUubG9nKCcgbm93IG1vZGUgYXQgZ2V0VGVzdE1vZGVsMSAnICsgbW9kZSApO1xyXG4gIGlmIChtb2RlID09PSAnUkVQTEFZJykge1xyXG4gICAgLy8gZGV0ZXJtaW5lIG1vZGVcclxuICAgIC8vIGluIHJlcGxheCBtb2RlLCB1c2luZyBhIHNpbmdsZXRvbiBpcyBzdWZmaWNpZW50XHJcbiAgICBhUHJvbWlzZSA9IGFQcm9taXNlIHx8IGxvYWRNb2RlbCgpO1xyXG4gICAgcmV0dXJuIGFQcm9taXNlO1xyXG4gIH1cclxuICByZXR1cm4gbG9hZE1vZGVsKCk7XHJcbn0iXX0=
