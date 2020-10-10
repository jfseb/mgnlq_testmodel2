"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestModel = void 0;
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
var mongooseMock = mongoose_record_replay.instrumentMongoose(mongoose, mypath, // 'node_modules/mgnlq_testmodel_replay/mgrecrep/',
mode);
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
function getTestModel() {
    if (mode === 'REPLAY') {
        // determine mode
        // in replax mode, using a singleton is sufficient
        aPromise = aPromise || loadModel();
        return aPromise;
    }
    return loadModel();
}
exports.getTestModel = getTestModel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXRtb2RlbDEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUNBQXFDO0FBQ3JDLGlFQUFpRTtBQUNqRSxtQ0FBbUM7QUFDbkMsMENBQTBDO0FBQzFDLDZDQUFpRTtBQUVqRSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7QUFDcEIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLFFBQVEsRUFBRTtJQUNwRSxJQUFJLEdBQUcsUUFBUSxDQUFDO0NBQ2pCO0tBQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLEtBQUssRUFBRTtJQUN4RSxJQUFJLEdBQUcsU0FBUyxDQUFDO0NBQ2xCO0tBQU0sSUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDO09BQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEtBQUssUUFBUSxFQUFFO0lBQ3BFLElBQUksR0FBRyxRQUFRLENBQUM7Q0FDakI7S0FBTztJQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLFNBQVUsU0FBUyxDQUFDLDRCQUE2Qix3REFBd0QsQ0FBQyxDQUFDO0NBQ2hNO0FBRUQsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLDZCQUE2QixDQUFDO0FBRXJELElBQUksWUFBWSxHQUFHLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFDbkUsTUFBTSxFQUFFLG1EQUFtRDtBQUMzRCxJQUFJLENBQUMsQ0FBQztBQUVSLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUV6QixTQUFTLFNBQVM7SUFDaEIsT0FBTyxtQkFBSyxDQUFDLDJCQUEyQixDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN0RyxDQUFDO0FBQ0Q7Ozs7O0dBS0c7QUFDSCxTQUFnQixZQUFZO0lBQzFCLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNyQixpQkFBaUI7UUFDakIsa0RBQWtEO1FBQ2xELFFBQVEsR0FBRyxRQUFRLElBQUksU0FBUyxFQUFFLENBQUM7UUFDbkMsT0FBTyxRQUFRLENBQUM7S0FDakI7SUFDRCxPQUFPLFNBQVMsRUFBRSxDQUFDO0FBQ3JCLENBQUM7QUFSRCxvQ0FRQyIsImZpbGUiOiJnZXRtb2RlbDEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgKiBhcyBtb25nb29zZV9yZWNvcmRfcmVwbGF5IGZyb20gJ21vbmdvb3NlX3JlY29yZF9yZXBsYXknO1xyXG5pbXBvcnQgKiBhcyBwcm9jZXNzIGZyb20gJ3Byb2Nlc3MnO1xyXG5pbXBvcnQgKiBhcyBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMxJztcclxuaW1wb3J0IHsgTW9kZWwgYXMgTW9kZWwsIElGTW9kZWwgYXMgSUZNb2RlbCB9IGZyb20gJ21nbmxxX21vZGVsJztcclxuXHJcbnZhciBtb2RlID0gJ1JFUExBWSc7XHJcbmlmIChwcm9jZXNzLmVudltDb25zdGFudHMuRU5WX05BTUVfTU9OR09fUkVDT1JEX1JFUExBWV0gPT09IFwiUkVDT1JEXCIpIHtcclxuICBtb2RlID0gJ1JFQ09SRCc7XHJcbn0gZWxzZSBpZiAocHJvY2Vzcy5lbnZbQ29uc3RhbnRzLkVOVl9OQU1FX01PTkdPX1JFQ09SRF9SRVBMQVldID09PSBcIk9GRlwiKSB7XHJcbiAgbW9kZSA9IHVuZGVmaW5lZDtcclxufSBlbHNlIGlmICggIXByb2Nlc3MuZW52W0NvbnN0YW50cy5FTlZfTkFNRV9NT05HT19SRUNPUkRfUkVQTEFZXVxyXG4gfHwgcHJvY2Vzcy5lbnZbQ29uc3RhbnRzLkVOVl9OQU1FX01PTkdPX1JFQ09SRF9SRVBMQVldID09PSBcIlJFUExBWVwiKSB7XHJcbiAgbW9kZSA9ICdSRVBMQVknO1xyXG59IGVsc2UgIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoYGlsbGVnYWwgdmFsdWUgJHtwcm9jZXNzLmVudltDb25zdGFudHMuRU5WX05BTUVfTU9OR09fUkVDT1JEX1JFUExBWV19ICBmb3IgJHsgQ29uc3RhbnRzLkVOVl9OQU1FX01PTkdPX1JFQ09SRF9SRVBMQVkgfSwgZXB4ZWN0ZWQgb25lIG9mIFwiUkVQTEFZXCIsIFwiUkVDT1JEXCIsIFwiT0ZGXCIgb3Igbm90IHNldGApO1xyXG59XHJcblxyXG52YXIgbXlwYXRoID0gQ29uc3RhbnRzLk1PTkdPT1NFX1JFQ09SRF9SRVBMQVlfRk9MREVSO1xyXG5cclxudmFyIG1vbmdvb3NlTW9jayA9IG1vbmdvb3NlX3JlY29yZF9yZXBsYXkuaW5zdHJ1bWVudE1vbmdvb3NlKG1vbmdvb3NlLFxyXG4gIG15cGF0aCwgLy8gJ25vZGVfbW9kdWxlcy9tZ25scV90ZXN0bW9kZWxfcmVwbGF5L21ncmVjcmVwLycsXHJcbiAgbW9kZSk7XHJcblxyXG52YXIgYVByb21pc2UgPSB1bmRlZmluZWQ7XHJcblxyXG5mdW5jdGlvbiBsb2FkTW9kZWwoKSA6IFByb21pc2U8SUZNb2RlbC5JTW9kZWxzPiB7XHJcbiAgcmV0dXJuIE1vZGVsLmxvYWRNb2RlbHNPcGVuaW5nQ29ubmVjdGlvbihtb25nb29zZU1vY2ssIENvbnN0YW50cy5NT05HT19EQlVSTCwgQ29uc3RhbnRzLk1PREVMX1BBVEgpO1xyXG59XHJcbi8qKlxyXG4gKiBPYnRhaW4gYSBtb2RlbCBpbnN0YW5jZSxcclxuICpcclxuICogbm90ZTogdGhlIG1vZGVsIG11c3QgYmUgY2xvc2VkIHZpYVxyXG4gKiBNb2RlbC5yZWxlYXNlTW9kZWwodGhlTW9kZWxJbnN0YW5jZSlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUZXN0TW9kZWwoKTogUHJvbWlzZTxJRk1vZGVsLklNb2RlbHM+IHtcclxuICBpZiAobW9kZSA9PT0gJ1JFUExBWScpIHtcclxuICAgIC8vIGRldGVybWluZSBtb2RlXHJcbiAgICAvLyBpbiByZXBsYXggbW9kZSwgdXNpbmcgYSBzaW5nbGV0b24gaXMgc3VmZmljaWVudFxyXG4gICAgYVByb21pc2UgPSBhUHJvbWlzZSB8fCBsb2FkTW9kZWwoKTtcclxuICAgIHJldHVybiBhUHJvbWlzZTtcclxuICB9XHJcbiAgcmV0dXJuIGxvYWRNb2RlbCgpO1xyXG59Il19
