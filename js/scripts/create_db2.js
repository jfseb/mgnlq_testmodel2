"use strict";
/**
 * (C) gerd forstmann 2017-2019
 *
 * Create database
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Constants = require("../constants2");
const mgnlq_model_1 = require("mgnlq_model");
// var FUtils = require(root + '/model/model.js')
const mongoose = require('mongoose');
mgnlq_model_1.Dataload.createDB(mongoose, Constants.MONGO_DBURL, Constants.RAW_MODEL_PATH).then(() => {
    console.log(`created database ${Constants.MONGO_DBURL} with data from ${Constants.RAW_MODEL_PATH} `);
}).catch(err => {
    console.log(`Creating database ${Constants.MONGO_DBURL} with data from ${Constants.RAW_MODEL_PATH} failed!\n`);
    console.log(err);
    console.log(err.stack);
    process.exit(-1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX2RiMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2NyZWF0ZV9kYjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsMkNBQTJDO0FBRzNDLDZDQUFtRDtBQUVuRCxpREFBaUQ7QUFDakQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXJDLHNCQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBRSxFQUFFO0lBRW5GLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLFNBQVMsQ0FBQyxXQUFXLG1CQUFtQixTQUFTLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztBQUN6RyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUUsR0FBRyxDQUFDLEVBQUU7SUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixTQUFTLENBQUMsV0FBVyxtQkFBbUIsU0FBUyxDQUFDLGNBQWMsWUFBWSxDQUFDLENBQUM7SUFDL0csT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsQ0FBQyxDQUFDLENBQUEifQ==