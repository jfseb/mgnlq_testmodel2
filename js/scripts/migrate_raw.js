"use strict";
/**
 * (C) gerd forstmann 2017
 *
 * Create database
 */
Object.defineProperty(exports, "__esModule", { value: true });
const folderin = 'model_raw_old/testmodel2';
const folderout = 'tmp/testmodel2';
const fs = require("fs");
try {
    fs.mkdirSync('tmp');
    fs.mkdirSync('tmp/testmodel2');
}
catch (e) {
}
const m2s = require("../migrate/model2schema");
// var FUtils = require(root + '/model/model.js')
const mongoose = require('mongoose');
var ModelNameMap = {
    "iupac": "iupacs",
    "GeneticDNA": "dna_aminoacids",
    "bom": "fioriapps",
    "twf_countries": "twf_countries",
    "twf_fields": "twf_fields",
    "questions": "questions",
    "commands": "commands",
    "hints": "hints"
};
function migrateData(sourcmodelpath, destmodelpath, modelnameold) {
    var modelnamenew = ModelNameMap[modelnameold];
    var mdl = m2s.loadModel(sourcmodelpath, modelnameold);
    var schema = m2s.mergeModelJson(modelnamenew, mdl);
    fs.writeFileSync(destmodelpath + '/' + modelnamenew + '.model.mongooseschema.json', JSON.stringify(schema, undefined, 2));
    var newmodeldoc = m2s.makeModelDoc(modelnamenew, mdl);
    fs.writeFileSync(destmodelpath + '/' + modelnamenew + '.model.doc.json', JSON.stringify(newmodeldoc, undefined, 2));
    var mdldata = m2s.loadModelData(sourcmodelpath, modelnameold);
    var mdlDocs = m2s.makeDocuments(mdldata, mdl);
    // write the data
    fs.writeFileSync(destmodelpath + '/' + modelnamenew + '.data.json', JSON.stringify(mdlDocs, undefined, 2));
}
Object.keys(ModelNameMap).forEach(key => {
    migrateData(folderin, folderout, key);
    console.log(` migrated ${key} `);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0ZV9yYXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NyaXB0cy9taWdyYXRlX3Jhdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRzs7QUFNSCxNQUFNLFFBQVEsR0FBRywwQkFBMEIsQ0FBQztBQUM1QyxNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQztBQUVuQyx5QkFBeUI7QUFFekIsSUFBSTtJQUVKLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0NBQzlCO0FBQUMsT0FBTSxDQUFDLEVBQUU7Q0FFVjtBQUVELCtDQUErQztBQUkvQyxpREFBaUQ7QUFDakQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBR3JDLElBQUksWUFBWSxHQUFHO0lBQ2YsT0FBTyxFQUFHLFFBQVE7SUFDbEIsWUFBWSxFQUFHLGdCQUFnQjtJQUMvQixLQUFLLEVBQUcsV0FBVztJQUNuQixlQUFlLEVBQUcsZUFBZTtJQUNqQyxZQUFZLEVBQUcsWUFBWTtJQUMzQixXQUFXLEVBQUUsV0FBVztJQUN4QixVQUFVLEVBQUcsVUFBVTtJQUN2QixPQUFPLEVBQUcsT0FBTztDQUNwQixDQUFBO0FBR0QsU0FBUyxXQUFXLENBQUMsY0FBc0IsRUFBRSxhQUFxQixFQUFFLFlBQXFCO0lBRXJGLElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNoRCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN0RCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNuRCxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBSSxHQUFHLEdBQUUsWUFBWSxHQUFHLDRCQUE0QixFQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNILElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3RELEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxHQUFJLEdBQUcsR0FBRSxZQUFZLEdBQUcsaUJBQWlCLEVBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckgsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDOUQsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0MsaUJBQWlCO0lBQ2YsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEdBQUcsR0FBRyxHQUFHLFlBQVksR0FBRyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0csQ0FBQztBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBQyxFQUFFO0lBQ3JDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQyxDQUFDIn0=